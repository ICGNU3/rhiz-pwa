import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { getRecentActivities } from '../../api/dashboard';
import Spinner from '../Spinner';
import { demoContacts } from '../../data/demoData';
import { getAtRiskContacts, getRelationshipHealthScore, getRelationshipHealthLabel } from '../../utils/relationshipHealth';

const RecentActivity: React.FC = () => {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: getRecentActivities,
    staleTime: 60 * 1000, // 1 minute
  });

  const atRiskContacts = getAtRiskContacts(demoContacts, 30).slice(0, 3);

  return (
    <Card className="col-span-1 lg:col-span-2">      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">            <Spinner />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">Failed to load recent activity.</div>
        ) : activities && activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="text-sm text-gray-600 dark:text-gray-300">
                {activity.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No recent activity found.</p>
        )}

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span>Contacts At Risk</span>
          </h3>
          {atRiskContacts.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-sm">No at-risk contacts 🎉</div>
          ) : (
            <div className="space-y-2">
              {atRiskContacts.map(contact => {
                const healthScore = getRelationshipHealthScore(contact);
                const healthLabel = getRelationshipHealthLabel(healthScore);
                let healthColor = '';
                if (healthLabel === 'Healthy') healthColor = 'bg-green-100 text-green-700';
                else if (healthLabel === 'At Risk') healthColor = 'bg-yellow-100 text-yellow-800';
                else healthColor = 'bg-red-100 text-red-700';
                return (
                  <div key={contact.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded p-2 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-medium text-gray-900 dark:text-white">{contact.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${healthColor}`}>{healthLabel}</span>
                    </div>
                    <button
                      className="ml-2 px-3 py-1 rounded bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
                      onClick={() => window.open(`mailto:${contact.email || ''}?subject=Checking in&body=Hi ${contact.name},`)}
                    >
                      Send Message
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;