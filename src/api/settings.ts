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

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw new Error(`Failed to fetch user settings: ${error.message}`);
  }

  // Return default settings if none exist
  if (!data) {
    return {
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
  }

  return data;
};

export const updateUserSettings = async (settings: UserSettings): Promise<UserSettings> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      ...settings,
      user_id: user.id,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user settings: ${error.message}`);
  }

  return data;
};