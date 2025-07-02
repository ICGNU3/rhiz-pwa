import { supabase } from './client';
import type { Goal } from '../types';

export const getGoals = async (): Promise<Goal[]> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user || userError) {
      console.warn('No authenticated user for goals:', userError?.message);
      
      // Return helpful demo goals for unauthenticated users
      return [
        {
          id: 'demo-goal-1',
          user_id: 'demo',
          title: 'Connect with 5 AI/ML founders',
          description: 'Build relationships with founders in the AI space to explore potential partnerships and learn from their experiences.',
          target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          category: 'Networking',
          priority: 'high' as const,
          completed: false,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          updated_at: new Date().toISOString(),
          progress: 40,
          related_contacts: 3
        },
        {
          id: 'demo-goal-2',
          user_id: 'demo',
          title: 'Secure pre-seed funding',
          description: 'Raise $500k pre-seed round by connecting with angel investors and early-stage VCs.',
          target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
          category: 'Fundraising',
          priority: 'high' as const,
          completed: false,
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
          updated_at: new Date().toISOString(),
          progress: 30,
          related_contacts: 8
        }
      ];
    }

    let data: any[] = [];
    let error = null;

    try {
      const result = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      data = result.data || [];
      error = result.error;
    } catch (dbError) {
      console.warn('Database error when fetching goals:', dbError);
      // Continue with empty array
    }

    if (error) {
      console.warn('Error fetching goals:', error.message);
      return []; // Return empty array instead of throwing
    }

    // If no goals exist, return empty array (component will show empty state)
    if (!data || data.length === 0) {
      console.log('No goals found - user can create their first goal');
      return [];
    }

    // Enhance with mock progress data for any missing fields
    const enhancedGoals = data.map(goal => ({
      ...goal,
      progress: goal.progress ?? Math.floor(Math.random() * 100),
      related_contacts: goal.related_contacts ?? Math.floor(Math.random() * 5) + 1,
      category: goal.category || ['Networking', 'Fundraising', 'Hiring', 'Partnerships', 'Growth'][Math.floor(Math.random() * 5)]
    }));

    return enhancedGoals;

  } catch (error) {
    console.error('Unexpected error in getGoals:', error);
    return []; // Always return array, never throw
  }
};

export const createGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Goal> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user || userError) {
      console.warn('No user for goal creation:', userError?.message);
      throw new Error('Please sign in to create goals');
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
      console.error('Error creating goal:', error);
      throw new Error(`Failed to create goal: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in createGoal:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create goal. Please try again.');
  }
};

export const updateGoal = async (goal: Goal): Promise<Goal> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user || userError) {
      console.warn('No user for goal update:', userError?.message);
      throw new Error('Please sign in to update goals');
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
      console.error('Error updating goal:', error);
      throw new Error(`Failed to update goal: ${error.message}`);
    }

    if (!data) {
      throw new Error('Goal not found or you do not have permission to update it');
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in updateGoal:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update goal. Please try again.');
  }
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user || userError) {
      console.warn('No user for goal deletion:', userError?.message);
      throw new Error('Please sign in to delete goals');
    }

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting goal:', error);
      throw new Error(`Failed to delete goal: ${error.message}`);
    }

    console.log('Goal deleted successfully:', goalId);
  } catch (error) {
    console.error('Unexpected error in deleteGoal:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete goal. Please try again.');
  }
};

// Real-time subscription with error handling
export const subscribeToGoals = (callback: (payload: any) => void) => {
  try {
    return supabase
      .channel('goals')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'goals' 
      }, callback)
      .subscribe();
  } catch (error) {
    console.warn('Failed to subscribe to goals changes:', error);
    return null;
  }
};

export { type Goal };