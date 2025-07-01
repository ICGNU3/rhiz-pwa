import React from 'react';

const PageLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-900">
      <div className="flex items-center space-x-2 text-gray-200">        <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400" style={{ animationDelay: '0.4import React from 'react';
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
