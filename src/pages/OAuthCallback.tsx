import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';

const BACKEND_OAUTH_ENDPOINT = '/api/google-oauth'; // Adjust as needed

export default function OAuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (!code) {
      setStatus('error');
      setMessage('No code found in URL.');
      return;
    }
    // Exchange code for tokens via backend
    fetch(BACKEND_OAUTH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'exchange_code', code }),
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to exchange code');
        return res.json();
      })
      .then((data) => {
        setStatus('success');
        setMessage('Gmail connected! You can close this window.');
        // Notify opener window
        if (window.opener) {
          window.opener.postMessage({ type: 'google-oauth-success' }, '*');
        }
      })
      .catch((err) => {
        setStatus('error');
        setMessage('OAuth failed: ' + err.message);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'loading' && <Spinner />}
      <div className="mt-4 text-lg font-medium">
        {status === 'loading' ? 'Connecting Gmail…' : message}
      </div>
    </div>
  );
} 