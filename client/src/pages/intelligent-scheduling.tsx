import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Zap, Shield, Target, Brain, Plus, Settings, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest, queryClient as qc } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TaskModal } from "@/components/modals/task-modal";
import { Task as DbTask } from "@shared/schema";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours: number;
  deadline?: string;
  project: string;
  energyRequired: 'low' | 'medium' | 'high';
  scheduledFor?: string;
  status: 'pending' | 'in_progress' | 'completed';
  focusTimeRequired: boolean;
}

interface EnergyPattern {
  hour: number;
  energyLevel: number;
  productivity: number;
  focusCapability: number;
  creativeCapability: number;
}

interface ScheduleBlock {
  id: number;
  startTime: string;
  endTime: string;
  task: Task;
  type: 'focus' | 'meeting' | 'break' | 'admin';
  energyMatch: number;
}

export default function IntelligentScheduling() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DbTask | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks"],
    select: (data) => data as Task[],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateTask = () => {
    setSelectedTask(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task as unknown as DbTask);
    setTaskModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteMutation.mutate(task.id);
    }
  };

  const { data: energyPatterns = [] } = useQuery({
    queryKey: ["/api/energy-patterns"],
    select: (data) => data as EnergyPattern[],
  });

  const { data: schedule = [] } = useQuery({
    queryKey: ["/api/schedule", selectedDate],
    select: (data) => data as ScheduleBlock[],
  });

  const optimizeScheduleMutation = useMutation({
    mutationFn: async (date: string) => {
      return await apiRequest("/api/schedule/optimize", {
        method: "POST",
        body: JSON.stringify({ date }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: "Schedule optimized",
        description: "Your schedule has been optimized based on energy patterns and priorities.",
      });
    },
  });

  // Mock data for demonstration
  const mockTasks: Task[] = [
    {
      id: 1,
      title: "Complete AI Model Implementation",
      description: "Implement the recommendation engine for client project",
      priority: 'high',
      estimatedHours: 4,
      deadline: "2025-01-20T17:00:00Z",
      project: "TechStartup Integration",
      energyRequired: 'high',
      focusTimeRequired: true,
      status: 'pending'
    },
    {
      id: 2,
      title: "Client Meeting - Project Review",
      description: "Review progress with Sarah Chen",
      priority: 'medium',
      estimatedHours: 1,
      deadline: "2025-01-19T15:00:00Z",
      project: "TechStartup Integration",
      energyRequired: 'medium',
      focusTimeRequired: false,
      status: 'pending'
    },
    {
      id: 3,
      title: "Write Blog Post - AI Trends",
      description: "Create content for marketing campaign",
      priority: 'medium',
      estimatedHours: 2,
      project: "Content Marketing",
      energyRequired: 'medium',
      focusTimeRequired: true,
      status: 'pending'
    }
  ];

  const mockEnergyPatterns: EnergyPattern[] = [
    { hour: 9, energyLevel: 95, productivity: 90, focusCapability: 95, creativeCapability: 80 },
    { hour: 10, energyLevel: 100, productivity: 95, focusCapability: 100, creativeCapability: 85 },
    { hour: 11, energyLevel: 90, productivity: 85, focusCapability: 90, creativeCapability: 90 },
    { hour: 14, energyLevel: 70, productivity: 60, focusCapability: 50, creativeCapability: 70 },
    { hour: 15, energyLevel: 85, productivity: 80, focusCapability: 75, creativeCapability: 85 },
    { hour: 16, energyLevel: 80, productivity: 75, focusCapability: 70, creativeCapability: 80 },
  ];

  const mockSchedule: ScheduleBlock[] = [
    {
      id: 1,
      startTime: "09:00",
      endTime: "11:00",
      task: mockTasks[0],
      type: 'focus',
      energyMatch: 95
    },
    {
      id: 2,
      startTime: "11:00",
      endTime: "11:15",
      task: { ...mockTasks[0], title: "Break" } as Task,
      type: 'break',
      energyMatch: 100
    },
    {
      id: 3,
      startTime: "15:00",
      endTime: "16:00",
      task: mockTasks[1],
      type: 'meeting',
      energyMatch: 80
    }
  ];

  const displayTasks = tasks.length > 0 ? tasks : mockTasks;
  const displayEnergyPatterns = energyPatterns.length > 0 ? energyPatterns : mockEnergyPatterns;
  const displaySchedule = schedule.length > 0 ? schedule : mockSchedule;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEnergyColor = (level: number) => {
    if (level >= 90) return 'text-green-600';
    if (level >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Intelligent Scheduling</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered scheduling with energy pattern learning and focus time protection
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => optimizeScheduleMutation.mutate(selectedDate)}
          >
            <Brain className="w-4 h-4 mr-2" />
            Optimize Schedule
          </Button>
          <Button size="sm" onClick={handleCreateTask}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Energy & Productivity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-xs text-muted-foreground">Peak performance window</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Focus Time Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5h</div>
            <p className="text-xs text-muted-foreground">Protected deep work</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7/12</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7/10</div>
            <p className="text-xs text-muted-foreground">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="energy">Energy Patterns</TabsTrigger>
          <TabsTrigger value="tasks">Task Queue</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Schedule View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Today's Schedule</CardTitle>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-1 border rounded-md"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displaySchedule.map((block) => (
                      <div key={block.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="text-sm font-medium w-20">
                          {block.startTime} - {block.endTime}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {block.type === 'focus' && <Shield className="w-4 h-4 text-blue-500" />}
                            {block.type === 'meeting' && <Calendar className="w-4 h-4 text-green-500" />}
                            {block.type === 'break' && <Clock className="w-4 h-4 text-gray-500" />}
                            <span className="font-medium">{block.task.title}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {block.type}
                            </Badge>
                            <span className={`text-xs ${getEnergyColor(block.energyMatch)}`}>
                              {block.energyMatch}% energy match
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(block.task.priority)}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Protect Focus Time
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Reschedule Low Priority
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Add Break
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Batch Similar Tasks
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Optimal Window</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Deep Work</span>
                      <span className="text-sm font-medium">2:00 PM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Creative Work</span>
                      <span className="text-sm font-medium">10:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Meetings</span>
                      <span className="text-sm font-medium">3:00 PM - 5:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Patterns</CardTitle>
              <CardDescription>
                Your productivity patterns learned from historical data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {displayEnergyPatterns.map((pattern) => (
                  <div key={pattern.hour} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {pattern.hour}:00 - {pattern.hour + 1}:00
                      </span>
                      <span className={`text-sm font-medium ${getEnergyColor(pattern.energyLevel)}`}>
                        {pattern.energyLevel}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Productivity</div>
                        <Progress value={pattern.productivity} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Focus</div>
                        <Progress value={pattern.focusCapability} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Creative</div>
                        <Progress value={pattern.creativeCapability} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Task Queue</CardTitle>
              <CardDescription>
                Tasks prioritized by deadline, energy requirements, and importance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{task.title}</span>
                        {task.focusTimeRequired && <Shield className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span>{task.estimatedHours}h</span>
                        <span>Energy: {task.energyRequired}</span>
                        <span>Project: {task.project}</span>
                        {task.deadline && (
                          <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{task.priority}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTask(task)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTask(task)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Productivity Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Peak Performance</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                    Your highest productivity occurs between 9-11 AM. Schedule deep work during this window.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100">Focus Protection</h4>
                  <p className="text-sm text-green-700 dark:text-green-200 mt-1">
                    You complete 40% more work when focus time is protected from interruptions.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Energy Dip</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                    Schedule breaks or low-energy tasks around 2 PM to maintain overall productivity.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Move meetings to afternoon</span>
                    <Badge variant="outline">+15% productivity</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Batch similar tasks</span>
                    <Badge variant="outline">+20% efficiency</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Protect 9-11 AM for deep work</span>
                    <Badge variant="outline">+25% focus</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Schedule breaks every 90 minutes</span>
                    <Badge variant="outline">+10% sustained energy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Modal */}
      <TaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        task={selectedTask}
      />
    </div>
  );
}