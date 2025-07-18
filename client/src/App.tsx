import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/layout/app-layout";
import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import AITools from "@/pages/ai-tools";
import Prompts from "@/pages/prompts";
import Knowledge from "@/pages/knowledge";
import Automation from "@/pages/automation";
import Revenue from "@/pages/revenue";
import ClientWorkspace from "@/pages/client-workspace";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/projects" component={Projects} />
        <Route path="/ai-tools" component={AITools} />
        <Route path="/prompts" component={Prompts} />
        <Route path="/knowledge" component={Knowledge} />
        <Route path="/automation" component={Automation} />
        <Route path="/revenue" component={Revenue} />
        <Route path="/client/:id" component={ClientWorkspace} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
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
