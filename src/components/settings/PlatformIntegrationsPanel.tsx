import React, { useState, useEffect } from 'react';
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
  const { integrations, loading, error, removeIntegration, addIntegration } = usePlatformIntegrations();
  const [connecting, setConnecting] = useState(false);

  // Handler for Gmail OAuth
  const handleConnectGmail = async () => {
    setConnecting(true);
    try {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      const redirectUri = window.location.origin + '/oauth-callback';
      const scope = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid'
      ].join(' ');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
      window.open(authUrl, 'google-oauth', 'width=500,height=600');
    } finally {
      setConnecting(false);
    }
  };

  // Listen for OAuth callback (window message)
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'google-oauth-success') {
        // After successful OAuth, reload integrations (or the page)
        window.location.reload();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

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
      <div className="flex gap-4 mt-6">
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium shadow disabled:opacity-60"
          onClick={handleConnectGmail}
          disabled={connecting}
        >
          {connecting ? 'Connecting…' : 'Connect Gmail'}
        </button>
        {/* Add more connect buttons for other platforms as needed */}
      </div>
      <div className="mt-4 text-xs text-gray-400">
        You control which platforms are connected. Data is encrypted and never shared without your consent.
      </div>
    </div>
  );
} 