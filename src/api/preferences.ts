import { supabase } from './client';

export interface UserPreferences {
  id?: string;
  user_id: string;
  
  // Behavioral learning data
  search_preferences: Record<string, number>;
  feature_usage: Record<string, number>;
  navigation_patterns: Record<string, number>;
  timing_patterns: string[];
  
  // UI adaptation preferences
  dashboard_layout: {
    widgets: string[];
    order: number[];
  };
  contact_view_preferences: {
    defaultView: 'grid' | 'list';
    sortBy: string;
    filters: string[];
  };
  workflow_patterns: Record<string, string[]>;
  
  // User behavior profile
  behavior_profile: 'relationship-focused' | 'goal-focused' | 'network-focused' | 'balanced';
  sophistication_level: 'beginner' | 'intermediate' | 'advanced';
  adaptation_level: 'minimal' | 'moderate' | 'aggressive';
  
  // Contextual preferences
  contextual_suggestions: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    types: string[];
  };
  smart_defaults: Record<string, string[]>;
  
  // Learning preferences
  learning_enabled: boolean;
  privacy_conscious: boolean;
  data_sharing_level: 'minimal' | 'standard' | 'enhanced';
  
  created_at?: string;
  updated_at?: string;
}

// Get user preferences
export const getUserPreferences = async (): Promise<UserPreferences> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch user preferences: ${error.message}`);
  }

  if (data) {
    return data;
  }

  // Create default preferences if none exist
  const defaultPreferences: UserPreferences = {
    user_id: user.id,
    search_preferences: {},
    feature_usage: {},
    navigation_patterns: {},
    timing_patterns: [],
    dashboard_layout: {
      widgets: ['recent_activity', 'trust_alerts', 'goal_progress'],
      order: [1, 2, 3]
    },
    contact_view_preferences: {
      defaultView: 'grid',
      sortBy: 'name',
      filters: []
    },
    workflow_patterns: {},
    behavior_profile: 'balanced',
    sophistication_level: 'intermediate',
    adaptation_level: 'moderate',
    contextual_suggestions: {
      enabled: true,
      frequency: 'daily',
      types: ['contact_reminders', 'goal_alerts', 'relationship_insights']
    },
    smart_defaults: {},
    learning_enabled: true,
    privacy_conscious: false,
    data_sharing_level: 'minimal'
  };

  const { data: newPreferences, error: createError } = await supabase
    .from('user_preferences')
    .insert([defaultPreferences])
    .select()
    .single();

  if (createError) {
    console.error('Failed to create default preferences:', createError);
    return defaultPreferences;
  }

  return newPreferences;
};

// Update user preferences
export const updateUserPreferences = async (updates: Partial<UserPreferences>): Promise<UserPreferences> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user preferences: ${error.message}`);
  }

  return data;
};

// Record behavioral data
export const recordBehavior = async (type: 'search' | 'feature' | 'navigation' | 'timing', data: any): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.warn('Cannot record behavior: user not authenticated');
    return;
  }

  try {
    const preferences = await getUserPreferences();
    
    let updates: Partial<UserPreferences> = {};
    
    switch (type) {
      case 'search':
        const searchPrefs = { ...preferences.search_preferences };
        searchPrefs[data.type] = (searchPrefs[data.type] || 0) + 1;
        updates.search_preferences = searchPrefs;
        break;
        
      case 'feature':
        const featureUsage = { ...preferences.feature_usage };
        featureUsage[data.feature] = (featureUsage[data.feature] || 0) + 1;
        updates.feature_usage = featureUsage;
        break;
        
      case 'navigation':
        const navPatterns = { ...preferences.navigation_patterns };
        navPatterns[data.route] = (navPatterns[data.route] || 0) + 1;
        updates.navigation_patterns = navPatterns;
        break;
        
      case 'timing':
        const timingPatterns = [...preferences.timing_patterns];
        const timeLabel = data.time;
        if (!timingPatterns.includes(timeLabel)) {
          timingPatterns.push(timeLabel);
          if (timingPatterns.length > 20) timingPatterns.shift(); // Keep last 20 patterns
        }
        updates.timing_patterns = timingPatterns;
        break;
    }
    
    await updateUserPreferences(updates);
  } catch (error) {
    console.error('Failed to record behavior:', error);
  }
};

