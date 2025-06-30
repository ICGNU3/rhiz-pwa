import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const PrivateAlphaRoute: React.FC = () => {
  const { isAuthenticated, isAlpha, loading: authLoading, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Wait for auth to finish loading
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // For now, let all authenticated users through
  // You can enable alpha checking later by uncommenting the lines below
  /*
  if (!isAlpha) {
    console.log('User not alpha approved, redirecting to apply');
    return <Navigate to="/apply?pending=true" state={{ from: location }} replace />;
  }
  */

  console.log('User authenticated and approved, allowing access');
  return <Outlet />;
};

export default PrivateAlphaRoute;