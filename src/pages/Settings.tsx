import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Smartphone, 
  Trash2, 
  Download, 
  Upload, 
  Zap, 
  MessageSquare,
  Shield,
  Eye,
  EyeOff,
  Key,
  Settings as SettingsIcon,
  Check,
  X,
  Mail,
  Calendar,
  Users,
  Building,
  Moon,
  Sun
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

interface UserSettings {
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
  };
}

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      displayName: user?.name || '',
      email: user?.email || '',
      bio: '',
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
  });

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        accountAge: '6 months',
        totalContacts: 247,
        goalsCompleted: 12,
        networkGrowth: '+23%',
        dataSize: '2.4 MB',
        lastBackup: '2 hours ago',
        loginSessions: 3,
        dataExports: 2,
        securityScore: 85
      };
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: UserSettings) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('rhiz-user-settings', JSON.stringify(newSettings));
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    }
  });

  const exportDataMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = {
        contacts: JSON.parse(localStorage.getItem('rhiz-contacts') || '[]'),
        goals: JSON.parse(localStorage.getItem('rhiz-goals') || '[]'),
        settings: settings,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rhiz-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });

  const handleSettingChange = (section: keyof UserSettings, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [section]: { ...settings[section], [key]: value }
    };
    setSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const profileData = {
      displayName: formData.get('displayName') as string,
      email: formData.get('email') as string,
      bio: formData.get('bio') as string,
      timezone: formData.get('timezone') as string,
      language: formData.get('language') as string,
    };
    
    const newSettings = { ...settings, profile: profileData };
    setSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal information' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alert preferences' },
    { id: 'integrations', label: 'Integrations', icon: Zap, description: 'Connected services' },
    { id: 'privacy', label: 'Privacy', icon: Shield, description: 'Data & security' },
    { id: 'ai', label: 'AI Assistant', icon: MessageSquare, description: 'AI preferences' },
    { id: 'advanced', label: 'Advanced', icon: SettingsIcon, description: 'System settings' }
  ];

  const integrationProviders = [
    { 
      key: 'linkedin', 
      name: 'LinkedIn', 
      icon: Users, 
      description: 'Sync professional connections and updates',
      status: 'available'
    },
    { 
      key: 'google', 
      name: 'Google Workspace', 
      icon: Mail, 
      description: 'Import contacts from Gmail and Google',
      status: 'available'
    },
    { 
      key: 'outlook', 
      name: 'Microsoft Outlook', 
      icon: Mail, 
      description: 'Sync Outlook contacts and calendar',
      status: 'available'
    },
    { 
      key: 'slack', 
      name: 'Slack', 
      icon: MessageSquare, 
      description: 'Track team interactions and relationships',
      status: 'available'
    },
    { 
      key: 'calendly', 
      name: 'Calendly', 
      icon: Calendar, 
      description: 'Sync meeting data and contacts',
      status: 'coming-soon'
    },
    { 
      key: 'zoom', 
      name: 'Zoom', 
      icon: Users, 
      description: 'Import meeting participants and interactions',
      status: 'coming-soon'
    }
  ];

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Manage your account preferences, privacy settings, and AI assistant configuration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50 sticky top-6">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className={`text-xs ${
                          activeTab === item.id ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="w-full justify-start"
                    icon={theme === 'light' ? Moon : Sun}
                  >
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportDataMutation.mutate()}
                    loading={exportDataMutation.isPending}
                    className="w-full justify-start"
                    icon={Download}
                  >
                    Export Data
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="w-full justify-start text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Profile Information
                    </h2>
                  </div>

                  {/* Account Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            {user?.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {user?.email}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Member for {userStats?.accountAge}
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Display Name
                          </label>
                          <input
                            name="displayName"
                            type="text"
                            defaultValue={settings.profile.displayName}
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            name="email"
                            type="email"
                            defaultValue={settings.profile.email}
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bio
                          </label>
                          <textarea
                            name="bio"
                            rows={3}
                            defaultValue={settings.profile.bio}
                            placeholder="Tell us about yourself..."
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Timezone
                            </label>
                            <select
                              name="timezone"
                              defaultValue={settings.profile.timezone}
                              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="UTC-8">UTC-8 (Pacific)</option>
                              <option value="UTC-5">UTC-5 (Eastern)</option>
                              <option value="UTC+0">UTC+0 (GMT)</option>
                              <option value="UTC+1">UTC+1 (CET)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Language
                            </label>
                            <select
                              name="language"
                              defaultValue={settings.profile.language}
                              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </select>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          loading={updateSettingsMutation.isPending}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                          Update Profile
                        </Button>
                      </form>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-indigo-600 mb-1">
                          {userStats?.totalContacts}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Contacts
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {userStats?.goalsCompleted}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Goals Completed
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {userStats?.networkGrowth}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Network Growth
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {userStats?.dataSize}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Data Size
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Bell className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Notification Preferences
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(settings.notifications).map(([key, value]) => {
                      const notificationLabels: Record<string, { title: string; desc: string }> = {
                        email: { title: 'Email Notifications', desc: 'Receive updates via email' },
                        push: { title: 'Push Notifications', desc: 'Browser and mobile push notifications' },
                        weekly: { title: 'Weekly Summary', desc: 'Weekly network activity digest' },
                        mentions: { title: 'Mentions & Messages', desc: 'When someone mentions you or sends a message' },
                        goalReminders: { title: 'Goal Reminders', desc: 'Reminders about goal deadlines and progress' },
                        relationshipAlerts: { title: 'Relationship Alerts', desc: 'AI-powered relationship health notifications' },
                        networkUpdates: { title: 'Network Updates', desc: 'Changes in your network connections' },
                        aiInsights: { title: 'AI Insights', desc: 'Personalized insights and recommendations' }
                      };
                      
                      return (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {notificationLabels[key]?.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {notificationLabels[key]?.desc}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Zap className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Connected Services
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {integrationProviders.map((provider) => {
                      const Icon = provider.icon;
                      const isConnected = settings.integrations[provider.key as keyof typeof settings.integrations];
                      
                      return (
                        <div key={provider.key} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                                <Icon className="w-6 h-6 text-indigo-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {provider.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {provider.description}
                                </p>
                              </div>
                            </div>
                            {isConnected && (
                              <div className="flex items-center space-x-1 text-green-600">
                                <Check className="w-4 h-4" />
                                <span className="text-xs font-medium">Connected</span>
                              </div>
                            )}
                          </div>
                          
                          <Button
                            variant={isConnected ? 'outline' : 'primary'}
                            size="sm"
                            disabled={provider.status === 'coming-soon'}
                            onClick={() => handleSettingChange('integrations', provider.key, !isConnected)}
                            className="w-full"
                          >
                            {provider.status === 'coming-soon' 
                              ? 'Coming Soon' 
                              : isConnected 
                                ? 'Disconnect' 
                                : 'Connect'
                            }
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Privacy & Security
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Privacy Controls */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Privacy Controls
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Profile Visibility
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Who can see your profile information
                            </p>
                          </div>
                          <select
                            value={settings.privacy.profileVisibility}
                            onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="private">Private</option>
                            <option value="connections">Connections Only</option>
                            <option value="network">Extended Network</option>
                            <option value="public">Public</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
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
                              checked={settings.privacy.contactSharing}
                              onChange={(e) => handleSettingChange('privacy', 'contactSharing', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
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
                              checked={settings.privacy.activityTracking}
                              onChange={(e) => handleSettingChange('privacy', 'activityTracking', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Data Management */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Data Management
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          className="justify-start"
                          icon={Download}
                          onClick={() => exportDataMutation.mutate()}
                          loading={exportDataMutation.isPending}
                        >
                          Download My Data
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="justify-start"
                          icon={Upload}
                        >
                          Import Data
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="justify-start"
                          icon={Key}
                        >
                          Manage Encryption Keys
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="justify-start"
                          icon={Lock}
                        >
                          Two-Factor Authentication
                        </Button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-red-600 mb-4">
                        Danger Zone
                      </h3>
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-red-800 dark:text-red-400">
                              Delete Account
                            </h4>
                            <p className="text-sm text-red-600 dark:text-red-300">
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Assistant Tab */}
              {activeTab === 'ai' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <MessageSquare className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      AI Assistant Settings
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(settings.ai).map(([key, value]) => {
                      const aiLabels: Record<string, { title: string; desc: string; type: 'toggle' | 'select' }> = {
                        assistantEnabled: { 
                          title: 'AI Assistant Enabled', 
                          desc: 'Enable AI-powered relationship insights and suggestions',
                          type: 'toggle'
                        },
                        insightFrequency: { 
                          title: 'Insight Frequency', 
                          desc: 'How often to receive AI insights',
                          type: 'select'
                        },
                        autoSuggestions: { 
                          title: 'Auto Suggestions', 
                          desc: 'Automatically suggest actions and connections',
                          type: 'toggle'
                        },
                        learningMode: { 
                          title: 'Learning Mode', 
                          desc: 'How the AI learns from your behavior',
                          type: 'select'
                        },
                        personalizedRecommendations: { 
                          title: 'Personalized Recommendations', 
                          desc: 'Receive tailored suggestions based on your goals',
                          type: 'toggle'
                        }
                      };
                      
                      return (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {aiLabels[key]?.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {aiLabels[key]?.desc}
                            </p>
                          </div>
                          
                          {aiLabels[key]?.type === 'toggle' ? (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) => handleSettingChange('ai', key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            </label>
                          ) : (
                            <select
                              value={value as string}
                              onChange={(e) => handleSettingChange('ai', key, e.target.value)}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                              {key === 'insightFrequency' && (
                                <>
                                  <option value="realtime">Real-time</option>
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                </>
                              )}
                              {key === 'learningMode' && (
                                <>
                                  <option value="adaptive">Adaptive</option>
                                  <option value="conservative">Conservative</option>
                                  <option value="aggressive">Aggressive</option>
                                  <option value="manual">Manual Only</option>
                                </>
                              )}
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <SettingsIcon className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Advanced Settings
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Security Score
                      </h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full transition-all duration-1000"
                            style={{ width: `${userStats?.securityScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {userStats?.securityScore}%
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Active Sessions
                      </h3>
                      <p className="text-2xl font-bold text-indigo-600">
                        {userStats?.loginSessions}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Devices logged in
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Data Exports
                      </h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {userStats?.dataExports}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total exports
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Last Backup
                      </h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userStats?.lastBackup}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automatic backup
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start" icon={Key}>
                      Manage API Keys
                    </Button>
                    <Button variant="outline" className="w-full justify-start" icon={Globe}>
                      Developer Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start" icon={Download}>
                      System Logs
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;