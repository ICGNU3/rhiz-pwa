import { useEffect } from 'react';

/**
 * Hook to prefetch routes for better performance
 */
export function usePrefetchRoute(routePath: string) {
  useEffect(() => {
    // This is a simplified version - in a real app, you would
    // integrate with your router's prefetching mechanism
    const prefetchRoute = async (path: string) => {
      try {
        await import(`../pages/${path}.tsx`);
      } catch (error) {
        console.warn(`Failed to prefetch route: ${path}`, error);
      }
    };

    // Only prefetch in production and if supported
    if (process.env.NODE_ENV === 'production' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        prefetchRoute(routePath);
      });
    }
  }, [routePath]);
}

export default usePrefetchRoute;