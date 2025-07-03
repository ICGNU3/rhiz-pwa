import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Users, Target, /* MessageSquare, */ Building, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getContacts } from '../api/contacts';
import { getGoals } from '../api/goals';

interface SearchResult {
  id: string;
  type: 'contact' | 'goal' | 'company';
  title: string;
  subtitle: string;
  icon: LucideIcon;
  url: string;
  score: number;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Fetch data for search
  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  });

  // Search results
  const [results, setResults] = useState<SearchResult[]>([]);

  // Search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const queryLower = searchQuery.toLowerCase();
    const newResults: SearchResult[] = [];

    // Search contacts
    if (contacts) {
      contacts.forEach((contact) => {
        const nameMatch = contact.name.toLowerCase().includes(queryLower);
        const emailMatch = contact.email.toLowerCase().includes(queryLower);
        const companyMatch = contact.company.toLowerCase().includes(queryLower);
        const titleMatch = contact.title.toLowerCase().includes(queryLower);

        if (nameMatch || emailMatch || companyMatch || titleMatch) {
          const score = nameMatch ? 100 : emailMatch ? 80 : companyMatch ? 60 : 40;
          newResults.push({
            id: contact.id,
            type: 'contact',
            title: contact.name,
            subtitle: `${contact.title} at ${contact.company}`,
            icon: Users,
            url: `/app/contacts/${contact.id}`,
            score,
          });
        }
      });
    }

    // Search goals
    if (goals) {
      goals.forEach((goal) => {
        const titleMatch = goal.title.toLowerCase().includes(queryLower);
        const descMatch = goal.description?.toLowerCase().includes(queryLower);

        if (titleMatch || descMatch) {
          const score = titleMatch ? 90 : 50;
          newResults.push({
            id: goal.id,
            type: 'goal',
            title: goal.title,
            subtitle: goal.description || 'No description',
            icon: Target,
            url: `/app/goals/${goal.id}`,
            score,
          });
        }
      });
    }

    // Search companies (from contacts)
    if (contacts) {
      const companies = new Set<string>();
      contacts.forEach((contact) => {
        if (contact.company.toLowerCase().includes(queryLower)) {
          companies.add(contact.company);
        }
      });

      companies.forEach((company) => {
        const companyContacts = contacts.filter(c => c.company === company);
        newResults.push({
          id: `company-${company}`,
          type: 'company',
          title: company,
          subtitle: `${companyContacts.length} contact${companyContacts.length !== 1 ? 's' : ''}`,
          icon: Building,
          url: `/app/contacts?company=${encodeURIComponent(company)}`,
          score: 70,
        });
      });
    }

    // Sort by relevance score
    newResults.sort((a, b) => b.score - a.score);
    setResults(newResults.slice(0, 10)); // Limit to 10 results
  }, [contacts, goals]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, contacts, goals, performSearch]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            navigate(results[selectedIndex].url);
            setIsOpen(false);
            setQuery('');
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, navigate]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsOpen(false);
    setQuery('');
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSelectedIndex(0);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search contacts, goals, companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((result, index) => {
            const Icon = result.icon;
            return (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors ${
                  index === selectedIndex ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {result.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {result.subtitle}
                  </div>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {result.type}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No results found for "{query}"</p>
            <p className="text-sm">Try searching for contacts, goals, or companies</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 