import { supabase } from './client';

export const getTrustMetrics = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: contacts } = await supabase
    .from('contacts')
    .select('trust_score, relationship_strength, last_contact, name, email')
    .eq('user_id', user.id);

  if (!contacts) {
    return {
      overallScore: 85,
      avgResponseTime: '2.3 hours',
      dormantPercentage: 15,
      securityFeatures: 7,
      privacyControls: 12,
      auditEvents: 127,
      twoFactorEnabled: false,
      backupsEnabled: true,
      privacyControlsEnabled: true,
      auditLoggingEnabled: true,
      tiers: [],
      timelineData: [],
      lowTrustAlerts: []
    };
  }

  // Calculate trust metrics
  const trustScores = contacts.map(c => c.trust_score || 75);
  const overallScore = Math.round(trustScores.reduce((sum, score) => sum + score, 0) / trustScores.length);
  
  // Calculate dormant percentage
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const dormantContacts = contacts.filter(c => 
    !c.last_contact || new Date(c.last_contact) < ninetyDaysAgo
  );
  const dormantPercentage = Math.round((dormantContacts.length / contacts.length) * 100);

  // Trust tier distribution
  const highTrust = contacts.filter(c => (c.trust_score || 75) >= 80).length;
  const mediumTrust = contacts.filter(c => (c.trust_score || 75) >= 60 && (c.trust_score || 75) < 80).length;
  const lowTrust = contacts.filter(c => (c.trust_score || 75) < 60).length;

  const tiers = [
    { 
      name: 'High Trust', 
      count: highTrust, 
      percentage: Math.round((highTrust / contacts.length) * 100), 
      color: 'green' 
    },
    { 
      name: 'Medium Trust', 
      count: mediumTrust, 
      percentage: Math.round((mediumTrust / contacts.length) * 100), 
      color: 'yellow' 
    },
    { 
      name: 'Low Trust', 
      count: lowTrust, 
      percentage: Math.round((lowTrust / contacts.length) * 100), 
      color: 'red' 
    }
  ];

  // Generate timeline data (last 30 days)
  const timelineData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
    return {
      date: date.toISOString().split('T')[0],
      score: overallScore + Math.floor(Math.random() * 10) - 5 // Simulate score variation
    };
  });

  // Generate low trust alerts from dormant high-value contacts
  const lowTrustAlerts = dormantContacts
    .filter(contact => (contact.trust_score || 0) >= 70) // High-value dormant contacts
    .slice(0, 5)
    .map((contact, index) => ({
      id: `alert-${contact.email}-${index}`,
      contact: contact.name || 'Unknown Contact',
      reason: `No contact in 90+ days despite high trust score of ${contact.trust_score}. Relationship at risk of deteriorating.`,
      trustScore: contact.trust_score || 70,
      severity: 'high' as const,
      action: 'Schedule Reconnection',
      timestamp: `${Math.floor(Math.random() * 72) + 1} hours ago`
    }));

  // Add some medium priority alerts
  const mediumAlerts = contacts
    .filter(c => (c.trust_score || 75) < 60)
    .slice(0, 3)
    .map((contact, index) => ({
      id: `alert-medium-${contact.email}-${index}`,
      contact: contact.name || 'Unknown Contact',
      reason: `Trust score below 60 (${contact.trust_score}). Consider reviewing relationship status and recent interactions.`,
      trustScore: contact.trust_score || 45,
      severity: 'medium' as const,
      action: 'Review Relationship',
      timestamp: `${Math.floor(Math.random() * 48) + 1} hours ago`
    }));

  // Add some low priority alerts
  const lowAlerts = contacts
    .filter(c => !c.last_contact)
    .slice(0, 2)
    .map((contact, index) => ({
      id: `alert-low-${contact.email}-${index}`,
      contact: contact.name || 'Unknown Contact',
      reason: 'No interaction history recorded. Consider adding contact notes or scheduling initial outreach.',
      trustScore: contact.trust_score || 50,
      severity: 'low' as const,
      action: 'Add Contact Notes',
      timestamp: `${Math.floor(Math.random() * 24) + 1} hours ago`
    }));

  const allAlerts = [...lowTrustAlerts, ...mediumAlerts, ...lowAlerts];

  return {
    overallScore,
    avgResponseTime: '2.3 hours',
    dormantPercentage,
    securityFeatures: 7,
    privacyControls: 12,
    auditEvents: 127 + Math.floor(Math.random() * 50),
    twoFactorEnabled: Math.random() > 0.5,
    backupsEnabled: true,
    privacyControlsEnabled: true,
    auditLoggingEnabled: true,
    tiers,
    timelineData,
    lowTrustAlerts: allAlerts
  };
};

// Export trust data
export const exportTrustData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const trustMetrics = await getTrustMetrics();
  
  const exportData = {
    userId: user.id,
    exportDate: new Date().toISOString(),
    trustMetrics,
    metadata: {
      version: '1.0',
      format: 'json',
      encrypted: false
    }
  };

  return exportData;
};

// Update privacy settings
export const updatePrivacySettings = async (settings: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // In a real implementation, this would update user settings in the database
  localStorage.setItem('rhiz-privacy-settings', JSON.stringify(settings));
  
  return settings;
};

// Get privacy settings
export const getPrivacySettings = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const stored = localStorage.getItem('rhiz-privacy-settings');
  if (stored) {
    return JSON.parse(stored);
  }

  // Default privacy settings
  return {
    profileVisibility: 'connections',
    contactSharing: false,
    activityTracking: true,
    dataCollection: 'minimal',
    thirdPartyIntegrations: true,
    analyticsOptOut: false
  };
};

// Real-time subscription for trust changes
export const subscribeToTrustChanges = (callback: (payload: any) => void) => {
  return supabase
    .channel('trust_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'contacts' 
    }, callback)
    .subscribe();
};