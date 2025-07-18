import { motion } from "framer-motion";
import { 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Activity,
  Brain,
  Zap,
  Bot
} from "lucide-react";
import { MetricCard } from "./metric-card";
import { AnimatedChart } from "./animated-chart";
import { ProgressRing } from "./progress-ring";
import { AnimatedStats } from "./animated-stats";

interface KPIDashboardProps {
  data: {
    monthlyRevenue: number;
    activeProjects: number;
    aiToolsCost: number;
    hoursSaved: number;
    clientCount?: number;
    profitMargin?: number;
    growthRate?: number;
  };
}

export function KPIDashboard({ data }: KPIDashboardProps) {
  // Mock data for charts - in production this would come from real analytics
  const revenueData = [
    { name: 'Jan', value: 85000 },
    { name: 'Feb', value: 92000 },
    { name: 'Mar', value: 98000 },
    { name: 'Apr', value: 105000 },
    { name: 'May', value: 115000 },
    { name: 'Jun', value: 127500 },
  ];

  const projectData = [
    { name: 'Active', value: data.activeProjects },
    { name: 'Completed', value: 47 },
    { name: 'Pending', value: 8 },
    { name: 'On Hold', value: 3 },
  ];

  const aiUsageData = [
    { name: 'GPT-4', value: 45 },
    { name: 'Claude', value: 28 },
    { name: 'Gemini', value: 15 },
    { name: 'Others', value: 12 },
  ];

  const productivityData = [
    { name: 'Mon', value: 8.5 },
    { name: 'Tue', value: 9.2 },
    { name: 'Wed', value: 7.8 },
    { name: 'Thu', value: 8.9 },
    { name: 'Fri', value: 9.5 },
    { name: 'Sat', value: 6.2 },
    { name: 'Sun', value: 4.1 },
  ];

  const businessStats = [
    { 
      label: 'Client Retention', 
      value: '94%', 
      change: 8,
      icon: Users,
      color: 'bg-green-500'
    },
    { 
      label: 'Project Success Rate', 
      value: '96%', 
      change: 12,
      icon: Target,
      color: 'bg-blue-500'
    },
    { 
      label: 'Response Time', 
      value: '< 2h', 
      change: -15,
      icon: Clock,
      color: 'bg-orange-500'
    },
    { 
      label: 'AI Efficiency', 
      value: '87%', 
      change: 23,
      icon: Brain,
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Revenue"
          value={`$${data.monthlyRevenue.toLocaleString()}`}
          change={23}
          icon={DollarSign}
          color="bg-green-500"
          delay={0.1}
        />
        <MetricCard
          title="Active Projects"
          value={data.activeProjects}
          change={15}
          icon={Briefcase}
          color="bg-blue-500"
          delay={0.2}
        />
        <MetricCard
          title="AI Tools Cost"
          value={`$${data.aiToolsCost.toLocaleString()}`}
          change={-8}
          icon={Bot}
          color="bg-purple-500"
          delay={0.3}
        />
        <MetricCard
          title="Hours Saved"
          value={data.hoursSaved}
          change={35}
          icon={Zap}
          color="bg-orange-500"
          delay={0.4}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedChart
          title="Revenue Growth"
          data={revenueData}
          type="area"
          delay={0.5}
        />
        <AnimatedChart
          title="Project Distribution"
          data={projectData}
          type="pie"
          delay={0.6}
        />
      </div>

      {/* Progress Rings and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProgressRing
          title="Monthly Goal"
          value={data.monthlyRevenue}
          max={150000}
          color="#10b981"
          delay={0.7}
        />
        <ProgressRing
          title="Client Satisfaction"
          value={94}
          max={100}
          color="#3b82f6"
          delay={0.8}
        />
        <AnimatedStats
          title="Business Metrics"
          stats={businessStats}
          delay={0.9}
        />
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedChart
          title="AI Usage Distribution"
          data={aiUsageData}
          type="bar"
          delay={1.0}
        />
        <AnimatedChart
          title="Weekly Productivity"
          data={productivityData}
          type="line"
          delay={1.1}
        />
      </div>

      {/* Real-time Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Live Activity Feed
        </h3>
        <div className="space-y-3">
          {[
            { time: '2 min ago', action: 'New project started: Brand Identity for TechCorp' },
            { time: '15 min ago', action: 'AI tool optimized: Reduced costs by 12%' },
            { time: '1 hour ago', action: 'Client meeting completed: Growth strategy review' },
            { time: '3 hours ago', action: 'Automation workflow deployed: Email sequences' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.3 + (index * 0.1) }}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}