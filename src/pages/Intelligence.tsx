import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brain, TrendingUp, Users, Target, Lightbulb, MessageSquare, Search, Zap, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getIntelligenceInsights } from '../api/intelligence';

const Intelligence: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data: insights, isLoading } = useQuery({
    queryKey: ['intelligence-insights'],
    queryFn: getIntelligenceInsights,
  });

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setIsProcessing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setAiQuery('');
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="grid gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const quickQueries = [
    "Who haven't I spoken to in 90 days?",
    "Which connections could help with fundraising?",
    "Show me at-risk relationships",
    "Who should I introduce to each other?",
    "Find opportunities in my network"
  ];

  const relationshipAlerts = [
    {
      type: 'opportunity',
      contact: 'Sarah Chen',
      message: 'Just joined AI/ML committee at Stanford - perfect for your fundraising goal',
      action: 'Draft introduction',
      priority: 'high',
      icon: Zap
    },
    {
      type: 'risk',
      contact: 'Michael Rodriguez',
      message: 'No contact in 90 days, engagement score dropped 15%',
      action: 'Schedule catch-up',
      priority: 'medium',
      icon: AlertTriangle
    },
    {
      type: 'milestone',
      contact: 'Emily Johnson',
      message: 'Work anniversary next week - good reconnection opportunity',
      action: 'Send congratulations',
      priority: 'low',
      icon: Target
    }
  ];

  const insightCards = [
    {
      title: 'Network Growth Patterns',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      insights: insights?.networkTrends || []
    },
    {
      title: 'Hidden Opportunities',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      insights: insights?.opportunities || []
    },
    {
      title: 'Goal Alignment',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      insights: insights?.goalRecommendations || []
    },
    {
      title: 'Smart Suggestions',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      insights: insights?.suggestions || []
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Relationship Assistant</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Ask questions, uncover opportunities, and get intelligent insights about your network.
        </p>
      </div>

      {/* AI Query Interface */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Ask Your Network Anything
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Natural language queries about your relationships and opportunities
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="e.g., Who in my network works in AI and could help with introductions?"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <Button 
                onClick={handleAiQuery}
                loading={isProcessing}
                disabled={!aiQuery.trim()}
              >
                Ask AI
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Try asking:</span>
              {quickQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setAiQuery(query)}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Network Intelligence Overview */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Network Intelligence Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {insights?.networkScore || 85}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Network Health Score
              </div>
              <div className="text-xs text-green-600 mt-1">
                +5 this month
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {insights?.growthRate || 12}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Monthly Growth Rate
              </div>
              <div className="text-xs text-green-600 mt-1">
                Above average
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {insights?.engagementRate || 68}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Engagement Rate
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                Room for improvement
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Relationship Alerts */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Relationship Alerts
            </h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {relationshipAlerts.map((alert, index) => {
              const Icon = alert.icon;
              const priorityColors = {
                high: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
                medium: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
                low: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
              };
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${priorityColors[alert.priority as keyof typeof priorityColors]}`}>
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {alert.contact}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                          alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {alert.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {alert.message}
                      </p>
                      <Button variant="outline" size="sm">
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Intelligence Cards */}
      <div className="grid gap-6">
        {insightCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {card.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {card.insights.length > 0 ? (
                    card.insights.map((insight: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{insight}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      Building insights from your network activity...
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Items */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI-Generated Action Items
            </h3>
            <Button variant="ghost" size="sm" icon={MessageSquare}>
              Generate More
            </Button>
          </div>
          <div className="space-y-4">
            {insights?.actionItems?.map((action: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <p className="text-gray-700 dark:text-gray-300">{action}</p>
                </div>
                <Button variant="outline" size="sm">
                  Take Action
                </Button>
              </div>
            )) || (
              <p className="text-gray-500 dark:text-gray-400 italic">
                AI is analyzing your network to generate personalized action items...
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Intelligence;