import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import Button from '../components/Button';

const OfflinePage: React.FC = () => {
  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          You're Offline
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          It looks like you've lost your internet connection. Don't worry - you can still 
          browse your cached data and any changes will sync when you're back online.
        </p>

        <div className="space-y-4">
          <Button 
            onClick={handleRetry}
            icon={RefreshCw}
            className="w-full"
          >
            Try Again
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full"
          >
            Go Back
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Tip:</strong> Rhiz works offline! Your data is cached locally and will 
            automatically sync when your connection is restored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;