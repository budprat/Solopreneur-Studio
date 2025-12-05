import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Prompt, AiTool } from "@shared/schema";
import { Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const promptSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  content: z.string().min(1, "Prompt content is required"),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  version: z.string().optional(),
  aiToolId: z.number().optional().nullable(),
  isPublic: z.boolean().default(false),
});

type PromptFormData = z.infer<typeof promptSchema>;

interface PromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt?: Prompt | null;
}

export function PromptModal({ open, onOpenChange, prompt }: PromptModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!prompt;
  const [tagInput, setTagInput] = useState("");

  const { data: aiTools } = useQuery<AiTool[]>({
    queryKey: ['/api/ai-tools'],
  });

  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: "",
      description: "",
      content: "",
      category: "",
      tags: [],
      version: "1.0",
      aiToolId: null,
      isPublic: false,
    },
  });

  // Reset form when prompt changes or modal opens
  useEffect(() => {
    if (open) {
      if (prompt) {
        form.reset({
          name: prompt.name,
          description: prompt.description || "",
          content: prompt.content,
          category: prompt.category || "",
          tags: prompt.tags || [],
          version: prompt.version || "1.0",
          aiToolId: prompt.aiToolId || null,
          isPublic: prompt.isPublic ?? false,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          content: "",
          category: "",
          tags: [],
          version: "1.0",
          aiToolId: null,
          isPublic: false,
        });
      }
      setTagInput("");
    }
  }, [open, prompt, form]);

  const createMutation = useMutation({
    mutationFn: (data: PromptFormData) => apiRequest('POST', '/api/prompts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Prompt created",
        description: "Your new prompt has been added successfully.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create prompt. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PromptFormData) => apiRequest('PUT', `/api/prompts/${prompt?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Prompt updated",
        description: "Your prompt has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update prompt. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PromptFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Prompt" : "Create New Prompt"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your prompt template below."
              : "Create a reusable AI prompt template."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blog Post Generator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of what this prompt does" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your prompt template here. Use {{variable}} for dynamic values."
                      className="min-h-[150px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use double curly braces for variables: {"{{topic}}"}, {"{{tone}}"}, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="analysis">Analysis</SelectItem>
                        <SelectItem value="strategy">Strategy</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="1.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="aiToolId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated AI Tool (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI tool" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {aiTools?.map((tool) => (
                        <SelectItem key={tool.id} value={tool.id.toString()}>
                          {tool.name} ({tool.provider})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="Type a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Prompt</FormLabel>
                    <FormDescription>
                      Make this prompt available to other users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gradient-bg">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Prompt" : "Create Prompt"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
