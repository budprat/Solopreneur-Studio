import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  Target,
  Activity,
  PieChart,
  LineChart,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Brain,
  Zap,
  Star,
  Globe,
  Shield,
  Rocket
} from "lucide-react";

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
    forecast: number;
  };
  clients: {
    active: number;
    churn: number;
    lifetime_value: number;
    satisfaction: number;
  };
  projects: {
    active: number;
    completed: number;
    avg_duration: number;
    success_rate: number;
  };
  ai_usage: {
    total_requests: number;
    total_cost: number;
    avg_response_time: number;
    cost_per_request: number;
  };
  productivity: {
    billable_hours: number;
    utilization_rate: number;
    profit_margin: number;
    efficiency_score: number;
  };
}

const mockAnalytics: AnalyticsData = {
  revenue: {
    current: 127500,
    previous: 98200,
    growth: 29.8,
    forecast: 156000
  },
  clients: {
    active: 8,
    churn: 12.5,
    lifetime_value: 45600,
    satisfaction: 4.7
  },
  projects: {
    active: 14,
    completed: 47,
    avg_duration: 28,
    success_rate: 94.2
  },
  ai_usage: {
    total_requests: 15420,
    total_cost: 847.30,
    avg_response_time: 1850,
    cost_per_request: 0.055
  },
  productivity: {
    billable_hours: 124,
    utilization_rate: 82.5,
    profit_margin: 68.3,
    efficiency_score: 91
  }
};

interface PredictiveInsight {
  type: 'revenue' | 'client' | 'project' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  value: number;
  actions: string[];
}

const predictiveInsights: PredictiveInsight[] = [
  {
    type: 'revenue',
    title: 'Revenue Acceleration Opportunity',
    description: 'Based on current trends, implementing productized services could increase monthly revenue by 45%',
    confidence: 87,
    impact: 'high',
    timeframe: '2-3 months',
    value: 57375,
    actions: ['Create service packages', 'Implement recurring billing', 'Develop template library']
  },
  {
    type: 'client',
    title: 'Client Retention Risk',
    description: 'Client engagement patterns suggest 15% churn risk in the next quarter',
    confidence: 92,
    impact: 'medium',
    timeframe: '1-2 months',
    value: -19200,
    actions: ['Schedule client check-ins', 'Improve onboarding', 'Implement feedback system']
  },
  {
    type: 'project',
    title: 'Project Efficiency Gains',
    description: 'AI automation can reduce project delivery time by 35% while maintaining quality',
    confidence: 78,
    impact: 'high',
    timeframe: '1 month',
    value: 32500,
    actions: ['Automate routine tasks', 'Implement AI workflows', 'Create project templates']
  },
  {
    type: 'opportunity',
    title: 'Market Expansion Window',
    description: 'European market showing 340% growth in AI services demand',
    confidence: 85,
    impact: 'high',
    timeframe: '3-6 months',
    value: 125000,
    actions: ['Research EU regulations', 'Localize offerings', 'Build partnerships']
  }
];

export default function BusinessIntelligence() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const { data: analytics = mockAnalytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics', selectedPeriod],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'client': return <Users className="w-4 h-4 text-blue-500" />;
      case 'project': return <Target className="w-4 h-4 text-purple-500" />;
      case 'risk': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'opportunity': return <Rocket className="w-4 h-4 text-orange-500" />;
      default: return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Business Intelligence</h1>
            <p className="text-slate-600 dark:text-slate-400">Predictive analytics and performance insights</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(analytics.revenue.current)}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  {formatPercentage(analytics.revenue.growth)}
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
                  {analytics.clients.active}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Star className="w-3 h-3 mr-1" />
                  {analytics.clients.satisfaction}/5.0
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
                <p className="text-sm text-slate-600 dark:text-slate-400">Project Success</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatPercentage(analytics.projects.success_rate)}
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Target className="w-3 h-3 mr-1" />
                  {analytics.projects.active} active
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">AI Efficiency</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {analytics.ai_usage.avg_response_time}ms
                </p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Zap className="w-3 h-3 mr-1" />
                  {formatCurrency(analytics.ai_usage.cost_per_request)}
                </p>
              </div>
              <Brain className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Profit Margin</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatPercentage(analytics.productivity.profit_margin)}
                </p>
                <p className="text-xs text-indigo-600 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  {formatPercentage(analytics.productivity.utilization_rate)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <span>Predictive Insights</span>
          </CardTitle>
          <CardDescription>
            AI-powered predictions and recommendations based on your business data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictiveInsights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg hover:border-purple-500 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <h3 className="font-medium text-slate-900 dark:text-white">{insight.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getImpactColor(insight.impact)}`} />
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Timeline: {insight.timeframe}
                  </span>
                  <span className={`text-sm font-medium ${insight.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {insight.value >= 0 ? '+' : ''}{formatCurrency(insight.value)}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Recommended Actions:</p>
                  {insight.actions.slice(0, 2).map((action, actionIndex) => (
                    <div key={actionIndex} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-purple-500 rounded-full" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{action}</span>
                    </div>
                  ))}
                  {insight.actions.length > 2 && (
                    <p className="text-xs text-purple-600 cursor-pointer hover:underline">
                      +{insight.actions.length - 2} more actions
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">This Month</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatCurrency(analytics.revenue.current)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Previous Month</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatCurrency(analytics.revenue.previous)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Growth Rate</span>
                    <span className="font-medium text-green-600">
                      +{formatPercentage(analytics.revenue.growth)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Next Month Forecast</span>
                      <span className="font-medium text-purple-600">
                        {formatCurrency(analytics.revenue.forecast)}
                      </span>
                    </div>
                    <Progress value={75} className="h-2 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Active Clients</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {analytics.clients.active}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Churn Rate</span>
                    <span className="font-medium text-red-600">
                      {formatPercentage(analytics.clients.churn)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Lifetime Value</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatCurrency(analytics.clients.lifetime_value)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Satisfaction Score</span>
                    <span className="font-medium text-green-600">
                      {analytics.clients.satisfaction}/5.0
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Service Revenue</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Product Sales</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Recurring Revenue</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">AI Tools</span>
                    <span className="font-medium">{formatCurrency(analytics.ai_usage.total_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Software</span>
                    <span className="font-medium">{formatCurrency(1200)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Marketing</span>
                    <span className="font-medium">{formatCurrency(800)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Other</span>
                    <span className="font-medium">{formatCurrency(450)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profitability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Gross Margin</span>
                    <span className="font-medium text-green-600">
                      {formatPercentage(analytics.productivity.profit_margin)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Net Margin</span>
                    <span className="font-medium text-green-600">52.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">ROI</span>
                    <span className="font-medium text-purple-600">287%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Productivity Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Billable Hours</span>
                      <span className="font-medium">{analytics.productivity.billable_hours}h</span>
                    </div>
                    <Progress value={analytics.productivity.billable_hours} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Utilization Rate</span>
                      <span className="font-medium">{formatPercentage(analytics.productivity.utilization_rate)}</span>
                    </div>
                    <Progress value={analytics.productivity.utilization_rate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Efficiency Score</span>
                      <span className="font-medium">{analytics.productivity.efficiency_score}/100</span>
                    </div>
                    <Progress value={analytics.productivity.efficiency_score} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Requests</span>
                    <span className="font-medium">{analytics.ai_usage.total_requests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Cost</span>
                    <span className="font-medium">{formatCurrency(analytics.ai_usage.total_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</span>
                    <span className="font-medium">{analytics.ai_usage.avg_response_time}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Cost per Request</span>
                    <span className="font-medium">{formatCurrency(analytics.ai_usage.cost_per_request)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="predictive" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Next Month</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatCurrency(analytics.revenue.forecast)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Next Quarter</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatCurrency(analytics.revenue.forecast * 3.2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Next Year</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatCurrency(analytics.revenue.forecast * 14.5)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Confidence Level</span>
                      <span className="font-medium text-green-600">89%</span>
                    </div>
                    <Progress value={89} className="h-2 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Client Concentration</span>
                    </div>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Cash Flow</span>
                    </div>
                    <Badge variant="secondary">Low</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Market Competition</span>
                    </div>
                    <Badge variant="secondary">High</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Technology Adoption</span>
                    </div>
                    <Badge variant="secondary">Low</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}