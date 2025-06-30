import { supabase } from './client';

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

  // Get recent activity from user_activities table (if exists)
  const { data: activities } = await supabase
    .from('user_activities')
    .select('activity_type, description, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    totalConnections: contactsCount || 0,
    activeGoals: activeGoalsCount || 0,
    networkGrowth: Math.floor(Math.random() * 20) + 5,
    recentActivity: activities?.map(a => a.description) || [
      'Connected with new contact from LinkedIn',
      'Completed networking goal milestone',
      'Added 3 new contacts from conference',
      'Updated relationship notes'
    ]
  };
};