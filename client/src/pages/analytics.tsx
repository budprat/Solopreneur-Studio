import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictiveAnalytics from "@/components/analytics/predictive-analytics";
import AIAssistant from "@/components/ai/ai-assistant";
import { Brain, TrendingUp, Target, Zap } from "lucide-react";

export default function Analytics() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Hub</h1>
          <p className="text-muted-foreground">
            Comprehensive business intelligence and AI-powered insights
          </p>
        </div>
      </div>

      <Tabs defaultValue="predictive" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictive" className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Predictive Analytics
          </TabsTrigger>
          <TabsTrigger value="ai-assistant" className="flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictive">
          <PredictiveAnalytics />
        </TabsContent>

        <TabsContent value="ai-assistant">
          <AIAssistant />
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">78%</div>
                    <div className="text-sm text-muted-foreground">Overall Performance</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">85%</div>
                    <div className="text-sm text-muted-foreground">AI Tool Efficiency</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-medium">Project Completion Rate</span>
                    <span className="text-green-600 font-bold">95%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-medium">Average Response Time</span>
                    <span className="text-blue-600 font-bold">2.3 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-medium">Revenue Growth</span>
                    <span className="text-purple-600 font-bold">+23%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="font-medium">AI Cost Efficiency</span>
                    <span className="text-orange-600 font-bold">$0.12/task</span>
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