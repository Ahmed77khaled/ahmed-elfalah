import { lazy, Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@workspace/fel7o-ds/components/ui/toaster';
import { TooltipProvider } from '@workspace/fel7o-ds/components/ui/tooltip';
import Home from '@/pages/Home';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { VisitorTracker } from '@/components/VisitorTracker';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

// ── Lazy-load all admin pages (zero cost for public visitors) ────────────────
const AdminLogin      = lazy(() => import('@/pages/admin/Login'));
const AdminDashboard  = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProjects   = lazy(() => import('@/pages/admin/Projects'));
const AdminSkills     = lazy(() => import('@/pages/admin/Skills'));
const AdminExperience = lazy(() => import('@/pages/admin/Experience'));
const AdminMessages   = lazy(() => import('@/pages/admin/Messages'));
const AdminSettings   = lazy(() => import('@/pages/admin/Settings'));
const AdminReminders  = lazy(() => import('@/pages/admin/Reminders'));
const AdminJourney    = lazy(() => import('@/pages/admin/Journey'));
const NotFound        = lazy(() => import('@/pages/not-found'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

// Simple spinner shown while admin chunks are loading
function AdminSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      {children}
    </Suspense>
  );
}

function AdminRoot() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate('/console/dashboard'); }, [navigate]);
  return null;
}

function Router() {
  return (
    <Switch>
      {/* Public portfolio — always eagerly loaded */}
      <Route path="/" component={Home} />

      {/* Admin: login (no auth) */}
      <Route path="/console/login">
        <AdminSuspense><AdminLogin /></AdminSuspense>
      </Route>
      <Route path="/admin/login">
        <AdminSuspense><AdminLogin /></AdminSuspense>
      </Route>

      {/* Admin: redirect /console and /admin → /console/dashboard */}
      <Route path="/console" component={AdminRoot} />
      <Route path="/admin" component={AdminRoot} />

      {/* Admin: protected pages — all lazy loaded */}
      <Route path="/console/dashboard">
        <ProtectedRoute>
          <AdminLayout>
            <AdminSuspense><AdminDashboard /></AdminSuspense>
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/dashboard">
        <ProtectedRoute>
          <AdminLayout>
            <AdminSuspense><AdminDashboard /></AdminSuspense>
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/console/projects">
        <ProtectedRoute>
          <AdminLayout>
            <AdminSuspense><AdminProjects /></AdminSuspense>
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/console/skills">
        <ProtectedRoute>
          <AdminLayout>
            <AdminSuspense><AdminSkills /></AdminSuspense>
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/console/experience">
        <ProtectedRoute>
          <AdminLayout>
            <AdminSuspense><AdminExperience /></AdminSuspense>
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/console/messages">
        <ProtectedRoute>
          <AdminLayout>
            <AdminSuspense><AdminMessages /></AdminSuspense>
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/console/settings">
        <ProtectedRoute>
          <AdminLayout>
            <AdminSuspense><AdminSettings /></AdminSuspense>
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/console/reminders">
        <ProtectedRoute>
          <AdminLayout>
            <AdminSuspense><AdminReminders /></AdminSuspense>
          </AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/console/journey">
        <ProtectedRoute>
          <AdminLayout>
            <AdminSuspense><AdminJourney /></AdminSuspense>
          </AdminLayout>
        </ProtectedRoute>
      </Route>

      <Route>
        <AdminSuspense><NotFound /></AdminSuspense>
      </Route>
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
