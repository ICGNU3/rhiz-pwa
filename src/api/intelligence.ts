export const getIntelligenceInsights = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    networkScore: 85,
    growthRate: 12,
    engagementRate: 68,
    networkTrends: [
      'Your network has grown 15% in the last month',
      'Tech industry connections increased by 23%',
      'Geographic diversity improved with new international contacts'
    ],
    opportunities: [
      'Consider connecting with more professionals in the AI/ML space',
      'Your network could benefit from more senior-level connections',
      'Explore connections in emerging markets for global expansion'
    ],
    goalRecommendations: [
      'Set a goal to connect with 5 CTOs in the next quarter',
      'Plan to attend 2 industry conferences this year',
      'Schedule monthly check-ins with your top 10 connections'
    ],
    suggestions: [
      'Reach out to Sarah Chen - you haven\'t connected in 3 weeks',
      'Follow up on the conversation with Michael about the fintech project',
      'Consider introducing Emily to your design team for potential collaboration'
    ],
    actionItems: [
      'Schedule coffee with 3 contacts you haven\'t spoken to recently',
      'Update your LinkedIn profile with recent achievements',
      'Join 2 new professional groups related to your interests',
      'Set up automated reminders for regular contact follow-ups'
    ]
  };
};