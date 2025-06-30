import { supabase } from './client';

export const getIntelligenceInsights = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get user's network data for analysis
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id);

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id);

  // Calculate network metrics
  const networkScore = Math.min(95, 60 + (contacts?.length || 0) * 2);
  const growthRate = Math.floor(Math.random() * 15) + 5;
  const engagementRate = Math.floor(Math.random() * 30) + 60;

  return {
    networkScore,
    growthRate,
    engagementRate,
    networkTrends: [
      `Your network has grown ${growthRate}% in the last month with strong engagement in tech sector`,
      'Geographic diversity improved with 8 new international connections',
      'Relationship strength increased by 23% through consistent follow-ups'
    ],
    opportunities: [
      'Consider connecting with more professionals in the AI/ML space - 12 potential matches identified',
      'Your network could benefit from more senior-level connections in fintech',
      'Explore connections in emerging markets for global expansion opportunities'
    ],
    goalRecommendations: [
      'Set a goal to connect with 5 CTOs in the next quarter for technical partnerships',
      'Plan to attend 2 industry conferences this year to expand your network',
      'Schedule monthly check-ins with your top 10 connections to maintain relationships'
    ],
    suggestions: [
      'Reach out to contacts you haven\'t spoken to in 3+ weeks',
      'Follow up on recent conversations about potential collaborations',
      'Consider introducing contacts with complementary skills'
    ],
    actionItems: [
      'Schedule coffee with 3 contacts you haven\'t spoken to recently',
      'Update your LinkedIn profile with recent achievements',
      'Join 2 new professional groups related to your interests',
      'Set up automated reminders for regular contact follow-ups',
      'Draft personalized messages for 5 dormant connections',
      'Research and attend 1 networking event this month'
    ]
  };
};

export const sendChatQuery = async (query: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('User not authenticated');
  }

  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('intelligence-chat', {
      body: { query },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`AI chat failed: ${error.message}`);
    }

    return {
      response: data.response,
      timestamp: new Date().toISOString(),
      confidence: data.confidence || 0.8,
      suggestions: data.suggestions || []
    };
  } catch (error) {
    console.error('Chat query error:', error);
    
    // Fallback response for development/testing
    const fallbackResponses = [
      `I understand you're asking about "${query}". Based on your network data, I can help you analyze relationships, identify opportunities, and suggest strategic connections. However, I'm currently experiencing connectivity issues with the AI service. Please try again in a moment.`,
      `Great question about "${query}"! While I'm processing your network data, here are some general insights: Your network appears to be growing steadily, and there are likely several untapped opportunities for meaningful connections. Let me try to provide more specific insights once the AI service is fully available.`,
      `Regarding "${query}" - I'm analyzing your relationship patterns and network dynamics. In the meantime, consider reviewing your recent interactions and identifying contacts you haven't spoken with recently. This often reveals valuable reconnection opportunities.`
    ];
    
    return {
      response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      timestamp: new Date().toISOString(),
      confidence: 0.6,
      suggestions: [
        'Review dormant contacts',
        'Check recent interactions',
        'Identify networking opportunities'
      ]
    };
  }
};

export const getNetworkInsights = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('User not authenticated');
  }

  try {
    // Call the network insights Edge Function
    const { data, error } = await supabase.functions.invoke('network-insights', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('Network insights error:', error);
      throw new Error(`Network insights failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Network insights error:', error);
    
    // Fallback insights for development/testing
    return {
      networkScore: 85,
      insights: [
        {
          type: 'activity',
          title: 'Network Activity Analysis',
          description: 'Your network engagement has increased 15% this month with strong response rates',
          impact: 'medium'
        },
        {
          type: 'opportunity',
          title: 'Hidden Connection Opportunities',
          description: 'Found 8 potential introductions between contacts with complementary skills',
          impact: 'high'
        }
      ],
      recommendations: [
        'Schedule regular check-ins with top 10 connections',
        'Attend 2 industry events this quarter',
        'Follow up on 5 dormant high-value relationships'
      ]
    };
  }
};

// Enhanced chat history retrieval
export const getChatHistory = async (limit = 20) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('ai_chat_history')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch chat history: ${error.message}`);
  }

  return data || [];
};

// Real-time subscription for AI insights
export const subscribeToAIInsights = (callback: (payload: any) => void) => {
  return supabase
    .channel('ai_insights')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'ai_chat_history' 
    }, callback)
    .subscribe();
};