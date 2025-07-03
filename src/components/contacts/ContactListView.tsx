import React from 'react';
import { getRelationshipHealthScore, getRelationshipHealthLabel } from '../../utils/relationshipHealth';
import type { Contact } from '../../types';

interface ContactListViewProps {
  contacts: Contact[];
  selectedContactIds?: string[];
  onSelectionChange?: (selected: string[]) => void;
  onContactClick?: (contact: Contact) => void;
}

function ContactListView({ contacts, selectedContactIds = [], onSelectionChange, onContactClick }: ContactListViewProps) {
  const allSelected = contacts.length > 0 && contacts.every(c => selectedContactIds.includes(c.id));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange?.(contacts.map(c => c.id));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedContactIds, id]);
    } else {
      onSelectionChange?.(selectedContactIds.filter(cid => cid !== id));
    }
  };

  return (
    <div>
      {/* Select All Checkbox */}
      <div className="flex items-center px-2 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={handleSelectAll}
          className="form-checkbox h-4 w-4 text-indigo-600 mr-3"
        />
        <span className="text-xs text-gray-600 dark:text-gray-300">Select All</span>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {contacts.map(contact => {
          const healthScore = getRelationshipHealthScore(contact);
          const healthLabel = getRelationshipHealthLabel(healthScore);
          let healthColor = '';
          if (healthLabel === 'Healthy') healthColor = 'bg-green-100 text-green-700';
          else if (healthLabel === 'At Risk') healthColor = 'bg-yellow-100 text-yellow-800';
          else healthColor = 'bg-red-100 text-red-700';
          const checked = selectedContactIds.includes(contact.id);
          return (
            <div
              key={contact.id}
              className="flex items-center py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
              onClick={e => {
                // Prevent click from checkbox triggering row click
                if ((e.target as HTMLElement).tagName === 'INPUT') return;
                onContactClick?.(contact);
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={e => handleSelect(contact.id, e.target.checked)}
                className="form-checkbox h-4 w-4 text-indigo-600 mr-3"
                onClick={e => e.stopPropagation()}
              />
              <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full object-cover mr-3" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white truncate">{contact.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${healthColor}`}>{healthLabel}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{contact.title} @ {contact.company}</div>
              </div>
              {/* Trust score */}
              {typeof contact.trust_score === 'number' && (
                <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                  {contact.trust_score}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactListView;