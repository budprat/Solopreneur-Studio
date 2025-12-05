import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, Copy, Star, TrendingUp, Code, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Prompt } from "@shared/schema";
import { PromptModal } from "@/components/modals/prompt-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Prompts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/prompts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Prompt deleted",
        description: "The prompt has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete prompt. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setModalOpen(true);
  };

  const handleDelete = (prompt: Prompt) => {
    if (confirm(`Are you sure you want to delete "${prompt.name}"?`)) {
      deleteMutation.mutate(prompt.id);
    }
  };

  const handleCreate = () => {
    setSelectedPrompt(null);
    setModalOpen(true);
  };

  const handleCopy = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.content);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  const filteredPrompts = prompts?.filter(prompt => {
    const matchesSearch = prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || prompt.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const getCategoryColor = (category: string | null) => {
    const colors = {
      'content': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'communication': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'development': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'analysis': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'strategy': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[category?.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getSuccessRateColor = (rate: string | null) => {
    const numRate = parseFloat(rate || '0');
    if (numRate >= 90) return 'text-green-600 dark:text-green-400';
    if (numRate >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Prompt Library</h1>
          <p className="text-muted-foreground">Create, organize, and optimize your AI prompts</p>
        </div>
        <Button className="gradient-bg" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Prompt
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Prompts</p>
                <p className="text-2xl font-bold">{prompts?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Success Rate</p>
                <p className="text-2xl font-bold">
                  {prompts?.length 
                    ? Math.round(prompts.reduce((sum, p) => sum + parseFloat(p.successRate || '0'), 0) / prompts.length)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">
                  {prompts?.reduce((sum, p) => sum + (p.usageCount || 0), 0) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">
                  {new Set(prompts?.map(p => p.category).filter(Boolean)).size || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="content">Content</SelectItem>
            <SelectItem value="communication">Communication</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="analysis">Analysis</SelectItem>
            <SelectItem value="strategy">Strategy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{prompt.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {prompt.description || 'No description'}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopy(prompt)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(prompt)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(prompt)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category and Tags */}
              <div className="flex flex-wrap gap-2">
                {prompt.category && (
                  <Badge className={getCategoryColor(prompt.category)}>
                    {prompt.category}
                  </Badge>
                )}
                {prompt.tags?.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Prompt Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Prompt Preview</label>
                <div className="bg-muted rounded-md p-3 text-sm font-mono max-h-24 overflow-y-auto">
                  {prompt.content.substring(0, 150)}
                  {prompt.content.length > 150 && '...'}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className={`font-bold ${getSuccessRateColor(prompt.successRate)}`}>
                    {parseFloat(prompt.successRate || '0').toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Usage Count</p>
                  <p className="font-bold">{prompt.usageCount || 0}</p>
                </div>
              </div>

              {/* Version Info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Version {prompt.version}</span>
                {prompt.isPublic && (
                  <Badge variant="secondary" className="text-xs">
                    Public
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleCopy(prompt)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(prompt)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || categoryFilter !== "all"
              ? "Try adjusting your filters or search terms"
              : "Get started by creating your first prompt"
            }
          </p>
          <Button className="gradient-bg" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Prompt
          </Button>
        </div>
      )}

      {/* Prompt Modal */}
      <PromptModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        prompt={selectedPrompt}
      />
    </div>
  );
}
