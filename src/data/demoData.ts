import type { Contact } from '../types';
import { Goal, UserSettings } from '../types';

export const demoContacts: Contact[] = [
  {
    id: '1',
    user_id: 'demo-user',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp',
    title: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    notes: 'Met at React Conf 2023. Interested in frontend architecture and performance optimization.',
    tags: ['frontend', 'react', 'conference'],
    last_contact: '2024-01-15T10:30:00Z',
    trust_score: 85,
    engagement_trend: 'up',
    relationship_strength: 'strong',
    mutual_connections: 3,
    relationship_type: 'colleague',
    source: 'conference',
    enriched: true,
    created_at: '2023-12-01T09:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    user_id: 'demo-user',
    name: 'Michael Chen',
    email: 'michael.chen@startup.io',
    phone: '+1 (555) 234-5678',
    company: 'Startup.io',
    title: 'CTO & Co-founder',
    location: 'Austin, TX',
    notes: 'Former colleague from Google. Building an AI-powered SaaS platform. Great mentor for technical decisions.',
    tags: ['ai', 'startup', 'mentor', 'cto'],
    last_contact: '2024-01-10T14:00:00Z',
    trust_score: 92,
    engagement_trend: 'stable',
    relationship_strength: 'strong',
    mutual_connections: 8,
    relationship_type: 'mentor',
    source: 'previous-company',
    enriched: true,
    created_at: '2023-11-15T08:00:00Z',
    updated_at: '2024-01-10T14:00:00Z'
  },
  {
    id: '3',
    user_id: 'demo-user',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@designstudio.com',
    phone: '+1 (555) 345-6789',
    company: 'Design Studio',
    title: 'UX Design Lead',
    location: 'New York, NY',
    notes: 'Collaborated on several projects. Excellent design thinking and user research skills.',
    tags: ['ux', 'design', 'research', 'collaboration'],
    last_contact: '2024-01-08T16:30:00Z',
    trust_score: 78,
    engagement_trend: 'up',
    relationship_strength: 'medium',
    mutual_connections: 2,
    relationship_type: 'colleague',
    source: 'project',
    enriched: true,
    created_at: '2023-10-20T11:00:00Z',
    updated_at: '2024-01-08T16:30:00Z'
  },
  {
    id: '4',
    user_id: 'demo-user',
    name: 'David Kim',
    email: 'david.kim@venturecapital.com',
    phone: '+1 (555) 456-7890',
    company: 'Venture Capital Partners',
    title: 'Investment Partner',
    location: 'Seattle, WA',
    notes: 'Met at a startup pitch event. Interested in our product roadmap and growth strategy.',
    tags: ['vc', 'investment', 'startup', 'pitch'],
    last_contact: '2024-01-05T13:00:00Z',
    trust_score: 65,
    engagement_trend: 'stable',
    relationship_strength: 'weak',
    mutual_connections: 1,
    relationship_type: 'professional',
    source: 'event',
    enriched: false,
    created_at: '2023-12-15T15:00:00Z',
    updated_at: '2024-01-05T13:00:00Z'
  },
  {
    id: '5',
    user_id: 'demo-user',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@marketingagency.com',
    phone: '+1 (555) 567-8901',
    company: 'Marketing Agency',
    title: 'Digital Marketing Director',
    location: 'Los Angeles, CA',
    notes: 'Potential marketing partner for our product launch. Great track record with SaaS companies.',
    tags: ['marketing', 'saas', 'launch', 'partnership'],
    last_contact: '2024-01-12T11:00:00Z',
    trust_score: 70,
    engagement_trend: 'up',
    relationship_strength: 'medium',
    mutual_connections: 0,
    relationship_type: 'professional',
    source: 'referral',
    enriched: false,
    created_at: '2023-12-20T10:00:00Z',
    updated_at: '2024-01-12T11:00:00Z'
  },
  {
    id: '6',
    user_id: 'demo-user',
    name: 'Alex Turner',
    email: 'alex.turner@freelance.dev',
    phone: '+1 (555) 678-9012',
    company: 'Freelance Developer',
    title: 'Full-Stack Developer',
    location: 'Remote',
    notes: 'Worked together on a client project. Reliable and skilled developer. Good for future collaborations.',
    tags: ['freelance', 'fullstack', 'collaboration', 'reliable'],
    last_contact: '2024-01-03T09:00:00Z',
    trust_score: 82,
    engagement_trend: 'stable',
    relationship_strength: 'medium',
    mutual_connections: 1,
    relationship_type: 'colleague',
    source: 'project',
    enriched: false,
    created_at: '2023-11-10T14:00:00Z',
    updated_at: '2024-01-03T09:00:00Z'
  },
  {
    id: '7',
    user_id: 'demo-user',
    name: 'Rachel Green',
    email: 'rachel.green@productcompany.com',
    phone: '+1 (555) 789-0123',
    company: 'Product Company',
    title: 'Product Manager',
    location: 'Boston, MA',
    notes: 'Met at Product Hunt meetup. Shared interest in product strategy and user experience.',
    tags: ['product', 'strategy', 'meetup', 'product-hunt'],
    last_contact: '2024-01-07T15:00:00Z',
    trust_score: 75,
    engagement_trend: 'up',
    relationship_strength: 'medium',
    mutual_connections: 2,
    relationship_type: 'professional',
    source: 'meetup',
    enriched: false,
    created_at: '2023-12-05T16:00:00Z',
    updated_at: '2024-01-07T15:00:00Z'
  },
  {
    id: '8',
    user_id: 'demo-user',
    name: 'James Wilson',
    email: 'james.wilson@consulting.com',
    phone: '+1 (555) 890-1234',
    company: 'Consulting Group',
    title: 'Senior Consultant',
    location: 'Chicago, IL',
    notes: 'Business development contact. Helped with market analysis for our target segment.',
    tags: ['consulting', 'business-dev', 'market-analysis', 'strategy'],
    last_contact: '2024-01-01T12:00:00Z',
    trust_score: 68,
    engagement_trend: 'down',
    relationship_strength: 'weak',
    mutual_connections: 1,
    relationship_type: 'professional',
    source: 'referral',
    enriched: false,
    created_at: '2023-11-25T13:00:00Z',
    updated_at: '2024-01-01T12:00:00Z'
  }
];

