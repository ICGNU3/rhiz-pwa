import React, { useState } from 'react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { 
  Brain, 
  Eye, 
  EyeOff, 
  Settings, 
  Sparkles, 
  Shield, 
  TrendingUp,
  Users,
  Target,
  Network,
  Info
} from 'lucide-react';
import { useAdaptiveBehavior } from '../../hooks/useAdaptiveBehavior';

const AdaptiveSettings: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    isUpdating,
    triggerBehaviorAnalysis
  } = useAdaptiveBehavior();

  const [localPreferences, setLocalPreferences] = useState(preferences);

  // Update local state when preferences change
  React.useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handlePreferenceChange = (key: string, value: any) => {
    if (!localPreferences) return;
    
    setLocalPreferences({
      ...localPreferences,
      [key]: value
    });
  };

  const handleSave = async () => {
    if (!localPreferences) return;
    
    try {
      await updatePreferences(localPreferences);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
  };

  if (!localPreferences) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Adaptive Interface Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Control how Rhiz learns from your behavior and adapts to your needs
          </p>
        </div>
        <Button
          onClick={triggerBehaviorAnalysis}
          className="bg-gradient-to-r from-purple-600 to-emerald-600 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Analyze Behavior
        </Button>
      </div>

      {/* Learning Controls */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Learning & Adaptation
          </h3>
        </div>

        <div className="space-y-6">
          {/* Learning Enabled */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Enable Learning
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Allow Rhiz to learn from your behavior and adapt the interface
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.learning_enabled}
                onChange={(e) => handlePreferenceChange('learning_enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Adaptation Level */}
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Adaptation Level
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                How aggressively should Rhiz adapt to your behavior?
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'minimal', label: 'Minimal', description: 'Subtle changes only' },
                { value: 'moderate', label: 'Moderate', description: 'Balanced adaptation' },
                { value: 'aggressive', label: 'Aggressive', description: 'Maximum personalization' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    localPreferences.adaptation_level === option.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="adaptation_level"
                    value={option.value}
                    checked={localPreferences.adaptation_level === option.value}
                    onChange={(e) => handlePreferenceChange('adaptation_level', e.target.value)}
                    className="sr-only"
                  />
                  <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Behavior Profile */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Behavior Profile
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Profile */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Current Profile</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Focus</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {localPreferences.behavior_profile.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Expertise</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {localPreferences.sophistication_level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Icons */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Profile Types</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Relationship-focused</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Prioritizes contact management</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <Target className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Goal-focused</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Driven by objectives</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <Network className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Network-focused</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Builds connections</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Controls */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Privacy & Data
          </h3>
        </div>

        <div className="space-y-6">
          {/* Privacy Conscious */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Privacy Conscious Mode
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Minimize data collection while maintaining personalization
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.privacy_conscious}
                onChange={(e) => handlePreferenceChange('privacy_conscious', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Data Sharing Level */}
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Data Sharing Level
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Control how much data is used for personalization
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'minimal', label: 'Minimal', description: 'Basic personalization only' },
                { value: 'standard', label: 'Standard', description: 'Balanced features and privacy' },
                { value: 'enhanced', label: 'Enhanced', description: 'Maximum personalization' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    localPreferences.data_sharing_level === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="data_sharing_level"
                    value={option.value}
                    checked={localPreferences.data_sharing_level === option.value}
                    onChange={(e) => handlePreferenceChange('data_sharing_level', e.target.value)}
                    className="sr-only"
                  />
                  <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Statistics */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Info className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Usage Statistics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(localPreferences.feature_usage).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Features Used</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">
              {Object.keys(localPreferences.search_preferences).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Types</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {localPreferences.timing_patterns.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Usage Patterns</div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isUpdating}
        >
          Reset to Defaults
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={triggerBehaviorAnalysis}
            disabled={isUpdating}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Re-analyze
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-gradient-to-r from-purple-600 to-emerald-600 text-white"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveSettings; 