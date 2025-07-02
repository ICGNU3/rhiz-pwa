// Centralized type definitions
export interface User {
  id: string;
  email: string;
  name: string;
  user_metadata?: any;
}

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  title: string;
  avatar?: string;
  location?: string;
  notes?: string;
  tags: string[];
  last_contact?: string;
  trust_score?: number;
  healthScore?: number;
  engagement_trend?: 'up' | 'down' | 'stable';
  relationship_strength?: 'strong' | 'medium' | 'weak';
  mutual_connections?: number;
  relationship_type?: string;
  source?: string;
  enriched?: boolean;
  created_at?: string;
  updated_at?: string;
  lastContacted?: Date;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  progress?: number;
  related_contacts?: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

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
    x: boolean;
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
    apiKey?: string;
  };
  userType?: 'founder' | 'nonprofit' | 'consultant' | 'other';
  created_at?: string;
  updated_at?: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  company: string;
  title: string;
  trustScore: number;
  relationshipStrength: 'strong' | 'medium' | 'weak';
  category: string;
  x?: number;
  y?: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  strength: number;
  type: 'direct' | 'mutual' | 'introduction';
}

export interface ChatMessage {
  id: string;
  query: string;
  response?: string;
  is_ai_response: boolean;
  confidence?: number;
  timestamp: string;
  suggestions?: string[];
}

export interface RelationshipAlert {
  type: 'opportunity' | 'risk' | 'milestone';
  contact: string;
  message: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  timestamp?: string;
  category?: string;
}

export interface TrustAlert {
  id: string;
  contact: string;
  reason: string;
  trustScore: number;
  severity: 'high' | 'medium' | 'low';
  action: string;
  timestamp: string;
}

export interface ImportResult {
  success: number;
  errors: string[];
  data: any[];
  duplicates: number;
  enriched: number;
}

export interface ImportStats {
  totalProcessed: number;
  newContacts: number;
  duplicatesFound: number;
  dataEnriched: number;
  trustScoresCalculated: number;
}