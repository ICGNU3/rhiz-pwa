import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Calendar, TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';
import Button from '../Button';

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
}

interface ContactCardProps { 
  contact: Contact; 
}

export default function ContactCard({ contact }: ContactCardProps) {
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEngagementIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRelationshipColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'weak': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {contact.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {contact.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(contact.relationshipStrength || 'medium')}`}>
                  {contact.relationshipStrength}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {contact.title} at {contact.company}
              </p>
            </div>
          </div>

          {/* Trust Score and Engagement */}
          <div className="flex items-center space-x-6 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Trust Score:</span>
              <span className={`font-bold ${getTrustScoreColor(contact.trustScore || 0)}`}>
                {contact.trustScore}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Engagement:</span>
              {getEngagementIcon(contact.engagementTrend || 'stable')}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Mutual:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {contact.mutualConnections}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {contact.email && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{contact.location}</span>
              </div>
            )}
          </div>

          {contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {contact.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {contact.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {contact.notes}
            </p>
          )}

          {contact.lastContact && (
            <p className="text-xs text-gray-500">
              Last contact: {new Date(contact.lastContact).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Button variant="outline" size="sm" icon={MessageSquare}>
            Message
          </Button>
          <Button variant="outline" size="sm" icon={Calendar}>
            Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}