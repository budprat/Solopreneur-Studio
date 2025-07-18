import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Folder, Bot, Clock, ArrowUpRight, Copy, Play, Calendar, FileText } from "lucide-react";
import { DashboardStats, ProjectWithClient, AIToolUsage } from "@/lib/types";
import { KPIDashboard } from "@/components/dashboard/kpi-dashboard";

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
      {/* Animated KPI Dashboard */}
      {statsLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="card-hover">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <KPIDashboard 
          data={{
            monthlyRevenue: stats?.monthlyRevenue || 127500,
            activeProjects: stats?.activeProjects || 14,
            aiToolsCost: stats?.aiToolsCost || 847,
            hoursSaved: stats?.hoursSaved || 124,
            clientCount: 8,
            profitMargin: 68,
            growthRate: 23
          }}
        />
      )}

      {/* Quick Access Projects */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Projects</span>
              <Badge variant="secondary">{mockProjects.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getClientColor(project.client.name)}`}>
                    {project.client.avatar}
                  </div>
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">{project.client.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{project.progress}%</p>
                  <Progress value={project.progress} className="w-16 h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AI Tools Performance</span>
              <Badge variant="secondary">{mockAITools.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAITools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{tool.name}</h4>
                    <p className="text-sm text-muted-foreground">{tool.provider}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${tool.currentSpend.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{tool.requestsCount} requests</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="card-hover mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-lg">{getActivityIcon(activity.category)}</span>
                <div className="flex-1">
                  <p className="font-medium">{activity.message}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
