import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Target, Lightbulb, MessageSquare } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import AIQueryInterface from '../components/intelligence/AIQueryInterface';
import RelationshipAlerts from '../components/intelligence/RelationshipAlerts';
import { getIntelligenceInsights } from '../api/intelligence';

const Intelligence: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data: insights, isLoading } = useQuery({
    queryKey: ['intelligence-insights'],
    queryFn: getIntelligenceInsights,
  });

  const handleAiQuery = async (query: string) => {
    setIsProcessing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
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

  const relationshipAlerts = [
    {
      type: 'opportunity' as const,
      contact: 'Sarah Chen',
      message: 'Just joined AI/ML committee at Stanford - perfect for your fundraising goal',
      action: 'Draft introduction',
      priority: 'high' as const
    },
    {
      type: 'risk' as const,
      contact: 'Michael Rodriguez',
      message: 'No contact in 90 days, engagement score dropped 15%',
      action: 'Schedule catch-up',
      priority: 'medium' as const
    },
    {
      type: 'milestone' as const,
      contact: 'Emily Johnson',
      message: 'Work anniversary next week - good reconnection opportunity',
      action: 'Send congratulations',
      priority: 'low' as const
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
        <AIQueryInterface onQuery={handleAiQuery} isProcessing={isProcessing} />
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
        <RelationshipAlerts alerts={relationshipAlerts} />
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