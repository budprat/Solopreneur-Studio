import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Zap,
  Send,
  Sparkles,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  RefreshCw,
  Star,
  Wand2
} from 'lucide-react';

interface BusinessInsight {
  type: 'opportunity' | 'risk' | 'trend' | 'forecast' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionItems: string[];
  priority: number;
}

interface PersonalizedRecommendation {
  category: 'productivity' | 'business' | 'ai-tools' | 'clients' | 'revenue';
  title: string;
  description: string;
  reasoning: string;
  expectedBenefit: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToImplement: string;
  steps: string[];
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-500" />;
    case 'risk': return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'trend': return <Target className="w-4 h-4 text-blue-500" />;
    case 'forecast': return <Brain className="w-4 h-4 text-purple-500" />;
    case 'recommendation': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
    default: return <Sparkles className="w-4 h-4 text-gray-500" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export default function AIAssistant() {
  const [chatInput, setChatInput] = useState('');
  const [selectedInsight, setSelectedInsight] = useState<BusinessInsight | null>(null);
  const queryClient = useQueryClient();

  // Fetch business insights
  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/ai/insights'],
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  // Fetch personalized recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['/api/ai/recommendations'],
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      setChatInput('');
    }
  });

  // Refresh insights mutation
  const refreshInsightsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/ai/insights/refresh', {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/insights'] });
    }
  });

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      chatMutation.mutate(chatInput);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="w-6 h-6 mr-2 text-primary" />
            AI Assistant
          </h2>
          <p className="text-muted-foreground">Your personalized business intelligence companion</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refreshInsightsMutation.mutate()}
            disabled={refreshInsightsMutation.isPending}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${refreshInsightsMutation.isPending ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Business Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {/* Business Insights */}
          {insightsLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {insights?.map((insight: BusinessInsight, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{insight.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getImpactColor(insight.impact)}>
                                {insight.impact} impact
                              </Badge>
                              <Badge variant="outline">
                                {insight.confidence}% confident
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {insight.description}
                          </p>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Action Items:</h4>
                            <ul className="text-sm space-y-1">
                              {insight.actionItems.map((item, i) => (
                                <li key={i} className="flex items-start">
                                  <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-muted-foreground" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {/* Personalized Recommendations */}
          {recommendationsLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {recommendations?.map((rec: PersonalizedRecommendation, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getDifficultyColor(rec.difficulty)}>
                            {rec.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {rec.timeToImplement}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {rec.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Why this matters:</h4>
                        <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Expected benefit:</h4>
                        <p className="text-sm text-green-600">{rec.expectedBenefit}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Implementation steps:</h4>
                        <ol className="text-sm space-y-1">
                          {rec.steps.map((step, i) => (
                            <li key={i} className="flex items-start">
                              <span className="font-medium mr-2">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        Start Implementation
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          {/* AI Chat Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat Messages Area */}
                <ScrollArea className="h-64 w-full border rounded-md p-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          Hello! I'm your AI assistant. I can help you with business insights, 
                          recommendations, and answer questions about your SoloAI Studio data. 
                          What would you like to know?
                        </p>
                      </div>
                    </div>
                    
                    {chatMutation.data && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Brain className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{chatMutation.data}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything about your business..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={chatMutation.isPending || !chatInput.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setChatInput("How can I improve my revenue this month?")}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Revenue Tips
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setChatInput("What are my top performing AI tools?")}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    AI Tools
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setChatInput("Suggest productivity improvements")}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Productivity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}