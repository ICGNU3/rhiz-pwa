export const getTrustMetrics = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    overallScore: 85,
    avgResponseTime: '2.3 hours',
    dormantPercentage: 15,
    securityFeatures: 5,
    privacyControls: 8,
    auditEvents: 127,
    twoFactorEnabled: false,
    backupsEnabled: true,
    privacyControlsEnabled: true,
    auditLoggingEnabled: true,
    tiers: [
      { name: 'High Trust', count: 45, percentage: 65, color: 'green' },
      { name: 'Medium Trust', count: 18, percentage: 26, color: 'yellow' },
      { name: 'Low Trust', count: 6, percentage: 9, color: 'red' }
    ],
    timelineData: [
      { date: '2025-01-01', score: 78 },
      { date: '2025-01-05', score: 82 },
      { date: '2025-01-10', score: 85 },
      { date: '2025-01-15', score: 83 },
      { date: '2025-01-20', score: 87 },
      { date: '2025-01-25', score: 85 }
    ],
    lowTrustAlerts: [
      {
        id: '1',
        contact: 'Michael Rodriguez',
        reason: 'No response to last 3 messages over 30 days',
        trustScore: 45,
        severity: 'high',
        action: 'Review relationship status',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        contact: 'Lisa Wang',
        reason: 'Missed 2 scheduled calls without notice',
        trustScore: 52,
        severity: 'medium',
        action: 'Schedule follow-up conversation',
        timestamp: '1 day ago'
      },
      {
        id: '3',
        contact: 'David Kim',
        reason: 'Inconsistent communication patterns detected',
        trustScore: 38,
        severity: 'high',
        action: 'Reassess relationship value',
        timestamp: '3 hours ago'
      }
    ]
  };
};