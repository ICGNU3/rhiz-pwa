import { useMemo } from 'react';
import { demoUserSettings } from '../data/demoData';
import { useBehaviorTracking } from './useBehaviorTracking';

export function useContextualSuggestions(context: string) {
  const { getSearchStats, getFeatureStats } = useBehaviorTracking();
  const userType = demoUserSettings.userType;
  const searchStats = getSearchStats();
  const featureStats = getFeatureStats();

  // Demo logic for suggestions
  const suggestions = useMemo(() => {
    const s: string[] = [];
    if (context === 'contacts') {
      if (userType === 'founder') s.push('Try tagging your investors for quick follow-up.');
      if (userType === 'nonprofit') s.push('Segment contacts by donation history.');
      if (userType === 'consultant') s.push('Use notes to track client meeting outcomes.');
      if ((searchStats.byCompany || 0) > 50) s.push('You often search by company—try bulk actions for company-wide updates.');
      if ((featureStats.notes || 0) > 50) s.push('You use notes a lot—set up note templates for faster entry.');
    }
    if (context === 'dashboard') {
      if (userType === 'founder') s.push('Monitor your strongest relationships for fundraising.');
      if (userType === 'nonprofit') s.push('Check engagement trends to plan your next campaign.');
      if (userType === 'consultant') s.push('Review trust scores to identify at-risk clients.');
    }
    return s;
  }, [userType, context, searchStats, featureStats]);

  // Demo smart defaults
  const smartDefaults = useMemo(() => {
    if (context === 'contacts') {
      if (userType === 'founder') return { tag: 'investor' };
      if (userType === 'nonprofit') return { tag: 'donor' };
      if (userType === 'consultant') return { tag: 'client' };
    }
    if (context === 'goals') {
      if (userType === 'founder') return { category: 'fundraising', priority: 'high' };
      if (userType === 'nonprofit') return { category: 'campaign', priority: 'medium' };
      if (userType === 'consultant') return { category: 'client success', priority: 'high' };
    }
    return {};
  }, [userType, context]);

  return { suggestions, smartDefaults };
} 