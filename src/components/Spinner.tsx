import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-b-2',
  };

  return (
    <div
      className={`animate-spin rounded-full border-gray-300 dark:border-gray-600 border-t-indigo-600 dark:border-t-indigo-400 ${sizes[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;