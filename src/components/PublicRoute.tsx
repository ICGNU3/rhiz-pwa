import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // TEMPORARY: Skip authentication check for debugging
  if (loading) {
    return <LoadingScreen />;
  }

  // TEMPORARY: Always show public routes for debugging
  return <Outlet />;
  
  // Original logic (commented out for debugging):
  // return !isAuthenticated ? <Outlet /> : <Navigate to="/app" replace />;
};

export default PublicRoute;
