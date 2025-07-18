import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Folder,
  FileText,
  Clock,
  Plus,
  Edit,
  MessageSquare
} from "lucide-react";
import { Client, Project, RevenueTracking, KnowledgeBase } from "@shared/schema";

export default function ClientWorkspace() {
  const { id } = useParams<{ id: string }>();
  const clientId = parseInt(id || '0');

  const { data: client, isLoading: clientLoading } = useQuery<Client>({
    queryKey: ['/api/clients', clientId],
    enabled: !!clientId,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    select: (data) => data.filter(project => project.clientId === clientId),
  });

  const { data: revenue, isLoading: revenueLoading } = useQuery<RevenueTracking[]>({
    queryKey: ['/api/revenue'],
    select: (data) => data.filter(item => item.clientId === clientId),
  });

  const { data: knowledge, isLoading: knowledgeLoading } = useQuery<KnowledgeBase[]>({
    queryKey: ['/api/knowledge'],
    select: (data) => data.filter(item => item.projectId && projects?.some(p => p.id === item.projectId)),
  });

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTotalRevenue = () => {
    return revenue?.filter(item => item.type === 'payment')
      .reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
  };

  const getActiveProjects = () => {
    return projects?.filter(project => project.status === 'active').length || 0;
  };

  const getCompletedProjects = () => {
    return projects?.filter(project => project.status === 'completed').length || 0;
  };

  const getAverageProjectProgress = () => {
    if (!projects?.length) return 0;
    const totalProgress = projects.reduce((sum, project) => sum + (project.progress || 0), 0);
    return Math.round(totalProgress / projects.length);
  };

  const getClientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (clientLoading || !client) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Client Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={client.avatar || ''} alt={client.name} />
                <AvatarFallback className="text-lg font-bold">
                  {getClientInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{client.name}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  {client.company && (
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {client.company}
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {client.email}
                    </div>
                  )}
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(getTotalRevenue().toString())}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{getActiveProjects()}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Projects</p>
                <p className="text-2xl font-bold">{getCompletedProjects()}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{getAverageProjectProgress()}%</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Details Tabs */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Button className="gradient-bg">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects?.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          {project.dueDate && (
                            <span className="text-xs text-muted-foreground">
                              Due: {new Date(project.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(project.budget)}</p>
                        <p className="text-xs text-muted-foreground">Budget</p>
                      </div>
                      <div className="w-20">
                        <Progress value={project.progress || 0} className="h-2" />
                        <p className="text-xs text-center mt-1">{project.progress}%</p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!projects || projects.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No projects found for this client</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenue?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {item.description || `${item.type} #${item.id}`}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent">
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(!revenue || revenue.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No revenue data found for this client</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {knowledge?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{item.type}</Badge>
                          {item.category && (
                            <Badge variant="secondary">{item.category}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                  </div>
                ))}
                {(!knowledge || knowledge.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No knowledge items found for this client</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="font-medium">{client.name}</p>
                  </div>
                </div>
                
                {client.company && (
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{client.company}</p>
                    </div>
                  </div>
                )}
                
                {client.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{client.email}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client Since</p>
                    <p className="font-medium">
                      {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relationship Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Projects</span>
                  <span className="font-bold">{projects?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Projects</span>
                  <span className="font-bold">{getActiveProjects()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed Projects</span>
                  <span className="font-bold">{getCompletedProjects()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="font-bold">{formatCurrency(getTotalRevenue().toString())}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Knowledge Items</span>
                  <span className="font-bold">{knowledge?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
