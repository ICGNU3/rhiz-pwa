import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );

  // Get authenticated user
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ linked: false }), { status: 401 });
  }

  // Check for Telegram integration
  const { data: integration } = await supabaseClient
    .from('user_integrations')
    .select('id')
    .eq('user_id', user.id)
    .eq('provider', 'telegram')
    .single();

  return new Response(JSON.stringify({ linked: !!integration }), { headers: { 'Content-Type': 'application/json' } });
}); 