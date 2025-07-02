import { useCallback } from 'react';

const STORAGE_KEY = 'rhiz-user-behavior';

export interface UserBehavior {
  searchPreferences: Record<string, number>; // e.g. { byCompany: 85, byName: 15 }
  featureUsage: Record<string, number>; // e.g. { notes: 90, tags: 30 }
  timing: string[]; // e.g. ['9am', '2pm']
}

function getInitialBehavior(): UserBehavior {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  return {
    searchPreferences: {},
    featureUsage: {},
    timing: [],
  };
}

function saveBehavior(behavior: UserBehavior) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(behavior));
}

export function useBehaviorTracking() {
  // Record a search/filter usage event
  const recordSearch = useCallback((type: string) => {
    const behavior = getInitialBehavior();
    behavior.searchPreferences[type] = (behavior.searchPreferences[type] || 0) + 1;
    saveBehavior(behavior);
  }, []);

  // Record a feature click (e.g. notes, tags, goals)
  const recordFeature = useCallback((feature: string) => {
    const behavior = getInitialBehavior();
    behavior.featureUsage[feature] = (behavior.featureUsage[feature] || 0) + 1;
    saveBehavior(behavior);
  }, []);

  // Record app open/check-in time
  const recordTiming = useCallback(() => {
    const behavior = getInitialBehavior();
    const now = new Date();
    const hour = now.getHours();
    const label = `${hour}:00`;
    if (!behavior.timing.includes(label)) {
      behavior.timing.push(label);
      if (behavior.timing.length > 10) behavior.timing.shift();
      saveBehavior(behavior);
    }
  }, []);

  // Get usage stats (percentages)
  const getSearchStats = useCallback(() => {
    const behavior = getInitialBehavior();
    const total = Object.values(behavior.searchPreferences).reduce((a, b) => a + b, 0);
    if (!total) return {};
    const stats: Record<string, number> = {};
    for (const key in behavior.searchPreferences) {
      stats[key] = Math.round((behavior.searchPreferences[key] / total) * 100);
    }
    return stats;
  }, []);

  const getFeatureStats = useCallback(() => {
    const behavior = getInitialBehavior();
    const total = Object.values(behavior.featureUsage).reduce((a, b) => a + b, 0);
    if (!total) return {};
    const stats: Record<string, number> = {};
    for (const key in behavior.featureUsage) {
      stats[key] = Math.round((behavior.featureUsage[key] / total) * 100);
    }
    return stats;
  }, []);

  return {
    recordSearch,
    recordFeature,
    recordTiming,
    getSearchStats,
    getFeatureStats,
  };
} 