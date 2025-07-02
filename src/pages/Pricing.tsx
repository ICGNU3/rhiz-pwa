import React, { useState } from 'react';
import PlanComparisonModal from '../components/PlanComparisonModal';

export default function Pricing() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center py-16 px-4">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Pricing & Access
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Unlock the full power of Rhiz. Start free, upgrade to Pro for unlimited intelligence and network mastery.<br/>
          <span className="font-semibold text-indigo-600 dark:text-indigo-300">Invite-only Alpha: First 100 members and their invitees get exclusive access.</span>
        </p>
        <button
          className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:from-indigo-700 hover:to-pink-700 transition-all text-lg"
          onClick={() => setModalOpen(true)}
        >
          Compare Free & Pro
        </button>
      </div>
      {/* Plan Comparison Table */}
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Mode */}
          <div className="border rounded-lg p-8 bg-gray-50 dark:bg-gray-800 flex flex-col">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-800 dark:text-white mr-2">Free Mode</span>
              <span className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">Forever Free</span>
            </div>
            <ul className="space-y-3 flex-1">
              <li>25 contacts maximum</li>
              <li>3 goals maximum</li>
              <li>Manual CSV import only</li>
              <li>10 AI queries/month (BYO API key)</li>
              <li>Basic trust scoring</li>
              <li>No network visualization</li>
              <li>No cross-network features</li>
              <li>Single user only</li>
              <li>Basic notifications</li>
            </ul>
            <button
              className="mt-8 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg font-semibold cursor-not-allowed opacity-60"
              disabled
            >
              Current Plan
            </button>
          </div>
          {/* Pro Mode */}
          <div className="border-2 border-yellow-400 rounded-lg p-8 bg-yellow-50 dark:bg-yellow-900/20 flex flex-col">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-200 mr-2">Pro Mode (Alpha)</span>
              <span className="bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 px-3 py-1 rounded-full text-xs font-semibold">Invite Only</span>
            </div>
            <ul className="space-y-3 flex-1">
              <li>Unlimited contacts & goals</li>
              <li>Automated email/calendar/LinkedIn sync</li>
              <li>Unlimited AI queries (Rhiz AI credits)</li>
              <li>Advanced trust scoring & predictive insights</li>
              <li>Full network visualization</li>
              <li>Advanced relationship prompts & Signal Mode</li>
              <li>Automated tracking & smart notifications</li>
              <li>Cross-network discovery & intro requests</li>
              <li>5 team member seats, shared intelligence</li>
              <li>Advanced analytics, integrations, bulk ops</li>
              <li>Priority support, beta access, success consult</li>
            </ul>
            <div className="mt-8 text-center">
              <button
                className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:from-indigo-700 hover:to-pink-700 transition-all text-lg"
                onClick={() => setModalOpen(true)}
              >
                Request Alpha Access
              </button>
              <p className="text-xs text-gray-500 mt-2">Pro Mode is currently invite-only for the first 100 alpha members and their invitees.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <PlanComparisonModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
} 