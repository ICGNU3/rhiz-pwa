import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

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
    const clusterGaps = Object.entries(clusters).filter(([type, count]) => count < 2)

    // 3. Generate suggested actions
    const suggestedActions = []
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
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), { status: 500 })
  }
})

// Example type for a contact (customize as needed)
type Contact = {
  id: string;
  name: string;
  last_contact?: string;
  engagement_trend?: string;
  trust_score?: number;
  relationship_type?: string;
  company?: string;
  title?: string;
  location?: string;
  mutual_connections?: number;
};

function generateNetworkInsights(contacts: Contact[]) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // Calculate network metrics
  const totalContacts = contacts.length
  const activeContacts = contacts.filter(c => 
    c.last_contact && new Date(c.last_contact) > thirtyDaysAgo
  ).length
  
  const dormantContacts = contacts.filter(c => 
    !c.last_contact || new Date(c.last_contact) < ninetyDaysAgo
  )

  const highTrustContacts = contacts.filter(c => c.trust_score >= 80)
  const lowTrustContacts = contacts.filter(c => c.trust_score < 60)

  // Calculate network score
  const activityScore = Math.min(100, (activeContacts / totalContacts) * 100)
  const trustScore = (highTrustContacts.length / totalContacts) * 100
  const diversityScore = calculateDiversityScore(contacts)
  const networkScore = Math.round((activityScore + trustScore + diversityScore) / 3)

  // Generate insights
  const insights = []
  const recommendations = []
  const riskAlerts = []
  const contactInsights = []

  // Activity insights
  if (activeContacts / totalContacts < 0.3) {
    insights.push({
      type: 'activity',
      title: 'Low Network Activity',
      description: `Only ${Math.round((activeContacts / totalContacts) * 100)}% of your network has been contacted in the last 30 days`,
      impact: 'medium',
      actionable: true
    })
    recommendations.push('Schedule regular check-ins with dormant contacts')
  }

  // Trust insights
  if (lowTrustContacts.length > totalContacts * 0.2) {
    insights.push({
      type: 'trust',
      title: 'Trust Score Concerns',
      description: `${lowTrustContacts.length} contacts have trust scores below 60`,
      impact: 'high',
      actionable: true
    })
    recommendations.push('Focus on strengthening low-trust relationships')
  }

  // Dormant contact alerts
  dormantContacts.forEach(contact => {
    if (contact.trust_score >= 70) {
      riskAlerts.push({
        type: 'dormant_high_value',
        contactId: contact.id,
        contactName: contact.name,
        message: `High-value contact ${contact.name} hasn't been contacted in 90+ days`,
        severity: 'high',
        action: 'immediate_outreach'
      })
    }

    // Generate contact-specific insights
    contactInsights.push({
      contactId: contact.id,
      trustScore: contact.trust_score,
      factors: {
        lastContact: contact.last_contact,
        responsePattern: 'analyzed',
        mutualConnections: contact.mutual_connections || 0,
        engagementTrend: contact.engagement_trend || 'stable'
      }
    })
  })

  // Company clustering insights
  const companies = contacts.reduce((acc, contact) => {
    acc[contact.company] = (acc[contact.company] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCompanies = Object.entries(companies)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  if (topCompanies[0] && topCompanies[0][1] > totalContacts * 0.3) {
    insights.push({
      type: 'diversity',
      title: 'Network Concentration Risk',
      description: `${Math.round((topCompanies[0][1] / totalContacts) * 100)}% of your network is concentrated in ${topCompanies[0][0]}`,
      impact: 'medium',
      actionable: true
    })
    recommendations.push('Diversify your network across more companies and industries')
  }

  return {
    networkScore,
    insights,
    recommendations,
    riskAlerts,
    contactInsights
  }
}

function calculateDiversityScore(contacts: Contact[]): number {
  const companies = new Set(contacts.map(c => c.company))
  const roles = new Set(contacts.map(c => c.title))
  const locations = new Set(contacts.map(c => c.location).filter(Boolean))
  
  const companyDiversity = Math.min(100, (companies.size / contacts.length) * 100)
  const roleDiversity = Math.min(100, (roles.size / contacts.length) * 100)
  const locationDiversity = Math.min(100, (locations.size / contacts.length) * 100)
  
  return (companyDiversity + roleDiversity + locationDiversity) / 3
}