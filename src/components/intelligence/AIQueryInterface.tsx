import React, { useState, useEffect } from 'react';
import { Brain, Search, Send, Sparkles, Lightbulb, Zap } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Button from '../Button';
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

  const isLoading = chatMutation.isPending || isProcessing;

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
          {chatHistory.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-3xl p-4 rounded-lg bg-indigo-600 text-white">
                  <p className="text-sm leading-relaxed">{message.query}</p>
                  <p className="text-xs text-indigo-200 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {/* AI Response */}
              {message.response && (
                <div className="flex justify-start">
                  <div className="max-w-3xl p-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.response}</p>
                        
                        {/* Confidence Score */}
                        {message.confidence && (
                          <div className="flex items-center space-x-2 mt-3">
                            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full">
                              <div 
                                className="h-1 bg-green-500 rounded-full transition-all duration-1000"
                                style={{ width: `${message.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {Math.round(message.confidence * 100)}% confidence
                            </span>
                          </div>
                        )}
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggested actions:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => setQuery(suggestion)}
                                  className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Loading State */}
          {isLoading && (
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