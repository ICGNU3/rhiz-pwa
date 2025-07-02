import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Start X (Twitter) OAuth 2.0 flow
  if (req.method === 'GET') {
    const clientId = Deno.env.get('X_CLIENT_ID');
    const redirectUri = Deno.env.get('X_REDIRECT_URI');
    const scope = 'tweet.read users.read follows.read offline.access'; // Adjust scopes as needed
    const state = crypto.randomUUID(); // For CSRF protection

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId ?? '',
      redirect_uri: redirectUri ?? '',
      scope,
      state,
      code_challenge: '', // TODO: Add PKCE support if required
      code_challenge_method: '',
    });

    // Remove empty PKCE params for now
    params.delete('code_challenge');
    params.delete('code_challenge_method');

    const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    return Response.redirect(authUrl, 302);
  }

  // Handle callback and token exchange
  if (req.method === 'POST' && new URL(req.url).pathname.endsWith('/callback')) {
    try {
      const { code } = await req.json();
      const clientId = Deno.env.get('X_CLIENT_ID');
      const clientSecret = Deno.env.get('X_CLIENT_SECRET');
      const redirectUri = Deno.env.get('X_REDIRECT_URI');

      // Initialize Supabase client
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
      );

      // Get authenticated user
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (userError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: clientId ?? '',
          client_secret: clientSecret ?? '',
          redirect_uri: redirectUri ?? '',
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        return new Response(JSON.stringify({ error: 'Failed to exchange code', details: errorText }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const tokens = await tokenResponse.json();

      // Optionally fetch user info from X API
      let userInfo = null;
      if (tokens.access_token) {
        const userInfoResp = await fetch('https://api.twitter.com/2/users/me', {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        if (userInfoResp.ok) {
          userInfo = await userInfoResp.json();
        }
      }

      // Store tokens in Supabase
      await supabaseClient
        .from('user_integrations')
        .upsert({
          user_id: user.id,
          provider: 'x',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: new Date(Date.now() + (tokens.expires_in || 0) * 1000).toISOString(),
          user_info: userInfo,
        });

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  }

  // Fetch X followers for the authenticated user
  if (req.method === 'POST') {
    try {
      const { action } = await req.json();
      if (action === 'get_followers') {
        // Initialize Supabase client
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );
        // Get authenticated user
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        // Get X integration for user
        const { data: integration } = await supabaseClient
          .from('user_integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'x')
          .single();
        if (!integration || !integration.access_token) {
          return new Response(JSON.stringify({ error: 'X integration not found' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        // Fetch followers from X API
        const followersResp = await fetch('https://api.twitter.com/2/users/me/followers?user.fields=name,username,profile_image_url,description', {
          headers: { Authorization: `Bearer ${integration.access_token}` },
        });
        if (!followersResp.ok) {
          const errorText = await followersResp.text();
          return new Response(JSON.stringify({ error: 'Failed to fetch followers', details: errorText }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        const followersData = await followersResp.json();
        // Transform to contact format
        const contacts = (followersData.data || []).map((f: any) => ({
          name: f.name,
          email: '', // X does not provide email
          phone: '',
          company: '',
          title: '',
          avatar: f.profile_image_url,
          notes: f.description || '',
          tags: ['x'],
          source: 'x',
          x_username: f.username,
          x_id: f.id,
        }));
        return new Response(JSON.stringify({ success: true, contacts }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  }

  return new Response('Not found', { status: 404, headers: corsHeaders });
}); 