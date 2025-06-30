import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'test-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase environment variables not set, using fallback values for testing.'
  );
}

// Create Supabase client with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'rhiz-pwa'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  }
})

// Setup connection state monitoring
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Prefetch user data on sign in
    supabase.from('profiles').select('*').eq('id', session?.user?.id).single();
    supabase.from('user_settings').select('*').eq('user_id', session?.user?.id).single();
  }
});

export default supabase
