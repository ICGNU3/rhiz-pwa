import { supabase } from './client';

export interface DashboardStats {
  totalContacts: number;
  newContactsLastMonth: number;
  networkHealth: number;
  overallTrust: number;
  totalGoals: number;
  goalsCompletedLastMonth: number;
}

export interface Activity {
  id: string;
  text: string;
  time: string;
}

export interface Suggestion {
  id: string;
  text: string;
  type: 'contact' | 'goal' | 'network' | 'intelligence';
  priority: 'low' | 'medium' | 'high';
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${diffWeeks}w ago`;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Return mock data for development
    return {
      totalContacts: 42,
      newContactsLastMonth: 8,
      networkHealth: 82,
      overallTrust: 88,
      totalGoals: 5,
      goalsCompletedLastMonth: 2,
    };
  }

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const { count: totalContacts } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: newContactsLastMonth } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', oneMonthAgo.toISOString());

  const { count: totalGoals } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);
    
  const { count: goalsCompletedLastMonth } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', true)
    .gte('updated_at', oneMonthAgo.toISOString());

  // Mocked data for health and trust as it's complex to calculate for now
  const networkHealth = 82; 
  const overallTrust = 88;

  return {
    totalContacts: totalContacts || 0,
    newContactsLastMonth: newContactsLastMonth || 0,
    networkHealth,
    overallTrust,
    totalGoals: totalGoals || 0,
    goalsCompletedLastMonth: goalsCompletedLastMonth || 0,
  };
};

export const getRecentActivities = async (): Promise<Activity[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Return mock data for development
    return [
      { id: '1', text: 'Added Sarah Chen to your network', time: '2h ago' },
      { id: '2', text: 'Updated fundraising goal progress', time: '1d ago' },
      { id: '3', text: 'Connected with John Smith', time: '3d ago' },
    ];
  }

  const { data, error } = await supabase
    .from('user_activities')
    .select('id, description, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    throw error;
  }

  return data.map(activity => ({
    id: activity.id,
    text: activity.description,
    time: formatTimeAgo(new Date(activity.created_at))
  }));
};

export const getSuggestedActions = async (): Promise<Suggestion[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Mock suggestions for now - in a real app, this would be AI-generated
    const mockSuggestions: Suggestion[] = [
      {
        id: '1',
        text: 'Connect with Sarah Chen from your LinkedIn network',
        type: 'contact',
        priority: 'high'
      },
      {
        id: '2',
        text: 'Update your fundraising goal progress',
        type: 'goal',
        priority: 'medium'
      },
      {
        id: '3',
        text: 'Review network insights for this week',
        type: 'intelligence',
        priority: 'low'
      }
    ];

    return mockSuggestions;
  } catch (error) {
    console.error('Error fetching suggested actions:', error);
    return [];
  }
};