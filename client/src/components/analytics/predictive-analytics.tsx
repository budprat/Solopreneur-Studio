import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Brain, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';

// Mock data for predictive analytics
const revenueProjection = [
  { month: 'Jan', actual: 4500, predicted: 4800, confidence: 85 },
  { month: 'Feb', actual: 5200, predicted: 5400, confidence: 88 },
  { month: 'Mar', actual: 4800, predicted: 5100, confidence: 82 },
  { month: 'Apr', actual: 6200, predicted: 6500, confidence: 90 },
  { month: 'May', actual: 5800, predicted: 6200, confidence: 87 },
  { month: 'Jun', actual: null, predicted: 7100, confidence: 83 },
  { month: 'Jul', actual: null, predicted: 7800, confidence: 79 },
  { month: 'Aug', actual: null, predicted: 8200, confidence: 76 },
];

const performanceMetrics = [
  { metric: 'Productivity', current: 78, predicted: 85, trend: 'up' },
  { metric: 'Client Satisfaction', current: 92, predicted: 94, trend: 'up' },
  { metric: 'Project Efficiency', current: 67, predicted: 73, trend: 'up' },
  { metric: 'AI Tool Usage', current: 85, predicted: 90, trend: 'up' },
  { metric: 'Cost Optimization', current: 71, predicted: 68, trend: 'down' },
];

const businessInsights = [
  {
    id: 1,
    type: 'opportunity',
    title: 'Peak Productivity Hours',
    description: 'Your productivity peaks between 9-11 AM. Schedule complex tasks during this window.',
    impact: 'high',
    confidence: 94,
    action: 'Adjust schedule'
  },
  {
    id: 2,
    type: 'risk',
    title: 'Client Response Delay',
    description: 'Average response time increased by 23% this week. May impact client satisfaction.',
    impact: 'medium',
    confidence: 87,
    action: 'Set reminders'
  },
  {
    id: 3,
    type: 'trend',
    title: 'AI Tool Efficiency',
    description: 'Content creation prompts show 31% higher success rate than analysis prompts.',
    impact: 'medium',
    confidence: 91,
    action: 'Optimize prompts'
  },
  {
    id: 4,
    type: 'forecast',
    title: 'Revenue Growth',
    description: 'Based on current trends, expect 15% revenue increase by Q3.',
    impact: 'high',
    confidence: 82,
    action: 'Plan scaling'
  }
];

const skillRadarData = [
  { skill: 'Content Creation', current: 85, target: 90 },
  { skill: 'Project Management', current: 78, target: 85 },
  { skill: 'AI Integration', current: 92, target: 95 },
  { skill: 'Client Relations', current: 88, target: 92 },
  { skill: 'Analytics', current: 72, target: 80 },
  { skill: 'Automation', current: 81, target: 88 },
];

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-500" />;
    case 'risk': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'trend': return <Activity className="w-4 h-4 text-blue-500" />;
    case 'forecast': return <Target className="w-4 h-4 text-purple-500" />;
    default: return <Brain className="w-4 h-4 text-gray-500" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

export default function PredictiveAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Predictive Analytics</h2>
          <p className="text-muted-foreground">AI-powered insights and forecasting</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            <Brain className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="forecasting" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasting" className="space-y-6">
          {/* Revenue Projection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Revenue Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Actual Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Next Month</p>
                  <p className="text-2xl font-bold text-green-600">$7,100</p>
                  <p className="text-xs text-muted-foreground">83% confidence</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Q3 Target</p>
                  <p className="text-2xl font-bold text-blue-600">$23,100</p>
                  <p className="text-xs text-muted-foreground">79% confidence</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                  <p className="text-2xl font-bold text-purple-600">+15%</p>
                  <p className="text-xs text-muted-foreground">vs last quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Performance Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <motion.div
                    key={metric.metric}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{metric.metric}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-muted-foreground">Current: {metric.current}%</span>
                        <span className="text-sm text-muted-foreground">→</span>
                        <span className="text-sm font-medium text-blue-600">Predicted: {metric.predicted}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.predicted - metric.current > 0 ? '+' : ''}{metric.predicted - metric.current}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Insights */}
          <div className="grid gap-4">
            {businessInsights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: insight.id * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{insight.title}</h4>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getImpactColor(insight.impact)}`} />
                            <span className="text-xs text-muted-foreground">{insight.confidence}% confident</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline" className="text-xs">
                            {insight.impact} impact
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-xs">
                            {insight.action}
                            <ArrowUpRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Weekly Performance</h4>
                    <div className="space-y-3">
                      {performanceMetrics.slice(0, 3).map((metric) => (
                        <div key={metric.metric} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{metric.metric}</span>
                            <span>{metric.current}%</span>
                          </div>
                          <Progress value={metric.current} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Trend Analysis</h4>
                    <div className="space-y-3">
                      {performanceMetrics.slice(3).map((metric) => (
                        <div key={metric.metric} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{metric.metric}</span>
                            <span>{metric.current}%</span>
                          </div>
                          <Progress value={metric.current} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          {/* Skills Development */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Development Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.2}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}