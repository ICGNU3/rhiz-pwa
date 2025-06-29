interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  title: string;
  location?: string;
  notes?: string;
  tags: string[];
  lastContact?: string;
}

export const getContacts = async (): Promise<Contact[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const contacts = localStorage.getItem('rhiz-contacts');
  if (contacts) {
    return JSON.parse(contacts);
  }
  
  // Return mock data if no contacts exist
  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@techcorp.com',
      phone: '+1-555-0123',
      company: 'TechCorp',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      notes: 'Met at React Conference 2024. Interested in AI/ML projects.',
      tags: ['tech', 'ai', 'react'],
      lastContact: '2025-01-10'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      email: 'michael@startup.io',
      phone: '+1-555-0124',
      company: 'Startup.io',
      title: 'Product Manager',
      location: 'Austin, TX',
      notes: 'Former colleague, now working on fintech products.',
      tags: ['fintech', 'product', 'startup'],
      lastContact: '2025-01-08'
    },
    {
      id: '3',
      name: 'Emily Johnson',
      email: 'emily@designstudio.com',
      company: 'Design Studio',
      title: 'UX Designer',
      location: 'New York, NY',
      notes: 'Excellent designer, potential collaboration opportunities.',
      tags: ['design', 'ux', 'collaboration']
    }
  ];
  
  localStorage.setItem('rhiz-contacts', JSON.stringify(mockContacts));
  return mockContacts;
};

export const createContact = async (contactData: Omit<Contact, 'id'>): Promise<Contact> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newContact: Contact = {
    ...contactData,
    id: Date.now().toString()
  };
  
  const existingContacts = JSON.parse(localStorage.getItem('rhiz-contacts') || '[]');
  const updatedContacts = [...existingContacts, newContact];
  localStorage.setItem('rhiz-contacts', JSON.stringify(updatedContacts));
  
  return newContact;
};