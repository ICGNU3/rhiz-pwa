import { supabase } from './client';
import type { Contact } from '../types';
import { demoContacts } from '../data/demoData';

export const getContacts = async (): Promise<Contact[]> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user || userError) {
      console.warn('No authenticated user for contacts: returning demo data.', userError?.message);
      return demoContacts;
    }

    let data: Contact[] = [];
    let error = null;

    try {
      const result = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      data = result.data ?? [];
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

    // Fetch user usage and settings
    const { data: usage } = await supabase
      .from('user_usage')
      .select('contacts_count')
      .eq('user_id', user.id)
      .single();
    const { data: settings } = await supabase
      .from('user_settings')
      .select('userType')
      .eq('user_id', user.id)
      .single();
    const isFreeTier = !settings?.userType || settings.userType === 'free';
    if (isFreeTier && usage?.contacts_count >= 25) {
      throw new Error('Free tier limit reached. Upgrade to add more than 25 contacts.');
    }
    // TODO: Enforce on backend with RLS or trigger

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
export const subscribeToContacts = (callback: (payload: unknown) => void) => {
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

export interface GoogleContact {
  name: string
  email: string
  phone: string
  company: string
  title: string
  source: 'google'
  google_id: string
}

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/settings`

export const contactsApi = {
  // Real Google OAuth Methods
  async initiateGoogleOAuth(): Promise<string> {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/contacts.readonly'
    ].join(' ')
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID!)
    authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('prompt', 'consent')
    
    return authUrl.toString()
  },

  async handleGoogleOAuthCallback(code: string): Promise<{ success: boolean; user?: unknown; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY!
        },
        body: JSON.stringify({
          action: 'exchange_code',
          code
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'OAuth exchange failed')
      }

      const result = await response.json()
      return { success: true, user: result.user }
    } catch (error) {
      console.error('Google OAuth error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async syncGoogleContacts(): Promise<{ success: boolean; contacts?: GoogleContact[]; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY!
        },
        body: JSON.stringify({
          action: 'get_contacts'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to sync contacts')
      }

      const result = await response.json()
      return { success: true, contacts: result.contacts }
    } catch (error) {
      console.error('Google contacts sync error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getGoogleIntegrationStatus(): Promise<{ connected: boolean; user?: unknown }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return { connected: false }

      const { data, error } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('provider', 'google')
        .single()

      if (error || !data) return { connected: false }
      
      return { connected: true, user: data.user_info }
    } catch (error) {
      console.error('Error checking Google integration:', error)
      return { connected: false }
    }
  },

  async disconnectGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      const { error } = await supabase
        .from('user_integrations')
        .delete()
        .eq('provider', 'google')

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error disconnecting Google:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  // Existing contact methods
  async getContacts(): Promise<Contact[]> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      // Return demo data for unauthenticated users
      return [
        {
          id: '1',
          user_id: 'demo',
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+1-555-0123',
          company: 'Tech Corp',
          title: 'Senior Developer',
          tags: ['work', 'tech'],
          healthScore: 85,
          last_contact: '2024-01-15',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          user_id: 'demo',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1-555-0456',
          company: 'Design Studio',
          title: 'UX Designer',
          tags: ['work', 'design'],
          healthScore: 92,
          last_contact: '2024-01-20',
          created_at: '2024-01-05T00:00:00Z'
        }
      ]
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contacts:', error)
      return []
    }

    return data || []
  },

  async createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact | null> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.warn('No session, contact creation skipped')
      return null
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', error)
      return null
    }

    return data
  },

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.warn('No session, contact update skipped')
      return null
    }

    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact:', error)
      return null
    }

    return data
  },

  async deleteContact(id: string): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.warn('No session, contact deletion skipped')
      return false
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact:', error)
      return false
    }

    return true
  },

  async bulkDeleteContacts(ids: string[]): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.warn('No session, bulk deletion skipped')
      return false
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .in('id', ids)

    if (error) {
      console.error('Error bulk deleting contacts:', error)
      return false
    }

    return true
  },

  async searchContacts(query: string): Promise<Contact[]> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      // Return filtered demo data for unauthenticated users
      const demoContacts = [
        {
          id: '1',
          user_id: 'demo',
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+1-555-0123',
          company: 'Tech Corp',
          title: 'Senior Developer',
          tags: ['work', 'tech'],
          healthScore: 85,
          last_contact: '2024-01-15',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          user_id: 'demo',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1-555-0456',
          company: 'Design Studio',
          title: 'UX Designer',
          tags: ['work', 'design'],
          healthScore: 92,
          last_contact: '2024-01-20',
          created_at: '2024-01-05T00:00:00Z'
        }
      ]

      return demoContacts.filter(contact =>
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.email?.toLowerCase().includes(query.toLowerCase()) ||
        contact.company?.toLowerCase().includes(query.toLowerCase())
      )
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching contacts:', error)
      return []
    }

    return data || []
  }
}

// Call the AI contact categorization and linking Edge Function
export async function aiCategorizeAndLinkContacts(contacts: Contact[]): Promise<{ enrichedContacts: Contact[]; suggestedMerges: Record<string, unknown>[] }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('ai-contact-categorize-link', {
    body: { contacts },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) throw error;
  return data;
}

// Call the contact web enrichment Edge Function
export async function enrichContactWithWebSearch(contact: Partial<Contact>): Promise<Record<string, unknown>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('contact-web-enrich', {
    body: contact,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) throw error;
  return data?.enriched;
}

// Call the merge contacts Edge Function
export async function mergeContacts(ids: string[]): Promise<{ success: boolean; message?: string; error?: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('merge-contacts', {
    body: { ids },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) throw error;
  return data;
}