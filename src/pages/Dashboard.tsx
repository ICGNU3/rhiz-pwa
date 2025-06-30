import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Target, Brain, MessageSquare, AlertCircle, Calendar, Zap, Shield, Network, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import { getDashboardStats } from '../api/dashboard';

const Dashboard: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Network Intelligence</h1>
        </div>
        <ErrorBorder 
          message="Failed to load dashboard data. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const metrics = [
    {
      title: 'Network Health',
      value: `${data.networkHealth}%`,
      change: '+5%',
      icon: Network,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
      description: 'Overall relationship strength'
    },
    {
      title: 'Total Goals',
      value: data.totalGoals,
      change: '+2 this week',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: 'Goals driving your network'
    },
    {
      title: 'Trust Score',
      value: data.overallTrust,
      change: '+3 points',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: 'Average relationship trust'
    },
    {
      title: 'Connections',
      value: data.totalContacts,
      change: '+15%',
      icon: Users,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Network Intelligence
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your relationship engine is working. Here's what's happening in your network.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              icon={TrendingUp}
              className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50"
            >
              Analytics
            </Button>
            <Button 
              icon={MessageSquare}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
            >
              Ask AI Assistant
            </Button>
          </div>
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
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Relationship Assistant
              </h3>
            </div>
            <Button variant="ghost" size="sm" icon={TrendingUp}>
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
        </Card>

        {/* Upcoming Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Actions
              </h3>
            </div>
            <div className="space-y-3">
              {data.upcomingActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {action.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full">
                    {action.due}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="ghost" size="sm" className="w-full" icon={CheckCircle}>
                View All Tasks
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Network Activity
              </h3>
            </div>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="ghost" size="sm" className="w-full" icon={TrendingUp}>
                View Activity Log
              </Button>
            </div>
          </Card>
        </div>

        {/* Network Growth & Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Network Growth
                </h3>
              </div>
              <select className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
            
            {/* Placeholder for chart - in a real app, use a charting library */}
            <div className="h-64 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">+{data.totalContacts > 10 ? 15 : 5}%</div>
                <p className="text-gray-600 dark:text-gray-400">Network growth this month</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{data.totalContacts}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Contacts</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(data.totalContacts * 0.7)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Contacts</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(data.totalContacts * 0.3)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">New This Month</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" icon={Users}>
                Add New Contact
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={Target}>
                Create New Goal
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={Brain}>
                Ask AI Assistant
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={Network}>
                View Network Graph
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  Trust Score: {data.overallTrust}
                </h4>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                  style={{ width: `${data.overallTrust}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Your network trust score is {data.overallTrust >= 80 ? 'excellent' : data.overallTrust >= 70 ? 'good' : 'needs improvement'}.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;