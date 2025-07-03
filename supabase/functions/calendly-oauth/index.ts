import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type CalendlyEvent = {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: {
    name: string;
    uri: string;
  };
  invitees: Array<{
    email: string;
    name: string;
    status: string;
    questions_and_answers?: Array<{
      question: string;
      answer: string;
    }>;
  }>;
  location?: {
    type: string;
    location: string;
  };
};

type CalendlyUser = {
  uri: string;
  name: string;
  email: string;
  scheduling_url: string;
  timezone: string;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, code, apiKey } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    switch (action) {
      case 'connect_api_key':
        return await handleApiKeyConnection(apiKey, supabaseClient);
      case 'get_meetings':
        return await handleGetMeetings(apiKey, supabaseClient);
      case 'get_user_info':
        return await handleGetUserInfo(apiKey, supabaseClient);
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

async function handleApiKeyConnection(apiKey: string, supabaseClient: any) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Test the API key by fetching user info
  const userResponse = await fetch('https://api.calendly.com/users/me', {
    headers: { 
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
  });

  if (!userResponse.ok) {
    throw new Error('Invalid Calendly API key');
  }

  const userInfo: CalendlyUser = await userResponse.json();

  // Store the API key and user info in Supabase
  await supabaseClient
    .from('user_integrations')
    .upsert({
      user_id: user.id,
      provider: 'calendly',
      access_token: apiKey,
      user_info: userInfo,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    });

  return new Response(
    JSON.stringify({ success: true, user: userInfo }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetMeetings(apiKey: string, supabaseClient: any) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Get user's Calendly URI first
  const userResponse = await fetch('https://api.calendly.com/users/me', {
    headers: { 
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
  });

  if (!userResponse.ok) {
    throw new Error('Failed to get Calendly user info');
  }

  const userInfo: CalendlyUser = await userResponse.json();

  // Get scheduled events (meetings)
  const eventsResponse = await fetch(
    `https://api.calendly.com/scheduled_events?user=${userInfo.uri}&status=active&count=100`,
    {
      headers: { 
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
    }
  );

  if (!eventsResponse.ok) {
    throw new Error('Failed to fetch Calendly meetings');
  }

  const eventsData = await eventsResponse.json();
  
  // Transform Calendly events to Rhiz meeting format
  const meetings = eventsData.collection?.map((event: CalendlyEvent) => ({
    id: event.uri.split('/').pop(),
    title: event.name,
    start_time: event.start_time,
    end_time: event.end_time,
    status: event.status,
    event_type: event.event_type.name,
    location: event.location?.location || 'Virtual',
    participants: event.invitees.map(invitee => ({
      email: invitee.email,
      name: invitee.name,
      status: invitee.status,
      questions: invitee.questions_and_answers || []
    })),
    source: 'calendly',
    calendly_uri: event.uri,
  })) || [];

  return new Response(
    JSON.stringify({ success: true, meetings }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetUserInfo(apiKey: string, supabaseClient: any) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  const userResponse = await fetch('https://api.calendly.com/users/me', {
    headers: { 
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
  });

  if (!userResponse.ok) {
    throw new Error('Failed to get Calendly user info');
  }

  const userInfo: CalendlyUser = await userResponse.json();

  return new Response(
    JSON.stringify({ success: true, user: userInfo }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
} 