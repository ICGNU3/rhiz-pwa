import React from 'react';
import Skeleton from '../common/Skeleton';
import Card from '../Card';

/** * A skeleton placeholder for a single contact item in a list.
 */
const ContactListItemSkeleton: React.FC = () => (
  <Card className="p-4 bg-white/80 backdrop-blur-sm border-transparent dark:bg-gray-800/80">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-6">
        <div className="text-center">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-2 w-16 mx-auto" />
        </div>
        <Skeleton className="h-6 w-24 rounded-md" />      </div>
    </div>
  </Card>
);

/**
 * Renders a list of skeleton placeholders for the contacts page.
 * This should be displayed while the actual contact data is being fetched.
 * @param count The number of skeleton items to render.
 */
const ContactListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ContactListItemSkeleton key={index} />
      ))}
    </div>
  );
};

export default ContactListSkeleton;
