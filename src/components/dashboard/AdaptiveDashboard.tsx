import React, { useState, useEffect } from 'react';
import { useAdaptiveBehavior } from '../../hooks/useAdaptiveBehavior';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle, 
  BarChart3, 
  Network,
  Settings,
  Sparkles,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

interface WidgetProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  priority: number;
  isVisible: boolean;
}

const Widget: React.FC<WidgetProps> = ({ id, title, icon, children, priority, isVisible }) => {
  if (!isVisible) return null;

  return (
    <Card 
      key={id}
      className="p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">AI-Powered</span>
        </div>
      </div>
      {children}
    </Card>
  );
};

const AdaptiveDashboard: React.FC = () => {
  const {
    preferences,
    dashboardLayout,
    isLoading,
    isAnalyzing,
    getContextualSuggestions,
    getAdaptiveRecommendations,
    triggerBehaviorAnalysis,
    recordAdaptiveBehavior
  } = useAdaptiveBehavior();

  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Record dashboard visit
  useEffect(() => {
    recordAdaptiveBehavior('navigation', { route: 'dashboard' });
  }, [recordAdaptiveBehavior]);

  // Get contextual suggestions
  useEffect(() => {
    const dashboardSuggestions = getContextualSuggestions('dashboard');
    setSuggestions(dashboardSuggestions);
  }, [getContextualSuggestions]);

  // Get adaptive recommendations
  const recommendations = getAdaptiveRecommendations();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Define available widgets
  const availableWidgets = {
    recent_activity: {
      title: 'Recent Activity',
      icon: <TrendingUp className="w-4 h-4 text-white" />,
      component: (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Last 7 days</span>
            <span className="text-emerald-600 font-medium">+12%</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm">Added 3 new contacts</span>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Updated 5 trust scores</span>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Completed 2 goals</span>
            </div>
          </div>
        </div>
      )
    },
    trust_alerts: {
      title: 'Trust Alerts',
      icon: <AlertTriangle className="w-4 h-4 text-white" />,
      component: (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Attention needed</span>
            <span className="text-red-600 font-medium">3 alerts</span>
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <span className="text-sm text-red-700 dark:text-red-300">John Doe's trust score dropped 15 points</span>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
              <span className="text-sm text-yellow-700 dark:text-yellow-300">Jane Smith hasn't been contacted in 30 days</span>
            </div>
          </div>
        </div>
      )
    },
    goal_progress: {
      title: 'Goal Progress',
      icon: <Target className="w-4 h-4 text-white" />,
      component: (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">This month</span>
            <span className="text-blue-600 font-medium">75%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            3 of 4 goals on track
          </div>
        </div>
      )
    },
    contact_insights: {
      title: 'Contact Insights',
      icon: <Users className="w-4 h-4 text-white" />,
      component: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">247</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Contacts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">89</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">High Trust</div>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Your network is growing strong
          </div>
        </div>
      )
    },
    network_graph: {
      title: 'Network Graph',
      icon: <Network className="w-4 h-4 text-white" />,
      component: (
        <div className="space-y-3">
          <div className="h-32 bg-gradient-to-br from-purple-100 to-emerald-100 dark:from-purple-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Network className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Interactive Network View</span>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            12 mutual connections discovered
          </div>
        </div>
      )
    },
    advanced_analytics: {
      title: 'Advanced Analytics',
      icon: <BarChart3 className="w-4 h-4 text-white" />,
      component: (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Engagement Rate</span>
              <span className="font-medium">87%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Response Time</span>
              <span className="font-medium">2.3 days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Network Growth</span>
              <span className="font-medium">+23%</span>
            </div>
          </div>
        </div>
      )
    }
  };

  // Get widget order from preferences or use default
  const widgetOrder = dashboardLayout?.widgets || ['recent_activity', 'trust_alerts', 'goal_progress'];
  const widgetSuggestions = dashboardLayout?.suggestions || [];

  return (
    <div className="space-y-6">
      {/* Header with adaptive controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          {preferences && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Tailored for {preferences.behavior_profile.replace('-', ' ')} users • 
              {preferences.sophistication_level} level
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerBehaviorAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Adapt'}
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* Contextual Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-emerald-50 dark:from-purple-900/20 dark:to-emerald-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Personalized Suggestions
                </h3>
                <ul className="space-y-1">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="text-sm text-purple-800 dark:text-purple-200">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(false)}
              className="text-purple-600 hover:text-purple-700"
            >
              ×
            </Button>
          </div>
        </Card>
      )}

      {/* Adaptive Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgetOrder.map((widgetId, index) => {
          const widget = availableWidgets[widgetId as keyof typeof availableWidgets];
          if (!widget) return null;

          return (
            <Widget
              key={widgetId}
              id={widgetId}
              title={widget.title}
              icon={widget.icon}
              priority={index + 1}
              isVisible={true}
            >
              {widget.component}
            </Widget>
          );
        })}
      </div>

      {/* Behavior Profile Summary */}
      {preferences && (
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your Relationship Management Style
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Based on your usage patterns, you're a {preferences.behavior_profile.replace('-', ' ')} user 
                with {preferences.sophistication_level} expertise.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(preferences.feature_usage).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Features Used
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdaptiveDashboard; 