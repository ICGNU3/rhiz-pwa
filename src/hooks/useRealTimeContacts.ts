import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeToContacts } from '../api/contacts';

export const useRealTimeContacts = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = subscribeToContacts((payload) => {
      console.log('Real-time contact update:', payload);
      
      // Invalidate and refetch contacts when changes occur
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      
      // Also invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['network-data'] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};