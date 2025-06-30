import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/client';
import Button from '../components/Button';
import Card from '../components/Card';
import { Mail, CheckCircle, ArrowLeft, Network } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check for auth callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        setError('Authentication failed. Please try again.');
      } else if (data.session) {
        // Check if user is approved for alpha
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_alpha')
          .eq('id', data.session.user.id)
          .single();
          
        if (userError) {
          console.error('User data fetch error:', userError);
          setError('Failed to verify alpha access. Please try again.');
          return;
        }
        
        if (userData?.is_alpha) {
          navigate('/app/dashboard');
        } else {
          // User is authenticated but not approved for alpha
          navigate('/apply?pending=true');
        }
      }
    };

    // Check if this is an auth callback
    if (searchParams.get('access_token') || searchParams.get('refresh_token')) {
      handleAuthCallback();
    }
  }, [searchParams, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if user is approved for alpha
      const checkAlphaStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        const { data, error } = await supabase
          .from('users')
          .select('is_alpha')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('User data fetch error:', error);
          return;
        }
        
        if (data?.is_alpha) {
          navigate('/app/dashboard');
        } else {
          // User is authenticated but not approved for alpha
          navigate('/apply?pending=true');
        }
      };
      
      checkAlphaStatus();
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail('');
    setError('');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Network className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">Rhiz</span>
            </Link>
          </div>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent a magic link to <strong>{email}</strong>. 
              Click the link in your email to sign in to your account.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Magic link sent!</span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  The link will expire in 1 hour for security.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={handleTryAgain}
                className="w-full"
                icon={ArrowLeft}
              >
                Try Different Email
              </Button>
            </div>
          </Card>

          <div className="text-center">
            <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">Rhiz</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Alpha Members Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email to receive a magic link
            <br />
            <Link to="/apply" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              Can't login yet? Apply for early access
            </Link>
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              loading={loading}
              size="lg"
              icon={Mail}
            >
              Send Magic Link
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="font-medium mb-2">✨ Magic Link Authentication</p>
              <p>No passwords needed! We'll send you a secure link to sign in instantly.</p>
            </div>
          </form>
        </Card>

        <div className="text-center">
          <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;