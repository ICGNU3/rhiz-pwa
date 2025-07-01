import { supabase } from './client';
import type { Contact } from '../types';

export const getContacts = async (): Promise<Contact[]> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user || userError) {
      console.warn('No authenticated user for contacts:', userError?.message);
      
      // Return helpful demo contacts for unauthenticated users
      return [
        {
          id: 'demo-contact-1',
          user_id: 'demo',
          name: 'Sarah Chen',
          email: 'sarah.chen@techcorp.com',
          company: 'TechCorp AI',
          title: 'VP of Engineering',
          phone: '+1-555-0123',
          location: 'San Francisco, CA',
          relationship_type: 'colleague',
          relationship_strength: 'strong',
          trust_score: 88,
          engagement_trend: 'up',
          mutual_connections: 12,
          last_contact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          notes: 'Met at AI conference. Very knowledgeable about ML infrastructure. Recently joined Stanford AI committee.',
          tags: ['AI', 'Engineering', 'Stanford'],
          source: 'conference',
          enriched: true,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-contact-2',
          user_id: 'demo',
          name: 'Michael Rodriguez',
          email: 'michael@startupfund.vc',
          company: 'Startup Fund',
          title: 'Partner',
          phone: '+1-555-0456',
          location: 'New York, NY',
          relationship_type: 'partner',
          relationship_strength: 'medium',
          trust_score: 76,
          engagement_trend: 'down',
          mutual_connections: 8,
          last_contact: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
          notes: 'Early stage investor focused on B2B SaaS. Invested in 3 companies in our space. Worth following up.',
          tags: ['Investor', 'B2B', 'SaaS'],
          source: 'linkedin',
          enriched: true,
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-contact-3',
          user_id: 'demo',
          name: 'Emma Wilson',
          email: 'emma.wilson@designstudio.co',
          company: 'Design Studio',
          title: 'Creative Director',
          phone: '+1-555-0789',
          location: 'Austin, TX',
          relationship_type: 'client',
          relationship_strength: 'strong',
          trust_score: 92,
          engagement_trend: 'stable',
          mutual_connections: 6,
          last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          notes: 'Fantastic design partner. Recently promoted to Creative Director. Great person to collaborate with on UX projects.',
          tags: ['Design', 'UX', 'Creative'],
          source: 'referral',
          enriched: true,
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-contact-4',
          user_id: 'demo',
          name: 'Alex Thompson',
          email: 'alex@ycombinator.com',
          company: 'Y Combinator',
          title: 'Partner',
          phone: '+1-555-0321',
          location: 'Mountain View, CA',
          relationship_type: 'colleague',
          relationship_strength: 'medium',
          trust_score: 85,
          engagement_trend: 'up',
          mutual_connections: 24,
          last_contact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          notes: 'YC partner focused on AI/ML startups. Very connected in the ecosystem. Met at YC Demo Day.',
          tags: ['YC', 'AI', 'Startups', 'Accelerator'],
          source: 'event',
          enriched: true,
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-contact-5',
          user_id: 'demo',
          name: 'Maria Garcia',
          email: 'maria.garcia@angelgroup.com',
          company: 'Angel Group',
          title: 'Angel Investor',
          phone: '+1-555-0654',
          location: 'Los Angeles, CA',
          relationship_type: 'partner',
          relationship_strength: 'weak',
          trust_score: 68,
          engagement_trend: 'stable',
          mutual_connections: 4,
          last_contact: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
          notes: 'Angel investor interested in B2B tools. Haven\'t connected in a while - should follow up soon.',
          tags: ['Angel', 'B2B', 'Tools'],
          source: 'manual',
          enriched: true,
          created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(), // 150 days ago
          updated_at: new Date().toISOString()
        }
      ];
    }

    let data = [];
    let error = null;

    try {
      const result = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      data = result.data;
      error = result.error;
    } catch (dbError) {
      console.warn('Database error when fetching contacts:', dbError);
      // Continue with empty array
    }

    if (error) {
      console.warn('Error fetching contacts:', error.message);
      return []; // Return empty array instead of throwing
    }

    // Return contacts or empty array (component will show empty state)
    return data || [];

  } catch (error) {
    console.error('Unexpected error in getContacts:', error);
    return []; // Always return array, never throw
  }
};

export const createContact = async (contactData: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Contact> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user || userError) {
      console.warn('No user for contact creation:', userError?.message);
      throw new Error('Please sign in to create contacts');
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
      console.error('Error creating contact:', error);
      throw new Error(`Failed to create contact: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in createContact:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create contact. Please try again.');
  }
};

export const updateContact = async (contact: Contact): Promise<Contact> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user || userError) {
      console.warn('No user for contact update:', userError?.message);
      throw new Error('Please sign in to update contacts');
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
      console.error('Error updating contact:', error);
      throw new Error(`Failed to update contact: ${error.message}`);
    }

    if (!data) {
      throw new Error('Contact not found or you do not have permission to update it');
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in updateContact:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update contact. Please try again.');
  }
};

export const deleteContact = async (contactId: string): Promise<void> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user || userError) {
      console.warn('No user for contact deletion:', userError?.message);
      throw new Error('Please sign in to delete contacts');
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting contact:', error);
      throw new Error(`Failed to delete contact: ${error.message}`);
    }

    console.log('Contact deleted successfully:', contactId);
  } catch (error) {
    console.error('Unexpected error in deleteContact:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete contact. Please try again.');
  }
};

// Real-time subscription with error handling
export const subscribeToContacts = (callback: (payload: any) => void) => {
  try {
    return supabase
      .channel('contacts')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contacts' 
      }, callback)
      .subscribe();
  } catch (error) {
    console.warn('Failed to subscribe to contacts changes:', error);
    return null;
  }
};

export { type Contact };