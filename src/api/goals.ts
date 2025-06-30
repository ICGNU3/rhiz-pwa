import { supabase } from './client';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  progress?: number;
  related_contacts?: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export const getGoals = async (): Promise<Goal[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch goals: ${error.message}`);
  }

  // Enhance with mock progress data
  const enhancedGoals = (data || []).map(goal => ({
    ...goal,
    progress: goal.progress || Math.floor(Math.random() * 100),
    related_contacts: goal.related_contacts || Math.floor(Math.random() * 5) + 1,
    category: goal.category || ['Networking', 'Fundraising', 'Hiring', 'Partnerships', 'Growth'][Math.floor(Math.random() * 5)]
  }));

  return enhancedGoals;
};

export const createGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Goal> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const enhancedGoal = {
    ...goalData,
    user_id: user.id,
    progress: 0,
    related_contacts: Math.floor(Math.random() * 5) + 1,
    category: goalData.category || 'Networking'
  };

  const { data, error } = await supabase
    .from('goals')
    .insert([enhancedGoal])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create goal: ${error.message}`);
  }

  return data;
};

export const updateGoal = async (goal: Goal): Promise<Goal> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('goals')
    .update({
      ...goal,
      updated_at: new Date().toISOString()
    })
    .eq('id', goal.id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update goal: ${error.message}`);
  }

  return data;
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to delete goal: ${error.message}`);
  }
};

// Real-time subscription for goals
export const subscribeToGoals = (callback: (payload: any) => void) => {
  return supabase
    .channel('goals')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'goals' 
    }, callback)
    .subscribe();
};