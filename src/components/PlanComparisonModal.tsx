import React from 'react';
import { CheckCircle, XCircle, Lock, Star } from 'lucide-react';

const freeFeatures = [
  '25 contacts maximum',
  '3 goals maximum',
  'Manual CSV import only',
  '10 AI queries/month (BYO API key)',
  'Basic trust scoring',
  'No network visualization',
  'No cross-network features',
  'Single user only',
  'Basic notifications',
];

const proFeatures = [
  'Unlimited contacts',
  'Unlimited goals',
  'Automated email/calendar/LinkedIn sync',
  'Unlimited AI queries (Rhiz AI credits)',
  'Advanced trust scoring & predictive insights',
  'Full network visualization',
  'Advanced relationship prompts',
  'Signal Mode & automated tracking',
  'Smart notifications & meeting prep AI',
  'Cross-network discovery',
  'Introduction requests',
  '5 team member seats',
  'Shared network intelligence',
  'Priority matching',
  'Advanced analytics',
  'Custom integrations (Zapier, API, webhooks)',
  'Bulk operations',
  'Template library',
  'Export & reporting',
  'Priority support & feature requests',
  'Beta access & success consultation',
];

export default function PlanComparisonModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white">
          <XCircle className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Compare Plans
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">See what you unlock with Pro Mode</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Mode */}
          <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-lg font-semibold text-gray-800 dark:text-white">Free Mode</span>
            </div>
            <ul className="space-y-3">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-center text-gray-700 dark:text-gray-200">
                  <XCircle className="w-4 h-4 text-red-400 mr-2" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {/* Pro Mode */}
          <div className="border-2 border-yellow-400 rounded-lg p-6 bg-yellow-50 dark:bg-yellow-900/20">
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="text-lg font-semibold text-yellow-700 dark:text-yellow-200">Pro Mode (Alpha)</span>
            </div>
            <ul className="space-y-3">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-center text-gray-800 dark:text-gray-100">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-indigo-700 hover:to-pink-700 transition-all">
                Request Alpha Access
              </button>
              <p className="text-xs text-gray-500 mt-2">Pro Mode is currently invite-only for the first 100 alpha members and their invitees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 