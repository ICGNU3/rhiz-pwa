interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const getGoals = async (): Promise<Goal[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const goals = localStorage.getItem('rhiz-goals');
  if (goals) {
    return JSON.parse(goals);
  }
  
  // Return mock data if no goals exist
  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Connect with 10 industry leaders',
      description: 'Build relationships with key figures in the tech industry',
      targetDate: '2025-03-01',
      completed: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Attend 3 networking events',
      description: 'Participate in professional networking events this quarter',
      targetDate: '2025-02-15',
      completed: true,
      priority: 'medium'
    }
  ];
  
  localStorage.setItem('rhiz-goals', JSON.stringify(mockGoals));
  return mockGoals;
};

export const createGoal = async (goalData: Omit<Goal, 'id'>): Promise<Goal> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newGoal: Goal = {
    ...goalData,
    id: Date.now().toString()
  };
  
  const existingGoals = JSON.parse(localStorage.getItem('rhiz-goals') || '[]');
  const updatedGoals = [...existingGoals, newGoal];
  localStorage.setItem('rhiz-goals', JSON.stringify(updatedGoals));
  
  return newGoal;
};

export const updateGoal = async (goal: Goal): Promise<Goal> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const existingGoals = JSON.parse(localStorage.getItem('rhiz-goals') || '[]');
  const updatedGoals = existingGoals.map((g: Goal) => g.id === goal.id ? goal : g);
  localStorage.setItem('rhiz-goals', JSON.stringify(updatedGoals));
  
  return goal;
};