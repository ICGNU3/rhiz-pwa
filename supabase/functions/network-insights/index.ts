import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.3'



serve(async (req) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  try {
    // Auth: get user from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth header' }), { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    // Supabase client (user context)
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Missing Supabase env vars' }), { status: 500 })
    }
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { global: { headers: { Authorization: `Bearer ${token}` } } })

    // 1. Fetch user's contacts and engagement data
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      return new Response(JSON.stringify({ error: 'User not found', details: userError?.message }), { status: 401 })
    }
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
    if (contactsError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch contacts', details: contactsError.message }), { status: 500 })
    }

    // 2. Analyze the contact graph and engagement
    // Mock AI logic for now
    const now = new Date()
    const atRisk = contacts.filter(c => c.engagement_trend === 'down' || (c.last_contact && ((now.getTime() - new Date(c.last_contact).getTime()) / (1000 * 60 * 60 * 24) > 60)))
    const opportunities = contacts.filter(c => c.engagement_trend === 'up' && c.trust_score > 80)
    const clusters: Record<string, number> = {}
    contacts.forEach(c => {
      if (c.relationship_type) {
        clusters[c.relationship_type] = (clusters[c.relationship_type] || 0) + 1
      }
    })
    const clusterGaps = Object.entries(clusters).filter(([, count]) => count < 2)

    // 3. Generate suggested actions
    const suggestedActions: string[] = []
    if (atRisk.length > 0) {
      suggestedActions.push(`Reconnect with ${atRisk[0].name}—relationship may be at risk.`)
    }
    if (opportunities.length > 0) {
      suggestedActions.push(`Follow up with ${opportunities[0].name}—engagement is trending up.`)
    }
    if (clusterGaps.length > 0) {
      suggestedActions.push(`Expand your network in: ${clusterGaps.map(([type]) => type).join(', ')}`)
    }
    if (contacts.length > 0) {
      suggestedActions.push(`You have ${contacts.length} contacts. Consider setting a new networking goal.`)
    }

    // 4. Return insights
    return new Response(JSON.stringify({
      atRisk: atRisk.map(c => ({ id: c.id, name: c.name, last_contact: c.last_contact, engagement_trend: c.engagement_trend })),
      opportunities: opportunities.map(c => ({ id: c.id, name: c.name, trust_score: c.trust_score, engagement_trend: c.engagement_trend })),
      clusterGaps: clusterGaps.map(([type, count]) => ({ type, count })),
      suggestedActions,
      totalContacts: contacts.length,
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (typeof error === 'object' && error && 'message' in error && typeof (error as { message: string }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
})