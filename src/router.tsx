import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PrivateAlphaRoute from './components/PrivateAlphaRoute';
import AdminRoute from './components/AdminRoute';
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
import { supabase } from './api/client';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/offline" element={<OfflinePage />} />
      
      {/* Admin Routes */}
      <Route path="/app/admin" element={
        <PrivateAlphaRoute>
          <AdminRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/app/admin/applications" replace />} />
                <Route path="/applications" element={<AdminApplicationsPage />} />
              </Routes>
            </Layout>
          </AdminRoute>
        </PrivateAlphaRoute>
      } />
      
      {/* App Routes */}
      <Route path="/app" element={<PrivateAlphaRoute><Layout /></PrivateAlphaRoute>}>
        <Route path="" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="goals" element={<Goals />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="import" element={<Import />} />
        <Route path="intelligence" element={<Intelligence />} />
        <Route path="network" element={<Network />} />
        <Route path="trust" element={<Trust />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;