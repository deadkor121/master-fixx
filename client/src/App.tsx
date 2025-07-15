import { Router, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/home";
import Services from "@/pages/services";
import About from "@/pages/about";
import HowItWorks from "@/pages/how-it-works";
import NotFound from "@/pages/not-found";
import MastersPage from "@/pages/MasterPage";
import ProfilePage from "@/pages/ProfilePage";



function RouterWithBase() {
  return (
    <Router base="/">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/about" component={About} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/masters" component={MastersPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <RouterWithBase />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
