import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Zap, 
  Brain, 
  FileText, 
  Users, 
  Calendar, 
  Settings,
  Search,
  MessageSquare,
  Target,
  TrendingUp,
  Lightbulb,
  Clock,
  Star,
  X
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
  category: 'create' | 'analyze' | 'manage' | 'optimize';
  action: () => void;
  isPremium?: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: 'new-project',
    title: 'New Project',
    description: 'Create a new client project with AI assistance',
    icon: Plus,
    shortcut: 'Ctrl+N',
    category: 'create',
    action: () => console.log('New project')
  },
  {
    id: 'ai-content',
    title: 'Generate Content',
    description: 'Create content using AI prompts',
    icon: Brain,
    shortcut: 'Ctrl+G',
    category: 'create',
    action: () => console.log('Generate content')
  },
  {
    id: 'analyze-performance',
    title: 'Performance Analysis',
    description: 'Analyze project and business metrics',
    icon: TrendingUp,
    shortcut: 'Ctrl+A',
    category: 'analyze',
    action: () => console.log('Analyze performance')
  },
  {
    id: 'schedule-task',
    title: 'Schedule Task',
    description: 'Add task to intelligent scheduling',
    icon: Calendar,
    shortcut: 'Ctrl+T',
    category: 'manage',
    action: () => console.log('Schedule task')
  },
  {
    id: 'optimize-prompt',
    title: 'Optimize Prompt',
    description: 'Improve prompt performance with AI',
    icon: Zap,
    shortcut: 'Ctrl+O',
    category: 'optimize',
    action: () => console.log('Optimize prompt'),
    isPremium: true
  },
  {
    id: 'client-insight',
    title: 'Client Insights',
    description: 'Get AI-powered client analytics',
    icon: Users,
    shortcut: 'Ctrl+I',
    category: 'analyze',
    action: () => console.log('Client insights'),
    isPremium: true
  },
  {
    id: 'smart-search',
    title: 'Smart Search',
    description: 'AI-powered search across all data',
    icon: Search,
    shortcut: 'Ctrl+K',
    category: 'manage',
    action: () => console.log('Smart search')
  },
  {
    id: 'generate-report',
    title: 'Generate Report',
    description: 'Create comprehensive business reports',
    icon: FileText,
    shortcut: 'Ctrl+R',
    category: 'create',
    action: () => console.log('Generate report')
  }
];

const categoryColors = {
  create: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  analyze: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  manage: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  optimize: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
};

interface QuickActionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickActions({ isOpen, onClose }: QuickActionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredActions = selectedCategory 
    ? quickActions.filter(action => action.category === selectedCategory)
    : quickActions;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold">Quick Actions</h2>
                <p className="text-sm text-muted-foreground">Supercharge your workflow</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Category Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {Object.keys(categoryColors).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions Grid */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Card className="p-4 cursor-pointer transition-all hover:shadow-md hover:scale-105 border-2 border-transparent hover:border-primary/20">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <action.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{action.title}</h3>
                            <div className="flex items-center space-x-1">
                              {action.isPremium && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Pro
                                </Badge>
                              )}
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${categoryColors[action.category]}`}
                              >
                                {action.category}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {action.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                              {action.shortcut}
                            </kbd>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                action.action();
                                onClose();
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Execute
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Press Ctrl+K to open quick actions anytime</span>
                <div className="flex items-center space-x-2">
                  <span>⌘</span>
                  <span>+</span>
                  <span>K</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface QuickActionTooltipProps {
  children: React.ReactNode;
  title: string;
  description: string;
  shortcut?: string;
  category?: 'create' | 'analyze' | 'manage' | 'optimize';
}

export function QuickActionTooltip({ 
  children, 
  title, 
  description, 
  shortcut, 
  category = 'manage' 
}: QuickActionTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{title}</span>
              {shortcut && (
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                  {shortcut}
                </kbd>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Badge 
              variant="outline" 
              className={`text-xs ${categoryColors[category]}`}
            >
              {category}
            </Badge>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Floating Action Button Component
export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <QuickActionTooltip 
          title="Quick Actions" 
          description="Access all actions instantly"
          shortcut="Ctrl+K"
        >
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => setIsOpen(true)}
          >
            <Zap className="w-6 h-6" />
          </Button>
        </QuickActionTooltip>
      </motion.div>
      
      <QuickActions isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}