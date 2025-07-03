import React from 'react';
import { usePlatformIntegrations } from '../../hooks/usePlatformIntegrations';

const PLATFORM_LABELS: Record<string, string> = {
  gmail: 'Gmail',
  outlook: 'Outlook',
  google_calendar: 'Google Calendar',
  linkedin: 'LinkedIn',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  salesforce: 'Salesforce',
  hubspot: 'HubSpot',
};

export default function PlatformIntegrationsPanel() {
  const { integrations, loading, error, removeIntegration } = usePlatformIntegrations();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Connected Platforms</h3>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {integrations.length === 0 && !loading && (
        <div className="text-gray-500">No platforms connected yet.</div>
      )}
      <ul className="space-y-2">
        {integrations.map((i) => (
          <li key={i.id} className="flex items-center justify-between bg-white/10 rounded p-3">
            <div>
              <span className="font-medium text-white">{PLATFORM_LABELS[i.platform] || i.platform}</span>
              <span className="ml-2 text-xs text-gray-400">{i.status}</span>
            </div>
            <button
              className="text-red-500 hover:underline text-sm"
              onClick={() => i.id && removeIntegration(i.id)}
            >
              Disconnect
            </button>
          </li>
        ))}
      </ul>
      {/* TODO: Add connect buttons for each platform (OAuth flows) */}
      <div className="mt-4 text-xs text-gray-400">
        You control which platforms are connected. Data is encrypted and never shared without your consent.
      </div>
    </div>
  );
} 