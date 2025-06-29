export const getIntelligenceInsights = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    networkScore: 85,
    growthRate: 12,
    engagementRate: 68,
    networkTrends: [
      'Your network has grown 15% in the last month with strong engagement in tech sector',
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
      'Reach out to Sarah Chen - you haven\'t connected in 3 weeks and she just joined Stanford AI committee',
      'Follow up on the conversation with Michael about the fintech project - perfect timing',
      'Consider introducing Emily to your design team for potential collaboration opportunities'
    ],
    actionItems: [
      'Schedule coffee with 3 contacts you haven\'t spoken to recently',
      'Update your LinkedIn profile with recent achievements to attract new connections',
      'Join 2 new professional groups related to your interests',
      'Set up automated reminders for regular contact follow-ups',
      'Draft personalized messages for 5 dormant connections',
      'Research and attend 1 networking event this month'
    ]
  };
};

// Mock function for chat API
export const sendChatQuery = async (query: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate intelligent responses based on query content
  const responses = {
    'fundraising': "Based on your network analysis, I've identified 5 key contacts who could help with fundraising: Sarah Chen (Stanford AI committee), Michael Rodriguez (former VC), and 3 others with strong investor connections. Would you like me to draft introduction requests?",
    'risk': "I've detected 2 at-risk relationships: Michael Rodriguez (90 days no contact, engagement down 15%) and Emily Johnson (missed last 2 scheduled calls). I recommend immediate personalized outreach to re-engage these valuable connections.",
    'opportunities': "Your network shows 12 hidden opportunities: 3 potential partnerships in fintech, 4 hiring prospects for senior roles, and 5 introduction opportunities that could strengthen your ecosystem. Shall I prioritize these by impact?",
    'introductions': "Perfect introduction opportunity detected: Sarah Chen and Alex Thompson both work in AI/ML space and share 3 mutual connections through your network. Their complementary expertise could create significant value for both parties.",
    'default': "I've analyzed your network and found several insights. Your relationship strength has grown 15% this month, with particularly strong engagement in the tech sector. I can help you identify specific opportunities, risks, or strategic connections. What would you like to explore?"
  };
  
  const queryLower = query.toLowerCase();
  let response = responses.default;
  
  if (queryLower.includes('fundrais') || queryLower.includes('investor')) response = responses.fundraising;
  else if (queryLower.includes('risk') || queryLower.includes('90 days')) response = responses.risk;
  else if (queryLower.includes('opportunit')) response = responses.opportunities;
  else if (queryLower.includes('introduc')) response = responses.introductions;
  
  return {
    response,
    timestamp: new Date().toISOString(),
    confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
  };
};