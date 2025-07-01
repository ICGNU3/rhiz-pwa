import React from 'react';
import Spinner from './Spinner';

/**
 * A simple, centered page loader component. 
 * Used as a fallback for React.Suspense during route-based code splitting.
 */
const PageLoader: React.FC = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-transparent">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
