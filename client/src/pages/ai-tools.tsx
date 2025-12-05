import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, DollarSign, Activity, Brain, Zap, MoreHorizontal, Pencil, Trash2, Power, PowerOff } from "lucide-react";
import { AiTool } from "@shared/schema";
import { AiToolModal } from "@/components/modals/ai-tool-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AITools() {
  const [searchTerm, setSearchTerm] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<AiTool | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: aiTools, isLoading } = useQuery<AiTool[]>({
    queryKey: ['/api/ai-tools'],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/ai-tools/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-tools'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "AI Tool deleted",
        description: "The AI tool has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete AI tool. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (tool: AiTool) => apiRequest('PUT', `/api/ai-tools/${tool.id}`, { isActive: !tool.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-tools'] });
      toast({
        title: "AI Tool updated",
        description: "The AI tool status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update AI tool. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (tool: AiTool) => {
    setSelectedTool(tool);
    setModalOpen(true);
  };

  const handleDelete = (tool: AiTool) => {
    if (confirm(`Are you sure you want to delete "${tool.name}"?`)) {
      deleteMutation.mutate(tool.id);
    }
  };

  const handleCreate = () => {
    setSelectedTool(null);
    setModalOpen(true);
  };

  const handleToggleActive = (tool: AiTool) => {
    toggleActiveMutation.mutate(tool);
  };

  const filteredTools = aiTools?.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = providerFilter === "all" || tool.provider === providerFilter;
    return matchesSearch && matchesProvider;
  }) || [];

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'anthropic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'google':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'meta':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const getBudgetProgress = (currentSpend: string | null, monthlyBudget: string | null) => {
    if (!currentSpend || !monthlyBudget) return 0;
    const spend = parseFloat(currentSpend);
    const budget = parseFloat(monthlyBudget);
    return Math.min((spend / budget) * 100, 100);
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
          <h1 className="text-2xl font-bold">AI Tools Hub</h1>
          <p className="text-muted-foreground">Manage your AI tools and monitor usage</p>
        </div>
        <Button className="gradient-bg" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tool
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Monthly Cost</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    aiTools?.reduce((sum, tool) => sum + parseFloat(tool.currentSpend || '0'), 0).toString() || '0'
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tools</p>
                <p className="text-2xl font-bold">
                  {aiTools?.filter(tool => tool.isActive).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">
                  {aiTools?.reduce((sum, tool) => sum + (tool.requestsCount || 0), 0).toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-secondary" />
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
            placeholder="Search AI tools..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="meta">Meta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Card key={tool.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <Badge className={getProviderColor(tool.provider)}>
                      {tool.provider}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${tool.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(tool)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleActive(tool)}>
                        {tool.isActive ? (
                          <>
                            <PowerOff className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(tool)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cost Information */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Spend</span>
                  <span className="font-medium">{formatCurrency(tool.currentSpend)}</span>
                </div>
                {tool.monthlyBudget && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Budget</span>
                      <span className="font-medium">{formatCurrency(tool.monthlyBudget)}</span>
                    </div>
                    <Progress 
                      value={getBudgetProgress(tool.currentSpend, tool.monthlyBudget)} 
                      className="h-2"
                    />
                  </>
                )}
              </div>

              {/* Usage Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tokens Used</span>
                  <span className="font-medium">{tool.tokensUsed?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Requests</span>
                  <span className="font-medium">{tool.requestsCount?.toLocaleString() || 0}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(tool)}>
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleActive(tool)}
                >
                  {tool.isActive ? (
                    <>
                      <PowerOff className="w-3 h-3 mr-1" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="w-3 h-3 mr-1" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No AI tools found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || providerFilter !== "all"
              ? "Try adjusting your filters or search terms"
              : "Get started by adding your first AI tool"
            }
          </p>
          <Button className="gradient-bg" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add AI Tool
          </Button>
        </div>
      )}

      {/* AI Tool Modal */}
      <AiToolModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        aiTool={selectedTool}
      />
    </div>
  );
}
