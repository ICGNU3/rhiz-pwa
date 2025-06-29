import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TrendingUp, Users, Target, Lightbulb, MessageSquare, Brain, Zap, BarChart3 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import AIQueryInterface from '../components/intelligence/AIQueryInterface';
import RelationshipAlerts from '../components/intelligence/RelationshipAlerts';
import { getIntelligenceInsights } from '../api/intelligence';

const Intelligence: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Array<{query: string, response: string, timestamp: Date}>>([]);
  
  const { data: insights, isLoading, error, refetch } = useQuery({
    queryKey: ['intelligence-insights'],
    queryFn: getIntelligenceInsights,
  });

  const chatMutation = useMutation({
    mutationFn: async (query: string) => {
      // Simulate API call to /api/intelligence/chat
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI responses based on query content
      const responses = {
        'fundraising': "Based on your network analysis, I've identified 5 key contacts who could help with fundraising: Sarah Chen (Stanford AI committee), Michael Rodriguez (former VC), and 3 others with strong investor connections. Would you like me to draft introduction requests?",
        'risk': "I've detected 2 at-risk relationships: Michael Rodriguez (90 days no contact, engagement down 15%) and Emily Johnson (missed last 2 scheduled calls). I recommend immediate personalized outreach to re-engage these valuable connections.",
        'opportunities': "Your network shows 12 hidden opportunities: 3 potential partnerships in fintech, 4 hiring prospects for senior roles, and 5 introduction opportunities that could strengthen your ecosystem. Shall I prioritize these by impact?",
        'introductions': "Perfect introduction opportunity detected: Sarah Chen and Alex Thompson both work in AI/ML space and share 3 mutual connections through your network. Their complementary expertise could create significant value for both parties.",
        'default': "I've analyzed your network and found several insights. Your relationship strength has grown 15% this month, with particularly strong engagement in the tech sector. I can help you identify specific opportunities, risks, or strategic connections. What would you like to explore?"
      };
      
      const queryLower = query.toLowerCase();
      let response = responses.default;
      
      if (queryLower.includes('fundrais') || queryLower.includes('investor')) response = responses.fundraising;
      else if (queryLower.includes('risk') || queryLower.includes('90 days')) response = responses.risk;
      else if (queryLower.includes('opportunit')) response = responses.opportunities;
      else if (queryLower.includes('introduc')) response = responses.introductions;
      
      return response;
    },
    onSuccess: (response, query) => {
      setChatHistory(prev => [...prev, {
        query,
        response,
        timestamp: new Date()
      }]);
    }
  });

  const sendQuery = async (query: string) => {
    await chatMutation.mutateAsync(query);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading AI insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Intelligence</h1>
        </div>
        <ErrorBorder 
          message="Failed to load intelligence insights. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Enhanced relationship alerts with more realistic data
  const relationshipAlerts = [
    {
      type: 'opportunity' as const,
      contact: 'Sarah Chen',
      message: 'Just joined AI/ML committee at Stanford - perfect timing for your fundraising goal. She has connections to 3 major VCs in your target list.',
      action: 'Draft Introduction',
      priority: 'high' as const,
      timestamp: '2 hours ago',
      category: 'Fundraising'
    },
    {
      type: 'risk' as const,
      contact: 'Michael Rodriguez',
      message: 'No contact in 90 days, engagement score dropped 15%. Previously strong relationship showing signs of weakening.',
      action: 'Schedule Catch-up',
      priority: 'medium' as const,
      timestamp: '1 day ago',
      category: 'Relationship Health'
    },
    {
      type: 'milestone' as const,
      contact: 'Emily Johnson',
      message: 'Work anniversary next week - excellent reconnection opportunity. She recently got promoted to VP of Design.',
      action: 'Send Congratulations',
      priority: 'low' as const,
      timestamp: '3 hours ago',
      category: 'Engagement'
    },
    {
      type: 'opportunity' as const,
      contact: 'Alex Thompson',
      message: 'Recently left Sequoia Capital and is now angel investing. Perfect match for your Series A goals.',
      action: 'Request Meeting',
      priority: 'high' as const,
      timestamp: '5 hours ago',
      category: 'Fundraising'
    }
  ];

  const insightCards = [
    {
      title: 'Network Growth Patterns',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      insights: insights?.networkTrends || [],
      metric: '+15%',
      metricLabel: 'This Month'
    },
    {
      title: 'Hidden Opportunities',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      insights: insights?.opportunities || [],
      metric: '12',
      metricLabel: 'Identified'
    },
    {
      title: 'Goal Alignment',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      insights: insights?.goalRecommendations || [],
      metric: '87%',
      metricLabel: 'Match Rate'
    },
    {
      title: 'Smart Suggestions',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      insights: insights?.suggestions || [],
      metric: '8',
      metricLabel: 'New Today'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Relationship Intelligence
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Uncover hidden opportunities, manage risks, and optimize your network with AI-powered insights
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              icon={BarChart3}
              className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50"
            >
              Analytics
            </Button>
            <Button 
              icon={Zap} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
            >
              Generate Insights
            </Button>
          </div>
        </div>

        {/* Network Intelligence Overview */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Network Intelligence Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {insights?.networkScore || 85}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Network Health Score
              </div>
              <div className="text-xs text-green-600 mt-1 font-semibold">
                +5 this month
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {insights?.growthRate || 12}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Monthly Growth Rate
              </div>
              <div className="text-xs text-green-600 mt-1 font-semibold">
                Above average
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {insights?.engagementRate || 68}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Engagement Rate
              </div>
              <div className="text-xs text-yellow-600 mt-1 font-semibold">
                Room for improvement
              </div>
            </div>
          </div>
        </Card>

        {/* AI Query Interface */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <AIQueryInterface onSend={sendQuery} isProcessing={chatMutation.isPending} />
        </Card>

        {/* Relationship Alerts */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <RelationshipAlerts alerts={relationshipAlerts} />
        </Card>

        {/* Intelligence Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insightCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${card.bgColor}`}>
                        <Icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {card.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${card.color}`}>
                        {card.metric}
                      </div>
                      <div className="text-xs text-gray-500">
                        {card.metricLabel}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {card.insights.length > 0 ? (
                      card.insights.slice(0, 3).map((insight: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{insight}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <Icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                          Building insights from your network activity...
                        </p>
                      </div>
                    )}
                  </div>

                  {card.insights.length > 3 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="ghost" size="sm" className="w-full">
                        View All {card.insights.length} Insights
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Items */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI-Generated Action Items
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Personalized recommendations to strengthen your network
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={Zap}>
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
                  <Button variant="outline" size="sm" className="bg-white/80 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                    Take Action
                  </Button>
                </div>
              )) || (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    AI is analyzing your network to generate personalized action items...
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Intelligence;