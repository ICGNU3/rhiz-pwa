import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Calendar, Star, ExternalLink, MoreVertical } from 'lucide-react';
import Button from '../ui/Button';
import { getTrustScoreColor, getRelationshipColor, getRelationshipTypeColor, getInitials } from '../../utils/helpers';
import type { Contact } from '../../types';

interface ContactCardProps { 
  contact: Contact; 
}

export default function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="p-6 relative overflow-hidden group">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="w-full h-full bg-gradient-to-br from-aqua to-lavender rounded-full transform rotate-45 scale-150"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-aqua to-lavender rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-light text-lg">
                  {getInitials(contact.name)}
                </span>
              </div>
              {contact.relationship_strength === 'strong' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-light text-gray-900 dark:text-white truncate">
                {contact.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-light truncate">
                {contact.title}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm font-light truncate">
                {contact.company}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" icon={MoreVertical} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Trust Score and Metrics */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-light ${getTrustScoreColor(contact.trust_score || 0)} ${getTrustScoreColor(contact.trust_score || 0).replace('text-', 'bg-').replace('-600', '-100')} dark:bg-opacity-20`}>
              {contact.trust_score}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-light text-gray-900 dark:text-white">
              {contact.mutual_connections}
            </p>
            <p className="text-xs font-light text-gray-500">Mutual</p>
          </div>
        </div>

        {/* Relationship Tags */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-light border ${getRelationshipColor(contact.relationship_strength || 'medium')}`}>
            {contact.relationship_strength}
          </span>
          {contact.relationship_type && (
            <span className={`px-2 py-1 rounded-full text-xs font-light ${getRelationshipTypeColor(contact.relationship_type)}`}>
              {contact.relationship_type}
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {contact.email && (
            <div className="flex items-center space-x-2 text-sm font-light text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center space-x-2 text-sm font-light text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.location && (
            <div className="flex items-center space-x-2 text-sm font-light text-gray-600 dark:text-gray-400">
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
                className="px-2 py-1 bg-aqua/10 dark:bg-aqua/20 text-aqua dark:text-aqua/80 text-xs rounded-md font-light"
              >
                {tag}
              </span>
            ))}
            {contact.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md font-light">
                +{contact.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Last Contact */}
        {contact.last_contact && (
          <p className="text-xs font-light text-gray-500 mb-4">
            Last contact: {new Date(contact.last_contact).toLocaleDateString()}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" icon={MessageSquare} className="text-aqua hover:text-aqua hover:bg-aqua/10 font-light" />
            <Button variant="ghost" size="sm" icon={Phone} className="text-emerald hover:text-emerald hover:bg-emerald/10 font-light" />
            <Button variant="ghost" size="sm" icon={Mail} className="text-lavender hover:text-lavender hover:bg-lavender/10 font-light" />
          </div>
          <Button variant="outline" size="sm" icon={ExternalLink} className="opacity-0 group-hover:opacity-100 transition-opacity font-light">
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}