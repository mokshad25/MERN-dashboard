import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import Projects from '@/pages/Projects';
import Analytics from '@/pages/Analytics';
import Calendar from '@/pages/Calendar';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/team" element={<Team />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#fff',
            border: '1px solid #f1f5f9',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  );
}
