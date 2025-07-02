import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, Filter, Search, Grid, List } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/ui/Button';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import ErrorBorder from '../components/ErrorBorder';
import ContactCard from '../components/contacts/ContactCard';
import ContactStats from '../components/contacts/ContactStats';
import ContactForm from '../components/contacts/ContactForm';
import ContactSearch from '../components/contacts/ContactSearch';
import ContactListView from '../components/contacts/ContactListView';
import { getContacts, createContact, Contact } from '../api/contacts';
import { useRealTimeContacts } from '../hooks/useRealTimeContacts';
import { filterContacts, sortContacts } from '../utils/helpers';

const Contacts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const queryClient = useQueryClient();

  // Enable real-time updates
  useRealTimeContacts();

  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });

  const createMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['network-data'] });
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
      relationship_type: 'colleague', // Default value
      source: 'manual'
    };

    createMutation.mutate(contactData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contacts</h1>
        </div>
        <ErrorBorder 
          message="Failed to load contacts. Please check your connection and try again."
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['contacts'] })}
        />
      </div>
    );
  }

  // Filter and sort contacts based on search and filters
  const filteredContacts = filterContacts(contacts || [], searchTerm, relationshipFilter);
  const sortedContacts = sortContacts(filteredContacts, sortBy);

  // Calculate stats for ContactStats component
  const strongRelationships = contacts?.filter(c => c.relationship_strength === 'strong').length || 0;
  const averageTrustScore = contacts?.length 
    ? Math.round(contacts.reduce((sum, c) => sum + (c.trust_score || 0), 0) / contacts.length)
    : 0;
  const growingEngagement = contacts?.filter(c => c.engagement_trend === 'up').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Contact Intelligence
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your intelligent relationship graph with trust scores and engagement insights
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              icon={Filter}
              className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50"
            >
              Advanced Filters
            </Button>
            <Button 
              icon={Plus} 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
            >
              Add Contact
            </Button>
          </div>
        </div>

        {/* Enhanced Statistics Dashboard */}
        <ContactStats 
          totalContacts={contacts?.length || 0}
          strongRelationships={strongRelationships}
          averageTrustScore={averageTrustScore}
          growingEngagement={growingEngagement}
        />

        {/* Search and Filters */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <ContactSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            relationshipFilter={relationshipFilter}
            setRelationshipFilter={setRelationshipFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </Card>

        {/* Results Summary */}
        {searchTerm && (
          <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <p className="text-indigo-700 dark:text-indigo-300">
              Found <span className="font-semibold">{sortedContacts.length}</span> contacts matching "{searchTerm}"
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchTerm('')}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Clear search
            </Button>
          </div>
        )}

        {/* Contacts Display */}
        {sortedContacts && sortedContacts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {sortedContacts.map((contact: Contact, index: number) => (
              <div
                key={contact.id}
                className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {viewMode === 'grid' ? (
                  <Card 
                    hover 
                    className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800 h-full"
                  >
                    <ContactCard contact={contact} />
                  </Card>
                ) : (
                  <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
                    <ContactListView contact={contact} />
                  </Card>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-16 text-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {searchTerm || relationshipFilter !== 'all' ? 'No contacts found' : 'No contacts yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {searchTerm || relationshipFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters to find the contacts you\'re looking for.'
                  : 'Start building your intelligent relationship graph by adding your first contact.'
                }
              </p>
              {!searchTerm && relationshipFilter === 'all' && (
                <Button 
                  icon={Plus} 
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
                >
                  Add Your First Contact
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Contact Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Contact"
          size="lg"
        >
          <ContactForm
            onSubmit={handleSubmit}
            loading={createMutation.isPending}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Contacts;