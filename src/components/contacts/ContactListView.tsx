import React from 'react';
import { Mail, Phone, MessageSquare, MoreVertical } from 'lucide-react';
import Button from '../ui/Button';
import { getTrustScoreColor, getRelationshipColor, getInitials } from '../../utils/helpers';
import type { Contact } from '../../types';

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
              {getInitials(contact.name)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {contact.name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(contact.relationship_strength || 'medium')}`}>
                {contact.relationship_strength}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 truncate">
              {contact.title} at {contact.company}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
              {contact.email}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className={`text-sm font-semibold ${getTrustScoreColor(contact.trust_score || 0)}`}>
              {contact.trust_score}
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