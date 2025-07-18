import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Lightbulb, 
  AlertTriangle, 
  Star, 
  ChevronRight,
  Brain,
  Zap,
  DollarSign,
  Users,
  BarChart3,
  Rocket,
  Globe,
  Shield,
  Clock,
  Award,
  LineChart,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Sparkles
} from "lucide-react";

interface MarketOpportunity {
  id: string;
  title: string;
  description: string;
  market: string;
  demandScore: number;
  competitionLevel: 'Low' | 'Medium' | 'High';
  potentialRevenue: number;
  timeToMarket: number;
  confidence: number;
  tags: string[];
}

interface GrowthInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'optimization' | 'trend';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  priority: number;
  actionItems: string[];
  timeframe: string;
  potentialValue: number;
}

interface CompetitorAnalysis {
  competitor: string;
  market: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  differentiators: string[];
}

const mockMarketOpportunities: MarketOpportunity[] = [
  {
    id: '1',
    title: 'AI-Powered Content Audit Services',
    description: 'Growing demand for AI-driven content analysis and optimization services for enterprise clients',
    market: 'Content Marketing',
    demandScore: 87,
    competitionLevel: 'Medium',
    potentialRevenue: 45000,
    timeToMarket: 6,
    confidence: 92,
    tags: ['Content', 'AI Analysis', 'Enterprise']
  },
  {
    id: '2',
    title: 'Automated Video Script Generation',
    description: 'Video content creators need AI-powered script generation tools for consistent content production',
    market: 'Video Production',
    demandScore: 94,
    competitionLevel: 'Low',
    potentialRevenue: 32000,
    timeToMarket: 4,
    confidence: 88,
    tags: ['Video', 'Automation', 'Content Creation']
  },
  {
    id: '3',
    title: 'AI Sales Email Personalization',
    description: 'B2B sales teams require sophisticated AI tools for personalized email outreach at scale',
    market: 'Sales Tech',
    demandScore: 91,
    competitionLevel: 'High',
    potentialRevenue: 67000,
    timeToMarket: 8,
    confidence: 85,
    tags: ['Sales', 'Personalization', 'B2B']
  },
];

const mockGrowthInsights: GrowthInsight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'Expand to European Markets',
    description: 'GDPR-compliant AI services show 340% growth in European markets. Your current expertise positions you well.',
    impact: 'High',
    priority: 1,
    actionItems: [
      'Research GDPR compliance requirements for AI services',
      'Identify key European markets with high AI adoption',
      'Develop localized pricing strategies',
      'Create European-specific case studies'
    ],
    timeframe: '3-6 months',
    potentialValue: 85000
  },
  {
    id: '2',
    type: 'optimization',
    title: 'Optimize Client Onboarding Process',
    description: 'Analysis shows 23% of potential clients drop off during onboarding. Streamlining could increase revenue by 30%.',
    impact: 'Medium',
    priority: 2,
    actionItems: [
      'Audit current onboarding process',
      'Identify friction points in client journey',
      'Implement automated onboarding workflows',
      'Create interactive onboarding guides'
    ],
    timeframe: '1-2 months',
    potentialValue: 25000
  },
  {
    id: '3',
    type: 'risk',
    title: 'Overdependence on Single Client',
    description: 'Client Alpha Corp represents 47% of total revenue. Diversification needed to reduce risk.',
    impact: 'High',
    priority: 3,
    actionItems: [
      'Develop acquisition strategy for similar-sized clients',
      'Create productized services to reduce client dependency',
      'Establish minimum viable client base targets',
      'Implement client diversification tracking'
    ],
    timeframe: '2-4 months',
    potentialValue: 0
  }
];

const mockCompetitorAnalysis: CompetitorAnalysis[] = [
  {
    competitor: 'AI Content Labs',
    market: 'Content Marketing',
    strengths: ['Strong brand presence', 'Enterprise partnerships', 'Proven ROI'],
    weaknesses: ['High pricing', 'Limited customization', 'Slow response times'],
    pricing: '$2,500-5,000/month',
    differentiators: ['Real-time collaboration', 'Custom AI model training', 'Faster turnaround']
  },
  {
    competitor: 'ScriptGenius AI',
    market: 'Video Production',
    strengths: ['User-friendly interface', 'Template library', 'Good customer support'],
    weaknesses: ['Limited AI models', 'Basic analytics', 'No API access'],
    pricing: '$99-299/month',
    differentiators: ['Advanced AI models', 'Comprehensive analytics', 'API integration']
  }
];

