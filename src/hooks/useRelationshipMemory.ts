import { useState, useEffect } from 'react';
import { getInteractionsForContact, getRelationshipInsight } from '../api/interactions';
import { supabase } from '../api/client';

async function getContactById(contactId: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', contactId)
    .single();
  if (error) throw error;
  return data;
}

export function useRelationshipMemory(contactId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [insight, setInsight] = useState<any>(null);
  const [contact, setContact] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [contactData, interactionsData, insightData] = await Promise.all([
          getContactById(contactId),
          getInteractionsForContact(contactId),
          getRelationshipInsight(contactId)
        ]);
        if (!isMounted) return;
        setContact(contactData);
        setInteractions(interactionsData);
        setInsight(insightData);
      } catch (e: any) {
        setError(e.message || 'Failed to load relationship memory');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (contactId) fetchAll();
    return () => { isMounted = false; };
  }, [contactId]);

  return { loading, error, contact, interactions, insight };
} 