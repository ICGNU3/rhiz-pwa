import React from 'react';
import { useRelationshipMemory } from '../../hooks/useRelationshipMemory';
import { Card } from '../ui/Card';
import Spinner from '../Spinner';

interface Props {
  contactId: string;
}

const ContactMemoryPanel: React.FC<Props> = ({ contactId }) => {
  const { loading, error, contact, interactions, insight } = useRelationshipMemory(contactId);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!contact) return <div>No contact found.</div>;

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-bold mb-2">Relationship Memory</h2>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <div><b>Personal Details:</b> {JSON.stringify(contact.personal_details) || '—'}</div>
          <div><b>Shared Interests:</b> {contact.shared_interests?.join(', ') || '—'}</div>
          <div><b>Mutual Connections:</b> {contact.mutual_connections?.join(', ') || '—'}</div>
          <div><b>Milestones:</b> {JSON.stringify(contact.relationship_milestones) || '—'}</div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-1">Timeline of Interactions</h3>
        {interactions.length === 0 ? (
          <div className="text-gray-500">No interactions yet.</div>
        ) : (
          <ul className="space-y-2">
            {interactions.map((i) => (
              <li key={i.id} className="border-b pb-2">
                <div className="text-xs text-gray-500">{i.timestamp} ({i.type})</div>
                <div className="font-medium">{i.topic || 'No topic'}</div>
                <div className="text-sm">{i.summary || i.notes || ''}</div>
                {i.sentiment && <div className="text-xs">Sentiment: {i.sentiment}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-1">Relationship Insights</h3>
        {insight ? (
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <div><b>Health Score:</b> {insight.health_score ?? '—'}</div>
            <div><b>Decay Risk:</b> {insight.decay_risk ?? '—'}</div>
            <div><b>Optimal Contact Time:</b> {insight.optimal_contact_time || '—'}</div>
            <div><b>Suggested Topics:</b> {insight.suggested_topics?.join(', ') || '—'}</div>
            <div><b>Prep Brief:</b> {insight.prep_brief || '—'}</div>
          </div>
        ) : (
          <div className="text-gray-500">No insights yet.</div>
        )}
      </div>
    </Card>
  );
};

export default ContactMemoryPanel; 