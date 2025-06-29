export const getTrustMetrics = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    overallScore: 85,
    securityFeatures: 5,
    privacyControls: 8,
    auditEvents: 127,
    twoFactorEnabled: false,
    backupsEnabled: true,
    privacyControlsEnabled: true,
    auditLoggingEnabled: true
  };
};