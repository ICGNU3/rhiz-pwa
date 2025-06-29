import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Contacts from './pages/Contacts';
import Import from './pages/Import';
import Intelligence from './pages/Intelligence';
import Network from './pages/Network';
import Trust from './pages/Trust';
import Settings from './pages/Settings';
import OfflinePage from './pages/OfflinePage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/offline" element={<OfflinePage />} />
      <Route
        path="/app/*"
        element={
          <PrivateRoute>
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
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;