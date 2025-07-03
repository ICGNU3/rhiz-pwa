import React from 'react';
import { Grid, List } from 'lucide-react';

interface ContactSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const ContactSearch: React.FC<ContactSearchProps> = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1">
        <input
          type="text"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ContactSearch;