export default function GrowthAdvisor() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const { data: businessMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/growth/metrics'],
    queryFn: () => Promise.resolve({
      currentRevenue: 127500,
      growthRate: 23,
      clientCount: 8,
      avgProjectValue: 15938,
      profitMargin: 68,
      marketPosition: 'Growing',
      riskLevel: 'Medium'
    })
  });

  const selectedOpportunityData = mockMarketOpportunities.find(op => op.id === selectedOpportunity);
  const selectedInsightData = mockGrowthInsights.find(insight => insight.id === selectedInsight);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Strategic Growth Advisor</h1>
            <p className="text-slate-600 dark:text-slate-400">AI-powered business intelligence and growth recommendations</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate New Insights
        </Button>
      </div>

      {/* Business Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${businessMetrics?.currentRevenue.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  {businessMetrics?.growthRate || 0}% growth
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Clients</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {businessMetrics?.clientCount || 0}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  Avg: ${businessMetrics?.avgProjectValue.toLocaleString() || '0'}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Profit Margin</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {businessMetrics?.profitMargin || 0}%
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {businessMetrics?.marketPosition || 'Stable'}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Risk Level</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {businessMetrics?.riskLevel || 'Low'}
                </p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Diversification needed
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Insights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span>Growth Insights</span>
            </CardTitle>
            <CardDescription>
              AI-powered recommendations for business growth and optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockGrowthInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedInsight === insight.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedInsight(insight.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {insight.type === 'opportunity' && <Rocket className="w-4 h-4 text-green-500" />}
                        {insight.type === 'risk' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        {insight.type === 'optimization' && <Zap className="w-4 h-4 text-blue-500" />}
                        {insight.type === 'trend' && <TrendingUp className="w-4 h-4 text-purple-500" />}
                        <h3 className="font-medium text-slate-900 dark:text-white">{insight.title}</h3>
                        <div className={`w-2 h-2 rounded-full ${getImpactColor(insight.impact)}`} />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-xs">
                          {insight.timeframe}
                        </Badge>
                        {insight.potentialValue > 0 && (
                          <span className="text-xs text-green-600 font-medium">
                            +${insight.potentialValue.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insight Details */}
        <Card>
          <CardHeader>
            <CardTitle>Action Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedInsightData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                    {selectedInsightData.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {selectedInsightData.description}
                  </p>
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="outline">
                      {selectedInsightData.impact} Impact
                    </Badge>
                    <Badge variant="outline">
                      Priority {selectedInsightData.priority}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Action Items:</h4>
                  <ul className="space-y-2">
                    {selectedInsightData.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t">
                  <Button className="w-full" size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Start Implementation
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select an insight to view action plan
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Market Opportunities</TabsTrigger>
          <TabsTrigger value="competitors">Competitive Analysis</TabsTrigger>
          <TabsTrigger value="forecasting">Revenue Forecasting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMarketOpportunities.map((opportunity) => (
              <Card 
                key={opportunity.id}
                className={`cursor-pointer transition-all ${
                  selectedOpportunity === opportunity.id
                    ? 'border-purple-500 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedOpportunity(opportunity.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                    <Badge variant="outline">{opportunity.market}</Badge>
                  </div>
                  <CardDescription>{opportunity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Demand Score</span>
                        <span className="font-medium">{opportunity.demandScore}/100</span>
                      </div>
                      <Progress value={opportunity.demandScore} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Competition</span>
                      <Badge 
                        variant="outline" 
                        className={`${getCompetitionColor(opportunity.competitionLevel)} text-white`}
                      >
                        {opportunity.competitionLevel}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Potential Revenue</span>
                      <span className="font-medium text-green-600">
                        ${opportunity.potentialRevenue.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Time to Market</span>
                      <span className="text-sm font-medium">{opportunity.timeToMarket} weeks</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {opportunity.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="competitors" className="space-y-4">
          <div className="grid gap-4">
            {mockCompetitorAnalysis.map((competitor, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{competitor.competitor}</CardTitle>
                    <Badge variant="outline">{competitor.market}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {competitor.strengths.map((strength, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <ArrowUp className="w-3 h-3 text-green-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Weaknesses</h4>
                      <ul className="space-y-1">
                        {competitor.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <ArrowDown className="w-3 h-3 text-red-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Pricing</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{competitor.pricing}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Your Differentiators</h4>
                      <div className="flex flex-wrap gap-1">
                        {competitor.differentiators.map((diff, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {diff}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5 text-blue-500" />
                  <span>Revenue Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Next Month</span>
                    <span className="font-medium text-slate-900 dark:text-white">$142,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Next Quarter</span>
                    <span className="font-medium text-slate-900 dark:text-white">$456,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Next Year</span>
                    <span className="font-medium text-slate-900 dark:text-white">$1,890,000</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Confidence Level</span>
                      <span className="font-medium text-green-600">87%</span>
                    </div>
                    <Progress value={87} className="h-2 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-purple-500" />
                  <span>Growth Drivers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Existing Clients</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">New Acquisitions</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Product Sales</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Scenario Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Conservative</h4>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">$1.2M</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">15% growth</p>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Realistic</h4>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">$1.9M</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">48% growth</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Optimistic</h4>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">$2.8M</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">120% growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}