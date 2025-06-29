import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, Search, Filter, Grid, List, Star, TrendingUp, MessageSquare, Phone, Mail, MoreVertical } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
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
  relationshipType?: string;
}

const Contacts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const queryClient = useQueryClient();

  const { data: contacts, isLoading, error } = useQuery({
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

  // Enhance contacts with mock data
  const enhancedContacts = contacts?.map((contact: Contact) => ({
    ...contact,
    trustScore: Math.floor(Math.random() * 30) + 70,
    engagementTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
    relationshipStrength: ['strong', 'medium', 'weak'][Math.floor(Math.random() * 3)] as 'strong' | 'medium' | 'weak',
    mutualConnections: Math.floor(Math.random() * 15) + 1,
    relationshipType: ['friend', 'colleague', 'investor', 'mentor', 'client', 'partner'][Math.floor(Math.random() * 6)]
  }));

  // Filter and sort contacts
  const filteredContacts = enhancedContacts?.filter((contact: Contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (relationshipFilter === 'all') return matchesSearch;
    return matchesSearch && contact.relationshipType === relationshipFilter;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'company': return a.company.localeCompare(b.company);
      case 'trustScore': return (b.trustScore || 0) - (a.trustScore || 0);
      case 'lastContact': 
        if (!a.lastContact && !b.lastContact) return 0;
        if (!a.lastContact) return 1;
        if (!b.lastContact) return -1;
        return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
      default: return 0;
    }
  });

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
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to load contacts
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  const strongRelationships = enhancedContacts?.filter(c => c.relationshipStrength === 'strong').length || 0;
  const averageTrustScore = Math.round((enhancedContacts?.reduce((sum, c) => sum + (c.trustScore || 0), 0) || 0) / (enhancedContacts?.length || 1));
  const growingEngagement = enhancedContacts?.filter(c => c.engagementTrend === 'up').length || 0;

  const relationshipTypes = ['all', 'friend', 'colleague', 'investor', 'mentor', 'client', 'partner'];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl shadow-blue-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Contacts</p>
                <p className="text-3xl font-bold">{enhancedContacts?.length || 0}</p>
                <p className="text-blue-200 text-xs mt-1">+12 this month</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl shadow-green-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Strong Relationships</p>
                <p className="text-3xl font-bold">{strongRelationships}</p>
                <p className="text-green-200 text-xs mt-1">+5 this week</p>
              </div>
              <Star className="w-8 h-8 text-green-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl shadow-purple-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg Trust Score</p>
                <p className="text-3xl font-bold">{averageTrustScore}</p>
                <p className="text-purple-200 text-xs mt-1">+3 points</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl shadow-orange-500/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Growing Engagement</p>
                <p className="text-3xl font-bold">{growingEngagement}</p>
                <p className="text-orange-200 text-xs mt-1">Trending up</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts, companies, tags, or roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* Filters and Controls */}
            <div className="flex items-center space-x-4">
              <select
                value={relationshipFilter}
                onChange={(e) => setRelationshipFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[140px]"
              >
                {relationshipTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[140px]"
              >
                <option value="name">Sort by Name</option>
                <option value="company">Sort by Company</option>
                <option value="trustScore">Sort by Trust Score</option>
                <option value="lastContact">Sort by Last Contact</option>
              </select>

              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        {searchTerm && (
          <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <p className="text-indigo-700 dark:text-indigo-300">
              Found <span className="font-semibold">{filteredContacts?.length || 0}</span> contacts matching "{searchTerm}"
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
        {filteredContacts && filteredContacts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredContacts.map((contact: Contact, index: number) => (
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
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {contact.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {contact.name}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                contact.relationshipStrength === 'strong' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : contact.relationshipStrength === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {contact.relationshipStrength}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 truncate">
                              {contact.title} at {contact.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {contact.trustScore}
                            </p>
                            <p className="text-xs text-gray-500">Trust Score</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" icon={Mail} />
                            <Button variant="ghost" size="sm" icon={Phone} />
                            <Button variant="ghost" size="sm" icon={MessageSquare} />
                            <Button variant="ghost" size="sm" icon={MoreVertical} />
                          </div>
                        </div>
                      </div>
                    </div>
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