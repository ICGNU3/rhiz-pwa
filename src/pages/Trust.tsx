import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Check, X, AlertTriangle, Lock, Eye, EyeOff, Key, Download, Trash2, Settings, TrendingUp, Users, Clock, Filter, BarChart3, Zap } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import TrustChart from '../components/trust/TrustChart';
import TrustAlert from '../components/trust/TrustAlert';
import { getTrustMetrics } from '../api/trust';

const Trust: React.FC = () => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [selectedTier, setSelectedTier] = useState('all');
  const [alertFilter, setAlertFilter] = useState('all');
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'connections',
    contactSharing: false,
    activityTracking: true,
    dataCollection: 'minimal',
    thirdPartyIntegrations: true,
    analyticsOptOut: false
  });
  
  const queryClient = useQueryClient();

  // Fetch trust metrics with React Query
  const { data: trustData, isLoading, error, refetch } = useQuery({
    queryKey: ['trust-metrics'],
    queryFn: getTrustMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Privacy settings mutation
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

  // Export data mutation
  const exportDataMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = {
        trustMetrics: trustData,
        privacySettings,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rhiz-trust-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });

  const handlePrivacyChange = (key: string, value: any) => {
    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  const handleTrustAlertAction = (alertId: string, action: string) => {
    console.log(`Action ${action} for alert ${alertId}`);
    // Handle alert actions here
    if (action === 'dismiss') {
      // Remove alert from list
      queryClient.setQueryData(['trust-metrics'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          lowTrustAlerts: oldData.lowTrustAlerts.filter((alert: any) => alert.id !== alertId)
        };
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading trust metrics...</p>
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

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 80) return 'from-blue-500 to-indigo-600';
    if (score >= 70) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  // Filter alerts based on selected criteria
  const filteredAlerts = (trustData?.lowTrustAlerts || []).filter(alert => {
    if (selectedTier === 'all' && alertFilter === 'all') return true;
    if (selectedTier !== 'all' && alert.severity !== selectedTier) return false;
    if (alertFilter !== 'all' && alertFilter !== alert.severity) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trust & Privacy Intelligence
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Advanced relationship trust scoring with enterprise-grade privacy protection
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              icon={BarChart3}
              className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50"
            >
              Analytics
            </Button>
            <Button 
              variant="outline" 
              icon={Settings}
              className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50"
            >
              Privacy Settings
            </Button>
            <Button 
              icon={Shield} 
              onClick={() => refetch()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
            >
              Security Audit
            </Button>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Trust Score */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50" hover>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Overall Trust Score
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Network relationship health
                </p>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(trustScore)}`}>
                {trustScore}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                out of 100
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full max-w-md mx-auto overflow-hidden">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 bg-gradient-to-r ${getScoreBgColor(trustScore)}`}
                  style={{ width: `${trustScore}%` }}
                >
                  <div className="h-full bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {trustData?.securityFeatures || 7}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Security Features
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {trustData?.privacyControls || 12}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Privacy Controls
                </div>
              </div>
            </div>

            {/* Security Status Indicators */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Two-Factor Auth</span>
                <div className="flex items-center space-x-2">
                  {trustData?.twoFactorEnabled ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={trustData?.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}>
                    {trustData?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Data Backups</span>
                <div className="flex items-center space-x-2">
                  {trustData?.backupsEnabled ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={trustData?.backupsEnabled ? 'text-green-600' : 'text-red-600'}>
                    {trustData?.backupsEnabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Average Response Time */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50" hover>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Avg Response Time
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Network responsiveness
                </p>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {trustData?.avgResponseTime || '2.3h'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Average response time
              </div>
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">15% faster</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {"Immediate (< 1h)"}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">45%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {"Same day (< 24h)"}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">35%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '35%' }}></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {"Delayed (> 24h)"}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">20%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </Card>

          {/* Dormant Contacts */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50" hover>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Dormant Contacts
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Inactive relationships
                </p>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {trustData?.dormantPercentage || 15}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                No contact in 90+ days
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-1000"
                  style={{ width: `${trustData?.dormantPercentage || 15}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">At Risk (60-90 days)</span>
                <span className="font-medium text-yellow-600">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Dormant (90+ days)</span>
                <span className="font-medium text-red-600">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Recently Active</span>
                <span className="font-medium text-green-600">
                  {100 - (trustData?.dormantPercentage || 15)}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Trust Tier Distribution with Filters */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trust Tier Distribution
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Tiers</option>
                  <option value="high">High Trust</option>
                  <option value="medium">Medium Trust</option>
                  <option value="low">Low Trust</option>
                </select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                icon={showSensitiveData ? EyeOff : Eye}
              >
                {showSensitiveData ? 'Hide' : 'Show'} Details
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trustData?.tiers?.map((tier, index) => (
              <button
                key={index}
                onClick={() => setSelectedTier(tier.name.toLowerCase().split(' ')[0])}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${
                  selectedTier === tier.name.toLowerCase().split(' ')[0] || selectedTier === 'all'
                    ? `border-${tier.color}-300 bg-${tier.color}-50 dark:bg-${tier.color}-900/20 shadow-md`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-semibold text-${tier.color}-800 dark:text-${tier.color}-400`}>
                    {tier.name}
                  </h4>
                  <span className={`text-3xl font-bold text-${tier.color}-600`}>
                    {tier.count}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Percentage</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {tier.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className={`h-2 bg-${tier.color}-500 rounded-full transition-all duration-1000`}
                      style={{ width: `${tier.percentage}%` }}
                    ></div>
                  </div>
                  {showSensitiveData && (
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <p>Avg response: {tier.name === 'High Trust' ? '1.2h' : tier.name === 'Medium Trust' ? '4.5h' : '12h'}</p>
                      <p>Last contact: {tier.name === 'High Trust' ? '3 days' : tier.name === 'Medium Trust' ? '2 weeks' : '2 months'}</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Trust Timeline Chart */}
        <TrustChart 
          data={trustData?.timelineData || []} 
          className="bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50"
        />

        {/* Trust Alerts with Enhanced Filtering */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Trust Alerts & Risk Assessment
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Relationships requiring attention ({filteredAlerts.length} alerts)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Alerts</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <Button variant="ghost" size="sm" icon={Settings}>
                  Alert Settings
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <TrustAlert
                    key={alert.id}
                    alert={alert}
                    onAction={handleTrustAlertAction}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    All relationships healthy
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No trust alerts detected. Your network relationships are performing well.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Privacy Controls and Data Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Privacy Controls
            </h3>
            <div className="space-y-6">
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
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="private">Private</option>
                  <option value="connections">Connections Only</option>
                  <option value="network">Extended Network</option>
                  <option value="public">Public</option>
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
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.contactSharing}
                    onChange={(e) => handlePrivacyChange('contactSharing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
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
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.activityTracking}
                    onChange={(e) => handlePrivacyChange('activityTracking', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Third-party Integrations
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Allow data sharing with connected services
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings.thirdPartyIntegrations}
                    onChange={(e) => handlePrivacyChange('thirdPartyIntegrations', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {updateSettingsMutation.isPending && (
                <div className="flex items-center space-x-2 text-sm text-indigo-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span>Updating privacy settings...</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Data Management & Security
            </h3>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                icon={Download}
                onClick={() => exportDataMutation.mutate()}
                loading={exportDataMutation.isPending}
              >
                Export Trust Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start" icon={Key}>
                Manage Encryption Keys
              </Button>
              
              <Button variant="outline" className="w-full justify-start" icon={Lock}>
                Two-Factor Authentication
              </Button>

              <Button variant="outline" className="w-full justify-start" icon={Settings}>
                Advanced Privacy Settings
              </Button>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  Security Audit Log
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last audit:</span>
                    <span className="text-gray-900 dark:text-white">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Events logged:</span>
                    <span className="text-gray-900 dark:text-white">{trustData?.auditEvents || 127}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Security score:</span>
                    <span className="text-green-600 font-medium">Excellent</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-red-600 mb-3">
                  Danger Zone
                </h4>
                <Button variant="danger" size="sm" icon={Trash2} className="w-full">
                  Delete All Trust Data
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  This action cannot be undone. All trust scores and relationship data will be permanently deleted.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Security Features */}
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Advanced Security Features
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enterprise-grade protection for your relationship data
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                End-to-End Encryption
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All relationship data encrypted with AES-256
              </p>
            </div>

            <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Zero-Knowledge Architecture
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We can't access your decrypted data
              </p>
            </div>

            <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Self-Sovereign Identity
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You control your identity and data
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Trust;