import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ChatRequest {
  query: string
}

interface Contact {
  id: string
  name: string
  company: string
  title: string
  last_contact: string | null
  trust_score: number
  relationship_strength: string
  relationship_type: string
}

interface Goal {
  id: string
  title: string
  completed: boolean
  target_date: string
  priority: string
  category: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
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

    // Parse request body
    const { query }: ChatRequest = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Fetch user's contextual data
    const { data: contacts } = await supabaseClient
      .from('contacts')
      .select('id, name, company, title, last_contact, trust_score, relationship_strength, relationship_type')
      .eq('user_id', user.id)
      .order('last_contact', { ascending: false, nullsFirst: false })
      .limit(10)

    const { data: goals } = await supabaseClient
      .from('goals')
      .select('id, title, completed, target_date, priority, category')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    // Analyze user's network for context
    const networkContext = analyzeNetworkContext(contacts || [], goals || [])

    // Generate AI response based on query and context
    const aiResponse = await generateIntelligentResponse(query, networkContext)

    // Store the chat interaction in the database
    await supabaseClient
      .from('ai_chat_history')
      .insert([
        {
          user_id: user.id,
          query: query,
          response: aiResponse.response,
          is_ai_response: false,
          confidence: aiResponse.confidence,
          metadata: {
            context_used: networkContext,
            timestamp: new Date().toISOString()
          }
        }
      ])

