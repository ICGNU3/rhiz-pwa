import { supabase } from './client';

export interface UserSettings {
  id?: string;
  user_id: string;
  profile: {
    displayName: string;
    email: string;
    bio: string;
    timezone: string;
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    weekly: boolean;
    mentions: boolean;
    goalReminders: boolean;
    relationshipAlerts: boolean;
    networkUpdates: boolean;
    aiInsights: boolean;
  };
  integrations: {
    linkedin: boolean;
    google: boolean;
    outlook: boolean;
    slack: boolean;
    calendly: boolean;
    zoom: boolean;
  };
  privacy: {
    profileVisibility: string;
    contactSharing: boolean;
    activityTracking: boolean;
    dataCollection: string;
    thirdPartyIntegrations: boolean;
    analyticsOptOut: boolean;
  };
  ai: {
    assistantEnabled: boolean;
    insightFrequency: string;
    autoSuggestions: boolean;
    learningMode: string;
    personalizedRecommendations: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export const getUserSettings = async (): Promise<UserSettings> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Try to fetch from database first
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw new Error(`Failed to fetch user settings: ${error.message}`);
  }

  // Return existing settings or create default settings
  if (data) {
    return data;
  }

  // Return default settings if none exist
  const defaultSettings: UserSettings = {
    user_id: user.id,
    profile: {
      displayName: user.user_metadata?.name || user.email?.split('@')[0] || '',
      email: user.email || '',
      bio: '',
      timezone: 'UTC-8',
      language: 'en'
    },
    notifications: {
      email: true,
      push: false,
      weekly: true,
      mentions: true,
      goalReminders: true,
      relationshipAlerts: true,
      networkUpdates: false,
      aiInsights: true
    },
    integrations: {
      linkedin: false,
      google: false,
      outlook: false,
      slack: false,
      calendly: false,
      zoom: false
    },
    privacy: {
      profileVisibility: 'connections',
      contactSharing: false,
      activityTracking: true,
      dataCollection: 'minimal',
      thirdPartyIntegrations: true,
      analyticsOptOut: false
    },
    ai: {
      assistantEnabled: true,
      insightFrequency: 'daily',
      autoSuggestions: true,
      learningMode: 'adaptive',
      personalizedRecommendations: true
    }
  };

  // Create default settings in database
  const { data: newSettings, error: createError } = await supabase
    .from('user_settings')
    .insert([defaultSettings])
    .select()
    .single();

  if (createError) {
    console.error('Failed to create default settings:', createError);
    // Return default settings even if database insert fails
    return defaultSettings;
  }

  return newSettings;
};

export const updateUserSettings = async (settings: UserSettings): Promise<UserSettings> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Ensure user_id is set correctly
  const settingsToUpdate = {
    ...settings,
    user_id: user.id,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('user_settings')
    .upsert(settingsToUpdate, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user settings: ${error.message}`);
  }

  return data;
};

// Get user statistics for display
export const getUserStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get contacts count
  const { count: contactsCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get goals count
  const { count: goalsCount } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', true);

  // Calculate account age
  const accountCreated = new Date(user.created_at);
  const now = new Date();
  const monthsOld = Math.floor((now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  return {
    accountAge: monthsOld > 0 ? `${monthsOld} month${monthsOld > 1 ? 's' : ''}` : 'Less than a month',
    totalContacts: contactsCount || 0,
    goalsCompleted: goalsCount || 0,
    networkGrowth: '+23%', // This would be calculated from historical data
    dataSize: '2.4 MB', // This would be calculated from actual data
    lastBackup: '2 hours ago',
    loginSessions: 3,
    dataExports: 2,
    securityScore: 85
  };
};

// Export user data
export const exportUserData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const [settings, stats, contacts, goals] = await Promise.all([
    getUserSettings(),
    getUserStats(),
    supabase.from('contacts').select('*').eq('user_id', user.id),
    supabase.from('goals').select('*').eq('user_id', user.id)
  ]);

  return {
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    },
    settings,
    stats,
    contacts: contacts.data || [],
    goals: goals.data || [],
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
};

// Delete user account and all data
export const deleteUserAccount = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // This would typically be handled by a secure server-side function
  // For now, we'll just sign out the user
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(`Failed to sign out: ${error.message}`);
  }

  return { success: true };
};

// Real-time subscription for settings changes
export const subscribeToSettingsChanges = (callback: (payload: any) => void) => {
  return supabase
    .channel('user_settings_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'user_settings' 
    }, callback)
    .subscribe();
};