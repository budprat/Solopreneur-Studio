import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Brain, Home, Folder, Bot, Code, Book, ServerCog, TrendingUp, X, Target, BarChart3, FileText, Mail, Calendar, Database, Network, Workflow, Sparkles, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Client } from "@shared/schema";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Folder, label: "Projects", href: "/projects" },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: Bot, label: "AI Tools Hub", href: "/ai-tools" },
  { icon: Code, label: "Prompt Library", href: "/prompts" },
  { icon: Book, label: "Knowledge Base", href: "/knowledge" },
  { icon: ServerCog, label: "Automation", href: "/automation" },
  { icon: TrendingUp, label: "Revenue Analytics", href: "/revenue" },
  { icon: BarChart3, label: "Analytics Hub", href: "/analytics" },
];

const advancedItems = [
  { icon: Brain, label: "Experiment Lab", href: "/experiment-lab", badge: "NEW" },
  { icon: Target, label: "Growth Advisor", href: "/growth-advisor", badge: "NEW" },
  { icon: BarChart3, label: "Business Intel", href: "/business-intelligence", badge: "NEW" },
  { icon: FileText, label: "Content Creation", href: "/content-creation", badge: "NEW" },
  { icon: Mail, label: "Email Intelligence", href: "/email-intelligence", badge: "NEW" },
  { icon: Calendar, label: "Smart Scheduling", href: "/intelligent-scheduling", badge: "NEW" },
  { icon: Database, label: "Digital Assets", href: "/digital-assets", badge: "NEW" },
  { icon: Network, label: "Knowledge Graph", href: "/knowledge-graph", badge: "NEW" },
  { icon: Workflow, label: "Content Pipeline", href: "/content-pipeline", badge: "NEW" },
  { icon: Sparkles, label: "AI Inspiration", href: "/inspiration", badge: "NEW" },
  { icon: Trophy, label: "Progress Tracker", href: "/progress", badge: "NEW" },
];

// Helper to generate consistent colors based on string
const getColorFromString = (str: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Helper to generate initials
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();

  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // Limit to 5 clients in sidebar
  const displayClients = clients?.slice(0, 5) || [];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">SoloAI Studio</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI Operating System</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "nav-link flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
                    isActive && "active"
                  )}
                  onClick={onClose}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Advanced Features */}
        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Advanced Features
          </div>
          <div className="space-y-1">
            {advancedItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "nav-link flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
                      isActive && "active"
                    )}
                    onClick={onClose}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Clients Section */}
        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Clients
            </div>
            {clients && clients.length > 5 && (
              <Link href="/clients">
                <span className="text-xs text-primary hover:underline cursor-pointer">View All</span>
              </Link>
            )}
          </div>
          <div className="space-y-1">
            {displayClients.length === 0 ? (
              <div className="text-sm text-muted-foreground px-3 py-2">No clients yet</div>
            ) : (
              displayClients.map((client) => (
                <Link key={client.id} href={`/client/${client.id}`}>
                  <div
                    className="nav-link flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer"
                    onClick={onClose}
                  >
                    <div className={cn("w-5 h-5 mr-3 rounded-full flex items-center justify-center", getColorFromString(client.name))}>
                      <span className="text-white text-xs">{client.avatar || getInitials(client.name)}</span>
                    </div>
                    {client.name}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </nav>


    </div>
  );
}
