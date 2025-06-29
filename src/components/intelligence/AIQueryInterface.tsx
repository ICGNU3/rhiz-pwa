import React, { useState } from 'react';
import { Brain, Search, Send, Sparkles } from 'lucide-react';
import Button from '../Button';

interface AIQueryInterfaceProps { 
  onSend: (query: string) => Promise<void>;
  isProcessing?: boolean;
}

export default function AIQueryInterface({ onSend, isProcessing = false }: AIQueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', message: string, timestamp: Date}>>([]);

  const handleSubmit = async () => {
    if (!query.trim() || isProcessing) return;
    
    const userMessage = query.trim();
    setQuery('');
    
    // Add user message to chat
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: userMessage,
      timestamp: new Date()
    }]);

    try {
      await onSend(userMessage);
      
      // Simulate AI response
      const aiResponses = [
        "Based on your network analysis, I found 3 contacts who haven't been reached out to in over 90 days: Michael Rodriguez, Lisa Wang, and David Kim. Would you like me to draft personalized follow-up messages?",
        "Your fundraising goal could benefit from connections to Sarah Chen (AI/ML committee at Stanford) and Alex Thompson (former VC at Sequoia). Both have strong ties to your existing network.",
        "I've identified 2 at-risk relationships: Michael Rodriguez (90 days no contact, engagement down 15%) and Emily Johnson (missed last 2 scheduled calls). Recommend immediate outreach.",
        "Perfect introduction opportunity: Sarah Chen and Michael Rodriguez both work in AI/ML space and could benefit from knowing each other. They share 3 mutual connections through your network.",
        "Your network shows strong opportunities in the fintech space with 12 relevant connections. Top matches for your goals: Lisa Wang (fintech investor), David Kim (payments expert), Alex Thompson (regulatory specialist)."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          type: 'ai',
          message: randomResponse,
          timestamp: new Date()
        }]);
      }, 1500);
      
    } catch (error) {
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      }]);
    }
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
            AI Relationship Assistant
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Ask natural language questions about your network and get intelligent insights
          </p>
        </div>
      </div>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="mb-6 max-h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          {chatHistory.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl p-4 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-start space-x-3">
                  {message.type === 'ai' && (
                    <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-3xl p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Query Input */}
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
              disabled={isProcessing}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            />
          </div>
          <Button 
            onClick={handleSubmit}
            loading={isProcessing}
            disabled={!query.trim()}
            icon={Send}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Ask AI
          </Button>
        </div>

        {/* Quick Query Suggestions */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Try asking:</span>
          {quickQueries.map((quickQuery, index) => (
            <button
              key={index}
              onClick={() => setQuery(quickQuery)}
              disabled={isProcessing}
              className="text-xs px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 rounded-full hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-200 border border-indigo-200 dark:border-indigo-800 disabled:opacity-50"
            >
              {quickQuery}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}