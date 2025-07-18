import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  BarChart3, 
  Zap, 
  Target, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Brain,
  GitBranch,
  Settings2,
  Star,
  ChevronRight,
  Beaker,
  Sparkles
} from "lucide-react";

interface ExperimentResult {
  id: string;
  model: string;
  prompt: string;
  response: string;
  tokens: number;
  cost: number;
  latency: number;
  qualityScore: number;
  timestamp: string;
}

interface PromptExperiment {
  id: string;
  name: string;
  description: string;
  basePrompt: string;
  variations: string[];
  models: string[];
  results: ExperimentResult[];
  status: 'draft' | 'running' | 'completed';
  createdAt: string;
}

const AI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', cost: 0.03 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', cost: 0.002 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', cost: 0.015 },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', cost: 0.003 },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', cost: 0.001 },
  { id: 'llama-2-70b', name: 'Llama 2 70B', provider: 'Meta', cost: 0.0008 },
];

export default function ExperimentLab() {
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const [newExperiment, setNewExperiment] = useState({
    name: '',
    description: '',
    basePrompt: '',
    variations: [''],
    models: [] as string[],
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: experiments = [], isLoading } = useQuery<PromptExperiment[]>({
    queryKey: ['/api/experiments'],
  });

  const createExperimentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/experiments', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/experiments'] });
      setShowCreateForm(false);
      setNewExperiment({ name: '', description: '', basePrompt: '', variations: [''], models: [] });
      toast({ title: "Experiment created successfully!" });
    },
  });

  const runExperimentMutation = useMutation({
    mutationFn: (experimentId: string) => apiRequest(`/api/experiments/${experimentId}/run`, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/experiments'] });
      toast({ title: "Experiment started! Results will appear shortly." });
    },
  });

  const addVariation = () => {
    setNewExperiment(prev => ({
      ...prev,
      variations: [...prev.variations, '']
    }));
  };

  const updateVariation = (index: number, value: string) => {
    setNewExperiment(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) => i === index ? value : v)
    }));
  };

  const removeVariation = (index: number) => {
    setNewExperiment(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const selectedExperimentData = experiments.find(exp => exp.id === selectedExperiment);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Beaker className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Experimentation Lab</h1>
            <p className="text-slate-600 dark:text-slate-400">Test and optimize prompts across multiple AI models</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Beaker className="w-4 h-4 mr-2" />
          New Experiment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Experiment Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Experiments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{experiments.length}</p>
              </div>
              <Beaker className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Running</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {experiments.filter(exp => exp.status === 'running').length}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {experiments.filter(exp => exp.status === 'completed').length}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Cost</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${experiments.reduce((sum, exp) => 
                    sum + exp.results.reduce((costSum, result) => costSum + result.cost, 0), 0
                  ).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>Create New Experiment</span>
            </CardTitle>
            <CardDescription>
              Set up a new prompt experiment to test across multiple AI models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Experiment Name</Label>
                <Input
                  id="name"
                  value={newExperiment.name}
                  onChange={(e) => setNewExperiment(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Blog Title Generation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newExperiment.description}
                  onChange={(e) => setNewExperiment(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the experiment"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrompt">Base Prompt</Label>
              <Textarea
                id="basePrompt"
                value={newExperiment.basePrompt}
                onChange={(e) => setNewExperiment(prev => ({ ...prev, basePrompt: e.target.value }))}
                placeholder="Enter your base prompt here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Prompt Variations</Label>
              {newExperiment.variations.map((variation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Textarea
                    value={variation}
                    onChange={(e) => updateVariation(index, e.target.value)}
                    placeholder={`Variation ${index + 1}`}
                    className="min-h-[60px]"
                  />
                  {newExperiment.variations.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeVariation(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addVariation} className="w-full">
                <GitBranch className="w-4 h-4 mr-2" />
                Add Variation
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Select AI Models</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {AI_MODELS.map((model) => (
                  <div key={model.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={model.id}
                      checked={newExperiment.models.includes(model.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewExperiment(prev => ({
                            ...prev,
                            models: [...prev.models, model.id]
                          }));
                        } else {
                          setNewExperiment(prev => ({
                            ...prev,
                            models: prev.models.filter(m => m !== model.id)
                          }));
                        }
                      }}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor={model.id} className="text-sm">
                      {model.name}
                      <span className="text-xs text-slate-500 ml-1">(${model.cost}/1K tokens)</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => createExperimentMutation.mutate(newExperiment)}
                disabled={createExperimentMutation.isPending}
              >
                {createExperimentMutation.isPending ? 'Creating...' : 'Create Experiment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Experiments List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Experiments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : experiments.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">No experiments yet</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Create your first experiment to get started</p>
                </div>
              ) : (
                experiments.map((experiment) => (
                  <div
                    key={experiment.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedExperiment === experiment.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    onClick={() => setSelectedExperiment(experiment.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 dark:text-white">{experiment.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {experiment.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant={
                              experiment.status === 'completed' ? 'default' :
                              experiment.status === 'running' ? 'secondary' : 'outline'
                            }
                          >
                            {experiment.status}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {experiment.results.length} results
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Experiment Details */}
        <div className="lg:col-span-2">
          {selectedExperimentData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedExperimentData.name}</CardTitle>
                    <CardDescription>{selectedExperimentData.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        selectedExperimentData.status === 'completed' ? 'default' :
                        selectedExperimentData.status === 'running' ? 'secondary' : 'outline'
                      }
                    >
                      {selectedExperimentData.status}
                    </Badge>
                    {selectedExperimentData.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => runExperimentMutation.mutate(selectedExperimentData.id)}
                        disabled={runExperimentMutation.isPending}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="results" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="results">Results</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="config">Configuration</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="results" className="space-y-4">
                    {selectedExperimentData.results.length === 0 ? (
                      <div className="text-center py-8">
                        <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">No results yet</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                          {selectedExperimentData.status === 'draft' ? 'Run the experiment to see results' : 'Results will appear here'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedExperimentData.results.map((result) => (
                          <Card key={result.id} className="border-l-4 border-purple-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">{result.model}</Badge>
                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {result.latency}ms
                                  </span>
                                  <span className="flex items-center">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    ${result.cost.toFixed(4)}
                                  </span>
                                  <span className="flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    {result.qualityScore}/10
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                <strong>Prompt:</strong> {result.prompt.substring(0, 100)}...
                              </div>
                              <div className="text-sm text-slate-900 dark:text-white">
                                <strong>Response:</strong> {result.response.substring(0, 200)}...
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="analysis" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Avg Quality Score</span>
                                <span>
                                  {selectedExperimentData.results.length > 0 
                                    ? (selectedExperimentData.results.reduce((sum, r) => sum + r.qualityScore, 0) / selectedExperimentData.results.length).toFixed(1)
                                    : '0'}
                                  /10
                                </span>
                              </div>
                              <Progress 
                                value={selectedExperimentData.results.length > 0 
                                  ? (selectedExperimentData.results.reduce((sum, r) => sum + r.qualityScore, 0) / selectedExperimentData.results.length) * 10
                                  : 0
                                } 
                                className="h-2"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Avg Latency</span>
                                <span>
                                  {selectedExperimentData.results.length > 0 
                                    ? Math.round(selectedExperimentData.results.reduce((sum, r) => sum + r.latency, 0) / selectedExperimentData.results.length)
                                    : 0}ms
                                </span>
                              </div>
                              <Progress 
                                value={selectedExperimentData.results.length > 0 
                                  ? Math.min(100, (1000 / (selectedExperimentData.results.reduce((sum, r) => sum + r.latency, 0) / selectedExperimentData.results.length)) * 100)
                                  : 0
                                } 
                                className="h-2"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Cost Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Total Cost</span>
                              <span className="font-medium">
                                ${selectedExperimentData.results.reduce((sum, r) => sum + r.cost, 0).toFixed(4)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Avg Cost/Result</span>
                              <span className="font-medium">
                                ${selectedExperimentData.results.length > 0 
                                  ? (selectedExperimentData.results.reduce((sum, r) => sum + r.cost, 0) / selectedExperimentData.results.length).toFixed(4)
                                  : '0.0000'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Best Value</span>
                              <span className="font-medium">
                                {selectedExperimentData.results.length > 0 
                                  ? selectedExperimentData.results.reduce((best, current) => 
                                      (current.qualityScore / current.cost) > (best.qualityScore / best.cost) ? current : best
                                    ).model
                                  : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="config" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Base Prompt</Label>
                        <div className="mt-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">
                            {selectedExperimentData.basePrompt}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Variations ({selectedExperimentData.variations.length})</Label>
                        <div className="mt-1 space-y-2">
                          {selectedExperimentData.variations.map((variation, index) => (
                            <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">
                                {variation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Selected Models</Label>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {selectedExperimentData.models.map((modelId) => {
                            const model = AI_MODELS.find(m => m.id === modelId);
                            return (
                              <Badge key={modelId} variant="outline">
                                {model?.name || modelId}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Settings2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">Select an experiment to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}