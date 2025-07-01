export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  location: string;
  relationship_type: string;
  relationship_strength: 'strong' | 'medium' | 'weak';
  trust_score: number;
  engagement_trend: 'up' | 'down' | 'stable';
  mutual_connections: number;
  last_contact: string; // ISO string
  notes: string;
  tags: string[];
  source: string;
  enriched: boolean;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}
