import { useState, useEffect } from 'react';
import { getPlatformIntegrations, addPlatformIntegration, updatePlatformIntegration, deletePlatformIntegration, PlatformIntegration } from '../api/integrations';

export function usePlatformIntegrations() {
  const [integrations, setIntegrations] = useState<PlatformIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPlatformIntegrations()
      .then(setIntegrations)
      .catch(e => setError(e.message || 'Failed to load integrations'))
      .finally(() => setLoading(false));
  }, []);

  const addIntegration = async (integration: Omit<PlatformIntegration, 'id' | 'created_at' | 'updated_at'>) => {
    const newIntegration = await addPlatformIntegration(integration);
    setIntegrations(prev => [...prev, newIntegration]);
  };

  const updateIntegration = async (id: string, updates: Partial<PlatformIntegration>) => {
    const updated = await updatePlatformIntegration(id, updates);
    setIntegrations(prev => prev.map(i => i.id === id ? updated : i));
  };

  const removeIntegration = async (id: string) => {
    await deletePlatformIntegration(id);
    setIntegrations(prev => prev.filter(i => i.id !== id));
  };

  return { integrations, loading, error, addIntegration, updateIntegration, removeIntegration };
} 