import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@workspace/fel7o-ds/components/ui/toaster';
import { TooltipProvider } from '@workspace/fel7o-ds/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminProjects from '@/pages/admin/Projects';
import AdminSkills from '@/pages/admin/Skills';
import AdminExperience from '@/pages/admin/Experience';
import AdminMessages from '@/pages/admin/Messages';
import AdminSettings from '@/pages/admin/Settings';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { VisitorTracker } from '@/components/VisitorTracker';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

function AdminRoot() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate('/admin/dashboard'); }, [navigate]);
  return null;
}

function Router() {
  return (
    <Switch>
      {/* Public portfolio */}
      <Route path="/" component={Home} />

      {/* Admin: login (no auth) */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* Admin: redirect /admin → /admin/dashboard */}
      <Route path="/admin" component={AdminRoot} />

      {/* Admin: protected pages */}
      <Route path="/admin/dashboard">
        <ProtectedRoute>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/projects">
        <ProtectedRoute>
          <AdminLayout><AdminProjects /></AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/skills">
        <ProtectedRoute>
          <AdminLayout><AdminSkills /></AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/experience">
        <ProtectedRoute>
          <AdminLayout><AdminExperience /></AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/messages">
        <ProtectedRoute>
          <AdminLayout><AdminMessages /></AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute>
          <AdminLayout><AdminSettings /></AdminLayout>
        </ProtectedRoute>
      </Route>

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
