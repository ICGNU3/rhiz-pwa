import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, HeartHandshake, Goal } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import SuggestedActions from '../components/dashboard/SuggestedActions';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import { getDashboardStats } from '../api/dashboard';
import { useContextualSuggestions } from '../hooks/useContextualSuggestions';
import { useState } from 'react';

const Dashboard: React.FC = () => {  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { suggestions } = useContextualSuggestions('dashboard');
  const [showSuggestions, setShowSuggestions] = useState(true);

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
          {suggestions.map((s, i) => (
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

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RecentActivity />
        <SuggestedActions />
      </div>
    </div>
  );
};

export default Dashboard;