import React, { useState, useEffect } from 'react';
import { Brain, Search, Send, Sparkles, Lightbulb, Zap } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Button from '../ui/Button';
import { sendChatQuery, getChatHistory } from '../../api/intelligence';

interface AIQueryInterfaceProps { 
  onSend?: (query: string) => Promise<void>;
  isProcessing?: boolean;
}

interface ChatMessage {
  id: string;
  query: string;
  response?: string;
  is_ai_response: boolean;
  confidence?: number;
  timestamp: string;
  suggestions?: string[];
}

export default function AIQueryInterface({ onSend, isProcessing = false }: AIQueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Load chat history
  const { data: historyData } = useQuery({
    queryKey: ['chat-history'],
    queryFn: () => getChatHistory(10),
  });

  useEffect(() => {
    if (historyData) {
      // Group messages by conversation pairs
      const groupedMessages: ChatMessage[] = [];
      for (let i = 0; i < historyData.length; i += 2) {
        const userMessage = historyData[i];
        const aiResponse = historyData[i + 1];
        
        if (userMessage && !userMessage.is_ai_response) {
          groupedMessages.push({
            id: userMessage.id,
            query: userMessage.query,
            response: aiResponse?.query || '',
            is_ai_response: false,
            confidence: aiResponse?.confidence,
            timestamp: userMessage.timestamp,
            suggestions: []
          });
        }
      }
      setChatHistory(groupedMessages.reverse());
    }
  }, [historyData]);

  const chatMutation = useMutation({
    mutationFn: sendChatQuery,
    onSuccess: (data) => {
      // Add the new conversation to chat history
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        query: query,
        response: data.response,
        is_ai_response: false,
        confidence: data.confidence,
        timestamp: data.timestamp,
        suggestions: data.suggestions || []
      };
      
      setChatHistory(prev => [...prev, newMessage]);
      setQuery('');
    },
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  const handleSubmit = async () => {
    if (!query.trim() || chatMutation.isPending) return;
    
    const userQuery = query.trim();
    
    try {
      if (onSend) {
        await onSend(userQuery);
        setQuery('');
      } else {
        await chatMutation.mutateAsync(userQuery);
      }
    } catch (error) {
      console.error('Failed to send query:', error);
    }
  };

  const quickQueries = [
    "Who haven't I spoken to in 90 days?",
    "Which connections could help with fundraising?",
    "Show me at-risk relationships",
    "Who should I introduce to each other?",
    "Find opportunities in my network",
    "What are my strongest relationships?",
    "Help me prioritize my goals",
    "Suggest networking events"
  ];

  // Quick network questions
  const quickNetworkQuestions = [
    'Who should I reach out to next?',
    'Who is at risk in my network?',
    'Where are my network gaps?',
    'Who has the highest trust score?',
    'Who did I last contact?',
  ];

  const handleQuickQuestion = (q: string) => {
    setQuery(q);
    setTimeout(() => handleSubmit(), 0); // Ensure query state is updated before submit
  };

  const isLoading = chatMutation.isPending || isProcessing;

  return (
    <div className="space-y-6">
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
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            />
          </div>
          <Button 
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!query.trim()}
            icon={Send}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Ask AI
          </Button>
        </div>

        {/* Quick Query Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Try asking:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQueries.map((quickQuery, index) => (
              <button
                key={index}
                onClick={() => setQuery(quickQuery)}
                disabled={isLoading}
                className="text-left text-sm px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-200 border border-indigo-200 dark:border-indigo-800 disabled:opacity-50 flex items-center space-x-2"
              >
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span>{quickQuery}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Network Questions */}
      <div className="mb-4">
        <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Quick Network Questions</div>
        <div className="flex flex-wrap gap-2">
          {quickNetworkQuestions.map((q, i) => (
            <button
              key={i}
              className="btn btn-xs btn-outline"
              onClick={() => handleQuickQuestion(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {chatHistory.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Welcome to your AI Relationship Assistant
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Ask me anything about your network, relationships, goals, or opportunities. 
            I'll analyze your data and provide intelligent insights.
          </p>
          <Button
            onClick={() => setQuery("What insights do you have about my network?")}
            icon={Sparkles}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
}