const now = new Date();
const demoTimelineData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
  return {
    date: date.toISOString().split('T')[0],
    score: 75 + Math.floor(Math.random() * 20) - 10
  };
});

export const demoTrustMetrics = {  overallScore: 78,
  avgResponseTime: '2.3 hours',
  dormantPercentage: 0,
  securityFeatures: 7,
  privacyControls: 12,
  auditEvents: 127,
  twoFactorEnabled: false,
  backupsEnabled: true,
  privacyControlsEnabled: true,
  auditLoggingEnabled: true,
  tiers: [
    { name: 'High Trust', count: 0, percentage: 0, color: 'green' },
    { name: 'Medium Trust', count: 0, percentage: 0, color: 'yellow' },
    { name: 'Low Trust', count: 0, percentage: 0, color: 'red' }
  ],
  timelineData: demoTimelineData,
  lowTrustAlerts: [
    {
      id: 'demo-alert-1',
      contact: 'Demo User',
      reason: 'Sign in to see your actual relationship trust metrics and alerts',
      trustScore: 75,
      severity: 'low' as const,
      action: 'Sign In',
      timestamp: '1 hour ago'
    }
  ]
};export const demoDashboardData = {
  networkHealth: 87,
  totalContacts: 247,
  totalGoals: 8,
  overallTrust: 82,
  upcomingActions: [
    { id: 'action-1', title: 'Follow up with Sarah Johnson about AI partnership', due: 'Today' },
    { id: 'action-2', title: 'Schedule coffee with Michael Chen', due: 'Tomorrow' },
    { id: 'action-3', title: 'Send introduction to Emily Rodriguez & Design Studio team', due: 'This week' }
  ],
  recentActivity: [
    { id: 'activity-1', text: 'Connected with Alex Turner from freelance project', time: '2 hours ago' },
    { id: 'activity-2', text: 'Completed networking goal: "Meet 5 AI founders"', time: '1 day ago' }
  ]
};

export const demoNetworkData = {
  nodes: [],
  edges: [],
  totalConnections: 0,
  newConnections: 0,
  activeConnections: 0,
  topCompanies: [],
  topLocations: [],
  networkDensity: 0,
  diversityScore: 0
};

