import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Trophy, 
  Target, 
  Star, 
  Zap, 
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Crown,
  Flame,
  Sparkles,
  ArrowUp,
  Calendar,
  Activity,
  BarChart3,
  Rocket,
  Shield,
  Diamond,
  Heart,
  Brain,
  Lightbulb,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'productivity' | 'ai-usage' | 'revenue' | 'social';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  reward?: string;
}

interface WorkflowStats {
  totalProjects: number;
  completedProjects: number;
  activeStreak: number;
  longestStreak: number;
  totalAiUsage: number;
  totalRevenue: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

interface LevelInfo {
  level: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  minXp: number;
}

const levels: LevelInfo[] = [
  { level: 1, title: 'Apprentice', description: 'Just getting started', icon: Sparkles, color: 'text-gray-500', minXp: 0 },
  { level: 2, title: 'Explorer', description: 'Learning the ropes', icon: Target, color: 'text-blue-500', minXp: 100 },
  { level: 3, title: 'Builder', description: 'Creating consistently', icon: Activity, color: 'text-green-500', minXp: 300 },
  { level: 4, title: 'Innovator', description: 'Pushing boundaries', icon: Lightbulb, color: 'text-yellow-500', minXp: 600 },
  { level: 5, title: 'Expert', description: 'Mastering the craft', icon: Star, color: 'text-orange-500', minXp: 1000 },
  { level: 6, title: 'Visionary', description: 'Leading the way', icon: Brain, color: 'text-purple-500', minXp: 1500 },
  { level: 7, title: 'Master', description: 'Peak performance', icon: Crown, color: 'text-pink-500', minXp: 2200 },
  { level: 8, title: 'Legend', description: 'Extraordinary achiever', icon: Trophy, color: 'text-gold-500', minXp: 3000 },
];

const achievementIcons = {
  milestone: Trophy,
  streak: Flame,
  productivity: Zap,
  'ai-usage': Brain,
  revenue: Diamond,
  social: Heart
};

const categoryColors = {
  milestone: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  streak: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  productivity: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'ai-usage': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  revenue: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  social: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
};

export default function AnimatedProgressTracker() {
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  // Fetch workflow stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/gamification/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/gamification/achievements'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Determine time of day for dynamic greetings
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  // Celebration effect for new achievements
  useEffect(() => {
    if (achievements?.some((a: Achievement) => a.unlocked && a.unlockedAt && 
        new Date(a.unlockedAt).getTime() > Date.now() - 5000)) {
      setCelebrationMode(true);
      setTimeout(() => setCelebrationMode(false), 3000);
    }
  }, [achievements]);

  const currentLevel = levels.find(l => stats?.level === l.level) || levels[0];
  const nextLevel = levels.find(l => l.level === (stats?.level || 1) + 1);

  const timeGreeting = {
    morning: { icon: Sun, text: 'Good Morning! Ready to conquer the day?' },
    afternoon: { icon: Coffee, text: 'Good Afternoon! Keep the momentum going!' },
    evening: { icon: Moon, text: 'Good Evening! Time to reflect on today\'s wins!' }
  };

  const currentGreeting = timeGreeting[timeOfDay];

  if (statsLoading || achievementsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const progressPercentage = stats ? (stats.xp / (stats.xp + stats.xpToNextLevel)) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {celebrationMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-full"
            >
              <Trophy className="w-16 h-16 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute mt-32 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-2">Achievement Unlocked!</h2>
              <p className="text-lg text-white/80">You're on fire! 🔥</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Dynamic Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <currentGreeting.icon className="w-6 h-6 text-orange-500" />
          <h1 className="text-3xl font-bold">Progress Tracker</h1>
        </div>
        <p className="text-muted-foreground">{currentGreeting.text}</p>
      </motion.div>

      {/* Level Progress Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <currentLevel.icon className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Level {stats?.level || 1}</CardTitle>
                  <p className="text-white/80">{currentLevel.title}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80">Total XP</div>
                <div className="text-2xl font-bold">{stats?.xp || 0}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextLevel?.title || 'Max Level'}</span>
                <span>{stats?.xpToNextLevel || 0} XP to go</span>
              </div>
              <div className="relative">
                <Progress 
                  value={progressPercentage} 
                  className="h-3 bg-white/20" 
                />
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            <p className="text-sm text-white/80">{currentLevel.description}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            icon: Target, 
            label: 'Projects', 
            value: stats?.completedProjects || 0, 
            total: stats?.totalProjects || 0,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
          },
          { 
            icon: Flame, 
            label: 'Current Streak', 
            value: stats?.activeStreak || 0, 
            subtitle: 'days',
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-900/20'
          },
          { 
            icon: Brain, 
            label: 'AI Usage', 
            value: stats?.totalAiUsage || 0, 
            subtitle: 'interactions',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
          },
          { 
            icon: TrendingUp, 
            label: 'Revenue', 
            value: `$${stats?.totalRevenue || 0}`, 
            subtitle: 'generated',
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className={`${stat.bgColor} border-0`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <div className="text-2xl font-bold">
                      {stat.total ? `${stat.value}/${stat.total}` : stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label} {stat.subtitle}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4">
            {achievements?.map((achievement: Achievement, index: number) => {
              const AchievementIcon = achievementIcons[achievement.category];
              const isCompleted = achievement.unlocked;
              const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`cursor-pointer ${isCompleted ? 'opacity-100' : 'opacity-75'}`}
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  <Card className={`transition-all duration-300 hover:shadow-lg ${
                    isCompleted ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${
                          isCompleted ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <AchievementIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <div className="flex items-center space-x-2">
                              {isCompleted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="p-1 bg-green-500 rounded-full"
                                >
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                              <Badge variant="outline" className={categoryColors[achievement.category]}>
                                {achievement.category}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <div className="relative">
                              <Progress value={progressPercent} className="h-2" />
                              {isCompleted && (
                                <motion.div
                                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 1 }}
                                />
                              )}
                            </div>
                          </div>
                          {achievement.reward && (
                            <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                              <p className="text-xs text-purple-700 dark:text-purple-300">
                                🎁 Reward: {achievement.reward}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="w-5 h-5 mr-2" />
                Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {levels.slice(0, (stats?.level || 1) + 1).map((level, index) => (
                  <motion.div
                    key={level.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-4 p-4 rounded-lg ${
                      level.level === stats?.level 
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-300 dark:border-purple-700' 
                        : level.level < (stats?.level || 1) 
                          ? 'bg-green-50 dark:bg-green-900/20' 
                          : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className={`p-3 rounded-full ${
                      level.level === stats?.level 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : level.level < (stats?.level || 1) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <level.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Level {level.level}: {level.title}</h3>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Required XP: {level.minXp}
                      </p>
                    </div>
                    {level.level === stats?.level && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Current
                      </Badge>
                    )}
                    {level.level < (stats?.level || 1) && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flame className="w-5 h-5 mr-2 text-red-500" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-red-500">{stats?.activeStreak || 0}</div>
                  <div className="text-sm text-muted-foreground">Days in a row</div>
                  <div className="flex justify-center space-x-1 mt-4">
                    {[...Array(Math.min(stats?.activeStreak || 0, 7))].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-3 h-3 bg-red-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Best Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-yellow-500">{stats?.longestStreak || 0}</div>
                  <div className="text-sm text-muted-foreground">Personal record</div>
                  <div className="mt-4">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      {stats?.longestStreak >= 7 ? 'Consistency Master' : 'Keep Going!'}
                    </Badge>
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