import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateAlphaRoute from './components/PrivateAlphaRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';
import NetworkAnalytics from './pages/NetworkAnalytics';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Goals = lazy(() => import('./pages/Goals'));
const Import = lazy(() => import('./pages/Import'));
const IOSShortcutsGuide = lazy(() => import('./pages/IOSShortcutsGuide'));
const Intelligence = lazy(() => import('./pages/Intelligence'));
const Network = lazy(() => import('./pages/Network'));
const Settings = lazy(() => import('./pages/Settings'));
const Trust = lazy(() => import('./pages/Trust'));
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/app" element={<PrivateAlphaRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="goals" element={<Goals />} />
          <Route path="import" element={<Import />} />
          <Route path="ios-shortcuts" element={<IOSShortcutsGuide />} />
          <Route path="intelligence" element={<Intelligence />} />
          <Route path="network" element={<Network />} />
          <Route path="settings" element={<Settings />} />
          <Route path="trust" element={<Trust />} />
          <Route path="network-analytics" element={<NetworkAnalytics />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;