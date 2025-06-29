import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Calendar, TrendingUp, TrendingDown, Minus, Star, ExternalLink, MoreVertical } from 'lucide-react';
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
  relationshipType?: string;
}

interface ContactCardProps { 
  contact: Contact; 
}

export default function ContactCard({ contact }: ContactCardProps) {
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
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
      case 'strong': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200';
      case 'weak': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200';
    }
  };

  const getRelationshipTypeColor = (type: string) => {
    const colors = {
      friend: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      colleague: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      investor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      mentor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      client: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      partner: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  return (
    <div className="p-6 relative overflow-hidden group">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full transform rotate-45 scale-150"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {contact.name.charAt(0)}
                </span>
              </div>
              {contact.relationshipStrength === 'strong' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {contact.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                {contact.title}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm truncate">
                {contact.company}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" icon={MoreVertical} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Trust Score and Metrics */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getTrustScoreColor(contact.trustScore || 0)}`}>
              {contact.trustScore}
            </div>
            <div className="flex items-center space-x-1">
              {getEngagementIcon(contact.engagementTrend || 'stable')}
              <span className="text-xs text-gray-500">Engagement</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {contact.mutualConnections}
            </p>
            <p className="text-xs text-gray-500">Mutual</p>
          </div>
        </div>

        {/* Relationship Tags */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRelationshipColor(contact.relationshipStrength || 'medium')}`}>
            {contact.relationshipStrength}
          </span>
          {contact.relationshipType && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipTypeColor(contact.relationshipType)}`}>
              {contact.relationshipType}
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {contact.email && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.location && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{contact.location}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {contact.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
            {contact.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                +{contact.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Last Contact */}
        {contact.lastContact && (
          <p className="text-xs text-gray-500 mb-4">
            Last contact: {new Date(contact.lastContact).toLocaleDateString()}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" icon={MessageSquare} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" />
            <Button variant="ghost" size="sm" icon={Phone} className="text-green-600 hover:text-green-700 hover:bg-green-50" />
            <Button variant="ghost" size="sm" icon={Mail} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" />
          </div>
          <Button variant="outline" size="sm" icon={ExternalLink} className="opacity-0 group-hover:opacity-100 transition-opacity">
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}