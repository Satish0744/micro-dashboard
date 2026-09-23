import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Loader from './components/Loader.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import ToastContainer from './components/Toast.jsx';
import { useAuth } from './context/AuthContext.jsx';

const Dashboard = lazy(() => import('./modules/dashboard/Dashboard.jsx'));
const UserManagement = lazy(() => import('./modules/users/UserManagement.jsx'));
const Analytics = lazy(() => import('./modules/analytics/Analytics.jsx'));
const Notifications = lazy(() => import('./modules/notifications/Notifications.jsx'));
const Products = lazy(() => import('./modules/products/Products.jsx'));
const Login = lazy(() => import('./modules/auth/Login.jsx'));
const Signup = lazy(() => import('./modules/auth/Signup.jsx'));

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
          <Breadcrumbs />
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

function AuthLayout() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <ToastContainer />
      {isAuthRoute ? (
        <AuthLayout />
      ) : !user ? (
        <Navigate to="/login" replace />
      ) : (
        <DashboardLayout />
      )}
    </>
  );
}