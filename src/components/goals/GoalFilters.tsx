import React from 'react';
import { Filter } from 'lucide-react';

export interface GoalFiltersProps {
  filterBy: string;
  setFilterBy: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function GoalFilters({ filterBy, setFilterBy, sortBy, setSortBy }: GoalFiltersProps) {
  const filters = ['all', 'active', 'completed', 'overdue', 'high-priority'];
  
  const filterLabels = {
    'all': 'All Goals',
    'active': 'Active',
    'completed': 'Completed',
    'overdue': 'Overdue',
    'high-priority': 'High Priority'
  };

  const sortOptions = [
    { value: 'priority', label: 'Sort by Priority' },
    { value: 'progress', label: 'Sort by Progress' },
    { value: 'deadline', label: 'Sort by Deadline' },
    { value: 'created', label: 'Sort by Created' }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterBy(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                filterBy === filter
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {filterLabels[filter as keyof typeof filterLabels]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}