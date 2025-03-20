import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import EnergyHistory from "@/pages/energy-history";
import GridMonitoring from "@/pages/grid-monitoring";
import Generator from "@/pages/generator";
import Weather from "@/pages/weather";
import SourceMonitor from "@/pages/source-monitor";
import DashboardLayout from "@/components/layouts/dashboard-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/energy-history" component={EnergyHistory} />
      <Route path="/grid-monitoring" component={GridMonitoring} />
      <Route path="/generator" component={Generator} />
      <Route path="/weather" component={Weather} />
      <Route path="/source-monitor" component={SourceMonitor} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        <Router />
      </DashboardLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
