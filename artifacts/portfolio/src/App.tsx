import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@workspace/fel7o-ds/components/ui/toaster';
import { TooltipProvider } from '@workspace/fel7o-ds/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import { VisitorTracker } from '@/components/VisitorTracker';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <VisitorTracker />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
