import React from 'react';
import { Users, Star, TrendingUp, MessageSquare } from 'lucide-react';
import Card from '../Card';

export interface ContactStatsProps {
  totalContacts: number;
  strongRelationships: number;
  averageTrustScore: number;
  growingEngagement: number;
}

export default function ContactStats({
  totalContacts,
  strongRelationships,
  averageTrustScore,
  growingEngagement
}: ContactStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-indigo-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalContacts}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Contacts</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <Star className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {strongRelationships}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Strong Relationships</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {averageTrustScore}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Trust Score</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {growingEngagement}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Growing Engagement</p>
          </div>
        </div>
      </Card>
    </div>
  );
}