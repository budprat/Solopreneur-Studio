import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { AiTool } from "@shared/schema";
import { Loader2, Eye, EyeOff } from "lucide-react";

const aiToolSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  provider: z.enum(["openai", "anthropic", "google", "meta", "mistral", "cohere", "other"]),
  apiKey: z.string().optional(),
  monthlyBudget: z.string().optional(),
  isActive: z.boolean().default(true),
});

type AiToolFormData = z.infer<typeof aiToolSchema>;

interface AiToolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aiTool?: AiTool | null;
}

export function AiToolModal({ open, onOpenChange, aiTool }: AiToolModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!aiTool;
  const [showApiKey, setShowApiKey] = useState(false);

  const form = useForm<AiToolFormData>({
    resolver: zodResolver(aiToolSchema),
    defaultValues: {
      name: "",
      provider: "openai",
      apiKey: "",
      monthlyBudget: "",
      isActive: true,
    },
  });

  // Reset form when aiTool changes or modal opens
  useEffect(() => {
    if (open) {
      if (aiTool) {
        form.reset({
          name: aiTool.name,
          provider: aiTool.provider as any,
          apiKey: aiTool.apiKey || "",
          monthlyBudget: aiTool.monthlyBudget || "",
          isActive: aiTool.isActive ?? true,
        });
      } else {
        form.reset({
          name: "",
          provider: "openai",
          apiKey: "",
          monthlyBudget: "",
          isActive: true,
        });
      }
      setShowApiKey(false);
    }
  }, [open, aiTool, form]);

  const createMutation = useMutation({
    mutationFn: (data: AiToolFormData) => apiRequest('POST', '/api/ai-tools', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-tools'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "AI Tool created",
        description: "Your new AI tool has been added successfully.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create AI tool. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AiToolFormData) => apiRequest('PUT', `/api/ai-tools/${aiTool?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-tools'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "AI Tool updated",
        description: "Your AI tool has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update AI tool. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AiToolFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit AI Tool" : "Add New AI Tool"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your AI tool configuration below."
              : "Configure a new AI tool to track usage and costs."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tool Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GPT-4 for Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="meta">Meta</SelectItem>
                      <SelectItem value="mistral">Mistral</SelectItem>
                      <SelectItem value="cohere">Cohere</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        placeholder="sk-..."
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Store your API key securely for direct integrations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="100.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Set a spending limit to track your costs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Enable or disable this AI tool
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
                {isEditing ? "Update Tool" : "Add Tool"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
