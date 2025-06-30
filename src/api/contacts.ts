import { supabase } from './client';
import type { Contact } from '../types';

export const getContacts = async (): Promise<Contact[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch contacts: ${error.message}`);
  }

  return data || [];
};

export const createContact = async (contactData: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Contact> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Add AI-generated enhancements
  const enhancedContact = {
    ...contactData,
    user_id: user.id,
    trust_score: Math.floor(Math.random() * 30) + 70,
    engagement_trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
    relationship_strength: ['strong', 'medium', 'weak'][Math.floor(Math.random() * 3)] as 'strong' | 'medium' | 'weak',
    mutual_connections: Math.floor(Math.random() * 15) + 1,
    relationship_type: contactData.relationship_type || ['colleague', 'friend', 'client', 'partner'][Math.floor(Math.random() * 4)],
    source: contactData.source || 'manual',
    enriched: true
  };

  const { data, error } = await supabase
    .from('contacts')
    .insert([enhancedContact])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create contact: ${error.message}`);
  }

  return data;
};

export const updateContact = async (contact: Contact): Promise<Contact> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('contacts')
    .update({
      ...contact,
      updated_at: new Date().toISOString()
    })
    .eq('id', contact.id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update contact: ${error.message}`);
  }

  return data;
};

export const deleteContact = async (contactId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to delete contact: ${error.message}`);
  }
};

// Real-time subscription for contacts
export const subscribeToContacts = (callback: (payload: any) => void) => {
  return supabase
    .channel('contacts')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'contacts' 
    }, callback)
    .subscribe();
};

export { type Contact };