// Analyze user behavior and update profile
export const analyzeUserBehavior = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return;
  }

  try {
    const preferences = await getUserPreferences();
    
    // Analyze behavior profile
    const searchStats = preferences.search_preferences;
    const featureStats = preferences.feature_usage;
    const navStats = preferences.navigation_patterns;
    
    let behaviorProfile: UserPreferences['behavior_profile'] = 'balanced';
    let sophisticationLevel: UserPreferences['sophistication_level'] = 'intermediate';
    
    // Determine behavior profile
    const totalFeatures = Object.values(featureStats).reduce((a, b) => a + b, 0);
    const featureDiversity = Object.keys(featureStats).length;
    
    if (featureDiversity > 8 && totalFeatures > 50) {
      sophisticationLevel = 'advanced';
    } else if (featureDiversity > 4 && totalFeatures > 20) {
      sophisticationLevel = 'intermediate';
    } else {
      sophisticationLevel = 'beginner';
    }
    
    // Determine behavior focus
    const contactFeatures = ['notes', 'tags', 'trust_score', 'relationship_strength'];
    const goalFeatures = ['goals', 'progress', 'target_date', 'priority'];
    const networkFeatures = ['network', 'connections', 'mutual_connections'];
    
    const contactUsage = contactFeatures.reduce((sum, feature) => sum + (featureStats[feature] || 0), 0);
    const goalUsage = goalFeatures.reduce((sum, feature) => sum + (featureStats[feature] || 0), 0);
    const networkUsage = networkFeatures.reduce((sum, feature) => sum + (featureStats[feature] || 0), 0);
    
    if (contactUsage > goalUsage && contactUsage > networkUsage) {
      behaviorProfile = 'relationship-focused';
    } else if (goalUsage > contactUsage && goalUsage > networkUsage) {
      behaviorProfile = 'goal-focused';
    } else if (networkUsage > contactUsage && networkUsage > goalUsage) {
      behaviorProfile = 'network-focused';
    } else {
      behaviorProfile = 'balanced';
    }
    
    // Update preferences with analysis
    await updateUserPreferences({
      behavior_profile: behaviorProfile,
      sophistication_level: sophisticationLevel
    });
    
  } catch (error) {
    console.error('Failed to analyze user behavior:', error);
  }
};

// Get adaptive dashboard layout
export const getAdaptiveDashboardLayout = async (): Promise<{
  widgets: string[];
  order: number[];
  suggestions: string[];
}> => {
  const preferences = await getUserPreferences();
  
  // Base widgets based on behavior profile
  let widgets: string[] = [];
  let suggestions: string[] = [];
  
  switch (preferences.behavior_profile) {
    case 'relationship-focused':
      widgets = ['recent_activity', 'trust_alerts', 'contact_insights'];
      suggestions = ['Try setting relationship goals to track progress', 'Review contacts with declining trust scores'];
      break;
    case 'goal-focused':
      widgets = ['goal_progress', 'goal_deadlines', 'goal_insights'];
      suggestions = ['Connect goals to specific contacts for better tracking', 'Set up goal reminders'];
      break;
    case 'network-focused':
      widgets = ['network_graph', 'connection_insights', 'network_growth'];
      suggestions = ['Explore mutual connections between your contacts', 'Identify network gaps'];
      break;
    default:
      widgets = ['recent_activity', 'trust_alerts', 'goal_progress'];
      suggestions = ['Customize your dashboard based on your usage patterns'];
  }
  
  // Add sophistication-based widgets
  if (preferences.sophistication_level === 'advanced') {
    widgets.push('advanced_analytics', 'predictive_insights');
  }
  
  return {
    widgets,
    order: preferences.dashboard_layout.order,
    suggestions
  };
};

// Get smart defaults for forms
export const getSmartDefaults = async (context: string): Promise<Record<string, any>> => {
  const preferences = await getUserPreferences();
  
  if (!preferences.smart_defaults[context]) {
    return {};
  }
  
  return preferences.smart_defaults[context];
};

// Update smart defaults
export const updateSmartDefaults = async (context: string, defaults: string[]): Promise<void> => {
  const preferences = await getUserPreferences();
  const updatedDefaults = {
    ...preferences.smart_defaults,
    [context]: defaults
  };
  
  await updateUserPreferences({
    smart_defaults: updatedDefaults
  });
}; 