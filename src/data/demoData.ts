import type { Contact } from '../types';
import type { DashboardData } from '../api/dashboard';

export const demoContacts: Contact[] = [
  {
    id: 'demo-contact-1',
    user_id: 'demo',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    company: 'TechCorp AI',
    title: 'VP of Engineering',
    phone: '+1-555-0123',    location: 'San Francisco, CA',
    relationship_type: 'colleague',
    relationship_strength: 'strong',
    trust_score: 88,
    engagement_trend: 'up',    mutual_connections: 12,
    last_contact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    notes: 'Met at AI conference. Very knowledgeable about ML infrastructure. Recently joined Stanford AI committee.',    tags: ['AI', 'Engineering', 'Stanford'],
    source: 'conference',
    enriched: true,    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-contact-2',
    user_id: 'demo',
    name: 'Michael Rodriguez',
    email: 'michael@startupfund.vc',
    company: 'Startup Fund',
    title: 'Partner',
    phone: '+1-555-0456',
    location: 'New York, NY',
    relationship_type: 'partner',
    relationship_strength: 'medium',
    trust_score: 76,
    engagement_trend: 'down',
    mutual_connections: 8,
    last_contact: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    notes: 'Early stage investor focused on B2B SaaS. Invested in 3 companies in our space. Worth following up.',
    tags: ['Investor', 'B2B', 'SaaS'],
    source: 'linkedin',
    enriched: true,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-contact-3',
    user_id: 'demo',
    name: 'Emma Wilson',
    email: 'emma.wilson@designstudio.co',
    company: 'Design Studio',
    title: 'Creative Director',
    phone: '+1-555-0789',
    location: 'Austin, TX',
    relationship_type: 'client',
    relationship_strength: 'strong',
    trust_score: 92,
    engagement_trend: 'stable',
    mutual_connections: 6,
    last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    notes: 'Fantastic design partner. Recently promoted to Creative Director. Great person to collaborate with on UX projects.',
    tags: ['Design', 'UX', 'Creative'],    source: 'referral',
    enriched: true,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    updated_at: new Date().toISOString()
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
};export const demoDashboardData: DashboardData = {
  networkHealth: 87,
  totalContacts: 247,
  totalGoals: 8,
  overallTrust: 82,
  upcomingActions: [
    { id: 'action-1', title: 'Follow up with Sarah Chen about AI partnership', due: 'Today' },
    { id: 'action-2', title: 'Schedule coffee with Michael Rodriguez', due: 'Tomorrow' },
    { id: 'action-3', title: 'Send introduction to Emma Wilson & TechCorp team', due: 'This week' }
  ],
  recentActivity: [
    { id: 'activity-1', text: 'Connected with Alex Thompson from YC Demo Day', time: '2 hours ago' },
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
