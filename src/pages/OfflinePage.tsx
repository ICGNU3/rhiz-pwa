import React from 'react';
import { WifiOff, RefreshCw, Network, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/Card';

const OfflinePage: React.FC = () => {
  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  const cachedFeatures = [
    'View your contact list and relationship data',
    'Access AI insights and recommendations',
    'Browse your network visualization',
    'Review goals and progress tracking',
    'Use trust and privacy controls'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Rhiz Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Network className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rhiz</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Intelligent Relationship Engine</p>
        </div>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            You're Offline
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            No internet connection detected. Don't worry - Rhiz works offline! 
            Your relationship data is cached locally and will sync when you're back online.
          </p>

          <div className="space-y-4 mb-8">
            <Button 
              onClick={handleRetry}
              icon={RefreshCw}
              className="w-full"
            >
              Check Connection
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </Card>

        {/* Offline Features */}
        <Card className="mt-6 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Available Offline
            </h3>
          </div>
          <ul className="space-y-2">
            {cachedFeatures.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
            <strong>Smart Caching:</strong> Your network data, AI insights, and relationship 
            intelligence are stored locally for instant offline access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;