import type { Contact } from '../types';

// Returns contacts not contacted in the last X days
export function getAtRiskContacts(contacts: Contact[], days: number = 30): Contact[] {
  const now = Date.now();
  return contacts.filter(contact => {
    if (!contact.lastContacted) return true; // Never contacted = at risk
    const diffDays = (now - new Date(contact.lastContacted).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= days;
  });
}

// Returns a health score (0-100) based on recency of contact
export function getRelationshipHealthScore(contact: Contact): number {
  if (!contact.lastContacted) return 0;
  const now = Date.now();
  const daysSince = (now - new Date(contact.lastContacted).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince < 14) return 100;
  if (daysSince < 30) return 70;
  if (daysSince < 60) return 40;
  return 10;
}

// Returns a health label for UI
export function getRelationshipHealthLabel(score: number): 'Healthy' | 'At Risk' | 'Stale' {
  if (score >= 70) return 'Healthy';
  if (score >= 40) return 'At Risk';
  return 'Stale';
} 