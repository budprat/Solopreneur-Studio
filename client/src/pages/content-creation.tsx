import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, FileText, Image, Video, Mic, Wand2, Save, Share2, Calendar, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContentItem {
  id: number;
  title: string;
  type: 'text' | 'image' | 'video' | 'audio';
  content: string;
  status: 'draft' | 'review' | 'published';
  platform: string;
  scheduledFor?: string;
  tags: string[];
  performance?: {
    views: number;
    engagement: number;
    reach: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ContentCreation() {
  const [selectedType, setSelectedType] = useState<'text' | 'image' | 'video' | 'audio'>('text');
  const [activeTab, setActiveTab] = useState('create');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [tags, setTags] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: contentItems = [], isLoading } = useQuery({
    queryKey: ["/api/content"],
    select: (data) => data as ContentItem[],
  });

  const createContentMutation = useMutation({
    mutationFn: async (newContent: Partial<ContentItem>) => {
      return await apiRequest("/api/content", {
        method: "POST",
        body: JSON.stringify(newContent),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content created successfully",
        description: "Your content has been saved and is ready for publishing.",
      });
      setContent('');
      setTitle('');
      setPlatform('');
      setTags('');
    },
  });

  const generateContentMutation = useMutation({
    mutationFn: async (prompt: string) => {
      return await apiRequest("/api/content/generate", {
        method: "POST",
        body: JSON.stringify({ prompt, type: selectedType }),
      });
    },
    onSuccess: (data: any) => {
      setContent(data.content);
      toast({
        title: "Content generated successfully",
        description: "AI-generated content is ready for review and editing.",
      });
    },
  });

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title or topic for content generation.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await generateContentMutation.mutateAsync(title);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please enter both title and content.",
        variant: "destructive",
      });
      return;
    }

    await createContentMutation.mutateAsync({
      title,
      content,
      type: selectedType,
      platform,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'draft',
    });
  };

  const contentTypeIcons = {
    text: FileText,
    image: Image,
    video: Video,
    audio: Mic,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Creation Studio</h1>
          <p className="text-muted-foreground mt-1">
            Create, optimize, and manage AI-powered content across all platforms
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Content
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Content Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentItems.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentItems.filter(c => c.status === 'published').length}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340%</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Content Creator</CardTitle>
              <CardDescription>
                Create high-quality content using advanced AI models with brand consistency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Type Selection */}
              <div className="space-y-2">
                <Label>Content Type</Label>
                <div className="flex space-x-2">
                  {Object.entries(contentTypeIcons).map(([type, Icon]) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type as any)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Content Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title / Topic</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter content title or topic..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Target Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="podcast">Podcast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="AI, marketing, tutorial (comma-separated)"
                />
              </div>

              {/* AI Generation */}
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !title.trim()}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
                <Button variant="outline" size="sm">
                  Use Template
                </Button>
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start typing or generate content with AI..."
                  className="min-h-[300px]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Tag className="w-4 h-4 mr-2" />
                    Add Tags
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={handleSave}>
                    Publish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>
                Manage and organize all your content assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : contentItems.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No content yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first piece of content to get started
                  </p>
                  <Button onClick={() => setActiveTab('create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Content
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {contentItems.map((item) => {
                    const Icon = contentTypeIcons[item.type];
                    return (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-start space-x-4">
                          <Icon className="w-8 h-8 text-muted-foreground mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{item.title}</h3>
                              <Badge variant={
                                item.status === 'published' ? 'default' :
                                item.status === 'review' ? 'secondary' : 'outline'
                              }>
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.platform} • {item.tags.join(', ')}
                            </p>
                            {item.performance && (
                              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                <span>{item.performance.views} views</span>
                                <span>{item.performance.engagement}% engagement</span>
                                <span>{item.performance.reach} reach</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                Schedule and manage your content publishing timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Content Scheduling</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced scheduling features coming soon
                </p>
                <Button variant="outline">
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>
                Track and analyze your content's performance across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Performance Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced analytics and insights coming soon
                </p>
                <Button variant="outline">
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}