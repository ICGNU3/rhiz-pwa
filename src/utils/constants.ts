// Application constants
export const APP_CONFIG = {
  name: 'Rhiz',
  description: 'Intelligent Relationship Engine',
  version: '1.0.0',
  author: 'Rhiz Team'
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  OFFLINE: '/offline',
  APP: {
    BASE: '/app',
    DASHBOARD: '/app/dashboard',
    GOALS: '/app/goals',
    CONTACTS: '/app/contacts',
    IMPORT: '/app/import',
    INTELLIGENCE: '/app/intelligence',
    NETWORK: '/app/network',
    TRUST: '/app/trust',
    SETTINGS: '/app/settings'
  }
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'rhiz-auth-token',
  USER_DATA: 'rhiz-user-data',
  CONTACTS: 'rhiz-contacts',
  GOALS: 'rhiz-goals',
  SETTINGS: 'rhiz-user-settings',
  PRIVACY_SETTINGS: 'rhiz-privacy-settings'
} as const;

export const QUERY_KEYS = {
  CONTACTS: ['contacts'],
  GOALS: ['goals'],
  DASHBOARD_STATS: ['dashboard-stats'],
  INTELLIGENCE_INSIGHTS: ['intelligence-insights'],
  NETWORK_INSIGHTS: ['network-insights'],
  NETWORK_DATA: ['network-data'],
  TRUST_METRICS: ['trust-metrics'],
  USER_STATS: ['user-stats'],
  CHAT_HISTORY: ['chat-history'],
  USER_SETTINGS: ['user-settings']
} as const;

export const RELATIONSHIP_TYPES = [
  'colleague',
  'friend', 
  'client',
  'partner',
  'investor',
  'mentor'
] as const;

export const PRIORITY_LEVELS = ['low', 'medium', 'high'] as const;

export const GOAL_CATEGORIES = [
  'Networking',
  'Fundraising', 
  'Hiring',
  'Partnerships',
  'Growth'
] as const;

export const TRUST_SCORE_RANGES = {
  HIGH: { min: 80, max: 100, color: 'green' },
  MEDIUM: { min: 60, max: 79, color: 'yellow' },
  LOW: { min: 0, max: 59, color: 'red' }
} as const;

export const ENGAGEMENT_TRENDS = ['up', 'down', 'stable'] as const;

export const RELATIONSHIP_STRENGTHS = ['strong', 'medium', 'weak'] as const;