import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PrivateAlphaRoute from './components/PrivateAlphaRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ApplyPage from './pages/ApplyPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Contacts from './pages/Contacts';
import Import from './pages/Import';
import Intelligence from './pages/Intelligence';
import Network from './pages/Network';
import Trust from './pages/Trust';
import Settings from './pages/Settings';
import OfflinePage from './pages/OfflinePage';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.is_admin || false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : <Navigate to="/app/dashboard" replace />;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/offline" element={<OfflinePage />} />
      
      {/* Admin Routes */}
      <Route
        path="/app/admin/*"
        element={
          <PrivateAlphaRoute>
            <AdminRoute>
              <Layout>
                <Routes>
                  <Route path="/applications" element={<AdminApplicationsPage />} />
                </Routes>
              </Layout>
            </AdminRoute>
          </PrivateAlphaRoute>
        }
      />
      
      {/* App Routes */}
      <Route
        path="/app/*"
        element={
          <PrivateAlphaRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/import" element={<Import />} />
                <Route path="/intelligence" element={<Intelligence />} />
                <Route path="/network" element={<Network />} />
                <Route path="/trust" element={<Trust />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </PrivateAlphaRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;