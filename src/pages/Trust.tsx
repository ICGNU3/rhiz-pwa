import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Check, X, AlertTriangle, Lock, Eye, EyeOff, Key, Download, Trash2, Settings, TrendingUp, Users, Clock, Filter } from 'lucide-react';
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

  const handleTrustAlertAction = (alertId: string, action: string) => {
    console.log(`Action ${action} for alert ${alertId}`);
    // Handle alert actions here
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

  const filteredAlerts = selectedTier === 'all' 
    ? trustData?.lowTrustAlerts || []
    : (trustData?.lowTrustAlerts || []).filter(alert => {
        if (selectedTier === 'high') return alert.severity === 'high';
        if (selectedTier === 'medium') return alert.severity === 'medium';
        if (selectedTier === 'low') return alert.severity === 'low';
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
              icon={Settings}
              className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50"
            >
              Privacy Settings
            </Button>
            <Button 
              icon={Shield} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
            >
              Security Audit
            </Button>
          </div>
        </div>

        {/* Trust Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Score */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
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
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full max-w-md mx-auto">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${trustScore >= 90 ? 'bg-green-600' : trustScore >= 80 ? 'bg-blue-600' : trustScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'}`}
                  style={{ width: `${trustScore}%` }}
                ></div>
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
          </Card>

          {/* Average Response Time */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
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
                <span className="text-gray-600 dark:text-gray-400">Immediate (< 1h)</span>
                <span className="font-medium text-gray-900 dark:text-white">45%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Same day (< 24h)</span>
                <span className="font-medium text-gray-900 dark:text-white">35%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Delayed (> 24h)</span>
                <span className="font-medium text-gray-900 dark:text-white">20%</span>
              </div>
            </div>
          </Card>

          {/* Dormant Percentage */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
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
            </div>
          </Card>
        </div>

        {/* Trust Tier Filters */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trust Tier Distribution
            </h3>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
              >
                <option value="all">All Tiers</option>
                <option value="high">High Trust</option>
                <option value="medium">Medium Trust</option>
                <option value="low">Low Trust</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trustData?.tiers?.map((tier, index) => (
              <button
                key={index}
                onClick={() => setSelectedTier(tier.name.toLowerCase().split(' ')[0])}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedTier === tier.name.toLowerCase().split(' ')[0] || selectedTier === 'all'
                    ? `border-${tier.color}-300 bg-${tier.color}-50 dark:bg-${tier.color}-900/20`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold text-${tier.color}-800 dark:text-${tier.color}-400`}>
                    {tier.name}
                  </h4>
                  <span className={`text-2xl font-bold text-${tier.color}-600`}>
                    {tier.count}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className={`h-2 bg-${tier.color}-500 rounded-full transition-all duration-1000`}
                      style={{ width: `${tier.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {tier.percentage}%
                  </span>
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

        {/* Low Trust Alerts */}
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
              <Button variant="ghost" size="sm" icon={Settings}>
                Alert Settings
              </Button>
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
                <input
                  type="checkbox"
                  checked={privacySettings.contactSharing}
                  onChange={(e) => handlePrivacyChange('contactSharing', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
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
                <input
                  type="checkbox"
                  checked={privacySettings.activityTracking}
                  onChange={(e) => handlePrivacyChange('activityTracking', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Data Management
            </h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" icon={Download}>
                Export Trust Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start" icon={Key}>
                Manage Encryption Keys
              </Button>
              
              <Button variant="outline" className="w-full justify-start" icon={Settings}>
                Advanced Privacy Settings
              </Button>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Danger Zone
                </h4>
                <Button variant="danger" size="sm" icon={Trash2}>
                  Delete All Trust Data
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  This action cannot be undone. All trust scores and relationship data will be permanently deleted.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Trust;