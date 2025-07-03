import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ZoomMeeting = {
  id: string;
  topic: string;
  start_time: string;
  duration: number;
  join_url: string;
  participants_count: number;
  participants: Array<{
    user_id: string;
    name: string;
    email: string;
    join_time: string;
    leave_time?: string;
    duration: number;
  }>;
};

type ZoomUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  account_id: string;
  timezone: string;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, code, refreshToken } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    switch (action) {
      case 'exchange_code':
        return await handleCodeExchange(code, supabaseClient);
      case 'refresh_token':
        return await handleTokenRefresh(refreshToken, supabaseClient);
      case 'get_meetings':
        return await handleGetMeetings(supabaseClient);
      default:
        throw new Error('Invalid action');
    }
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (typeof error === 'object' && error && 'message' in error && typeof (error as { message: string }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleCodeExchange(code: string, supabaseClient: any) {
  const clientId = Deno.env.get('ZOOM_CLIENT_ID');
  const clientSecret = Deno.env.get('ZOOM_CLIENT_SECRET');
  const redirectUri = Deno.env.get('ZOOM_REDIRECT_URI');

  // Exchange authorization code for tokens
  const tokenResponse = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri!,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  const tokens = await tokenResponse.json();
  
  // Get user info
  const userResponse = await fetch('https://api.zoom.us/v2/users/me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  
  if (!userResponse.ok) {
    throw new Error('Failed to get user info');
  }
  
  const userInfo: ZoomUser = await userResponse.json();
  
  // Store tokens in Supabase
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  await supabaseClient
    .from('user_integrations')
    .upsert({
      user_id: user.id,
      provider: 'zoom',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      user_info: userInfo,
    });

  return new Response(
    JSON.stringify({ success: true, user: userInfo }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleTokenRefresh(refreshToken: string, supabaseClient: any) {
  const clientId = Deno.env.get('ZOOM_CLIENT_ID');
  const clientSecret = Deno.env.get('ZOOM_CLIENT_SECRET');

  const response = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const tokens = await response.json();
  
  // Update stored tokens
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  await supabaseClient
    .from('user_integrations')
    .update({
      access_token: tokens.access_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    })
    .eq('user_id', user.id)
    .eq('provider', 'zoom');

  return new Response(
    JSON.stringify({ success: true, access_token: tokens.access_token }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetMeetings(supabaseClient: any) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  // Get stored tokens
  const { data: integration } = await supabaseClient
    .from('user_integrations')
    .select('*')
    .eq('user_id', user.id)
    .eq('provider', 'zoom')
    .single();

  if (!integration) {
    throw new Error('Zoom integration not found');
  }

  // Check if token needs refresh
  if (new Date(integration.expires_at) <= new Date()) {
    const refreshResponse = await handleTokenRefresh(integration.refresh_token, supabaseClient);
    const refreshData = await refreshResponse.json();
    integration.access_token = refreshData.access_token;
  }

  // Get meetings from Zoom API
  const meetingsResponse = await fetch(
    'https://api.zoom.us/v2/users/me/meetings?type=scheduled&page_size=100',
    {
      headers: { Authorization: `Bearer ${integration.access_token}` },
    }
  );

  if (!meetingsResponse.ok) {
    throw new Error('Failed to fetch Zoom meetings');
  }

  const meetingsData = await meetingsResponse.json();
  
  // Get meeting participants for each meeting
  const meetingsWithParticipants = await Promise.all(
    meetingsData.meetings?.map(async (meeting: any) => {
      try {
        const participantsResponse = await fetch(
          `https://api.zoom.us/v2/report/meetings/${meeting.id}/participants`,
          {
            headers: { Authorization: `Bearer ${integration.access_token}` },
          }
        );
        
        if (participantsResponse.ok) {
          const participantsData = await participantsResponse.json();
          return {
            ...meeting,
            participants: participantsData.participants || []
          };
        }
        return meeting;
      } catch {
        return meeting;
      }
    }) || []
  );
  
  // Transform Zoom meetings to Rhiz format
  const meetings = meetingsWithParticipants.map((meeting: ZoomMeeting) => ({
    id: meeting.id,
    title: meeting.topic,
    start_time: meeting.start_time,
    duration: meeting.duration,
    join_url: meeting.join_url,
    participants_count: meeting.participants_count,
    participants: meeting.participants?.map(p => ({
      email: p.email,
      name: p.name,
      join_time: p.join_time,
      leave_time: p.leave_time,
      duration: p.duration
    })) || [],
    source: 'zoom',
    zoom_id: meeting.id,
  }));

  return new Response(
    JSON.stringify({ success: true, meetings }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
} 