import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, Filter, Search, Grid, List, Trash, Tag, Mail } from 'lucide-react';
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
import { filterContacts, sortContacts, applyContactFilters } from '../utils/helpers';
import { useNotifications, createNotification } from '../context/NotificationContext';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';

// Filter state type
interface ContactFilters {
  health: string[];
  trustScore: [number, number];
  tags: string[];
  lastContacted: { from: string; to: string };
  hasEmail: boolean;
  hasPhone: boolean;
  recentlyAdded: boolean;
}

const Contacts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const queryClient = useQueryClient();
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [localContacts, setLocalContacts] = useState<Contact[]>([]);
  const { addNotification } = useNotifications();
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<ContactFilters>({
    health: [],
    trustScore: [0, 100],
    tags: [],
    lastContacted: { from: '', to: '' },
    hasEmail: false,
    hasPhone: false,
    recentlyAdded: false,
  });

  const {
    recordSearch,
    recordFeature,
    recordTiming,
    getSearchStats,
    getFeatureStats,
  } = useBehaviorTracking();

  useEffect(() => {
    recordTiming(); // Track app open/check-in
  }, [recordTiming]);

  // Example: Track search type usage
  useEffect(() => {
    if (searchTerm) {
      // Guess search type: byName, byCompany, byTag, byTitle
      if (/^[a-zA-Z\s]+$/.test(searchTerm)) recordSearch('byName');
      if (localContacts.some(c => c.company.toLowerCase().includes(searchTerm.toLowerCase()))) recordSearch('byCompany');
      if (localContacts.some(c => c.tags && c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))) recordSearch('byTag');
      if (localContacts.some(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))) recordSearch('byTitle');
    }
    // eslint-disable-next-line
  }, [searchTerm]);

  // Example: Track filter usage
  useEffect(() => {
    if (filters.health.length) recordSearch('health');
    if (filters.tags.length) recordSearch('tag');
    if (filters.trustScore[0] > 0 || filters.trustScore[1] < 100) recordSearch('trustScore');
    if (filters.lastContacted.from || filters.lastContacted.to) recordSearch('lastContacted');
    if (filters.hasEmail) recordSearch('hasEmail');
    if (filters.hasPhone) recordSearch('hasPhone');
    if (filters.recentlyAdded) recordSearch('recentlyAdded');
    // eslint-disable-next-line
  }, [filters]);

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

  // Sync localContacts with fetched contacts
  useEffect(() => {
    if (contacts) setLocalContacts(contacts);
  }, [contacts]);

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

  // Bulk action handlers
  const handleBulkDelete = () => {
    const remaining = localContacts.filter(c => !selectedContactIds.includes(c.id));
    setLocalContacts(remaining);
    setSelectedContactIds([]);
    addNotification(createNotification.success(
      'Contacts deleted',
      'Selected contacts have been removed.',
      'contact'
    ));
  };
  const handleBulkTag = () => {
    const tag = prompt('Enter tag(s) to add to selected contacts (comma separated):');
    if (!tag) return;
    const tags = tag.split(',').map(t => t.trim()).filter(Boolean);
    setLocalContacts(localContacts.map(c =>
      selectedContactIds.includes(c.id)
        ? { ...c, tags: Array.from(new Set([...(c.tags || []), ...tags])) }
        : c
    ));
    addNotification(createNotification.success(
      'Tags added',
      `Added tag(s) to ${selectedContactIds.length} contacts.`,
      'contact'
    ));
  };
  const handleBulkMessage = () => {
    const selectedContacts = localContacts.filter(c => selectedContactIds.includes(c.id));
    const emails = selectedContacts.map(c => c.email).filter(Boolean);
    if (emails.length > 0) {
      window.open(`mailto:${emails.join(',')}`);
    } else {
      alert('No emails found for selected contacts');
    }
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
  const filteredContacts = applyContactFilters(localContacts, filters, searchTerm);
  const sortedContacts = sortContacts(filteredContacts, sortBy);

  // Calculate stats for ContactStats component
  const strongRelationships = localContacts.filter(c => c.relationship_strength === 'strong').length;
  const averageTrustScore = localContacts.length 
    ? Math.round(localContacts.reduce((sum, c) => sum + (c.trust_score || 0), 0) / localContacts.length)
    : 0;
  const growingEngagement = localContacts.filter(c => c.engagement_trend === 'up').length;

  // Use stats to adapt UI
  const searchStats = getSearchStats();
  const featureStats = getFeatureStats();

  // Reorder search filter chips based on usage
  const healthOrder = ['Healthy', 'At Risk', 'Stale'].sort((a, b) => (searchStats[a] || 0) < (searchStats[b] || 0) ? 1 : -1);

  // Show quick access bar for most-used features
  const quickFeatures = Object.entries(featureStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([feature]) => feature);

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
          totalContacts={localContacts.length}
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

        {/* Quick Access Bar */}
        {quickFeatures.length > 0 && (
          <div className="flex gap-2 mb-2">
            {quickFeatures.map(f => (
              <button key={f} className="btn btn-xs btn-accent" onClick={() => recordFeature(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Learning Banner for Root Members */}
        {true && (
          <div className="mb-2 p-2 rounded bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 text-xs font-medium shadow">
            Your Rhiz is learning your workflow to adapt and optimize your experience. 🚀
          </div>
        )}

        {/* Contacts Display */}
        <Card className="p-0 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          {/* Bulk Action Bar */}
          {selectedContactIds.length > 0 && (
            <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-2 bg-indigo-50 dark:bg-indigo-900/80 border-b border-indigo-200 dark:border-indigo-800 shadow-sm">
              <span className="text-sm text-indigo-700 dark:text-indigo-200 font-medium">
                {selectedContactIds.length} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button icon={Trash} variant="danger" size="sm" onClick={handleBulkDelete}>Delete</Button>
                <Button icon={Tag} variant="outline" size="sm" onClick={handleBulkTag}>Tag</Button>
                <Button icon={Mail} variant="primary" size="sm" onClick={handleBulkMessage}>Send Message</Button>
              </div>
            </div>
          )}
          <ContactListView
            contacts={sortedContacts}
            selectedContactIds={selectedContactIds}
            onSelectionChange={setSelectedContactIds}
          />
        </Card>

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

        {/* Filter dropdown panel */}
        {filterPanelOpen && (
          <div className="absolute z-20 mt-2 right-0 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
            <div className="font-semibold mb-2">Filters</div>
            {/* Health filter */}
            <div className="mb-3">
              <div className="text-xs font-medium mb-1">Relationship Health</div>
              <div className="flex gap-2">
                {healthOrder.map(h => (
                  <button
                    key={h}
                    className={`px-2 py-1 rounded text-xs border ${filters.health.includes(h) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                    onClick={() => setFilters(f => ({ ...f, health: f.health.includes(h) ? f.health.filter(x => x !== h) : [...f.health, h] }))}
                  >{h}</button>
                ))}
              </div>
            </div>
            {/* Trust score filter */}
            <div className="mb-3">
              <div className="text-xs font-medium mb-1">Trust Score</div>
              <div className="flex gap-2 items-center">
                <input type="number" min={0} max={100} value={filters.trustScore[0]} onChange={e => setFilters(f => ({ ...f, trustScore: [Number(e.target.value), f.trustScore[1]] }))} className="w-12 px-1 py-0.5 border rounded" />
                <span>-</span>
                <input type="number" min={0} max={100} value={filters.trustScore[1]} onChange={e => setFilters(f => ({ ...f, trustScore: [f.trustScore[0], Number(e.target.value)] }))} className="w-12 px-1 py-0.5 border rounded" />
              </div>
            </div>
            {/* Tags filter */}
            <div className="mb-3">
              <div className="text-xs font-medium mb-1">Tags</div>
              <input type="text" placeholder="Tag(s), comma separated" value={filters.tags.join(', ')} onChange={e => setFilters(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} className="w-full px-2 py-1 border rounded" />
            </div>
            {/* Last contacted filter */}
            <div className="mb-3">
              <div className="text-xs font-medium mb-1">Last Contacted</div>
              <div className="flex gap-2 items-center">
                <input type="date" value={filters.lastContacted.from} onChange={e => setFilters(f => ({ ...f, lastContacted: { ...f.lastContacted, from: e.target.value } }))} className="px-1 py-0.5 border rounded" />
                <span>-</span>
                <input type="date" value={filters.lastContacted.to} onChange={e => setFilters(f => ({ ...f, lastContacted: { ...f.lastContacted, to: e.target.value } }))} className="px-1 py-0.5 border rounded" />
              </div>
            </div>
            {/* Quick toggles */}
            <div className="mb-3 flex gap-2 flex-wrap">
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={filters.hasEmail} onChange={e => setFilters(f => ({ ...f, hasEmail: e.target.checked }))} />Has Email</label>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={filters.hasPhone} onChange={e => setFilters(f => ({ ...f, hasPhone: e.target.checked }))} />Has Phone</label>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={filters.recentlyAdded} onChange={e => setFilters(f => ({ ...f, recentlyAdded: e.target.checked }))} />Recently Added</label>
            </div>
            <div className="flex justify-between mt-4">
              <button className="btn btn-sm btn-outline" onClick={() => setFilters({ health: [], trustScore: [0, 100], tags: [], lastContacted: { from: '', to: '' }, hasEmail: false, hasPhone: false, recentlyAdded: false })}>Clear All</button>
              <button className="btn btn-sm btn-primary" onClick={() => setFilterPanelOpen(false)}>Apply</button>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        <div className="flex gap-2 flex-wrap my-2">
          {filters.health.map(h => (
            <span key={h} className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs flex items-center gap-1">{h} <button onClick={() => setFilters(f => ({ ...f, health: f.health.filter(x => x !== h) }))}>&times;</button></span>
          ))}
          {filters.tags.map(tag => (
            <span key={tag} className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs flex items-center gap-1">{tag} <button onClick={() => setFilters(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}>&times;</button></span>
          ))}
          {(filters.trustScore[0] > 0 || filters.trustScore[1] < 100) && (
            <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs flex items-center gap-1">Trust: {filters.trustScore[0]}-{filters.trustScore[1]} <button onClick={() => setFilters(f => ({ ...f, trustScore: [0, 100] }))}>&times;</button></span>
          )}
          {(filters.lastContacted.from || filters.lastContacted.to) && (
            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs flex items-center gap-1">Last: {filters.lastContacted.from || '...'} - {filters.lastContacted.to || '...'} <button onClick={() => setFilters(f => ({ ...f, lastContacted: { from: '', to: '' } }))}>&times;</button></span>
          )}
          {filters.hasEmail && (
            <span className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs flex items-center gap-1">Has Email <button onClick={() => setFilters(f => ({ ...f, hasEmail: false }))}>&times;</button></span>
          )}
          {filters.hasPhone && (
            <span className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs flex items-center gap-1">Has Phone <button onClick={() => setFilters(f => ({ ...f, hasPhone: false }))}>&times;</button></span>
          )}
          {filters.recentlyAdded && (
            <span className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs flex items-center gap-1">Recently Added <button onClick={() => setFilters(f => ({ ...f, recentlyAdded: false }))}>&times;</button></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;