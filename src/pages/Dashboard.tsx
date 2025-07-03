import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, HeartHandshake, Goal } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import SuggestedActions from '../components/dashboard/SuggestedActions';
import AdaptiveDashboard from '../components/dashboard/AdaptiveDashboard';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import { getDashboardStats } from '../api/dashboard';
import { useAdaptiveBehavior } from '../hooks/useAdaptiveBehavior';
import { useNotifications, createNotification } from '../context/NotificationContext';

const Dashboard: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { getContextualSuggestions } = useAdaptiveBehavior();
  const [showSuggestions, setShowSuggestions] = useState(true);
  const suggestions = getContextualSuggestions('dashboard');

  // Network Insights state
  type Insight = {
    suggestedActions: string[];
    atRisk?: { id: string; name: string; last_contact?: string }[];
    opportunities?: { id: string; name: string; trust_score?: number }[];
    clusterGaps?: { type: string; count: number }[];
    totalContacts?: number;
  };
  const [insights, setInsights] = useState<Insight | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const { addNotification } = useNotifications();
  const [showMoreInsight, setShowMoreInsight] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setInsightsLoading(true);
      setInsightsError(null);
      try {
        const resp = await fetch('/functions/v1/network-insights', {
          headers: { Authorization: `Bearer ${localStorage.getItem('sb-access-token')}` },
        });
        if (!resp.ok) throw new Error('Failed to fetch network insights');
        const data = await resp.json();
        setInsights(data);
      } catch (err) {
        if (err instanceof Error) {
          setInsightsError(err.message || 'Failed to load network insights');
        } else {
          setInsightsError('Failed to load network insights');
        }
      } finally {
        setInsightsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const handleShowMoreInsight = (insight: string) => {
    // Simulate AI answer for now
    setAiAnswer(`AI deep dive: ${insight} — (This would be a detailed, personalized analysis powered by your network data and AI.)`);
    setShowMoreInsight(insight);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
        <ErrorBorder 
          message="Failed to load dashboard data. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Here's a snapshot of your network.</p>
      </div>

      {/* Contextual Suggestions Panel */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mb-4 p-3 rounded bg-gradient-to-r from-green-50 to-blue-50 border border-blue-200 shadow flex flex-col gap-2 relative">
          <button className="absolute top-2 right-2 text-xs text-blue-500" onClick={() => setShowSuggestions(false)} aria-label="Dismiss suggestions">&times;</button>
          <div className="font-semibold text-blue-900 mb-1">Suggestions for you</div>
          {suggestions.map((s: string, i: number) => (
            <div key={i} className="text-sm text-blue-800">{s}</div>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Contacts" 
          value={data?.totalContacts?.toString() || '0'}
          icon={Users}
          description={`${data?.newContactsLastMonth || 0} new this month`}
        />
        <StatCard 
          title="Network Health" 
          value={`${data?.networkHealth || 0}%`}
          icon={TrendingUp}
          description="Overall relationship strength"
        />
        <StatCard 
          title="Avg. Trust Score" 
          value={data?.overallTrust?.toString() || 'N/A'}          icon={HeartHandshake}
          description="Based on interactions"
        />
        <StatCard 
          title="Active Goals" 
          value={data?.totalGoals?.toString() || '0'}          icon={Goal}
          description={`${data?.goalsCompletedLastMonth || 0} completed this month`}
        />
      </div>

      {/* Network Insights Panel */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Network Insights</h2>
        <div className="mb-4">
          {insightsLoading && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded">Loading network insights...</div>
          )}
          {insightsError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">{insightsError}</div>
          )}
          {insights && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded space-y-2">
              <div className="font-semibold text-blue-900">Suggested Actions</div>
              <ul className="list-disc pl-5 mb-2">
                {insights.suggestedActions.map((a: string, i: number) => (
                  <li key={i} className="text-blue-800 flex items-center justify-between">
                    <span>{a}</span>
                    <span className="ml-2 flex gap-2">
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() => addNotification(createNotification.info('Reminder set', a, 'ai'))}
                      >Remind me</button>
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() => handleShowMoreInsight(a)}
                      >Show more</button>
                    </span>
                  </li>
                ))}
              </ul>
              {insights.atRisk && insights.atRisk.length > 0 && (
                <div className="mb-2">
                  <div className="font-medium text-yellow-900">At-Risk Relationships</div>
                  <ul className="list-disc pl-5">
                    {insights.atRisk.map((c) => (
                      <li key={c.id} className="text-yellow-800 flex items-center justify-between">
                        <span>{c.name} (last contact: {c.last_contact || 'N/A'})</span>
                        <button
                          className="btn btn-xs btn-outline ml-2"
                          onClick={() => handleShowMoreInsight(`At risk: ${c.name}`)}
                        >Show more</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {insights.opportunities && insights.opportunities.length > 0 && (
                <div className="mb-2">
                  <div className="font-medium text-green-900">Opportunities</div>
                  <ul className="list-disc pl-5">
                    {insights.opportunities.map((c) => (
                      <li key={c.id} className="text-green-800 flex items-center justify-between">
                        <span>{c.name} (trust: {c.trust_score})</span>
                        <button
                          className="btn btn-xs btn-outline ml-2"
                          onClick={() => handleShowMoreInsight(`Opportunity: ${c.name}`)}
                        >Show more</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {insights.clusterGaps && insights.clusterGaps.length > 0 && (
                <div className="mb-2">
                  <div className="font-medium text-purple-900">Network Gaps</div>
                  <ul className="list-disc pl-5">
                    {insights.clusterGaps.map((g, i: number) => (
                      <li key={i} className="text-purple-800 flex items-center justify-between">
                        <span>{g.type} (only {g.count})</span>
                        <button
                          className="btn btn-xs btn-outline ml-2"
                          onClick={() => handleShowMoreInsight(`Gap: ${g.type}`)}
                        >Show more</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="text-xs text-gray-500">Total contacts analyzed: {insights.totalContacts}</div>
            </div>
          )}
        </div>
        {/* Show more modal (placeholder) */}
        {showMoreInsight && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <div className="font-bold mb-2">More Insight</div>
              <div className="mb-4">{aiAnswer || showMoreInsight}</div>
              <button className="btn btn-primary" onClick={() => { setShowMoreInsight(null); setAiAnswer(null); }}>Close</button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RecentActivity />
        <SuggestedActions />
      </div>
    </div>
  );
};

export default Dashboard;