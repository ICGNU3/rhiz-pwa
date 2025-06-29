import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, Bell, Lock, Globe, Smartphone, Trash2, Download, Upload, Zap, MessageSquare } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    weekly: boolean;
    mentions: boolean;
    goalReminders: boolean;
    relationshipAlerts: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  ai: {
    assistantEnabled: boolean;
    insightFrequency: string;
    autoSuggestions: boolean;
    learningMode: string;
  };
  integrations: {
    linkedin: boolean;
    google: boolean;
    outlook: boolean;
    slack: boolean;
  };
}

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: false,
      weekly: true,
      mentions: true,
      goalReminders: true,
      relationshipAlerts: true
    },
    preferences: {
      language: 'en',
      timezone: 'UTC-8',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    },
    ai: {
      assistantEnabled: true,
      insightFrequency: 'daily',
      autoSuggestions: true,
      learningMode: 'adaptive'
    },
    integrations: {
      linkedin: false,
      google: false,
      outlook: false,
      slack: false
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
        lastBackup: '2 hours ago'
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
      // Simulate data export
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

  const handleNotificationChange = (key: string, value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: { ...settings.notifications, [key]: value }
    };
    setSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  const handlePreferenceChange = (key: string, value: string) => {
    const newSettings = {
      ...settings,
      preferences: { ...settings.preferences, [key]: value }
    };
    setSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  const handleAiChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      ai: { ...settings.ai, [key]: value }
    };
    setSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  const handleIntegrationToggle = (key: string) => {
    const newSettings = {
      ...settings,
      integrations: { ...settings.integrations, [key]: !settings.integrations[key as keyof typeof settings.integrations] }
    };
    setSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account preferences, privacy settings, and AI assistant configuration.
        </p>
      </div>

      {/* Account Overview */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Account Overview
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <Button variant="outline">
                Update Profile
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {userStats?.totalContacts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Contacts
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {userStats?.goalsCompleted}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Goals Completed
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {userStats?.networkGrowth}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Network Growth
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
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
      </Card>

      {/* Notifications */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => {
              const labels = {
                email: { title: 'Email Notifications', desc: 'Receive updates via email' },
                push: { title: 'Push Notifications', desc: 'Browser and mobile push notifications' },
                weekly: { title: 'Weekly Summary', desc: 'Weekly network activity digest' },
                mentions: { title: 'Mentions & Messages', desc: 'When someone mentions you or sends a message' },
                goalReminders: { title: 'Goal Reminders', desc: 'Reminders about goal deadlines and progress' },
                relationshipAlerts: { title: 'Relationship Alerts', desc: 'AI-powered relationship health notifications' }
              };
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {labels[key as keyof typeof labels].title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {labels[key as keyof typeof labels].desc}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleNotificationChange(key, e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* AI Assistant Settings */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  AI Assistant Enabled
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable AI-powered relationship insights and suggestions
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.ai.assistantEnabled}
                onChange={(e) => handleAiChange('assistantEnabled', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Insight Frequency
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How often to receive AI insights
                </p>
              </div>
              <select
                value={settings.ai.insightFrequency}
                onChange={(e) => handleAiChange('insightFrequency', e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="realtime">Real-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Auto Suggestions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically suggest actions and connections
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.ai.autoSuggestions}
                onChange={(e) => handleAiChange('autoSuggestions', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Learning Mode
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How the AI learns from your behavior
                </p>
              </div>
              <select
                value={settings.ai.learningMode}
                onChange={(e) => handleAiChange('learningMode', e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="adaptive">Adaptive</option>
                <option value="conservative">Conservative</option>
                <option value="aggressive">Aggressive</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Integrations & Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Integrations
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.integrations).map(([key, connected]) => {
                const integrationLabels = {
                  linkedin: { name: 'LinkedIn', desc: 'Sync professional contacts and updates' },
                  google: { name: 'Google Contacts', desc: 'Import contacts from Gmail and Google' },
                  outlook: { name: 'Microsoft Outlook', desc: 'Sync Outlook contacts and calendar' },
                  slack: { name: 'Slack', desc: 'Track team interactions and relationships' }
                };
                
                return (
                  <div key={key} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {integrationLabels[key as keyof typeof integrationLabels].name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {integrationLabels[key as keyof typeof integrationLabels].desc}
                      </p>
                    </div>
                    <Button
                      variant={connected ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleIntegrationToggle(key)}
                    >
                      {connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Download className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Data Management
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Last Backup</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{userStats?.lastBackup}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Data Size</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{userStats?.dataSize}</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full justify-start" 
                icon={Download}
                onClick={() => exportDataMutation.mutate()}
                loading={exportDataMutation.isPending}
              >
                Export All Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start" icon={Upload}>
                Import Data
              </Button>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Danger Zone
                </h4>
                <Button variant="danger" size="sm" icon={Trash2}>
                  Delete Account
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Preferences & Sign Out */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preferences
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Theme
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred color scheme
                  </p>
                </div>
                <Button variant="outline" onClick={toggleTheme}>
                  {theme === 'light' ? 'Dark' : 'Light'}
                </Button>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Language
                </h3>
                <select 
                  value={settings.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Time Zone
                </h3>
                <select 
                  value={settings.preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="UTC-8">UTC-8 (Pacific)</option>
                  <option value="UTC-5">UTC-5 (Eastern)</option>
                  <option value="UTC+0">UTC+0 (GMT)</option>
                  <option value="UTC+1">UTC+1 (CET)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security
              </h2>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start" icon={Smartphone}>
                Two-Factor Authentication
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                Active Sessions
              </Button>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Sign Out
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sign out of your Rhiz account on this device
                    </p>
                  </div>
                  <Button variant="outline" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;