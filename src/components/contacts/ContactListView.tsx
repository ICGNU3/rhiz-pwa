import React from 'react';
import { Mail, Phone, MessageSquare, MoreVertical } from 'lucide-react';
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

interface ContactListViewProps {
  contact: Contact;
}

export default function ContactListView({ contact }: ContactListViewProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {contact.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {contact.name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                contact.relationshipStrength === 'strong' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : contact.relationshipStrength === 'medium'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {contact.relationshipStrength}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 truncate">
              {contact.title} at {contact.company}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {contact.trustScore}
            </p>
            <p className="text-xs text-gray-500">Trust Score</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" icon={Mail} />
            <Button variant="ghost" size="sm" icon={Phone} />
            <Button variant="ghost" size="sm" icon={MessageSquare} />
            <Button variant="ghost" size="sm" icon={MoreVertical} />
          </div>
        </div>
      </div>
    </div>
  );
}