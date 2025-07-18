import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Network, Search, Filter, Plus, Eye, Link, Brain, 
  FileText, Users, Target, Lightbulb, TrendingUp, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface KnowledgeEntity {
  id: number;
  name: string;
  type: 'person' | 'project' | 'concept' | 'skill' | 'tool' | 'client' | 'document' | 'insight';
  description: string;
  importance: number;
  connectionCount: number;
  lastUpdated: string;
  tags: string[];
  metadata: {
    source: string;
    confidence: number;
    extractedFrom: string[];
  };
}

interface KnowledgeConnection {
  id: number;
  fromEntity: number;
  toEntity: number;
  relationshipType: 'related_to' | 'depends_on' | 'created_by' | 'used_in' | 'influences' | 'part_of';
  strength: number;
  context: string;
  discoveredAt: string;
}

interface KnowledgeInsight {
  id: number;
  title: string;
  description: string;
  type: 'pattern' | 'opportunity' | 'risk' | 'recommendation';
  confidence: number;
  entities: number[];
  connections: number[];
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export default function KnowledgeGraph() {
  const [activeTab, setActiveTab] = useState('graph');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedEntity, setSelectedEntity] = useState<KnowledgeEntity | null>(null);
  const { toast } = useToast();

  const { data: entities = [], isLoading } = useQuery({
    queryKey: ["/api/knowledge/entities", searchQuery, filterType],
    select: (data) => data as KnowledgeEntity[],
  });

  const { data: connections = [] } = useQuery({
    queryKey: ["/api/knowledge/connections"],
    select: (data) => data as KnowledgeConnection[],
  });

  const { data: insights = [] } = useQuery({
    queryKey: ["/api/knowledge/insights"],
    select: (data) => data as KnowledgeInsight[],
  });

