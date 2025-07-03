import { useState, useEffect } from 'react';

interface ImageOptimizerOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
}

/**
 * Hook to optimize images for better performance
 */
export function useImageOptimizer(
  src: string,
  options: ImageOptimizerOptions = {}
): { optimizedSrc: string; isLoading: boolean; error: Error | null } {
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip optimization for external URLs or SVGs
    if (src.startsWith('http') || src.endsWith('.svg')) {
      setOptimizedSrc(src);
      setIsLoading(false);
      return;
    }

    const optimizeImage = async () => {
      try {
        setIsLoading(true);
        
        // For local development, just return the original
        // In production, this would connect to an image optimization service
        setOptimizedSrc(src);
        setIsLoading(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setOptimizedSrc(src); // Fallback to original
        setIsLoading(false);
      }
    };

    optimizeImage();
  }, [src, options]);

  return { optimizedSrc, isLoading, error };
}

export default useImageOptimizer;