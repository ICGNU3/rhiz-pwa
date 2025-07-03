import { supabase } from './client';

export interface Meeting {
  id: string;
  title: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  join_url?: string;
  participants_count?: number;
  participants: Array<{
    email: string;
    name: string;
    status?: string;
    join_time?: string;
    leave_time?: string;
    duration?: number;
    questions?: Array<{ question: string; answer: string }>;
  }>;
  source: 'calendly' | 'zoom' | 'google-meet';
  location?: string;
  event_type?: string;
  timezone?: string;
  calendly_uri?: string;
  zoom_id?: string;
  google_event_id?: string;
}

export interface IntegrationUser {
  id: string;
  name: string;
  email: string;
  scheduling_url?: string;
  timezone?: string;
  picture?: string;
}

export interface IntegrationStatus {
  provider: string;
  connected: boolean;
  user_info?: IntegrationUser;
  last_sync?: string;
}

// Calendly Integration
export const calendlyAPI = {
  async connect(apiKey: string): Promise<{ success: boolean; user: IntegrationUser }> {
    const response = await fetch('/api/calendly-oauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'connect_api_key', apiKey }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to connect Calendly');
    }
    
    return response.json();
  },

  async getMeetings(apiKey: string): Promise<{ success: boolean; meetings: Meeting[] }> {
    const response = await fetch('/api/calendly-oauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_meetings', apiKey }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Calendly meetings');
    }
    
    return response.json();
  },

  async getUserInfo(apiKey: string): Promise<{ success: boolean; user: IntegrationUser }> {
    const response = await fetch('/api/calendly-oauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_user_info', apiKey }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get Calendly user info');
    }
    
    return response.json();
  },
};

// Zoom Integration
export const zoomAPI = {
  async getAuthUrl(): Promise<string> {
    const clientId = process.env.NODE_ENV === 'production' 
      ? process.env.VITE_ZOOM_CLIENT_ID 
      : 'your-zoom-client-id';
    const redirectUri = process.env.NODE_ENV === 'production'
      ? `${window.location.origin}/settings`
      : 'http://localhost:5173/settings';
    
    return `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  },

  async exchangeCode(code: string): Promise<{ success: boolean; user: IntegrationUser }> {
    const response = await fetch('/api/zoom-oauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'exchange_code', code }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to exchange Zoom authorization code');
    }
    
    return response.json();
  },

  async getMeetings(): Promise<{ success: boolean; meetings: Meeting[] }> {
    const response = await fetch('/api/zoom-oauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_meetings' }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Zoom meetings');
    }
    
    return response.json();
  },
};

// Google Meet Integration
export const googleMeetAPI = {
  async getAuthUrl(): Promise<string> {
    const clientId = process.env.NODE_ENV === 'production' 
      ? process.env.VITE_GOOGLE_CLIENT_ID 
      : 'your-google-client-id';
    const redirectUri = process.env.NODE_ENV === 'production'
      ? `${window.location.origin}/settings`
      : 'http://localhost:5173/settings';
    
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ');
    
    return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;
  },

  async exchangeCode(code: string): Promise<{ success: boolean; user: IntegrationUser }> {
    const response = await fetch('/api/google-meet-oauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'exchange_code', code }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to exchange Google authorization code');
    }
    
    return response.json();
  },

  async getMeetings(): Promise<{ success: boolean; meetings: Meeting[] }> {
    const response = await fetch('/api/google-meet-oauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_meetings' }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Google Meet events');
    }
    
    return response.json();
  },
};

// General Integration Management
export const integrationsAPI = {
  async getStatus(): Promise<IntegrationStatus[]> {
    const { data: integrations, error } = await supabase
      .from('user_integrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return integrations?.map(integration => ({
      provider: integration.provider,
      connected: true,
      user_info: integration.user_info,
      last_sync: integration.updated_at,
    })) || [];
  },

  async disconnect(provider: string): Promise<void> {
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('provider', provider);

    if (error) throw error;
  },

  async syncMeetings(provider: string): Promise<Meeting[]> {
    let meetings: Meeting[] = [];

    switch (provider) {
      case 'calendly': {
        // For Calendly, we need the API key from the user
        throw new Error('Calendly sync requires API key - use calendlyAPI.getMeetings() directly');
      }
      
      case 'zoom': {
        const zoomResult = await zoomAPI.getMeetings();
        meetings = zoomResult.meetings;
        break;
      }
      
      case 'google-meet': {
        const googleResult = await googleMeetAPI.getMeetings();
        meetings = googleResult.meetings;
        break;
      }
      
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }

    // Store meetings in contacts table or a separate meetings table
    // This could create/update contacts based on meeting participants
    await this.processMeetingsIntoContacts(meetings);

    return meetings;
  },

  async processMeetingsIntoContacts(meetings: Meeting[]): Promise<void> {
    // Extract unique participants from all meetings
    const participants = new Map<string, {
      email: string;
      name: string;
      meeting_count: number;
      last_meeting: string;
      sources: string[];
    }>();

    meetings.forEach(meeting => {
      meeting.participants.forEach(participant => {
        const key = participant.email.toLowerCase();
        const existing = participants.get(key);
        
        if (existing) {
          existing.meeting_count += 1;
          existing.last_meeting = meeting.start_time > existing.last_meeting 
            ? meeting.start_time 
            : existing.last_meeting;
          if (!existing.sources.includes(meeting.source)) {
            existing.sources.push(meeting.source);
          }
        } else {
          participants.set(key, {
            email: participant.email,
            name: participant.name,
            meeting_count: 1,
            last_meeting: meeting.start_time,
            sources: [meeting.source],
          });
        }
      });
    });

    // Upsert contacts based on meeting participants
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    for (const [email, participant] of participants) {
      const { error } = await supabase
        .from('contacts')
        .upsert({
          user_id: user.id,
          name: participant.name,
          email: participant.email,
          company: '',
          title: '',
          notes: `Met in ${participant.meeting_count} meeting(s) via ${participant.sources.join(', ')}`,
          tags: participant.sources,
          source: participant.sources.join(','),
          healthScore: Math.min(participant.meeting_count * 10, 100),
          relationship_strength: participant.meeting_count > 2 ? 'strong' : 'weak',
          enriched: false,
          last_contact: participant.last_meeting,
        }, {
          onConflict: 'user_id,email'
        });

      if (error) {
        console.error(`Failed to upsert contact ${email}:`, error);
      }
    }
  },
}; 