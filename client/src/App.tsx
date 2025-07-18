import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import AITools from "@/pages/ai-tools";
import Prompts from "@/pages/prompts";
import Knowledge from "@/pages/knowledge";
import Automation from "@/pages/automation";
import Revenue from "@/pages/revenue";
import ExperimentLab from "@/pages/experiment-lab";
import GrowthAdvisor from "@/pages/growth-advisor";
import BusinessIntelligence from "@/pages/business-intelligence";
import ContentCreation from "@/pages/content-creation";
import EmailIntelligence from "@/pages/email-intelligence";
import IntelligentScheduling from "@/pages/intelligent-scheduling";
import DigitalAssets from "@/pages/digital-assets";
import KnowledgeGraph from "@/pages/knowledge-graph";
import ContentPipeline from "@/pages/content-pipeline";
import Analytics from "@/pages/analytics";
import ClientWorkspace from "@/pages/client-workspace";
import Inspiration from "@/pages/inspiration";
import Progress from "@/pages/progress";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <AppLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/projects" component={Projects} />
            <Route path="/ai-tools" component={AITools} />
            <Route path="/prompts" component={Prompts} />
            <Route path="/knowledge" component={Knowledge} />
            <Route path="/automation" component={Automation} />
            <Route path="/revenue" component={Revenue} />
            <Route path="/experiment-lab" component={ExperimentLab} />
            <Route path="/growth-advisor" component={GrowthAdvisor} />
            <Route path="/business-intelligence" component={BusinessIntelligence} />
            <Route path="/content-creation" component={ContentCreation} />
            <Route path="/email-intelligence" component={EmailIntelligence} />
            <Route path="/intelligent-scheduling" component={IntelligentScheduling} />
            <Route path="/digital-assets" component={DigitalAssets} />
            <Route path="/knowledge-graph" component={KnowledgeGraph} />
            <Route path="/content-pipeline" component={ContentPipeline} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/inspiration" component={Inspiration} />
            <Route path="/progress" component={Progress} />
            <Route path="/client/:id" component={ClientWorkspace} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="soloai-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
