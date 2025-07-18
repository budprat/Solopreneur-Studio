import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Sparkles, 
  Lightbulb, 
  Wand2, 
  Target, 
  Clock,
  DollarSign,
  Star,
  ArrowRight,
  RefreshCw,
  Copy,
  Heart,
  Zap,
  Brain,
  Rocket,
  Wand,
  Shuffle
} from 'lucide-react';

interface CreativeIdea {
  title: string;
  description: string;
  category: 'business' | 'content' | 'product' | 'service' | 'marketing' | 'automation';
  difficulty: 'easy' | 'medium' | 'hard';
  timeToImplement: string;
  potentialRevenue: string;
  requiredSkills: string[];
  nextSteps: string[];
  inspiration: string;
}

interface ContentIdea {
  title: string;
  description: string;
  type: 'blog' | 'video' | 'social' | 'email' | 'course' | 'podcast';
  audience: string;
  keyPoints: string[];
  callToAction: string;
  estimatedTime: string;
}

const categoryIcons = {
  business: Target,
  content: Lightbulb,
  product: Rocket,
  service: Star,
  marketing: Zap,
  automation: Brain
};

const categoryColors = {
  business: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  content: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  product: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  service: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  marketing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  automation: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export default function AIInspirationGenerator() {
  const [userContext, setUserContext] = useState({
    industry: '',
    skills: '',
    interests: '',
    currentProjects: '',
    goals: ''
  });
  const [ideaType, setIdeaType] = useState('mixed');
  const [contentTopic, setContentTopic] = useState('');
  const [contentType, setContentType] = useState('mixed');
  const [favoriteIdeas, setFavoriteIdeas] = useState<string[]>([]);

  // Fetch inspirational quote
  const { data: inspirationalQuote, refetch: refetchQuote } = useQuery({
    queryKey: ['/api/inspiration/quote'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Generate creative ideas mutation
  const generateIdeasMutation = useMutation({
    mutationFn: async () => {
      const contextData = {
        industry: userContext.industry || undefined,
        skills: userContext.skills ? userContext.skills.split(',').map(s => s.trim()) : undefined,
        interests: userContext.interests ? userContext.interests.split(',').map(s => s.trim()) : undefined,
        currentProjects: userContext.currentProjects ? userContext.currentProjects.split(',').map(s => s.trim()) : undefined,
        goals: userContext.goals ? userContext.goals.split(',').map(s => s.trim()) : undefined
      };

      return await apiRequest('/api/inspiration/ideas', {
        method: 'POST',
        body: JSON.stringify({
          userContext: contextData,
          ideaType,
          count: 3
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  // Generate content ideas mutation
  const generateContentMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/inspiration/content', {
        method: 'POST',
        body: JSON.stringify({
          topic: contentTopic,
          contentType,
          targetAudience: 'solopreneurs',
          count: 3
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  const toggleFavorite = (ideaTitle: string) => {
    setFavoriteIdeas(prev => 
      prev.includes(ideaTitle) 
        ? prev.filter(title => title !== ideaTitle)
        : [...prev, ideaTitle]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header with Magical Button */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Inspiration Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Spark your creativity with AI-powered ideas that transform thoughts into profitable ventures
          </p>
        </motion.div>

        {/* Inspirational Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
        >
          <p className="text-lg italic text-purple-700 dark:text-purple-300">
            "{inspirationalQuote || 'Every great journey begins with a single step forward.'}"
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchQuote()}
            className="mt-2 text-purple-600 hover:text-purple-700"
          >
            <Shuffle className="w-4 h-4 mr-1" />
            New Quote
          </Button>
        </motion.div>
      </div>

      <Tabs defaultValue="business-ideas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business-ideas" className="flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Business Ideas
          </TabsTrigger>
          <TabsTrigger value="content-ideas" className="flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" />
            Content Ideas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business-ideas" className="space-y-6">
          {/* Business Ideas Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="w-5 h-5 mr-2" />
                Tell AI About You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry/Niche</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Digital Marketing, SaaS, E-commerce"
                    value={userContext.industry}
                    onChange={(e) => setUserContext(prev => ({ ...prev, industry: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="skills">Your Skills</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., Writing, Design, Programming"
                    value={userContext.skills}
                    onChange={(e) => setUserContext(prev => ({ ...prev, skills: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="interests">Interests</Label>
                  <Input
                    id="interests"
                    placeholder="e.g., AI, Sustainability, Education"
                    value={userContext.interests}
                    onChange={(e) => setUserContext(prev => ({ ...prev, interests: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="ideaType">Idea Type</Label>
                  <Select value={ideaType} onValueChange={setIdeaType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select idea type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed Ideas</SelectItem>
                      <SelectItem value="business">Business Ventures</SelectItem>
                      <SelectItem value="content">Content Projects</SelectItem>
                      <SelectItem value="product">Product Ideas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="goals">Current Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="e.g., Scale to $10K/month, Launch a course, Build passive income"
                  value={userContext.goals}
                  onChange={(e) => setUserContext(prev => ({ ...prev, goals: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => generateIdeasMutation.mutate()}
                  disabled={generateIdeasMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
                >
                  {generateIdeasMutation.isPending ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Ideas ✨
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          {/* Generated Business Ideas */}
          <AnimatePresence>
            {generateIdeasMutation.data && (
              <div className="grid gap-6">
                {generateIdeasMutation.data.map((idea: CreativeIdea, index: number) => {
                  const CategoryIcon = categoryIcons[idea.category];
                  const isFavorite = favoriteIdeas.includes(idea.title);
                  
                  return (
                    <motion.div
                      key={idea.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
                                <CategoryIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <CardTitle className="text-xl">{idea.title}</CardTitle>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className={categoryColors[idea.category]}>
                                    {idea.category}
                                  </Badge>
                                  <Badge variant="outline" className={difficultyColors[idea.difficulty]}>
                                    {idea.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(idea.title)}
                                className={isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}
                              >
                                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(idea.title + '\n\n' + idea.description)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground">{idea.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-purple-600" />
                              <span className="text-sm">{idea.timeToImplement}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-sm">{idea.potentialRevenue}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm">{idea.requiredSkills.length} skills needed</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">Required Skills:</h4>
                            <div className="flex flex-wrap gap-2">
                              {idea.requiredSkills.map((skill, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">Next Steps:</h4>
                            <ol className="text-sm space-y-1">
                              {idea.nextSteps.map((step, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="font-medium mr-2 text-purple-600">{i + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                            <p className="text-sm italic text-purple-700 dark:text-purple-300">
                              💡 {idea.inspiration}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="content-ideas" className="space-y-6">
          {/* Content Ideas Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Content Inspiration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contentTopic">Topic/Theme</Label>
                  <Input
                    id="contentTopic"
                    placeholder="e.g., AI productivity, Remote work, Entrepreneurship"
                    value={contentTopic}
                    onChange={(e) => setContentTopic(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed Content</SelectItem>
                      <SelectItem value="blog">Blog Posts</SelectItem>
                      <SelectItem value="video">Video Content</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email Campaigns</SelectItem>
                      <SelectItem value="course">Course Content</SelectItem>
                      <SelectItem value="podcast">Podcast Episodes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => generateContentMutation.mutate()}
                  disabled={generateContentMutation.isPending || !contentTopic}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 text-lg"
                >
                  {generateContentMutation.isPending ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Creating Content Ideas...
                    </>
                  ) : (
                    <>
                      <Wand className="w-5 h-5 mr-2" />
                      Generate Content Ideas
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          {/* Generated Content Ideas */}
          <AnimatePresence>
            {generateContentMutation.data && (
              <div className="grid gap-6">
                {generateContentMutation.data.map((idea: ContentIdea, index: number) => (
                  <motion.div
                    key={idea.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-2 border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{idea.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                {idea.type}
                              </Badge>
                              <Badge variant="outline">
                                {idea.estimatedTime}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(idea.title + '\n\n' + idea.description)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{idea.description}</p>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Key Points to Cover:</h4>
                          <ul className="text-sm space-y-1">
                            {idea.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start">
                                <ArrowRight className="w-3 h-3 mr-2 mt-0.5 text-green-600" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">Call to Action:</h4>
                          <p className="text-sm">{idea.callToAction}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}