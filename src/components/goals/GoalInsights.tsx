import React from 'react';
import { Zap, Target, Users, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';
import Card from '../Card';
import Button from '../ui/Button';

export default function GoalInsights() {
  const insights = [
    {
      title: 'Smart Recommendation',
      description: 'Connect with Sarah Chen for your fundraising goal - she just joined Stanford\'s AI committee and has connections to 3 major VCs.',
      type: 'opportunity',
      priority: 'high',
      action: 'Draft Introduction',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'Progress Alert',
      description: 'Your hiring goal is 70% complete. Schedule 3 more interviews to reach your target by the deadline.',
      type: 'progress',
      priority: 'medium',
      action: 'Schedule Interviews',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Network Opportunity',
      description: '5 mutual connections could help with your partnership goals. AI has identified optimal introduction paths.',
      type: 'network',
      priority: 'medium',
      action: 'View Suggestions',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    }
  ];

  const quickActions = [
    {
      title: 'Goal Matching',
      description: 'Find contacts aligned with your active goals',
      icon: Target,
      action: 'Match Contacts'
    },
    {
      title: 'Progress Tracking',
      description: 'Update goal progress and milestones',
      icon: TrendingUp,
      action: 'Update Progress'
    },
    {
      title: 'AI Recommendations',
      description: 'Get personalized goal achievement strategies',
      icon: Lightbulb,
      action: 'Get Insights'
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Goal Insights
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Intelligent recommendations to accelerate your goal achievement
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={ArrowRight}>
          View All
        </Button>
      </div>

      {/* Main Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div 
              key={index} 
              className={`p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm border ${insight.borderColor} hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                  <Icon className={`w-4 h-4 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {insight.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      insight.priority === 'high' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {insight.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    {insight.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-full text-xs ${insight.color.replace('text-', 'border-').replace('-600', '-300')} ${insight.color} hover:${insight.bgColor.replace('bg-', 'bg-').replace('-100', '-50')}`}
                  >
                    {insight.action}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-indigo-200 dark:border-indigo-800 pt-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Quick Actions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="flex items-center space-x-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 text-left border border-indigo-200/50 dark:border-indigo-800/50"
              >
                <Icon className="w-4 h-4 text-indigo-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {action.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Learning Notice */}
      <div className="mt-4 p-3 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-indigo-600" />
          <p className="text-xs text-indigo-700 dark:text-indigo-300">
            <strong>AI Learning:</strong> These insights improve as you interact with your network and update goal progress.
          </p>
        </div>
      </div>
    </Card>
  );
}