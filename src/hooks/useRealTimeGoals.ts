import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeToGoals } from '../api/goals';

export const useRealTimeGoals = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = subscribeToGoals((payload) => {
      console.log('Real-time goal update:', payload);
      
      // Invalidate and refetch goals when changes occur
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      
      // Also invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};