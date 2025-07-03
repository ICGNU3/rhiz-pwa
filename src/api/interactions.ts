import { supabase } from './client';

export interface RelationshipInteraction {
  id?: string;
  user_id: string;
  contact_id: string;
  type: string; // 'email', 'call', 'meeting', 'note', etc.
  topic?: string;
  summary?: string;
  timestamp?: string;
  sentiment?: string;
  duration?: number;
  notes?: string;
  created_at?: string;
  source?: string; // 'manual', 'email', 'calendar', 'linkedin', etc.
  external_id?: string; // platform-specific unique id
  raw_metadata?: Record<string, any>; // platform-specific metadata
}

export interface RelationshipInsight {
  id?: string;
  user_id: string;
  contact_id: string;
  health_score?: number;
  decay_risk?: number;
  optimal_contact_time?: string;
  suggested_topics?: string[];
  prep_brief?: string;
  last_updated?: string;
}

// Log a new relationship interaction
export async function logInteraction(interaction: Omit<RelationshipInteraction, 'id' | 'created_at'>): Promise<RelationshipInteraction> {
  const { data, error } = await supabase
    .from('relationship_interactions')
    .insert([interaction])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Fetch all interactions for a contact
export async function getInteractionsForContact(contact_id: string): Promise<RelationshipInteraction[]> {
  const { data, error } = await supabase
    .from('relationship_interactions')
    .select('*')
    .eq('contact_id', contact_id)
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Fetch relationship insights for a contact
export async function getRelationshipInsight(contact_id: string): Promise<RelationshipInsight | null> {
  const { data, error } = await supabase
    .from('relationship_insights')
    .select('*')
    .eq('contact_id', contact_id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

// Update or insert relationship insight
export async function upsertRelationshipInsight(insight: Omit<RelationshipInsight, 'id' | 'last_updated'>): Promise<RelationshipInsight> {
  const { data, error } = await supabase
    .from('relationship_insights')
    .upsert([insight], { onConflict: 'user_id,contact_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
} 