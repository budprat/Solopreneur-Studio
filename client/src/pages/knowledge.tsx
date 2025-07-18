import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, BookOpen, FileText, Link, LayoutTemplate, MoreHorizontal, Edit, Share, Archive } from "lucide-react";
import { KnowledgeBase } from "@shared/schema";

export default function Knowledge() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: knowledgeItems, isLoading } = useQuery<KnowledgeBase[]>({
    queryKey: ['/api/knowledge'],
  });

  const filteredItems = knowledgeItems?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  }) || [];

  const getTypeColor = (type: string) => {
    const colors = {
      'article': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'note': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'resource': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'template': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return BookOpen;
      case 'note':
        return FileText;
      case 'resource':
        return Link;
      case 'template':
        return LayoutTemplate;
      default:
        return FileText;
    }
  };

  const getItemsByType = (type: string) => {
    return knowledgeItems?.filter(item => item.type === type).length || 0;
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
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">Organize your insights, resources, and expertise</p>
        </div>
        <Button className="gradient-bg">
          <Plus className="w-4 h-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Articles</p>
                <p className="text-2xl font-bold">{getItemsByType('article')}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-2xl font-bold">{getItemsByType('note')}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resources</p>
                <p className="text-2xl font-bold">{getItemsByType('resource')}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Link className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold">{getItemsByType('template')}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <LayoutTemplate className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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
            placeholder="Search knowledge base..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
            <SelectItem value="note">Notes</SelectItem>
            <SelectItem value="resource">Resources</SelectItem>
            <SelectItem value="template">Templates</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Knowledge Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          return (
            <Card key={item.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content Preview */}
                <div className="space-y-2">
                  <div className="bg-muted rounded-md p-3 text-sm max-h-24 overflow-y-auto">
                    {item.content.substring(0, 200)}
                    {item.content.length > 200 && '...'}
                  </div>
                </div>

                {/* Category and Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.category && (
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  )}
                  {item.tags?.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'No date'}
                  </span>
                  {item.isPublic && (
                    <Badge variant="secondary" className="text-xs">
                      Public
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No knowledge items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== "all" 
              ? "Try adjusting your filters or search terms"
              : "Get started by adding your first knowledge item"
            }
          </p>
          <Button className="gradient-bg">
            <Plus className="w-4 h-4 mr-2" />
            Add Knowledge
          </Button>
        </div>
      )}
    </div>
  );
}
