import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Services from "@/pages/services";
import About from "@/pages/about";
import HowItWorks from "@/pages/how-it-works";
import NotFound from "@/pages/not-found";
import MastersPage from "@/pages/MasterPage";
import ProfilePage from "@/pages/ProfilePage"; 

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/about" component={About} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/masters" component={MastersPage} />
      <Route path="/profile" component={ProfilePage} /> {/* добавлено */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
