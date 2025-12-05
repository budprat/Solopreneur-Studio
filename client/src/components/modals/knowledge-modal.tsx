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
import { KnowledgeBase, Project } from "@shared/schema";
import { Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const knowledgeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["article", "note", "resource", "template"]),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  projectId: z.number().optional().nullable(),
  isPublic: z.boolean().default(false),
});

type KnowledgeFormData = z.infer<typeof knowledgeSchema>;

interface KnowledgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  knowledge?: KnowledgeBase | null;
}

export function KnowledgeModal({ open, onOpenChange, knowledge }: KnowledgeModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!knowledge;
  const [tagInput, setTagInput] = useState("");

  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const form = useForm<KnowledgeFormData>({
    resolver: zodResolver(knowledgeSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "note",
      category: "",
      tags: [],
      projectId: null,
      isPublic: false,
    },
  });

  // Reset form when knowledge changes or modal opens
  useEffect(() => {
    if (open) {
      if (knowledge) {
        form.reset({
          title: knowledge.title,
          content: knowledge.content,
          type: knowledge.type as any,
          category: knowledge.category || "",
          tags: knowledge.tags || [],
          projectId: knowledge.projectId || null,
          isPublic: knowledge.isPublic ?? false,
        });
      } else {
        form.reset({
          title: "",
          content: "",
          type: "note",
          category: "",
          tags: [],
          projectId: null,
          isPublic: false,
        });
      }
      setTagInput("");
    }
  }, [open, knowledge, form]);

  const createMutation = useMutation({
    mutationFn: (data: KnowledgeFormData) => apiRequest('POST', '/api/knowledge', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Knowledge item created",
        description: "Your new knowledge item has been added successfully.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create knowledge item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: KnowledgeFormData) => apiRequest('PUT', `/api/knowledge/${knowledge?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Knowledge item updated",
        description: "Your knowledge item has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update knowledge item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: KnowledgeFormData) => {
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
          <DialogTitle>{isEditing ? "Edit Knowledge Item" : "Add New Knowledge"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your knowledge item below."
              : "Add a new article, note, resource, or template to your knowledge base."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., How to optimize React performance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="resource">Resource</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your knowledge content here. Markdown is supported."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can use markdown formatting for better organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Project (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
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
                    <FormLabel className="text-base">Public</FormLabel>
                    <FormDescription>
                      Make this knowledge item accessible to others
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
                {isEditing ? "Update" : "Add Knowledge"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
