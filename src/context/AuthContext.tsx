import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../api/client';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAlpha: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAlpha, setIsAlpha] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (session) {
          console.log('Initial session found:', session.user.email);
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Check user status in our profiles table
          await checkUserStatus(session.user.id);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session) {
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Check user status
          await checkUserStatus(session.user.id);
        } else {
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
          setIsAlpha(false);
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUserStatus = async (userId: string) => {
    try {
      // Check if user exists in our profiles table
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('is_alpha, is_admin')
        .eq('id', userId)
        .single();
        
      if (userError) {
        console.log('User not found in profiles table:', userError.message);
        
        // Create a new profile for this user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: user.email,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              is_alpha: false,
              is_admin: false
            });
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
          } else {
            console.log('Created new profile for user');
          }
        }
        
        setIsAlpha(false);
        setIsAdmin(false);
      } else {
        console.log('User found in profiles table:', userData);
        setIsAlpha(userData.is_alpha || false);
        setIsAdmin(userData.is_admin || false);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setIsAlpha(false);
      setIsAdmin(false);
    }
  };

  const login = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/app/dashboard`
        }
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      session, 
      login, 
      logout, 
      loading,
      isAlpha,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};