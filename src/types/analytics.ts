// Analytics types for Rhiz PWA

export interface AnalyticsOverview {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  dateRange: {
    start: Date;
    end: Date;
  };
  summary: {
    totalContacts: number;
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    totalActivities: number;
    teamCollaboration: number;
  };
  trends: {
    contactsGrowth: number;
    goalsProgress: number;
    activityIncrease: number;
    engagementRate: number;
  };
}

export interface ContactAnalytics {
  total: number;
  added: number;
  updated: number;
  shared: number;
  bySource: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  byCompany: Array<{
    company: string;
    count: number;
    percentage: number;
  }>;
  byTrustLevel: Array<{
    level: 'high' | 'medium' | 'low';
    count: number;
    percentage: number;
  }>;
  growth: Array<{
    date: string;
    count: number;
  }>;
  topContacts: Array<{
    id: string;
    name: string;
    company: string;
    trustScore: number;
    lastContact: Date;
    interactions: number;
  }>;
}

export interface GoalAnalytics {
  total: number;
  active: number;
  completed: number;
  overdue: number;
  progress: number;
  byCategory: Array<{
    category: string;
    count: number;
    completed: number;
    progress: number;
  }>;
  byPriority: Array<{
    priority: 'high' | 'medium' | 'low';
    count: number;
    completed: number;
    progress: number;
  }>;
  byStatus: Array<{
    status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
    count: number;
    percentage: number;
  }>;
  completionRate: Array<{
    date: string;
    completed: number;
    total: number;
    rate: number;
  }>;
  topGoals: Array<{
    id: string;
    title: string;
    category: string;
    progress: number;
    dueDate: Date;
    priority: string;
  }>;
}

export interface ActivityAnalytics {
  total: number;
  byType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  byUser: Array<{
    userId: string;
    userName: string;
    count: number;
    percentage: number;
  }>;
  byTime: Array<{
    hour: number;
    count: number;
  }>;
  byDay: Array<{
    day: string;
    count: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    userId: string;
    userName: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }>;
}

export interface NetworkAnalytics {
  totalConnections: number;
  averageTrustScore: number;
  networkDensity: number;
  byTrustLevel: Array<{
    level: 'high' | 'medium' | 'low';
    count: number;
    percentage: number;
  }>;
  byCompany: Array<{
    company: string;
    connections: number;
    averageTrust: number;
  }>;
  topConnectors: Array<{
    userId: string;
    userName: string;
    connections: number;
    averageTrust: number;
  }>;
  relationshipStrength: Array<{
    strength: 'strong' | 'moderate' | 'weak';
    count: number;
    percentage: number;
  }>;
}

export interface TeamAnalytics {
  memberCount: number;
  activeMembers: number;
  averageResponseTime: string;
  collaborationScore: number;
  byRole: Array<{
    role: string;
    count: number;
    activity: number;
  }>;
  byActivity: Array<{
    userId: string;
    userName: string;
    actions: number;
    lastActive: Date;
  }>;
  sharedResources: Array<{
    type: 'contact' | 'goal';
    count: number;
    sharedBy: string[];
  }>;
  teamPerformance: Array<{
    metric: string;
    value: number;
    target: number;
    percentage: number;
  }>;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  errorRate: number;
  uptime: number;
  userSessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
}

export interface UserEngagement {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  retentionRate: {
    day1: number;
    day7: number;
    day30: number;
  };
  featureUsage: Array<{
    feature: string;
    usage: number;
    percentage: number;
  }>;
  userJourney: Array<{
    step: string;
    users: number;
    dropoff: number;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf' | 'xlsx';
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  includeMetadata?: boolean;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  type: 'overview' | 'contacts' | 'goals' | 'activity' | 'network' | 'team' | 'custom';
  data: any;
  generatedAt: Date;
  period: string;
  filters?: Record<string, any>;
}

// API response types
export interface GetAnalyticsRequest {
  type: 'overview' | 'contacts' | 'goals' | 'activity' | 'network' | 'team';
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  teamId?: string;
}

export interface ExportAnalyticsRequest {
  type: 'contacts' | 'goals' | 'activity' | 'network' | 'team';
  format: 'csv' | 'json' | 'pdf' | 'xlsx';
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  teamId?: string;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface TimeSeriesData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: Array<{
      x: string;
      y: number;
    }>;
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }>;
}

// Dashboard widget types
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'list';
  title: string;
  data: any;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  refreshInterval?: number;
  lastUpdated: Date;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
} 