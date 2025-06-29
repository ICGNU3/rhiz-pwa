import React from 'react';
import { Zap } from 'lucide-react';
import Card from '../Card';

export default function GoalInsights() {
  const insights = [
    {
      title: 'Smart Recommendation',
      description: 'Connect with Sarah Chen for your fundraising goal - she just joined Stanford\'s AI committee.'
    },
    {
      title: 'Progress Alert',
      description: 'Your hiring goal is 70% complete. Schedule 3 more interviews to reach your target.'
    },
    {
      title: 'Network Opportunity',
      description: '5 mutual connections could help with your partnership goals. View suggestions.'
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Goal Insights</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">{insight.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}