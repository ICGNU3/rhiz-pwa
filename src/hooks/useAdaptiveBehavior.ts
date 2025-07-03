import { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserPreferences, 
  recordBehavior, 
  analyzeUserBehavior, 
  getAdaptiveDashboardLayout,
  getSmartDefaults,
  updateSmartDefaults,
  UserPreferences 
} from '../api/preferences';
import { useBehaviorTracking } from './useBehaviorTracking';

export function useAdaptiveBehavior() {
  const queryClient = useQueryClient();
  const { recordSearch, recordFeature, recordTiming } = useBehaviorTracking();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch user preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: getUserPreferences,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch adaptive dashboard layout
  const { data: dashboardLayout, isLoading: layoutLoading } = useQuery({
    queryKey: ['adaptive-dashboard'],
    queryFn: getAdaptiveDashboardLayout,
    enabled: !!preferences,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for updating preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: (updates: Partial<UserPreferences>) => 
      getUserPreferences().then(prefs => ({ ...prefs, ...updates })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      queryClient.invalidateQueries({ queryKey: ['adaptive-dashboard'] });
    }
  });

  // Enhanced behavior recording that syncs with server
  const recordAdaptiveBehavior = useCallback(async (
    type: 'search' | 'feature' | 'navigation' | 'timing',
    data: any
  ) => {
    // Record locally for immediate feedback
    switch (type) {
      case 'search':
        recordSearch(data.type);
        break;
      case 'feature':
        recordFeature(data.feature);
        break;
      case 'timing':
        recordTiming();
        break;
    }

    // Record on server for persistence and analysis
    try {
      await recordBehavior(type, data);
    } catch (error) {
      console.warn('Failed to record behavior on server:', error);
    }
  }, [recordSearch, recordFeature, recordTiming]);

  // Analyze behavior periodically
  const triggerBehaviorAnalysis = useCallback(async () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      await analyzeUserBehavior();
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      queryClient.invalidateQueries({ queryKey: ['adaptive-dashboard'] });
    } catch (error) {
      console.error('Failed to analyze behavior:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, queryClient]);

  // Get smart defaults for a specific context
  const getContextDefaults = useCallback(async (context: string) => {
    try {
      return await getSmartDefaults(context);
    } catch (error) {
      console.warn('Failed to get smart defaults:', error);
      return {};
    }
  }, []);

  // Update smart defaults for a context
  const updateContextDefaults = useCallback(async (context: string, defaults: string[]) => {
    try {
      await updateSmartDefaults(context, defaults);
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    } catch (error) {
      console.error('Failed to update smart defaults:', error);
    }
  }, [queryClient]);

  // Get contextual suggestions based on current behavior
  const getContextualSuggestions = useCallback((context: string): string[] => {
    if (!preferences) return [];

    const suggestions: string[] = [];
    const { behavior_profile, sophistication_level, feature_usage } = preferences;

    switch (context) {
      case 'contacts':
        if (behavior_profile === 'relationship-focused') {
          suggestions.push('Try setting relationship goals to track progress');
          suggestions.push('Review contacts with declining trust scores');
        }
        if (sophistication_level === 'advanced') {
          suggestions.push('Use advanced filtering to segment your network');
        }
        if ((feature_usage.notes || 0) > 50) {
          suggestions.push('Create note templates for faster contact updates');
        }
        break;

      case 'goals':
        if (behavior_profile === 'goal-focused') {
          suggestions.push('Connect goals to specific contacts for better tracking');
        }
        if (sophistication_level === 'beginner') {
          suggestions.push('Start with simple goals and gradually add complexity');
        }
        break;

      case 'dashboard':
        if (behavior_profile === 'network-focused') {
          suggestions.push('Explore mutual connections between your contacts');
        }
        if (dashboardLayout?.suggestions) {
          suggestions.push(...dashboardLayout.suggestions);
        }
        break;
    }

    return suggestions;
  }, [preferences, dashboardLayout]);

  // Get adaptive UI recommendations
  const getAdaptiveRecommendations = useCallback(() => {
    if (!preferences) return {};

    const { behavior_profile, sophistication_level, adaptation_level } = preferences;

    return {
      // UI complexity based on sophistication
      uiComplexity: sophistication_level === 'advanced' ? 'high' : 
                   sophistication_level === 'intermediate' ? 'medium' : 'low',
      
      // Feature discovery based on adaptation level
      progressiveDisclosure: adaptation_level === 'aggressive',
      
      // Default views based on behavior profile
      defaultContactView: behavior_profile === 'relationship-focused' ? 'trust_score' : 'name',
      defaultGoalView: behavior_profile === 'goal-focused' ? 'progress' : 'deadline',
      
      // Widget priorities
      widgetPriority: behavior_profile === 'relationship-focused' ? 
        ['trust_alerts', 'contact_insights', 'recent_activity'] :
        behavior_profile === 'goal-focused' ? 
        ['goal_progress', 'goal_deadlines', 'goal_insights'] :
        ['recent_activity', 'trust_alerts', 'goal_progress']
    };
  }, [preferences]);

  // Auto-analyze behavior when preferences change significantly
  useEffect(() => {
    if (preferences && Object.keys(preferences.feature_usage).length > 10) {
      const timer = setTimeout(() => {
        triggerBehaviorAnalysis();
      }, 30000); // 30 seconds delay

      return () => clearTimeout(timer);
    }
  }, [preferences?.feature_usage, triggerBehaviorAnalysis]);

  return {
    // Data
    preferences,
    dashboardLayout,
    isLoading: preferencesLoading || layoutLoading,
    isAnalyzing,
    
    // Actions
    recordAdaptiveBehavior,
    triggerBehaviorAnalysis,
    getContextDefaults,
    updateContextDefaults,
    getContextualSuggestions,
    getAdaptiveRecommendations,
    
    // Mutations
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending
  };
} 