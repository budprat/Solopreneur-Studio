import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Workflow, Play, Pause, Plus, Settings, CheckCircle, Clock, 
  AlertCircle, Target, Zap, FileText, Share2, Calendar, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContentPipeline {
  id: number;
  name: string;
  description: string;
  stages: PipelineStage[];
  status: 'active' | 'paused' | 'completed' | 'failed';
  progress: number;
  created: string;
  lastRun: string;
  totalRuns: number;
  successRate: number;
  averageTime: number;
}

interface PipelineStage {
  id: number;
  name: string;
  type: 'ideation' | 'research' | 'creation' | 'review' | 'optimization' | 'publication' | 'promotion';
  status: 'pending' | 'running' | 'completed' | 'failed';
  aiEnabled: boolean;
  automationLevel: 'manual' | 'semi-auto' | 'fully-auto';
  estimatedTime: number;
  actualTime?: number;
  config: any;
}

interface ContentCampaign {
  id: number;
  name: string;
  pipeline: string;
  topics: string[];
  targetAudience: string;
  platforms: string[];
  schedule: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  contentGenerated: number;
  contentPublished: number;
  engagement: number;
  createdAt: string;
}

export default function ContentPipeline() {
  const [activeTab, setActiveTab] = useState('pipelines');
  const [selectedPipeline, setSelectedPipeline] = useState<ContentPipeline | null>(null);
  const { toast } = useToast();

  const { data: pipelines = [], isLoading } = useQuery({
    queryKey: ["/api/content-pipelines"],
    select: (data) => data as ContentPipeline[],
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ["/api/content-campaigns"],
    select: (data) => data as ContentCampaign[],
  });

  const runPipelineMutation = useMutation({
    mutationFn: async (pipelineId: number) => {
      return await apiRequest(`/api/content-pipelines/${pipelineId}/run`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-pipelines"] });
      toast({
        title: "Pipeline started",
        description: "Your content pipeline is now running.",
      });
    },
  });

  const pausePipelineMutation = useMutation({
    mutationFn: async (pipelineId: number) => {
      return await apiRequest(`/api/content-pipelines/${pipelineId}/pause`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-pipelines"] });
      toast({
        title: "Pipeline paused",
        description: "Your content pipeline has been paused.",
      });
    },
  });

  // Mock data for demonstration
  const mockPipelines: ContentPipeline[] = [
    {
      id: 1,
      name: "AI Blog Content Pipeline",
      description: "Automated blog content creation from ideation to publication",
      stages: [
        {
          id: 1,
          name: "Topic Ideation",
          type: 'ideation',
          status: 'completed',
          aiEnabled: true,
          automationLevel: 'fully-auto',
          estimatedTime: 30,
          actualTime: 25,
          config: {
            aiModel: 'gpt-4',
            prompts: ['trending AI topics', 'industry insights']
          }
        },
        {
          id: 2,
          name: "Research & Outline",
          type: 'research',
          status: 'completed',
          aiEnabled: true,
          automationLevel: 'semi-auto',
          estimatedTime: 60,
          actualTime: 55,
          config: {
            sources: ['industry reports', 'news articles', 'competitor analysis']
          }
        },
        {
          id: 3,
          name: "Content Creation",
          type: 'creation',
          status: 'running',
          aiEnabled: true,
          automationLevel: 'semi-auto',
          estimatedTime: 120,
          config: {
            wordCount: 1500,
            tone: 'professional',
            seoOptimization: true
          }
        },
        {
          id: 4,
          name: "Review & Edit",
          type: 'review',
          status: 'pending',
          aiEnabled: true,
          automationLevel: 'manual',
          estimatedTime: 45,
          config: {
            checkGrammar: true,
            factCheck: true,
            brandVoice: true
          }
        },
        {
          id: 5,
          name: "SEO Optimization",
          type: 'optimization',
          status: 'pending',
          aiEnabled: true,
          automationLevel: 'fully-auto',
          estimatedTime: 30,
          config: {
            keywords: ['AI', 'automation', 'productivity'],
            metaDescription: true,
            headingOptimization: true
          }
        },
        {
          id: 6,
          name: "Publication",
          type: 'publication',
          status: 'pending',
          aiEnabled: false,
          automationLevel: 'semi-auto',
          estimatedTime: 15,
          config: {
            platforms: ['blog', 'medium', 'linkedin'],
            scheduledTime: '2025-01-20T10:00:00Z'
          }
        },
        {
          id: 7,
          name: "Promotion",
          type: 'promotion',
          status: 'pending',
          aiEnabled: true,
          automationLevel: 'fully-auto',
          estimatedTime: 60,
          config: {
            socialMedia: ['twitter', 'linkedin', 'facebook'],
            emailNewsletter: true,
            crossPlatform: true
          }
        }
      ],
      status: 'active',
      progress: 45,
      created: "2025-01-15T00:00:00Z",
      lastRun: "2025-01-18T14:30:00Z",
      totalRuns: 23,
      successRate: 87,
      averageTime: 285
    },
    {
      id: 2,
      name: "Social Media Campaign",
      description: "Multi-platform social media content automation",
      stages: [
        {
          id: 8,
          name: "Content Planning",
          type: 'ideation',
          status: 'completed',
          aiEnabled: true,
          automationLevel: 'fully-auto',
          estimatedTime: 45,
          actualTime: 40,
          config: {}
        },
        {
          id: 9,
          name: "Visual Creation",
          type: 'creation',
          status: 'completed',
          aiEnabled: true,
          automationLevel: 'semi-auto',
          estimatedTime: 90,
          actualTime: 85,
          config: {}
        },
        {
          id: 10,
          name: "Cross-Platform Publishing",
          type: 'publication',
          status: 'completed',
          aiEnabled: false,
          automationLevel: 'fully-auto',
          estimatedTime: 30,
          actualTime: 25,
          config: {}
        }
      ],
      status: 'completed',
      progress: 100,
      created: "2025-01-10T00:00:00Z",
      lastRun: "2025-01-18T16:00:00Z",
      totalRuns: 15,
      successRate: 93,
      averageTime: 165
    }
  ];

  const mockCampaigns: ContentCampaign[] = [
    {
      id: 1,
      name: "AI Innovation Series",
      pipeline: "AI Blog Content Pipeline",
      topics: ["Machine Learning", "Automation", "Future of AI"],
      targetAudience: "Tech professionals and entrepreneurs",
      platforms: ["blog", "linkedin", "twitter"],
      schedule: "Weekly on Tuesdays",
      status: 'active',
      contentGenerated: 12,
      contentPublished: 8,
      engagement: 847,
      createdAt: "2025-01-10T00:00:00Z"
    },
    {
      id: 2,
      name: "Product Launch Campaign",
      pipeline: "Social Media Campaign",
      topics: ["Product features", "Use cases", "Customer success"],
      targetAudience: "Potential customers and partners",
      platforms: ["twitter", "linkedin", "facebook", "instagram"],
      schedule: "Daily during launch week",
      status: 'completed',
      contentGenerated: 25,
      contentPublished: 25,
      engagement: 1542,
      createdAt: "2025-01-05T00:00:00Z"
    }
  ];

  const displayPipelines = pipelines.length > 0 ? pipelines : mockPipelines;
  const displayCampaigns = campaigns.length > 0 ? campaigns : mockCampaigns;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'running': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'completed': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'ideation': return Target;
      case 'research': return FileText;
      case 'creation': return Zap;
      case 'review': return CheckCircle;
      case 'optimization': return TrendingUp;
      case 'publication': return Share2;
      case 'promotion': return Calendar;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Pipeline Automation</h1>
          <p className="text-muted-foreground mt-1">
            Automated content workflows from ideation to publication and promotion
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Pipeline Settings
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Pipeline
          </Button>
        </div>
      </div>

      {/* Pipeline Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Pipelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayPipelines.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">Pipeline completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124h</div>
            <p className="text-xs text-muted-foreground">Through automation</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline List */}
            <div className="space-y-4">
              {displayPipelines.map((pipeline) => (
                <Card 
                  key={pipeline.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedPipeline?.id === pipeline.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-muted-foreground/50'
                  }`}
                  onClick={() => setSelectedPipeline(pipeline)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(pipeline.status)}`}
                        >
                          {pipeline.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (pipeline.status === 'active') {
                                pausePipelineMutation.mutate(pipeline.id);
                              } else {
                                runPipelineMutation.mutate(pipeline.id);
                              }
                            }}
                          >
                            {pipeline.status === 'active' ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{pipeline.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{pipeline.progress}%</span>
                      </div>
                      <Progress value={pipeline.progress} className="h-2" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Runs:</span>
                          <span className="font-medium ml-2">{pipeline.totalRuns}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Success Rate:</span>
                          <span className="font-medium ml-2">{pipeline.successRate}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pipeline Details */}
            <div>
              {selectedPipeline ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedPipeline.name}</CardTitle>
                    <CardDescription>Pipeline stages and configuration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPipeline.stages.map((stage, index) => {
                        const StageIcon = getStageIcon(stage.type);
                        return (
                          <div key={stage.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                stage.status === 'completed' ? 'bg-green-500' :
                                stage.status === 'running' ? 'bg-blue-500' :
                                stage.status === 'failed' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}>
                                <StageIcon className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{stage.name}</h4>
                                <div className="flex items-center space-x-2">
                                  {stage.aiEnabled && (
                                    <Badge variant="secondary" className="text-xs">
                                      AI
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {stage.automationLevel}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                                <span className={getStatusColor(stage.status)}>
                                  {stage.status}
                                </span>
                                <span>
                                  {stage.actualTime || stage.estimatedTime}min
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Workflow className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a pipeline</h3>
                    <p className="text-muted-foreground">
                      Choose a pipeline to view stages and configuration
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Campaigns</CardTitle>
              <CardDescription>
                Ongoing content campaigns using automated pipelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{campaign.name}</h3>
                          <Badge variant="outline" className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Pipeline: {campaign.pipeline}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Target:</span>
                            <span className="font-medium ml-2">{campaign.targetAudience}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Schedule:</span>
                            <span className="font-medium ml-2">{campaign.schedule}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Generated:</span>
                            <span className="font-medium ml-2">{campaign.contentGenerated}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Published:</span>
                            <span className="font-medium ml-2">{campaign.contentPublished}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {campaign.platforms.map((platform) => (
                            <Badge key={platform} variant="secondary" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{campaign.engagement}</div>
                        <div className="text-xs text-muted-foreground">Total engagement</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Analytics</CardTitle>
              <CardDescription>
                Performance metrics and optimization insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed pipeline performance and optimization insights coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Templates</CardTitle>
              <CardDescription>
                Pre-configured pipeline templates for common workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Workflow className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Pipeline Templates</h3>
                <p className="text-muted-foreground mb-4">
                  Template library and custom pipeline builder coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}