import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Target, Brain, MessageSquare, AlertCircle, Calendar, Zap } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getDashboardStats } from '../api/dashboard';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Network Health',
      value: '87%',
      change: '+5%',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
      description: 'Overall relationship strength'
    },
    {
      title: 'Active Goals',
      value: stats?.activeGoals || 0,
      change: '+2 this week',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: 'Goals driving your network'
    },
    {
      title: 'Trust Score',
      value: '92',
      change: '+3 points',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: 'Average relationship trust'
    },
    {
      title: 'Connections',
      value: stats?.totalConnections || 0,
      change: `+${stats?.networkGrowth || 0}%`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      description: 'Total network size'
    }
  ];

  const aiInsights = [
    {
      type: 'opportunity',
      icon: Zap,
      title: 'Hidden Opportunity Detected',
      message: 'Sarah Chen from TechCorp just joined the AI/ML committee at Stanford. Perfect timing for your fundraising goal.',
      action: 'Draft Message',
      priority: 'high'
    },
    {
      type: 'risk',
      icon: AlertCircle,
      title: 'Relationship At Risk',
      message: 'You haven\'t connected with Michael Rodriguez in 90 days. His engagement score has dropped 15%.',
      action: 'Schedule Follow-up',
      priority: 'medium'
    },
    {
      type: 'milestone',
      icon: Target,
      title: 'Goal Progress Update',
      message: 'You\'re 70% toward your Q1 networking goal. 3 more strategic connections needed.',
      action: 'View Suggestions',
      priority: 'low'
    }
  ];

  const upcomingActions = [
    { type: 'follow-up', contact: 'Emily Johnson', action: 'Follow up on design collaboration', due: 'Today' },
    { type: 'birthday', contact: 'David Kim', action: 'Send birthday message', due: 'Tomorrow' },
    { type: 'check-in', contact: 'Lisa Wang', action: 'Quarterly relationship check-in', due: 'This week' },
    { type: 'introduction', contact: 'Alex Thompson', action: 'Introduce to Sarah Chen', due: 'This week' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Network Intelligence</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your relationship engine is working. Here's what's happening in your network.
          </p>
        </div>
        <Button icon={MessageSquare}>
          Ask AI Assistant
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} hover className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <span className="text-sm text-green-600 font-medium">
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {metric.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {metric.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* AI Insights */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Relationship Assistant
            </h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => {
              const Icon = insight.icon;
              const priorityColors = {
                high: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
                medium: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
                low: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
              };
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${priorityColors[insight.priority as keyof typeof priorityColors]}`}>
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {insight.message}
                      </p>
                      <Button variant="outline" size="sm">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Upcoming Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Actions
              </h3>
            </div>
            <div className="space-y-3">
              {upcomingActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {action.contact}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {action.action}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {action.due}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Network Activity
            </h3>
            <div className="space-y-4">
              {stats?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {Math.floor(Math.random() * 24)} hours ago
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;