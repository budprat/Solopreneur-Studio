import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Upload, Image, FileText, Video, Music, Download, Tag, Search, 
  Filter, Grid, List, Star, Share2, FolderOpen, Zap, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DigitalAsset {
  id: number;
  filename: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  size: number;
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  aiGeneratedTags: string[];
  description?: string;
  usage: {
    projects: string[];
    campaigns: string[];
    views: number;
    downloads: number;
  };
  metadata: {
    dimensions?: string;
    duration?: string;
    format: string;
    createdAt: string;
    uploadedAt: string;
  };
  aiAnalysis?: {
    objects: string[];
    colors: string[];
    mood: string;
    quality: number;
    suggestions: string[];
  };
}

interface AssetCollection {
  id: number;
  name: string;
  description: string;
  assetCount: number;
  tags: string[];
  createdAt: string;
}

export default function DigitalAssets() {
  const [activeTab, setActiveTab] = useState('assets');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const { toast } = useToast();

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["/api/assets", searchQuery, filterType],
    select: (data) => data as DigitalAsset[],
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["/api/asset-collections"],
    select: (data) => data as AssetCollection[],
  });

  const uploadAssetMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiRequest("/api/assets/upload", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      toast({
        title: "Asset uploaded successfully",
        description: "Your file has been processed and analyzed by AI.",
      });
    },
  });

  const analyzeAssetMutation = useMutation({
    mutationFn: async (assetId: number) => {
      return await apiRequest(`/api/assets/${assetId}/analyze`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      toast({
        title: "Asset analyzed",
        description: "AI analysis completed with new tags and insights.",
      });
    },
  });

  // Mock data for demonstration
  const mockAssets: DigitalAsset[] = [
    {
      id: 1,
      filename: "hero-banner-design.jpg",
      type: 'image',
      size: 2048000,
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300",
      tags: ["banner", "hero", "design"],
      aiGeneratedTags: ["technology", "modern", "blue", "professional", "clean"],
      description: "Hero banner for tech startup website",
      usage: {
        projects: ["TechStartup Integration", "Website Redesign"],
        campaigns: ["Product Launch", "Brand Refresh"],
        views: 247,
        downloads: 23
      },
      metadata: {
        dimensions: "1920x1080",
        format: "JPEG",
        createdAt: "2025-01-15T10:30:00Z",
        uploadedAt: "2025-01-15T10:35:00Z"
      },
      aiAnalysis: {
        objects: ["computer", "graph", "chart", "workspace"],
        colors: ["blue", "white", "gray"],
        mood: "professional",
        quality: 9.2,
        suggestions: ["Great for tech presentations", "Consider variants for different screen sizes"]
      }
    },
    {
      id: 2,
      filename: "ai-demo-video.mp4",
      type: 'video',
      size: 15728640,
      url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300",
      tags: ["demo", "ai", "presentation"],
      aiGeneratedTags: ["artificial intelligence", "technology", "automation", "future"],
      description: "AI capabilities demonstration video",
      usage: {
        projects: ["Client Presentations", "Marketing Materials"],
        campaigns: ["AI Services", "Capability Showcase"],
        views: 156,
        downloads: 12
      },
      metadata: {
        dimensions: "1280x720",
        duration: "2:34",
        format: "MP4",
        createdAt: "2025-01-16T14:20:00Z",
        uploadedAt: "2025-01-16T14:25:00Z"
      },
      aiAnalysis: {
        objects: ["robot", "screen", "interface", "data"],
        colors: ["blue", "green", "white"],
        mood: "innovative",
        quality: 8.7,
        suggestions: ["Excellent for client onboarding", "Consider shorter clips for social media"]
      }
    },
    {
      id: 3,
      filename: "brand-guidelines.pdf",
      type: 'document',
      size: 5242880,
      url: "/documents/brand-guidelines.pdf",
      tags: ["brand", "guidelines", "identity"],
      aiGeneratedTags: ["branding", "style guide", "colors", "typography", "logo"],
      description: "Complete brand identity guidelines",
      usage: {
        projects: ["All Brand Projects"],
        campaigns: ["Brand Consistency"],
        views: 89,
        downloads: 34
      },
      metadata: {
        format: "PDF",
        createdAt: "2025-01-10T09:15:00Z",
        uploadedAt: "2025-01-10T09:20:00Z"
      },
      aiAnalysis: {
        objects: ["logo", "colors", "typography", "examples"],
        colors: ["primary brand colors", "secondary palette"],
        mood: "professional",
        quality: 9.5,
        suggestions: ["Essential reference for all projects", "Consider creating quick reference cards"]
      }
    }
  ];

  const mockCollections: AssetCollection[] = [
    {
      id: 1,
      name: "TechStartup Project",
      description: "All assets for the TechStartup integration project",
      assetCount: 24,
      tags: ["tech", "startup", "integration"],
      createdAt: "2025-01-15T00:00:00Z"
    },
    {
      id: 2,
      name: "Brand Assets",
      description: "Core brand identity and marketing materials",
      assetCount: 18,
      tags: ["brand", "identity", "marketing"],
      createdAt: "2025-01-10T00:00:00Z"
    }
  ];

  const displayAssets = assets.length > 0 ? assets : mockAssets;
  const displayCollections = collections.length > 0 ? collections : mockCollections;

  const filteredAssets = displayAssets.filter(asset => {
    const matchesSearch = asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         asset.aiGeneratedTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || asset.type === filterType;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Digital Asset Management</h1>
          <p className="text-muted-foreground mt-1">
            Centralized repository with AI-powered tagging and content analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FolderOpen className="w-4 h-4 mr-2" />
            Collections
          </Button>
          <Button size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Assets
          </Button>
        </div>
      </div>

      {/* Asset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayAssets.length}</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-xs text-muted-foreground">24% of limit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Tags Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Auto-categorized</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Asset Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Active assets</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assets by name, tags, or AI descriptions..."
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
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Assets Display */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const FileIcon = getFileIcon(asset.type);
                return (
                  <Card key={asset.id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      {asset.thumbnailUrl ? (
                        <img
                          src={asset.thumbnailUrl}
                          alt={asset.filename}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                          <FileIcon className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm truncate flex-1">{asset.filename}</h3>
                        {asset.aiAnalysis && (
                          <Badge variant="secondary" className="text-xs ml-2">
                            AI: {asset.aiAnalysis.quality}/10
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatFileSize(asset.size)} • {asset.metadata.format}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {asset.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {asset.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{asset.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{asset.usage.views} views</span>
                        <span>{asset.usage.downloads} downloads</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssets.map((asset) => {
                const FileIcon = getFileIcon(asset.type);
                return (
                  <Card key={asset.id} className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium truncate">{asset.filename}</h3>
                          {asset.aiAnalysis && (
                            <Badge variant="secondary" className="text-xs">
                              AI: {asset.aiAnalysis.quality}/10
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(asset.size)} • {asset.metadata.format}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {asset.aiGeneratedTags.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Zap className="w-4 h-4 mr-2" />
                          Re-analyze
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Collections</CardTitle>
              <CardDescription>
                Organize your assets into themed collections for better project management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayCollections.map((collection) => (
                  <Card key={collection.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{collection.name}</h3>
                      <Badge variant="secondary">{collection.assetCount} assets</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {collection.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {collection.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Created {new Date(collection.createdAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" variant="outline">
                        Open
                      </Button>
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
              <CardTitle>Asset Analytics</CardTitle>
              <CardDescription>
                Insights into your asset usage and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed usage analytics and performance insights coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Management Settings</CardTitle>
              <CardDescription>
                Configure storage, AI analysis, and organization preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Management Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced configuration options coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}