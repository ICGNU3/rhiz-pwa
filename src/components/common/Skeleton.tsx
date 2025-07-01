import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  // This component can be extended with shape variants (e.g., 'circle') if needed.
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
