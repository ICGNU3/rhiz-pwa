export const getDashboardStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get data from localStorage or return mock data
  const contacts = JSON.parse(localStorage.getItem('rhiz-contacts') || '[]');
  const goals = JSON.parse(localStorage.getItem('rhiz-goals') || '[]');
  
  return {
    totalConnections: contacts.length,
    activeGoals: goals.filter((goal: any) => !goal.completed).length,
    networkGrowth: Math.floor(Math.random() * 20) + 5, // Random growth percentage
    recentActivity: [
      'Connected with Sarah Chen from TechCorp',
      'Completed goal: Attend 3 networking events',
      'Added 5 new contacts from conference',
      'Updated relationship notes for John Doe'
    ]
  };
};