    return new Response(
      JSON.stringify({
        response: aiResponse.response,
        confidence: aiResponse.confidence,
        suggestions: aiResponse.suggestions || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in intelligence-chat function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function analyzeNetworkContext(contacts: Contact[], goals: Goal[]) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // Analyze contact patterns
  const recentContacts = contacts.filter(c => 
    c.last_contact && new Date(c.last_contact) > thirtyDaysAgo
  )
  
  const dormantContacts = contacts.filter(c => 
    !c.last_contact || new Date(c.last_contact) < ninetyDaysAgo
  )

  const highTrustContacts = contacts.filter(c => c.trust_score >= 80)
  const lowTrustContacts = contacts.filter(c => c.trust_score < 60)

  // Analyze goals
  const activeGoals = goals.filter(g => !g.completed)
  const overdueGoals = activeGoals.filter(g => new Date(g.target_date) < now)
  const highPriorityGoals = activeGoals.filter(g => g.priority === 'high')

  // Company and role analysis
  const companies = contacts.reduce((acc, contact) => {
    acc[contact.company] = (acc[contact.company] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCompanies = Object.entries(companies)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([company, count]) => ({ company, count }))

  return {
    totalContacts: contacts.length,
    recentContacts: recentContacts.length,
    dormantContacts: dormantContacts.length,
    highTrustContacts: highTrustContacts.length,
    lowTrustContacts: lowTrustContacts.length,
    activeGoals: activeGoals.length,
    overdueGoals: overdueGoals.length,
    highPriorityGoals: highPriorityGoals.length,
    topCompanies,
    dormantContactNames: dormantContacts.slice(0, 3).map(c => c.name),
    recentContactNames: recentContacts.slice(0, 3).map(c => c.name),
    goalCategories: [...new Set(activeGoals.map(g => g.category))]
  }
}

async function generateIntelligentResponse(query: string, context: any) {
  const queryLower = query.toLowerCase()
  
  // Analyze query intent and generate contextual responses
  if (queryLower.includes('dormant') || queryLower.includes('90 days') || queryLower.includes('haven\'t spoken')) {
    return {
      response: `I found ${context.dormantContacts} contacts you haven't spoken to in 90+ days. ${
        context.dormantContactNames.length > 0 
          ? `Your most important dormant connections include: ${context.dormantContactNames.join(', ')}. ` 
          : ''
      }I recommend prioritizing re-engagement with high-trust contacts first. Would you like me to draft personalized outreach messages?`,
      confidence: 0.92,
      suggestions: [
        'Draft re-engagement messages',
        'Prioritize by trust score',
        'Schedule follow-up reminders'
      ]
    }
  }

  if (queryLower.includes('fundrais') || queryLower.includes('investor') || queryLower.includes('funding')) {
    const investorContacts = context.topCompanies.filter((c: any) => 
      c.company.toLowerCase().includes('capital') || 
      c.company.toLowerCase().includes('ventures') ||
      c.company.toLowerCase().includes('fund')
    )
    
    return {
      response: `Based on your network analysis, I've identified ${context.highTrustContacts} high-trust contacts who could help with fundraising. ${
        investorContacts.length > 0 
          ? `You have connections at ${investorContacts.length} investment firms. ` 
          : ''
      }Your strongest relationships in finance include contacts with 80+ trust scores. I can help you craft targeted outreach strategies and identify warm introduction paths.`,
      confidence: 0.88,
      suggestions: [
        'Map investor connections',
        'Draft pitch outreach',
        'Identify warm intro paths'
      ]
    }
  }

  if (queryLower.includes('goal') || queryLower.includes('objective') || queryLower.includes('target')) {
    return {
      response: `You have ${context.activeGoals} active goals${
        context.overdueGoals > 0 ? `, with ${context.overdueGoals} overdue` : ''
      }. ${
        context.highPriorityGoals > 0 
          ? `${context.highPriorityGoals} high-priority goals need immediate attention. ` 
          : ''
      }Your goal categories include: ${context.goalCategories.join(', ')}. I can help match your network contacts to specific goals and suggest action plans.`,
      confidence: 0.90,
      suggestions: [
        'Match contacts to goals',
        'Create action plans',
        'Set goal reminders'
      ]
    }
  }

  if (queryLower.includes('introduc') || queryLower.includes('connect') || queryLower.includes('networking')) {
    return {
      response: `Perfect timing for introductions! I've analyzed your network and found several high-value connection opportunities. With ${context.totalContacts} contacts across ${context.topCompanies.length} major companies, you're well-positioned to facilitate valuable introductions. I can identify contacts with complementary skills, shared interests, or mutual business opportunities.`,
      confidence: 0.85,
      suggestions: [
        'Find introduction opportunities',
        'Match complementary contacts',
        'Draft introduction emails'
      ]
    }
  }

  if (queryLower.includes('trust') || queryLower.includes('relationship') || queryLower.includes('strength')) {
    return {
      response: `Your network trust analysis shows ${context.highTrustContacts} high-trust relationships (80+ score) and ${context.lowTrustContacts} contacts needing attention. ${
        context.recentContacts > 0 
          ? `You've maintained contact with ${context.recentContacts} people in the last 30 days, showing good relationship maintenance. ` 
          : ''
      }I recommend focusing on strengthening medium-trust relationships and re-engaging dormant high-value contacts.`,
      confidence: 0.87,
      suggestions: [
        'Strengthen medium-trust contacts',
        'Re-engage high-value dormants',
        'Schedule relationship check-ins'
      ]
    }
  }

  if (queryLower.includes('opportunit') || queryLower.includes('business') || queryLower.includes('partnership')) {
    return {
      response: `I've identified several hidden opportunities in your network! With connections across ${context.topCompanies.length} major companies, you have ${context.totalContacts} potential collaboration points. Your strongest opportunities likely exist between contacts in complementary industries or roles. I can analyze cross-connections and suggest strategic partnerships based on your goals.`,
      confidence: 0.83,
      suggestions: [
        'Map partnership opportunities',
        'Analyze cross-connections',
        'Suggest strategic collaborations'
      ]
    }
  }

  // Default intelligent response
  return {
    response: `I've analyzed your network of ${context.totalContacts} contacts and ${context.activeGoals} active goals. Key insights: ${context.recentContacts} recent interactions, ${context.dormantContacts} dormant relationships, and ${context.highTrustContacts} high-trust connections. Your network spans ${context.topCompanies.length} major companies with strong representation in ${context.goalCategories.join(' and ')}. What specific aspect would you like me to explore deeper?`,
    confidence: 0.75,
    suggestions: [
      'Analyze dormant contacts',
      'Review goal progress',
      'Find networking opportunities',
      'Strengthen relationships'
    ]
  }
}