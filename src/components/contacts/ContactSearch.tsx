import React from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import Button from '../Button';

interface ContactSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  relationshipFilter: string;
  setRelationshipFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export default function ContactSearch({
  searchTerm,
  setSearchTerm,
  relationshipFilter,
  setRelationshipFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode
}: ContactSearchProps) {
  const relationshipTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'investor', label: 'Investor' },
    { value: 'mentor', label: 'Mentor' },
    { value: 'client', label: 'Client' },
    { value: 'partner', label: 'Partner' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'company', label: 'Sort by Company' },
    { value: 'trustScore', label: 'Sort by Trust Score' },
    { value: 'lastContact', label: 'Sort by Last Contact' }
  ];

  return (
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
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[140px]"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
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
  );
}