export const demoGoals: Goal[] = [
  {
    id: '1',
    user_id: 'demo-user',
    title: 'Launch Product Beta',
    description: 'Successfully launch our product beta with 100+ early adopters and gather feedback for iteration.',
    target_date: '2024-03-15',
    completed: false,
    priority: 'high',
    progress: 75,
    related_contacts: 3,
    category: 'Product Development',
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    user_id: 'demo-user',
    title: 'Build Advisory Board',
    description: 'Assemble a diverse advisory board of 5-7 industry experts to guide product strategy and growth.',
    target_date: '2024-04-30',
    completed: false,
    priority: 'medium',
    progress: 40,
    related_contacts: 2,
    category: 'Networking',
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-12T16:00:00Z'
  },
  {
    id: '3',
    user_id: 'demo-user',
    title: 'Secure Series A Funding',
    description: 'Raise $2M in Series A funding to scale the team and accelerate product development.',
    target_date: '2024-06-30',
    completed: false,
    priority: 'high',
    progress: 25,
    related_contacts: 1,
    category: 'Funding',
    created_at: '2024-01-10T11:00:00Z',
    updated_at: '2024-01-15T09:00:00Z'
  },
  {
    id: '4',
    user_id: 'demo-user',
    title: 'Attend 3 Industry Conferences',
    description: 'Present at and network at 3 major industry conferences to build brand awareness and connections.',
    target_date: '2024-12-31',
    completed: false,
    priority: 'medium',
    progress: 0,
    related_contacts: 0,
    category: 'Networking',
    created_at: '2024-01-15T14:00:00Z',
    updated_at: '2024-01-15T14:00:00Z'
  },
  {
    id: '5',
    user_id: 'demo-user',
    title: 'Hire Core Team',
    description: 'Build out the core team with 3 senior engineers and 1 product manager.',
    target_date: '2024-05-15',
    completed: false,
    priority: 'high',
    progress: 60,
    related_contacts: 2,
    category: 'Team Building',
    created_at: '2024-01-08T13:00:00Z',
    updated_at: '2024-01-14T17:00:00Z'
  },
  {
    id: '6',
    user_id: 'demo-user',
    title: 'Complete MVP Development',
    description: 'Finish the minimum viable product with core features and begin user testing.',
    target_date: '2024-02-28',
    completed: true,
    priority: 'high',
    progress: 100,
    related_contacts: 4,
    category: 'Product Development',
    created_at: '2023-12-01T08:00:00Z',
    updated_at: '2024-01-10T15:00:00Z'
  }
];

export const demoUserSettings: UserSettings = {
  user_id: 'demo-user',
  profile: {
    displayName: 'Demo User',
    email: 'demo@rhiz.com',
    bio: 'Building the future of relationship management with AI-powered insights.',
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

export const demoUserStats = {
  accountAge: '3 months',
  totalContacts: demoContacts.length,
  goalsCompleted: demoGoals.filter(g => g.completed).length,
  networkGrowth: '+23%',
  dataSize: '2.4 MB',
  lastBackup: '2 hours ago',
  loginSessions: 3,
  dataExports: 2,
  securityScore: 85
};

export const demoActivities = [
  {
    id: '1',
    user_id: 'demo-user',
    activity_type: 'contact_added',
    description: 'Added Sarah Johnson to contacts',
    metadata: { contact_id: '1', source: 'conference' },
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    user_id: 'demo-user',
    activity_type: 'goal_updated',
    description: 'Updated progress on "Launch Product Beta" to 75%',
    metadata: { goal_id: '1', previous_progress: 60, new_progress: 75 },
    created_at: '2024-01-15T14:30:00Z'
  },
  {
    id: '3',
    user_id: 'demo-user',
    activity_type: 'contact_interaction',
    description: 'Had coffee meeting with Michael Chen',
    metadata: { contact_id: '2', interaction_type: 'meeting', duration: 60 },
    created_at: '2024-01-10T14:00:00Z'
  },
  {
    id: '4',
    user_id: 'demo-user',
    activity_type: 'goal_completed',
    description: 'Completed goal: "Complete MVP Development"',
    metadata: { goal_id: '6' },
    created_at: '2024-01-10T15:00:00Z'
  },
  {
    id: '5',
    user_id: 'demo-user',
    activity_type: 'contact_enriched',
    description: 'Enriched contact data for Emily Rodriguez',
    metadata: { contact_id: '3', enrichment_source: 'linkedin' },
    created_at: '2024-01-08T16:30:00Z'
  }
];

// Helper function to get demo data by type
export const getDemoData = (type: 'contacts' | 'goals' | 'settings' | 'stats' | 'activities') => {
  switch (type) {
    case 'contacts':
      return demoContacts;
    case 'goals':
      return demoGoals;
    case 'settings':
      return demoUserSettings;
    case 'stats':
      return demoUserStats;
    case 'activities':
      return demoActivities;
    default:
      return null;
  }
};

// Helper function to get a specific demo item by ID
export const getDemoItem = (type: 'contacts' | 'goals', id: string) => {
  const data = getDemoData(type);
  if (Array.isArray(data)) {
    return data.find(item => item.id === id);
  }
  return null;
};
