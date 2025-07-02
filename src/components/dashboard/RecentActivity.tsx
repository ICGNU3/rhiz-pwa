import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { getRecentActivities } from '../../api/dashboard';
import Spinner from '../Spinner';

const RecentActivity: React.FC = () => {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: getRecentActivities,
    staleTime: 60 * 1000, // 1 minute
  });

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
      </CardContent>
    </Card>
  );
};

export default RecentActivity;