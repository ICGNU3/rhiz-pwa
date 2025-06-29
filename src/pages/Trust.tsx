import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Check, X, AlertTriangle, Lock, Eye, EyeOff, Key, Download, Trash2, Settings } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import { getTrustMetrics } from '../api/trust';

const Trust: React.FC = () => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'connections',
    contactSharing: false,
    activityTracking: true,
    dataCollection: 'minimal',
    thirdPartyIntegrations: true
  });
  
  const { data: trustData, isLoading, error, refetch } = useQuery({
    queryKey: ['trust-metrics'],
    queryFn: getTrustMetrics,
  });

  const queryClient = useQueryClient();

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: typeof privacySettings) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('rhiz-privacy-settings', JSON.stringify(settings));
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trust-metrics'] });
    },
  });

  const handlePrivacyChange = (key: string, value: any) => {
    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trust & Privacy</h1>
        </div>
        <ErrorBorder 
          message="Failed to load trust metrics. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const trustScore = trustData?.overallScore || 85;
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const securityChecks = [
    { 
      label: 'End-to-End Encryption', 
      status: true,
      description: 'All relationship data encrypted with your personal key',
      critical: true
    },
    { 
      label: 'Two-Factor Authentication', 
      status: trustData?.twoFactorEnabled || false,
      description: 'Additional security layer for account access',
      critical: true
    },
    { 
      label: 'Zero-Knowledge Architecture', 
      status: true,
      description: 'Rhiz cannot access your decrypted relationship data',
      critical: true
    },
    { 
      label: 'Regular Security Audits', 
      status: true,
      description: 'Third-party security assessments every quarter',
      critical: false
    },
    { 
      label: 'Automated Backups', 
      status: trustData?.backupsEnabled || true,
      description: 'Encrypted daily backups of your data',
      critical: false
    },
    { 
      label: 'Privacy Controls', 
      status: trustData?.privacyControlsEnabled || true,
      description: 'Granular control over data sharing and visibility',
      critical: false
    },
    { 
      label: 'Audit Logging', 
      status: trustData?.auditLoggingEnabled || true,
      description: 'Complete log of data access and changes',
      critical: false
    }
  ];

  const dataCategories = [
    {
      name: 'Contact Information',
      description: 'Names, emails, phone numbers, companies',
      encrypted: true,
      shared: false,
      retention: '2 years after last activity'
    },
    {
      name: 'Interaction History',
      description: 'Communication logs, meeting notes, relationship timeline',
      encrypted: true,
      shared: false,
      retention: '5 years or until deletion request'
    },
    {
      name: 'Trust Scores',
      description: 'Relationship strength metrics and engagement data',
      encrypted: true,
      shared: false,
      retention: 'Calculated in real-time, not stored'
    },
    {
      name: 'Usage Analytics',
      description: 'App usage patterns for feature improvement',
      encrypted: true,
      shared: true,
      retention: '1 year, anonymized after 30 days'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trust & Privacy</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your relationship data is protected by enterprise-grade security and privacy-first design.
        </p>
      </div>

      {/* Trust Score Overview */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Privacy Trust Score
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your overall data security and privacy rating
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(trustScore)}`}>
                {trustScore}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                out of 100
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full max-w-md mx-auto">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${trustScore >= 90 ? 'bg-green-600' : trustScore >= 80 ? 'bg-blue-600' : trustScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'}`}
                  style={{ width: `${trustScore}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {trustData?.securityFeatures || 7}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Security Features
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {trustData?.privacyControls || 12}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Privacy Controls
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {trustData?.auditEvents || 247}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Security Events
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Data Breaches
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Checklist */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Security & Encryption Status
          </h3>
          <div className="space-y-4">
            {securityChecks.map((check, index) => (
              <div key={index} className={`flex items-start space-x-3 p-4 rounded-lg border ${
                check.critical 
                  ? check.status 
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700'
              }`}>
                <div className={`p-1 rounded-full ${check.status ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                  {check.status ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {check.label}
                      {check.critical && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full">
                          Critical
                        </span>
                      )}
                    </h4>
                    <span className={`text-sm font-medium ${check.status ? 'text-green-600' : 'text-red-600'}`}>
                      {check.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {check.description}
                  </p>
                  {!check.status && (
                    <Button variant="outline" size="sm" className="mt-2">
                      Enable Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Privacy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Privacy Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Profile Visibility
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Who can see your profile information
                  </p>
                </div>
                <select 
                  value={privacySettings.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="private">Private</option>
                  <option value="connections">Connections Only</option>
                  <option value="network">Extended Network</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Contact Data Sharing
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Allow mutual connections to see shared contacts
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.contactSharing}
                    onChange={(e) => handlePrivacyChange('contactSharing', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Activity Tracking
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track interactions for relationship insights
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.activityTracking}
                    onChange={(e) => handlePrivacyChange('activityTracking', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Data Collection Level
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    How much data to collect for AI insights
                  </p>
                </div>
                <select 
                  value={privacySettings.dataCollection}
                  onChange={(e) => handlePrivacyChange('dataCollection', e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="minimal">Minimal</option>
                  <option value="standard">Standard</option>
                  <option value="enhanced">Enhanced</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Third-party Integrations
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Allow connections to external services
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacySettings.thirdPartyIntegrations}
                    onChange={(e) => handlePrivacyChange('thirdPartyIntegrations', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data Management
            </h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" icon={Download}>
                Export All Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start" icon={Key}>
                Manage Encryption Keys
              </Button>
              
              <Button variant="outline" className="w-full justify-start" icon={Settings}>
                Advanced Privacy Settings
              </Button>

              <Button variant="outline" className="w-full justify-start" icon={AlertTriangle}>
                Report Security Issue
              </Button>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Danger Zone
                </h4>
                <Button variant="danger" size="sm" icon={Trash2}>
                  Delete All Data
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  This action cannot be undone. All your relationship data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Categories */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data Categories & Retention
          </h3>
          <div className="space-y-4">
            {dataCategories.map((category, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h4>
                  <div className="flex space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.encrypted 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {category.encrypted ? 'Encrypted' : 'Not Encrypted'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.shared 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {category.shared ? 'Shared' : 'Private'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {category.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Retention: {category.retention}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Compliance Information */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Compliance & Certifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'GDPR', status: 'Compliant', color: 'green' },
              { name: 'CCPA', status: 'Compliant', color: 'green' },
              { name: 'SOC 2', status: 'Type II', color: 'blue' },
              { name: 'ISO 27001', status: 'Certified', color: 'purple' }
            ].map((cert, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="font-medium text-gray-900 dark:text-white">{cert.name}</div>
                <div className={`text-sm ${
                  cert.color === 'green' ? 'text-green-600' :
                  cert.color === 'blue' ? 'text-blue-600' :
                  'text-purple-600'
                }`}>
                  {cert.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Trust;