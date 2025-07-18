import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Play, Pause, Mail, Calendar, FileText, Webhook, Clock, TrendingUp, Zap, MoreHorizontal } from "lucide-react";
import { AutomationWorkflow } from "@shared/schema";

export default function Automation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: workflows, isLoading } = useQuery<AutomationWorkflow[]>({
    queryKey: ['/api/automation'],
  });

  const filteredWorkflows = workflows?.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.trigger.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && workflow.isActive) ||
                         (statusFilter === "inactive" && !workflow.isActive);
    return matchesSearch && matchesStatus;
  }) || [];

  const getTriggerIcon = (trigger: string) => {
    switch (trigger.toLowerCase()) {
      case 'email':
        return Mail;
      case 'schedule':
        return Calendar;
      case 'webhook':
        return Webhook;
      case 'completion':
        return FileText;
      default:
        return Zap;
    }
  };

  const getTriggerColor = (trigger: string) => {
    const colors = {
      'email': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'schedule': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'webhook': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'completion': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[trigger.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatLastTriggered = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWorkflowsByStatus = (isActive: boolean) => {
    return workflows?.filter(workflow => workflow.isActive === isActive).length || 0;
  };

  const getTotalTriggers = () => {
    return workflows?.reduce((sum, workflow) => sum + (workflow.triggerCount || 0), 0) || 0;
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
          <h1 className="text-2xl font-bold">Automation Workflows</h1>
          <p className="text-muted-foreground">Automate your repetitive tasks and workflows</p>
        </div>
        <Button className="gradient-bg">
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold">{getWorkflowsByStatus(true)}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Workflows</p>
                <p className="text-2xl font-bold">{workflows?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Triggers</p>
                <p className="text-2xl font-bold">{getTotalTriggers()}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Hours Saved</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
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
            placeholder="Search workflows..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workflows</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => {
          const TriggerIcon = getTriggerIcon(workflow.trigger);
          return (
            <Card key={workflow.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <TriggerIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <Badge className={getTriggerColor(workflow.trigger)}>
                        {workflow.trigger}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={workflow.isActive}
                      onCheckedChange={() => {
                        // Handle toggle workflow active state
                      }}
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {workflow.description || 'No description available'}
                  </p>
                </div>

                {/* Workflow Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Triggers</p>
                    <p className="font-bold">{workflow.triggerCount || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className={`font-bold ${workflow.isActive ? 'text-accent' : 'text-muted-foreground'}`}>
                      {workflow.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>

                {/* Last Triggered */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last triggered:</span>
                  <span className="font-medium">
                    {formatLastTriggered(workflow.lastTriggered)}
                  </span>
                </div>

                {/* Actions Section */}
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Actions:</span>
                  </div>
                  <div className="mt-2 text-sm">
                    {Array.isArray(workflow.actions) 
                      ? `${workflow.actions.length} action${workflow.actions.length !== 1 ? 's' : ''} configured`
                      : 'No actions configured'
                    }
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    {workflow.isActive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {workflow.isActive ? 'Pause' : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your filters or search terms"
              : "Get started by creating your first automation workflow"
            }
          </p>
          <Button className="gradient-bg">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      )}
    </div>
  );
}
