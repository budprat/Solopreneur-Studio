import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Folder, Bot, Clock, ArrowUpRight, Copy, Play, Calendar, FileText } from "lucide-react";
import { DashboardStats, ProjectWithClient, AIToolUsage } from "@/lib/types";

// Mock data for demonstration
const mockProjects: ProjectWithClient[] = [
  {
    id: 1,
    name: "AI Content Strategy",
    description: "Developing comprehensive AI content strategy",
    status: "active",
    progress: 75,
    budget: "15000",
    revenue: "11250",
    dueDate: "2024-12-15",
    client: { id: 1, name: "TechCorp", avatar: "TC" }
  },
  {
    id: 2,
    name: "ML Pipeline Optimization",
    description: "Optimizing machine learning pipeline performance",
    status: "active",
    progress: 45,
    budget: "25000",
    revenue: "11250",
    dueDate: "2024-12-20",
    client: { id: 2, name: "DataSys Inc", avatar: "DS" }
  },
  {
    id: 3,
    name: "Chatbot Development",
    description: "Building intelligent chatbot system",
    status: "active",
    progress: 90,
    budget: "18000",
    revenue: "16200",
    dueDate: "2024-12-18",
    client: { id: 3, name: "AIStartup", avatar: "AI" }
  }
];

const mockAITools: AIToolUsage[] = [
  {
    id: 1,
    name: "GPT-4",
    provider: "OpenAI",
    currentSpend: 127.43,
    tokensUsed: 15230,
    requestsCount: 342,
    isActive: true
  },
  {
    id: 2,
    name: "Claude",
    provider: "Anthropic",
    currentSpend: 87.21,
    tokensUsed: 9847,
    requestsCount: 234,
    isActive: true
  },
  {
    id: 3,
    name: "DALL-E",
    provider: "OpenAI",
    currentSpend: 52.18,
    tokensUsed: 0,
    requestsCount: 127,
    isActive: true
  }
];

const mockActivities = [
  {
    id: 1,
    type: "prompt",
    message: "New prompt created",
    description: "Content generation for TechCorp",
    timestamp: "2 hours ago",
    category: "prompt" as const
  },
  {
    id: 2,
    type: "project",
    message: "Project milestone completed",
    description: "AIStartup chatbot phase 2",
    timestamp: "4 hours ago",
    category: "project" as const
  },
  {
    id: 3,
    type: "ai",
    message: "AI cost alert",
    description: "GPT-4 usage approaching limit",
    timestamp: "6 hours ago",
    category: "ai" as const
  }
];

const mockPrompts = [
  {
    id: 1,
    name: "Blog Post Generator",
    usageCount: 23,
    successRate: 94,
    category: "Content"
  },
  {
    id: 2,
    name: "Email Responder",
    usageCount: 18,
    successRate: 89,
    category: "Communication"
  },
  {
    id: 3,
    name: "Code Reviewer",
    usageCount: 15,
    successRate: 92,
    category: "Development"
  }
];

const mockAutomations = [
  {
    id: 1,
    name: "Email to Task",
    description: "Triggered 12 times today",
    isActive: true,
    icon: Play
  },
  {
    id: 2,
    name: "Daily Report",
    description: "Runs every morning at 9 AM",
    isActive: true,
    icon: Calendar
  },
  {
    id: 3,
    name: "Invoice Generator",
    description: "Triggered on project completion",
    isActive: true,
    icon: FileText
  }
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getClientColor = (clientName: string) => {
    const colors = {
      'TechCorp': 'bg-blue-500',
      'DataSys Inc': 'bg-green-500',
      'AIStartup': 'bg-purple-500'
    };
    return colors[clientName as keyof typeof colors] || 'bg-gray-500';
  };

  const getActivityIcon = (category: string) => {
    switch (category) {
      case 'prompt':
        return '🟢';
      case 'project':
        return '🔵';
      case 'ai':
        return '🟡';
      default:
        return '⚪';
    }
  };

  return (
    <div className="fade-in">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-24 mt-2" />
                ) : (
                  <p className="text-2xl font-bold">{formatCurrency(stats?.monthlyRevenue || 12450)}</p>
                )}
                <p className="text-sm text-accent font-medium">+23% from last month</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-8 mt-2" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.activeProjects || 7}</p>
                )}
                <p className="text-sm text-primary font-medium">3 due this week</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Tools Cost</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20 mt-2" />
                ) : (
                  <p className="text-2xl font-bold">{formatCurrency(stats?.aiToolsCost || 287)}</p>
                )}
                <p className="text-sm text-warning font-medium">12% over budget</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hours Saved</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12 mt-2" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.hoursSaved || 47}</p>
                )}
                <p className="text-sm text-secondary font-medium">This month</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Projects</CardTitle>
                <Button variant="ghost" size="sm">
                  View All <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${getClientColor(project.client?.name || '')} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-sm font-medium">{project.client?.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.client?.name} • Due {new Date(project.dueDate || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20">
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* AI Tools Usage */}
          <Card>
            <CardHeader>
              <CardTitle>AI Tools Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAITools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{tool.name}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(tool.currentSpend)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{tool.tokensUsed.toLocaleString()} tokens</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Prompts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Performing Prompts</CardTitle>
              <Button variant="ghost" size="sm">
                View Library <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPrompts.map((prompt) => (
                <div key={prompt.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{prompt.name}</p>
                    <p className="text-sm text-muted-foreground">Used {prompt.usageCount} times this month</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-accent font-medium">{prompt.successRate}% success</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Automations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Automations</CardTitle>
              <Button variant="ghost" size="sm">
                Create New <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAutomations.map((automation) => (
                <div key={automation.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <automation.icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">{automation.name}</p>
                      <p className="text-sm text-muted-foreground">{automation.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
