import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/client';
import Spinner from './Spinner';

interface PrivateAlphaRouteProps {
  children: React.ReactNode;
}

const PrivateAlphaRoute: React.FC<PrivateAlphaRouteProps> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isAlpha, setIsAlpha] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAlphaStatus = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAlpha(false);
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('users')
          .select('is_alpha')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error checking alpha status:', error);
          setIsAlpha(false);
        } else {
          setIsAlpha(data?.is_alpha || false);
        }
      } catch (error) {
        console.error('Error checking alpha status:', error);
        setIsAlpha(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAlphaStatus();
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || loading) {
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAlpha) {
    return <Navigate to="/apply?pending=true" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateAlphaRoute;