import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type GoogleMeetEvent = {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
    displayName?: string;
    responseStatus: string;
  }>;
  conferenceData?: {
    entryPoints: Array<{
      entryPointType: string;
      uri: string;
    }>;
  };
  hangoutLink?: string;
};

type GoogleUser = {
  id: string;
  email: string;
  name: string;
  picture: string;
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
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  const redirectUri = Deno.env.get('GOOGLE_MEET_REDIRECT_URI');

  // Exchange authorization code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
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
  const userResponse = await fetch(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
  );
  
  if (!userResponse.ok) {
    throw new Error('Failed to get user info');
  }
  
  const userInfo: GoogleUser = await userResponse.json();
  
  // Store tokens in Supabase
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  await supabaseClient
    .from('user_integrations')
    .upsert({
      user_id: user.id,
      provider: 'google-meet',
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
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

  const response = await fetch('https://oauth2.googleapis.com/token', {
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
    .eq('provider', 'google-meet');

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
    .eq('provider', 'google-meet')
    .single();

  if (!integration) {
    throw new Error('Google Meet integration not found');
  }

  // Check if token needs refresh
  if (new Date(integration.expires_at) <= new Date()) {
    const refreshResponse = await handleTokenRefresh(integration.refresh_token, supabaseClient);
    const refreshData = await refreshResponse.json();
    integration.access_token = refreshData.access_token;
  }

  // Get calendar events (meetings) from Google Calendar API
  const now = new Date();
  const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const meetingsResponse = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
    `timeMin=${now.toISOString()}&timeMax=${oneMonthFromNow.toISOString()}&` +
    `singleEvents=true&orderBy=startTime&maxResults=100`,
    {
      headers: { Authorization: `Bearer ${integration.access_token}` },
    }
  );

  if (!meetingsResponse.ok) {
    throw new Error('Failed to fetch Google Meet events');
  }

  const meetingsData = await meetingsResponse.json();
  
  // Filter for events with video conferencing
  const meetEvents = meetingsData.items?.filter((event: GoogleMeetEvent) => 
    event.conferenceData?.entryPoints?.some(ep => ep.entryPointType === 'video') ||
    event.hangoutLink
  ) || [];
  
  // Transform Google Meet events to Rhiz format
  const meetings = meetEvents.map((event: GoogleMeetEvent) => ({
    id: event.id,
    title: event.summary,
    start_time: event.start.dateTime,
    end_time: event.end.dateTime,
    timezone: event.start.timeZone,
    join_url: event.hangoutLink || 
              event.conferenceData?.entryPoints?.find(ep => ep.entryPointType === 'video')?.uri ||
              '',
    participants: event.attendees?.map(attendee => ({
      email: attendee.email,
      name: attendee.displayName || attendee.email,
      status: attendee.responseStatus,
    })) || [],
    source: 'google-meet',
    google_event_id: event.id,
  }));

  return new Response(
    JSON.stringify({ success: true, meetings }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
} 