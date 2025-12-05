import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Folder, Plus } from "lucide-react";
import { DashboardStats } from "@/lib/types";
import { KPIDashboard } from "@/components/dashboard/kpi-dashboard";
import { Project, AiTool, Client, Prompt, AutomationWorkflow } from "@shared/schema";
import { Link } from "wouter";

// Helper to generate avatar initials from name
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

// Helper to generate consistent colors based on string
const getColorFromString = (str: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: aiTools, isLoading: aiToolsLoading } = useQuery<AiTool[]>({
    queryKey: ['/api/ai-tools'],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const { data: prompts } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });

  const { data: automations } = useQuery<AutomationWorkflow[]>({
    queryKey: ['/api/automation'],
  });

  // Get active projects (limit to 5 for display)
  const activeProjects = projects?.filter(p => p.status === 'active').slice(0, 5) || [];

  // Get active AI tools (limit to 5 for display)
  const activeAiTools = aiTools?.filter(t => t.isActive).slice(0, 5) || [];

  // Get client map for lookups
  const clientMap = new Map(clients?.map(c => [c.id, c]) || []);

  // Generate recent activities from real data
  const recentActivities = [
    ...(projects?.slice(0, 2).map(p => ({
      id: `project-${p.id}`,
      type: 'project',
      message: p.status === 'completed' ? 'Project completed' : 'Project updated',
      description: p.name,
      timestamp: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Recently',
      category: 'project' as const
    })) || []),
    ...(prompts?.slice(0, 1).map(p => ({
      id: `prompt-${p.id}`,
      type: 'prompt',
      message: 'Prompt created',
      description: p.name,
      timestamp: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recently',
      category: 'prompt' as const
    })) || []),
    ...(aiTools?.slice(0, 1).map(t => ({
      id: `ai-${t.id}`,
      type: 'ai',
      message: 'AI tool activity',
      description: `${t.name} - ${t.requestsCount || 0} requests`,
      timestamp: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'Recently',
      category: 'ai' as const
    })) || [])
  ].slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  const isLoading = statsLoading || projectsLoading || aiToolsLoading;

  return (
    <div className="fade-in">
      {/* Animated KPI Dashboard */}
      {isLoading ? (
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
            monthlyRevenue: stats?.monthlyRevenue || 0,
            activeProjects: stats?.activeProjects || activeProjects.length,
            aiToolsCost: stats?.aiToolsCost || activeAiTools.reduce((sum, t) => sum + parseFloat(t.currentSpend || '0'), 0),
            hoursSaved: stats?.hoursSaved || 0,
            clientCount: clients?.length || 0,
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
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{activeProjects.length}</Badge>
                <Link href="/projects">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.length === 0 ? (
              <div className="text-center py-8">
                <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-3">No active projects yet</p>
                <Link href="/projects">
                  <Button size="sm" className="gradient-bg">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </div>
            ) : (
              activeProjects.map((project) => {
                const client = project.clientId ? clientMap.get(project.clientId) : null;
                const clientName = client?.name || 'No Client';
                return (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getColorFromString(clientName)}`}>
                        {getInitials(clientName)}
                      </div>
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{clientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{project.progress || 0}%</p>
                      <Progress value={project.progress || 0} className="w-16 h-2" />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AI Tools Performance</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{activeAiTools.length}</Badge>
                <Link href="/ai-tools">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAiTools.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-3">No AI tools configured yet</p>
                <Link href="/ai-tools">
                  <Button size="sm" className="gradient-bg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add AI Tool
                  </Button>
                </Link>
              </div>
            ) : (
              activeAiTools.map((tool) => (
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
                    <p className="text-sm font-medium">${parseFloat(tool.currentSpend || '0').toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{tool.requestsCount || 0} requests</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="card-hover mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activity. Start by creating a project or adding an AI tool!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
