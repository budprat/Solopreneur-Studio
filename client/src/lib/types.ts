export interface DashboardStats {
  monthlyRevenue: number;
  activeProjects: number;
  aiToolsCost: number;
  hoursSaved: number;
}

export interface ProjectWithClient {
  id: number;
  name: string;
  description?: string;
  status: string;
  progress: number;
  budget?: string;
  revenue?: string;
  dueDate?: string;
  client?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface AIToolUsage {
  id: number;
  name: string;
  provider: string;
  currentSpend: number;
  tokensUsed: number;
  requestsCount: number;
  isActive: boolean;
}

export interface Activity {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  category: 'prompt' | 'project' | 'ai' | 'revenue';
}

export interface PromptPerformance {
  id: number;
  name: string;
  usageCount: number;
  successRate: number;
  category: string;
}

export interface AutomationWorkflow {
  id: number;
  name: string;
  description?: string;
  trigger: string;
  isActive: boolean;
  triggerCount: number;
  lastTriggered?: string;
}
