/**
 * Utility functions for performance monitoring and optimization
 */

/**
 * Measures and logs component render time
 * @param componentName Name of the component being measured
 * @param callback Function to execute and measure
 * @returns Result of the callback function
 */
export function measureRenderTime<T>(componentName: string, callback: () => T): T {
  if (process.env.NODE_ENV !== 'production') {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();
    console.log(`[Performance] ${componentName} rendered in ${(endTime - startTime).toFixed(2)}ms`);
    return result;
  }
  return callback();
}

/**
 * Reports Web Vitals metrics
 * @param metric The metric to report
 */
export function reportWebVitals(metric: any): void {
  if (process.env.NODE_ENV === 'production') {
    // In a real app, you would send this to your analytics service
    console.log(metric);
  }
}

/**
 * Debounces a function to improve performance
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttles a function to improve performance
 * @param func Function to throttle
 * @param limit Limit time in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoizes a function to improve performance
 * @param func Function to memoize
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map();
  return (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Lazy loads an image
 * @param src Image source URL
 * @returns Promise that resolves when the image is loaded
 */
export function lazyLoadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.fetchPriority = 'high';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

/**
 * Preloads critical resources
 * @param resources Array of resource URLs to preload
 */
export function preloadResources(resources: string[]): void {
  resources.forEach(resource => {
    if (resource.endsWith('.js')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = resource;
      document.head.appendChild(link);
    } else if (resource.endsWith('.css')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = resource;
      document.head.appendChild(link);
    } else if (resource.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      document.head.appendChild(link);
    }
  });
}

/**
 * Optimizes images by resizing and converting to WebP
 * @param src Original image source
 * @param width Desired width
 * @param height Desired height
 * @returns Optimized image URL
 */
export function optimizeImage(src: string, width?: number, height?: number): string {
  // In a real app, you would use an image optimization service
  // For now, we'll just return the original image
  if (!src) return src;
  
  // If it's an external URL (like Pexels), return as is
  if (src.startsWith('http')) return src;
  
  // For local images, we could implement resizing logic
  return src;
}

/**
 * Prefetches a page to improve navigation performance
 * @param path Page path to prefetch
 */
export function prefetchPage(path: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  document.head.appendChild(link);
}

/**
 * Measures time taken for a function to execute
 * @param name Name of the function being measured
 * @param fn Function to execute
 * @returns Result of the function
 */
export function measureTime<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`[Performance] ${name} took ${(end - start).toFixed(2)}ms`);
  return result;
}