  const analyzeKnowledgeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/knowledge/analyze", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/knowledge"] });
      toast({
        title: "Knowledge analysis completed",
        description: "New insights and connections have been discovered.",
      });
    },
  });

  // Mock data for demonstration
  const mockEntities: KnowledgeEntity[] = [
    {
      id: 1,
      name: "Sarah Chen",
      type: 'person',
      description: "CTO at TechStartup, AI integration project client",
      importance: 85,
      connectionCount: 12,
      lastUpdated: "2025-01-18T14:30:00Z",
      tags: ["client", "decision-maker", "tech-leader"],
      metadata: {
        source: "email_analysis",
        confidence: 95,
        extractedFrom: ["emails", "meeting_notes", "project_docs"]
      }
    },
    {
      id: 2,
      name: "AI Recommendation Engine",
      type: 'project',
      description: "Machine learning system for e-commerce personalization",
      importance: 90,
      connectionCount: 18,
      lastUpdated: "2025-01-18T16:45:00Z",
      tags: ["ml", "e-commerce", "personalization"],
      metadata: {
        source: "project_tracking",
        confidence: 100,
        extractedFrom: ["project_specs", "code_repos", "meetings"]
      }
    },
    {
      id: 3,
      name: "GPT-4 Integration",
      type: 'concept',
      description: "Implementation of OpenAI's GPT-4 for natural language processing",
      importance: 78,
      connectionCount: 15,
      lastUpdated: "2025-01-18T11:20:00Z",
      tags: ["ai", "nlp", "openai"],
      metadata: {
        source: "knowledge_base",
        confidence: 88,
        extractedFrom: ["documentation", "code", "experiments"]
      }
    },
    {
      id: 4,
      name: "Python",
      type: 'skill',
      description: "Primary programming language for AI development",
      importance: 95,
      connectionCount: 25,
      lastUpdated: "2025-01-18T10:15:00Z",
      tags: ["programming", "ai", "backend"],
      metadata: {
        source: "activity_analysis",
        confidence: 100,
        extractedFrom: ["code_commits", "projects", "time_tracking"]
      }
    },
    {
      id: 5,
      name: "TensorFlow",
      type: 'tool',
      description: "Machine learning framework for building AI models",
      importance: 82,
      connectionCount: 14,
      lastUpdated: "2025-01-18T13:10:00Z",
      tags: ["ml", "framework", "google"],
      metadata: {
        source: "tool_usage",
        confidence: 92,
        extractedFrom: ["projects", "experiments", "documentation"]
      }
    }
  ];

  const mockConnections: KnowledgeConnection[] = [
    {
      id: 1,
      fromEntity: 1,
      toEntity: 2,
      relationshipType: 'created_by',
      strength: 90,
      context: "Sarah Chen commissioned the AI Recommendation Engine project",
      discoveredAt: "2025-01-18T14:30:00Z"
    },
    {
      id: 2,
      fromEntity: 2,
      toEntity: 3,
      relationshipType: 'depends_on',
      strength: 85,
      context: "AI Recommendation Engine uses GPT-4 for natural language understanding",
      discoveredAt: "2025-01-18T16:45:00Z"
    },
    {
      id: 3,
      fromEntity: 4,
      toEntity: 2,
      relationshipType: 'used_in',
      strength: 95,
      context: "Python is the primary development language for the recommendation engine",
      discoveredAt: "2025-01-18T10:15:00Z"
    }
  ];

  const mockInsights: KnowledgeInsight[] = [
    {
      id: 1,
      title: "High-Value Client Pattern",
      description: "Clients who request AI integration projects have 3x higher project values and 80% higher satisfaction rates",
      type: 'pattern',
      confidence: 87,
      entities: [1, 2],
      connections: [1, 2],
      actionable: true,
      priority: 'high',
      createdAt: "2025-01-18T15:30:00Z"
    },
    {
      id: 2,
      title: "Skill Monetization Opportunity",
      description: "Python + AI expertise combination shows highest billing rates and project success",
      type: 'opportunity',
      confidence: 92,
      entities: [4, 3],
      connections: [2, 3],
      actionable: true,
      priority: 'medium',
      createdAt: "2025-01-18T12:45:00Z"
    },
    {
      id: 3,
      title: "Technology Dependency Risk",
      description: "Over-reliance on GPT-4 for multiple projects creates single point of failure",
      type: 'risk',
      confidence: 76,
      entities: [3, 2],
      connections: [2],
      actionable: true,
      priority: 'medium',
      createdAt: "2025-01-18T14:20:00Z"
    }
  ];

  const displayEntities = entities.length > 0 ? entities : mockEntities;
  const displayConnections = connections.length > 0 ? connections : mockConnections;
  const displayInsights = insights.length > 0 ? insights : mockInsights;

  const filteredEntities = displayEntities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || entity.type === filterType;
    return matchesSearch && matchesType;
  });

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'person': return Users;
      case 'project': return Target;
      case 'concept': return Lightbulb;
      case 'skill': return Brain;
      case 'tool': return Zap;
      case 'client': return Users;
      case 'document': return FileText;
      case 'insight': return TrendingUp;
      default: return Network;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'person': return 'bg-blue-500';
      case 'project': return 'bg-green-500';
      case 'concept': return 'bg-purple-500';
      case 'skill': return 'bg-orange-500';
      case 'tool': return 'bg-red-500';
      case 'client': return 'bg-indigo-500';
      case 'document': return 'bg-gray-500';
      case 'insight': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'text-blue-600';
      case 'opportunity': return 'text-green-600';
      case 'risk': return 'text-red-600';
      case 'recommendation': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Graph</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered entity extraction and relationship mapping across your entire operation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => analyzeKnowledgeMutation.mutate()}
          >
            <Brain className="w-4 h-4 mr-2" />
            Analyze Knowledge
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Entity
          </Button>
        </div>
      </div>

      {/* Knowledge Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayEntities.length}</div>
            <p className="text-xs text-muted-foreground">+{displayEntities.length - 3} extracted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayConnections.length}</div>
            <p className="text-xs text-muted-foreground">Relationships mapped</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Insights Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayInsights.length}</div>
            <p className="text-xs text-muted-foreground">AI-discovered patterns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Of activities mapped</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="graph">Graph View</TabsTrigger>
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Graph Visualization</CardTitle>
              <CardDescription>
                Interactive network of entities and their relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed">
                <div className="text-center">
                  <Network className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Interactive Knowledge Graph</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced 3D visualization with entity clustering and relationship mapping
                  </p>
                  <Button>
                    <Eye className="w-4 h-4 mr-2" />
                    Launch Graph Viewer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search entities by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="person">People</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
                <SelectItem value="concept">Concepts</SelectItem>
                <SelectItem value="skill">Skills</SelectItem>
                <SelectItem value="tool">Tools</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="insight">Insights</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Entity List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Entities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredEntities.map((entity) => {
                      const EntityIcon = getEntityIcon(entity.type);
                      return (
                        <div
                          key={entity.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedEntity?.id === entity.id 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:border-muted-foreground/50'
                          }`}
                          onClick={() => setSelectedEntity(entity)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full ${getTypeColor(entity.type)} flex items-center justify-center`}>
                              <EntityIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium truncate">{entity.name}</h3>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {entity.connectionCount} connections
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {entity.importance}% importance
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 truncate">
                                {entity.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {entity.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Entity Details */}
            <div>
              {selectedEntity ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${getTypeColor(selectedEntity.type)} flex items-center justify-center`}>
                        {(() => {
                          const EntityIcon = getEntityIcon(selectedEntity.type);
                          return <EntityIcon className="w-5 h-5 text-white" />;
                        })()}
                      </div>
                      <div>
                        <CardTitle>{selectedEntity.name}</CardTitle>
                        <CardDescription>
                          {selectedEntity.type.charAt(0).toUpperCase() + selectedEntity.type.slice(1)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedEntity.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedEntity.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Metadata</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Importance:</span>
                          <span className="font-medium">{selectedEntity.importance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Connections:</span>
                          <span className="font-medium">{selectedEntity.connectionCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Confidence:</span>
                          <span className="font-medium">{selectedEntity.metadata.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Source:</span>
                          <span className="font-medium">{selectedEntity.metadata.source}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Extracted From</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedEntity.metadata.extractedFrom.map((source) => (
                          <Badge key={source} variant="secondary" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Link className="w-4 h-4 mr-2" />
                        View Connections
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Show in Graph
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select an entity</h3>
                    <p className="text-muted-foreground">
                      Choose an entity from the list to view details and connections
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>
                Patterns, opportunities, and recommendations discovered from your knowledge graph
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayInsights.map((insight) => (
                  <Card key={insight.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{insight.title}</h3>
                          <Badge variant="outline" className={`text-xs ${getInsightTypeColor(insight.type)}`}>
                            {insight.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {insight.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{insight.entities.length} entities involved</span>
                          <span>{insight.connections.length} connections analyzed</span>
                          <span>Priority: {insight.priority}</span>
                          {insight.actionable && (
                            <Badge variant="secondary" className="text-xs">
                              Actionable
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {insight.actionable && (
                          <Button size="sm">
                            Act on Insight
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Analysis</CardTitle>
              <CardDescription>
                Deep analysis of your knowledge patterns and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive knowledge analytics and pattern recognition coming soon
                </p>
                <Button onClick={() => analyzeKnowledgeMutation.mutate()}>
                  <Zap className="w-4 h-4 mr-2" />
                  Run Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}