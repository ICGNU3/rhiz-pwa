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

    // Check if browser supports modern image formats
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    };

    const supportsAvif = async () => {
      if (!createImageBitmap) return false;
      
      const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      try {
        const blob = await fetch(avifData).then(r => r.blob());
        return createImageBitmap(blob).then(() => true, () => false);
      } catch (e) {
        return false;
      }
    };

    const optimizeImage = async () => {
      try {
        setIsLoading(true);
        
        // Determine best format
        let format = options.format || 'webp';
        const webpSupported = supportsWebP();
        const avifSupported = await supportsAvif();
        
        if (!options.format) {
          if (avifSupported) format = 'avif';
          else if (webpSupported) format = 'webp';
          else format = 'jpeg';
        }
        
        // For local development, just return the original
        // In production, this would connect to an image optimization service
        setOptimizedSrc(src);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setOptimizedSrc(src); // Fallback to original
        setIsLoading(false);
      }
    };

    optimizeImage();
  }, [src, options]);

  return { optimizedSrc, isLoading, error };
}

export default useImageOptimizer;