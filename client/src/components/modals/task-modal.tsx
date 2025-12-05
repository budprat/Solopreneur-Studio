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
import { Task, Project } from "@shared/schema";
import { Loader2 } from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  estimatedHours: z.number().min(0.5).max(24),
  deadline: z.string().optional(),
  project: z.string().optional(),
  energyRequired: z.enum(["low", "medium", "high"]),
  scheduledFor: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]),
  focusTimeRequired: z.boolean().default(false),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskModal({ open, onOpenChange, task }: TaskModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!task;

  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      estimatedHours: 1,
      deadline: "",
      project: "",
      energyRequired: "medium",
      scheduledFor: "",
      status: "pending",
      focusTimeRequired: false,
    },
  });

  // Reset form when task changes or modal opens
  useEffect(() => {
    if (open) {
      if (task) {
        form.reset({
          title: task.title,
          description: task.description || "",
          priority: task.priority as any,
          estimatedHours: task.estimatedHours,
          deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
          project: task.project || "",
          energyRequired: task.energyRequired as any,
          scheduledFor: task.scheduledFor ? new Date(task.scheduledFor).toISOString().slice(0, 16) : "",
          status: task.status as any,
          focusTimeRequired: task.focusTimeRequired ?? false,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          priority: "medium",
          estimatedHours: 1,
          deadline: "",
          project: "",
          energyRequired: "medium",
          scheduledFor: "",
          status: "pending",
          focusTimeRequired: false,
        });
      }
    }
  }, [open, task, form]);

  const createMutation = useMutation({
    mutationFn: (data: TaskFormData) => apiRequest('POST', '/api/tasks', {
      ...data,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor).toISOString() : null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({
        title: "Task created",
        description: "Your new task has been added successfully.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TaskFormData) => apiRequest('PUT', `/api/tasks/${task?.id}`, {
      ...data,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor).toISOString() : null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TaskFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your task details below."
              : "Add a new task to your intelligent schedule."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Complete client proposal" {...field} />
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
                    <Textarea
                      placeholder="Add details about this task..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimatedHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="24"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="energyRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Energy Required</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select energy level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - Admin tasks</SelectItem>
                        <SelectItem value="medium">Medium - Regular work</SelectItem>
                        <SelectItem value="high">High - Deep focus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.name}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline (Optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledFor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule For (Optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="focusTimeRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Focus Time Required</FormLabel>
                    <FormDescription>
                      Protect this task from interruptions during scheduling
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
                {isEditing ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
