import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/client';
import Button from '../components/Button';
import Card from '../components/Card';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-aqua to-lavender flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans font-light">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
              <img 
                src="/OuRhizome Dark CRM Background Removed Background Removed.png" 
                alt="Rhiz Logo" 
                className="w-12 h-12"
              />
              <span className="text-3xl font-light text-white">Rhiz</span>
            </Link>
          </div>

          <Card className="p-8 text-center bg-white/90 backdrop-blur-md border border-emerald/50">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald to-aqua rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 font-light mb-6">
              We've sent a magic link to <strong>{email}</strong>. 
              Click the link in your email to sign in to your account.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald/10 to-aqua/10 rounded-lg border border-emerald/20">
                <div className="flex items-center space-x-2 text-emerald">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-light">Magic link sent!</span>
                </div>
                <p className="text-xs font-light text-gray-600 mt-1">
                  The link will expire in 1 hour for security.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={handleTryAgain}
                className="w-full font-light"
                icon={ArrowLeft}
              >
                Try Different Email
              </Button>
            </div>
          </Card>

          <div className="text-center">
            <Link to="/" className="text-sm font-light text-white/80 hover:text-white">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aqua to-lavender flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans font-light">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
            <img 
              src="/OuRhizome Dark CRM Background Removed Background Removed.png" 
              alt="Rhiz Logo" 
              className="w-12 h-12"
            />
            <span className="text-3xl font-light text-white">Rhiz</span>
          </Link>
          <h2 className="text-2xl font-light text-white">
            Alpha Members Sign In
          </h2>
          <p className="mt-2 text-sm font-light text-white/80">
            Enter your email to receive a magic link
            <br />
            <Link to="/apply" className="text-white hover:text-white/90 underline">
              Can't login yet? Apply for early access
            </Link>
          </p>
        </div>

        <Card className="p-8 bg-white/90 backdrop-blur-md border border-emerald/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-light">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 bg-white text-gray-900 font-light focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald"
                placeholder="Enter your email"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-aqua via-emerald to-lavender text-white font-light"
              loading={loading}
              size="lg"
              icon={Mail}
            >
              Send Magic Link
            </Button>

            <div className="text-sm font-light text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p className="font-light mb-2">✨ Magic Link Authentication</p>
              <p>No passwords needed! We'll send you a secure link to sign in instantly.</p>
            </div>
          </form>
        </Card>

        <div className="text-center">
          <Link to="/" className="text-sm font-light text-white/80 hover:text-white">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;