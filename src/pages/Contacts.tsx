import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, Search } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ContactCard from '../components/contacts/ContactCard';
import ContactStats from '../components/contacts/ContactStats';
import ContactForm from '../components/contacts/ContactForm';
import { getContacts, createContact } from '../api/contacts';

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
  trustScore?: number;
  engagementTrend?: 'up' | 'down' | 'stable';
  relationshipStrength?: 'strong' | 'medium' | 'weak';
  mutualConnections?: number;
}

const Contacts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });

  const createMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsModalOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const contactData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      title: formData.get('title') as string,
      location: formData.get('location') as string,
      notes: formData.get('notes') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
    };

    createMutation.mutate(contactData);
  };

  // Enhance contacts with mock trust scores and engagement data
  const enhancedContacts = contacts?.map((contact: Contact) => ({
    ...contact,
    trustScore: Math.floor(Math.random() * 30) + 70, // 70-100
    engagementTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
    relationshipStrength: ['strong', 'medium', 'weak'][Math.floor(Math.random() * 3)] as 'strong' | 'medium' | 'weak',
    mutualConnections: Math.floor(Math.random() * 15) + 1
  }));

  const filteredContacts = enhancedContacts?.filter((contact: Contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'strong') return matchesSearch && contact.relationshipStrength === 'strong';
    if (filterBy === 'needs-attention') return matchesSearch && (contact.relationshipStrength === 'weak' || contact.engagementTrend === 'down');
    if (filterBy === 'recent') return matchesSearch && contact.lastContact;
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const strongRelationships = enhancedContacts?.filter(c => c.relationshipStrength === 'strong').length || 0;
  const averageTrustScore = Math.round((enhancedContacts?.reduce((sum, c) => sum + (c.trustScore || 0), 0) || 0) / (enhancedContacts?.length || 1));
  const growingEngagement = enhancedContacts?.filter(c => c.engagementTrend === 'up').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relationship Graph</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your intelligent network with trust scores, engagement trends, and relationship insights.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search contacts, companies, or roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Contacts</option>
          <option value="strong">Strong Relationships</option>
          <option value="needs-attention">Needs Attention</option>
          <option value="recent">Recent Contact</option>
        </select>
      </div>

      {/* Network Stats */}
      <ContactStats
        totalContacts={enhancedContacts?.length || 0}
        strongRelationships={strongRelationships}
        averageTrustScore={averageTrustScore}
        growingEngagement={growingEngagement}
      />

      {/* Contacts Grid */}
      <div className="grid gap-6">
        {filteredContacts?.map((contact: Contact) => (
          <Card key={contact.id} hover>
            <ContactCard contact={contact} />
          </Card>
        )) || (
          <Card>
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No contacts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start building your intelligent relationship graph by adding your first contact.
              </p>
              <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                Add Your First Contact
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Contact"
        size="lg"
      >
        <ContactForm
          onSubmit={handleSubmit}
          loading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default Contacts;