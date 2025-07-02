
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';import Button from '../ui/Button';
import Spinner from '../Spinner';
import { getSuggestedActions, Suggestion } from '../../api/dashboard';

const SuggestedActions: React.FC = () => {
  const { data: suggestions, isLoading, error } = useQuery<Suggestion[], Error>({
    queryKey: ['suggested-actions'],
    queryFn: getSuggestedActions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Suggested Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">Failed to load suggestions.</div>
        ) : suggestions && suggestions.length > 0 ? (          <ul className="space-y-4">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">{suggestion.text}</span>
                <Button variant="outline" size="sm">View</Button>
              </li>
            ))}          </ul>
        ) : (
          <p className="text-sm text-gray-500">No suggestions at this time.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestedActions;