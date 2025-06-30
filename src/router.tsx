import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PrivateAlphaRoute from './components/PrivateAlphaRoute';
import AdminRoute from './components/AdminRoute';
import LoadingScreen from './components/LoadingScreen';
import { prefetchPage } from './utils/performance';

// Lazy-loaded components with prefetching
const Landing = lazy(() => {
  prefetchPage('/login');
  prefetchPage('/apply');
  return import('./pages/Landing');
});
const Login = lazy(() => {
  prefetchPage('/app/dashboard');
  prefetchPage('/apply');
  return import('./pages/Login');
});
const ApplyPage = lazy(() => {
  prefetchPage('/login');
  return import('./pages/ApplyPage');
});
const AdminApplicationsPage = lazy(() => import('./pages/admin/AdminApplicationsPage'));
const Dashboard = lazy(() => {
  prefetchPage('/app/contacts');
  prefetchPage('/app/goals');
  return import('./pages/Dashboard');
});
const Goals = lazy(() => import('./pages/Goals'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Import = lazy(() => import('./pages/Import'));
const Intelligence = lazy(() => import('./pages/Intelligence'));
const Network = lazy(() => import('./pages/Network'));
const Trust = lazy(() => import('./pages/Trust'));
const Settings = lazy(() => import('./pages/Settings'));
const OfflinePage = lazy(() => import('./pages/OfflinePage'));

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<LoadingScreen />}>
          <Landing />
        </Suspense>
      } />
      <Route path="/login" element={
        <Suspense fallback={<LoadingScreen />}>
          <Login />
        </Suspense>
      } />
      <Route path="/apply" element={
        <Suspense fallback={<LoadingScreen />}>
          <ApplyPage />
        </Suspense>
      } />
      <Route path="/offline" element={
        <Suspense fallback={<LoadingScreen />}>
          <OfflinePage />
        </Suspense>
      } />
      
      {/* Admin Routes */}
      <Route path="/app/admin" element={
        <PrivateAlphaRoute>
          <AdminRoute>
            <Layout>
              <Suspense fallback={<LoadingScreen message="Loading admin panel..." />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/app/admin/applications" replace />} />
                  <Route path="/applications" element={<AdminApplicationsPage />} />
                </Routes>
              </Suspense>
            </Layout>
          </AdminRoute>
        </PrivateAlphaRoute>
      } />
      
      {/* App Routes */}
      <Route path="/app" element={<PrivateAlphaRoute><Layout /></PrivateAlphaRoute>}>
        <Route path="" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={
          <Suspense fallback={<LoadingScreen message="Loading your dashboard..." />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="goals" element={
          <Suspense fallback={<LoadingScreen message="Loading your goals..." />}>
            <Goals />
          </Suspense>
        } />
        <Route path="contacts" element={
          <Suspense fallback={<LoadingScreen message="Loading your contacts..." />}>
            <Contacts />
          </Suspense>
        } />
        <Route path="import" element={
          <Suspense fallback={<LoadingScreen message="Preparing import tools..." />}>
            <Import />
          </Suspense>
        } />
        <Route path="intelligence" element={
          <Suspense fallback={<LoadingScreen message="Activating AI assistant..." />}>
            <Intelligence />
          </Suspense>
        } />
        <Route path="network" element={
          <Suspense fallback={<LoadingScreen message="Mapping your network..." />}>
            <Network />
          </Suspense>
        } />
        <Route path="trust" element={
          <Suspense fallback={<LoadingScreen message="Calculating trust metrics..." />}>
            <Trust />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<LoadingScreen message="Loading your settings..." />}>
            <Settings />
          </Suspense>
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;