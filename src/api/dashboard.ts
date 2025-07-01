// Replace your src/api/dashboard.ts with this temporarily
import { supabase } from './client';

export interface DashboardData {
  networkHealth: number;        // 0–100%
  totalContacts: number;
  totalGoals: number;
  overallTrust: number;         // 0–100%
  upcomingActions: { id: string; title: string; due: string }[];
  recentActivity: { id: string; text: string; time: string }[];
}

export const getDashboardStats = async (): Promise<DashboardData> => {
  // TEMPORARY: Return mock data to see your UI in action
  console.log('🚀 Using mock dashboard data for development');
  
  return {
    networkHealth: 87,
    totalContacts: 247,
    totalGoals: 8,
    overallTrust: 82,
    upcomingActions: [
      { 
        id: 'action-1', 
        title: 'Follow up with Sarah Chen about AI partnership', 
        due: 'Today' 
      },
      { 
        id: 'action-2', 
        title: 'Schedule coffee with Michael Rodriguez', 
        due: 'Tomorrow' 
      },
      { 
        id: 'action-3', 
        title: 'Send introduction to Emma Wilson & TechCorp team', 
        due: 'This week' 
      },
      { 
        id: 'action-4', 
        title: 'Review Q1 networking goals progress', 
        due: 'Next week' 
      }
    ],
    recentActivity: [
      { id: 'activity-1', text: 'Connected with Alex Thompson from YC Demo Day', time: '2 hours ago' },
      { id: 'activity-2', text: 'Completed networking goal: "Meet 5 AI founders"', time: '1 day ago' },
      { id: 'activity-3', text: 'Added 4 new contacts from Stanford AI conference', time: '2 days ago' },
      { id: 'activity-4', text: 'Updated relationship notes for 12 key contacts', time: '3 days ago' },
      { id: 'activity-5', text: 'Scheduled follow-up with Maria Garcia (potential investor)', time: '5 days ago' }
    ]
  };
};

// Keep the original function commented out for later restoration
/*
export const getDashboardStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get contacts count
  const { count: contactsCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get active goals count
  const { count: activeGoalsCount } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', false);

  // Get total goals count
  const { count: totalGoalsCount } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get recent activity from user_activities table
  const { data: activities } = await supabase
    .from('user_activities')
    .select('id, activity_type, description, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Get trust insights
  const { data: trustInsights } = await supabase
    .from('trust_insights')
    .select('trust_score')
    .eq('user_id', user.id)
    .order('calculated_at', { ascending: false })
    .limit(1);

  // Calculate network health score (weighted average of various metrics)
  const contactsScore = Math.min(100, (contactsCount || 0) * 5); // 5 points per contact, max 100
  const goalsScore = Math.min(100, (activeGoalsCount || 0) * 10); // 10 points per active goal, max 100
  const trustScore = trustInsights?.[0]?.trust_score || 75;
  
  const networkHealth = Math.round((contactsScore * 0.4) + (goalsScore * 0.3) + (trustScore * 0.3));

  // Generate upcoming actions
  const upcomingActions = [
    { 
      id: 'action-1', 
      title: 'Follow up with Sarah Chen about AI partnership', 
      due: 'Today' 
    },
    { 
      id: 'action-2', 
      title: 'Schedule meeting with Michael Rodriguez', 
      due: 'Tomorrow' 
    },
    { 
      id: 'action-3', 
      title: 'Send proposal to TechCorp', 
      due: 'This week' 
    },
    { 
      id: 'action-4', 
      title: 'Review fundraising goal progress', 
      due: 'Next week' 
    }
  ];

  // Format activities or use fallback
  const recentActivity = activities?.map(activity => ({
    id: activity.id,
    text: activity.description,
    time: formatTimeAgo(new Date(activity.created_at))
  })) || [
    { id: 'activity-1', text: 'Connected with new contact from LinkedIn', time: '2 hours ago' },
    { id: 'activity-2', text: 'Completed networking goal milestone', time: '1 day ago' },
    { id: 'activity-3', text: 'Added 3 new contacts from conference', time: '2 days ago' },
    { id: 'activity-4', text: 'Updated relationship notes for key contacts', time: '3 days ago' },
    { id: 'activity-5', text: 'Scheduled follow-up with potential investor', time: '1 week ago' }
  ];

  return {
    networkHealth,
    totalContacts: contactsCount || 0,
    totalGoals: totalGoalsCount || 0,
    overallTrust: trustScore,
    upcomingActions,
    recentActivity
  };
};

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSecs < 60) return `${diffSecs} seconds ago`;
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${diffWeeks} weeks ago`;
}
*/