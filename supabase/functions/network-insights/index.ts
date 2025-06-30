import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Fetch all user contacts for network analysis
    const { data: contacts } = await supabaseClient
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)

    if (!contacts) {
      return new Response(
        JSON.stringify({ insights: [], networkScore: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate network insights
    const insights = generateNetworkInsights(contacts)

    // Store insights in trust_insights table
    for (const insight of insights.contactInsights) {
      await supabaseClient
        .from('trust_insights')
        .upsert({
          user_id: user.id,
          contact_id: insight.contactId,
          trust_score: insight.trustScore,
          factors: insight.factors,
          calculated_at: new Date().toISOString()
        })
    }

    return new Response(
      JSON.stringify({
        networkScore: insights.networkScore,
        insights: insights.insights,
        recommendations: insights.recommendations,
        riskAlerts: insights.riskAlerts
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in network-insights function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function generateNetworkInsights(contacts: any[]) {
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

function calculateDiversityScore(contacts: any[]) {
  const companies = new Set(contacts.map(c => c.company))
  const roles = new Set(contacts.map(c => c.title))
  const locations = new Set(contacts.map(c => c.location).filter(Boolean))
  
  const companyDiversity = Math.min(100, (companies.size / contacts.length) * 100)
  const roleDiversity = Math.min(100, (roles.size / contacts.length) * 100)
  const locationDiversity = Math.min(100, (locations.size / contacts.length) * 100)
  
  return (companyDiversity + roleDiversity + locationDiversity) / 3
}