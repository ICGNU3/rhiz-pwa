import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorBorderProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorBorder: React.FC<ErrorBorderProps> = ({ 
  message = 'Something went wrong. Please try again.', 
  onRetry,
  className = '' 
}) => {
  return (
    <div className={`border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center ${className}`}>
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
        Error Loading Data
      </h3>
      <p className="text-red-600 dark:text-red-300 mb-4">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorBorder;