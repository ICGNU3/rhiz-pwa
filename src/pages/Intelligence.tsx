import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TrendingUp, Users, Target, Lightbulb, MessageSquare, Brain, Zap, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import AIQueryInterface from '../components/intelligence/AIQueryInterface';
import RelationshipAlerts from '../components/intelligence/RelationshipAlerts';
import { getIntelligenceInsights, sendChatQuery, getNetworkInsights } from '../api/intelligence';

const Intelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatHistory, setChatHistory] = useState<{ user: string; ai: string; timestamp: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Fetch intelligence insights
  const { data: insights, isLoading, error, refetch } = useQuery({
    queryKey: ['intelligence-insights'],
    queryFn: getIntelligenceInsights,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch network insights from edge function
  const { data: networkInsights, isLoading: networkLoading } = useQuery({
    queryKey: ['network-insights'],
    queryFn: getNetworkInsights,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Chat mutation for AI queries
  const chatMutation = useMutation({
    mutationFn: sendChatQuery,
    onMutate: (query: string) => {
      setIsProcessing(true);
      // Optimistically add user message
      setChatHistory(prev => [...prev, { 
        user: query, 
        ai: '', 
        timestamp: new Date().toISOString() 
      }]);
    },
    onSuccess: (response, query) => {
      setChatHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex] && updated[lastIndex].user === query) {
          updated[lastIndex].ai = response.response;
        }
        return updated;
      });
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setChatHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex] && !updated[lastIndex].ai) {
          updated[lastIndex].ai = 'Sorry, I encountered an error processing your request. Please try again.';
        }
        return updated;
      });
      setIsProcessing(false);
    }
  });

  const sendQuery = async (query: string) => {
    if (!query.trim() || isProcessing) return;
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

  // Enhanced relationship alerts with real data
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

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, description: 'Interactive AI assistant' },
    { id: 'insights', label: 'Network Insights', icon: Brain, description: 'AI-generated insights' },
    { id: 'alerts', label: 'Relationship Alerts', icon: AlertTriangle, description: 'Risk & opportunity alerts' }
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
              onClick={() => refetch()}
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
                {networkInsights?.networkScore || insights?.networkScore || 85}
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

        {/* Main Content - Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Column */}
          <div className="col-span-1 lg:col-span-3">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              {activeTab === 'chat' && (
                <div className="space-y-6">
                  {/* Chat History */}
                  {chatHistory.length > 0 && (
                    <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      {chatHistory.map((entry, index) => (
                        <div key={index} className="space-y-3">
                          {/* User Message */}
                          <div className="flex justify-end">
                            <div className="max-w-3xl p-4 rounded-lg bg-indigo-600 text-white">
                              <p className="text-sm leading-relaxed">{entry.user}</p>
                              <p className="text-xs text-indigo-200 mt-2">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          
                          {/* AI Response */}
                          {entry.ai && (
                            <div className="flex justify-start">
                              <div className="max-w-3xl p-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                                <div className="flex items-start space-x-3">
                                  <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded">
                                    <Brain className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm leading-relaxed">{entry.ai}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                      {new Date(entry.timestamp).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Loading State */}
                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="max-w-3xl p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                              <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded">
                                <Brain className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <AIQueryInterface onSend={sendQuery} isProcessing={isProcessing} />
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="space-y-6">
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

                  {/* Network Insights from Edge Function */}
                  {networkInsights && (
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          AI Network Analysis
                        </h3>
                        
                        {networkInsights.insights && networkInsights.insights.length > 0 && (
                          <div className="space-y-4">
                            {networkInsights.insights.map((insight: any, index: number) => (
                              <div key={index} className={`p-4 rounded-lg border ${
                                insight.impact === 'high' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' :
                                insight.impact === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' :
                                'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                              }`}>
                                <div className="flex items-start space-x-3">
                                  <div className={`p-1 rounded ${
                                    insight.impact === 'high' ? 'bg-red-500' :
                                    insight.impact === 'medium' ? 'bg-yellow-500' :
                                    'bg-blue-500'
                                  }`}>
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                      {insight.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {insight.description}
                                    </p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    insight.impact === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                  }`}>
                                    {insight.impact.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {networkInsights.recommendations && networkInsights.recommendations.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              AI Recommendations
                            </h4>
                            <div className="space-y-2">
                              {networkInsights.recommendations.map((rec: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'alerts' && (
                <RelationshipAlerts alerts={relationshipAlerts} />
              )}
            </Card>
          </div>

          {/* Insights Sidebar */}
          <aside className="col-span-1 space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Insights
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-400">
                      Network Growing
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    15% growth this month with strong engagement
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                      New Opportunities
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    12 potential connections identified
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                      Attention Needed
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    3 relationships need follow-up
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {insights?.actionItems?.slice(0, 3).map((action: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{action}</p>
                  </div>
                )) || (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    No recent activity
                  </p>
                )}
              </div>
            </Card>
          </aside>
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