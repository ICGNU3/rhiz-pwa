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
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Store chat query in database
  await supabase
    .from('ai_chat_history')
    .insert([{
      user_id: user.id,
      query,
      timestamp: new Date().toISOString()
    }]);

  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const responses = {
    'fundraising': "Based on your network analysis, I've identified 5 key contacts who could help with fundraising. Would you like me to draft introduction requests?",
    'risk': "I've detected 2 at-risk relationships with 90+ days no contact. I recommend immediate personalized outreach to re-engage these valuable connections.",
    'opportunities': "Your network shows 12 hidden opportunities: 3 potential partnerships, 4 hiring prospects, and 5 introduction opportunities. Shall I prioritize these by impact?",
    'introductions': "Perfect introduction opportunity detected: Two contacts in AI/ML space with complementary expertise could create significant value for both parties.",
    'default': "I've analyzed your network and found several insights. Your relationship strength has grown 15% this month. What would you like to explore?"
  };
  
  const queryLower = query.toLowerCase();
  let response = responses.default;
  
  if (queryLower.includes('fundrais') || queryLower.includes('investor')) response = responses.fundraising;
  else if (queryLower.includes('risk') || queryLower.includes('90 days')) response = responses.risk;
  else if (queryLower.includes('opportunit')) response = responses.opportunities;
  else if (queryLower.includes('introduc')) response = responses.introductions;
  
  // Store AI response
  await supabase
    .from('ai_chat_history')
    .insert([{
      user_id: user.id,
      query: response,
      timestamp: new Date().toISOString(),
      is_ai_response: true
    }]);

  return {
    response,
    timestamp: new Date().toISOString(),
    confidence: Math.random() * 0.3 + 0.7
  };
};