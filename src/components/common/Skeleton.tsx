import React from 'react';

// Skeleton component for loading states
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

/**
 * A reusable, animated skeleton component to indicate loading states.
 * It uses Tailwind's `animate-pulse` for a subtle shimmer effect.
 */
const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
