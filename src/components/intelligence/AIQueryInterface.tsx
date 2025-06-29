import React, { useState } from 'react';
import { Brain, Search } from 'lucide-react';
import Button from '../Button';

interface AIQueryInterfaceProps { 
  onQuery: (query: string) => void;
  isProcessing?: boolean;
}

export default function AIQueryInterface({ onQuery, isProcessing = false }: AIQueryInterfaceProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (!query.trim()) return;
    onQuery(query);
    setQuery('');
  };

  const quickQueries = [
    "Who haven't I spoken to in 90 days?",
    "Which connections could help with fundraising?",
    "Show me at-risk relationships",
    "Who should I introduce to each other?",
    "Find opportunities in my network"
  ];

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Ask Your Network Anything
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Natural language queries about your relationships and opportunities
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="e.g., Who in my network works in AI and could help with introductions?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <Button 
            onClick={handleSubmit}
            loading={isProcessing}
            disabled={!query.trim()}
          >
            Ask AI
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Try asking:</span>
          {quickQueries.map((quickQuery, index) => (
            <button
              key={index}
              onClick={() => setQuery(quickQuery)}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {quickQuery}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}