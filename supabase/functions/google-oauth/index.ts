import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type GoogleContact = {
  names?: Array<{ displayName?: string }>;
  emailAddresses?: Array<{ value?: string }>;
  phoneNumbers?: Array<{ value?: string }>;
  organizations?: Array<{ name?: string; title?: string }>;
  resourceName?: string;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, code, refreshToken } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    switch (action) {
      case 'exchange_code':
        return await handleCodeExchange(code, supabaseClient)
      case 'refresh_token':
        return await handleTokenRefresh(refreshToken, supabaseClient)
      case 'get_contacts':
        return await handleGetContacts(supabaseClient)
      default:
        throw new Error('Invalid action')
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
    )
  }
})

async function handleCodeExchange(code: string, supabaseClient: SupabaseClient) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
  const redirectUri = Deno.env.get('GOOGLE_REDIRECT_URI')

  // Exchange authorization code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri!,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange code for tokens')
  }

  const tokens = await tokenResponse.json()
  
  // Get user info
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  
  if (!userResponse.ok) {
    throw new Error('Failed to get user info')
  }
  
  const userInfo = await userResponse.json()
  
  // Store tokens in Supabase (encrypted)
  const { data: { user } } = await supabaseClient.auth.getUser()
  
  await supabaseClient
    .from('user_integrations')
    .upsert({
      user_id: user.id,
      provider: 'google',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      user_info: userInfo,
    })

  return new Response(
    JSON.stringify({ success: true, user: userInfo }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleTokenRefresh(refreshToken: string, supabaseClient: SupabaseClient) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  const tokens = await response.json()
  
  // Update stored tokens
  const { data: { user } } = await supabaseClient.auth.getUser()
  
  await supabaseClient
    .from('user_integrations')
    .update({
      access_token: tokens.access_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    })
    .eq('user_id', user.id)
    .eq('provider', 'google')

  return new Response(
    JSON.stringify({ success: true, access_token: tokens.access_token }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleGetContacts(supabaseClient: SupabaseClient) {
  const { data: { user } } = await supabaseClient.auth.getUser()
  
  // Get stored tokens
  const { data: integration } = await supabaseClient
    .from('user_integrations')
    .select('*')
    .eq('user_id', user.id)
    .eq('provider', 'google')
    .single()

  if (!integration) {
    throw new Error('Google integration not found')
  }

  // Check if token needs refresh
  if (new Date(integration.expires_at) <= new Date()) {
    const refreshResponse = await handleTokenRefresh(integration.refresh_token, supabaseClient)
    const refreshData = await refreshResponse.json()
    integration.access_token = refreshData.access_token
  }

  // Fetch contacts from Google People API
  const contactsResponse = await fetch(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations',
    {
      headers: { Authorization: `Bearer ${integration.access_token}` },
    }
  )

  if (!contactsResponse.ok) {
    throw new Error('Failed to fetch contacts from Google')
  }

  const contactsData = await contactsResponse.json()
  
  // Transform Google contacts to Rhiz format
  const contacts = contactsData.connections?.map((contact: GoogleContact) => ({
    name: contact.names?.[0]?.displayName || '',
    email: contact.emailAddresses?.[0]?.value || '',
    phone: contact.phoneNumbers?.[0]?.value || '',
    company: contact.organizations?.[0]?.name || '',
    title: contact.organizations?.[0]?.title || '',
    source: 'google',
    google_id: contact.resourceName,
  })) || []

  return new Response(
    JSON.stringify({ success: true, contacts }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
} 