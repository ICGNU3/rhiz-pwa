import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function generateCode() {
  return 'rhiz-' + Math.random().toString(36).slice(2, 10);
}

serve(async (req) => {
  if (req.method !== 'POST') {
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
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Generate code and expiration
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Insert into telegram_link_codes
  const { error: insertError } = await supabaseClient
    .from('telegram_link_codes')
    .insert({
      user_id: user.id,
      code,
      expires_at: expiresAt
    });

  if (insertError) {
    return new Response(JSON.stringify({ error: 'Failed to generate code' }), { status: 500 });
  }

  return new Response(JSON.stringify({ code }), { headers: { 'Content-Type': 'application/json' } });
}); 