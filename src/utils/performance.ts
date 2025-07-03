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
export function reportWebVitals(metric: unknown): void {
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
export function debounce<T extends (...args: unknown[]) => unknown>(
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
export function throttle<T extends (...args: unknown[]) => unknown>(
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
export function memoize<T extends (...args: unknown[]) => unknown>(
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
 * @returns Optimized image URL
 */
export function optimizeImage(src: string): string {
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

/**
 * Creates a virtualized list renderer for large datasets
 * @param items Full list of items
 * @param renderItem Function to render a single item
 * @param visibleCount Number of items to render at once
 * @returns Virtualized list of rendered items
 */
export function virtualizeList<T>(
  items: T[],
  renderItem: (item: T, index: number) => React.ReactNode,
  visibleCount: number = 100
): React.ReactNode[] {
  // If list is small enough, render everything
  if (items.length <= visibleCount) {
    return items.map(renderItem);
  }
  
  // Otherwise, render only the most important items
  // This is a simplified approach - a real implementation would consider viewport
  return items.slice(0, visibleCount).map(renderItem);
}

/**
 * Optimizes WebGL rendering by batching draw calls
 * @param drawFn Function that performs WebGL drawing
 * @param batchSize Number of items to batch together
 */
export function batchWebGLDrawCalls(
  drawFn: (startIndex: number, endIndex: number) => void,
  totalItems: number,
  batchSize: number = 1000
): void {
  // Process in batches to avoid blocking the main thread
  let currentBatch = 0;
  
  function processBatch() {
    const start = currentBatch * batchSize;
    const end = Math.min(start + batchSize, totalItems);
    
    drawFn(start, end);
    
    currentBatch++;
    if (start < totalItems) {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(processBatch);
    }
  }
  
  processBatch();
}

import React from 'react';

// Performance optimization utilities for Rhiz PWA
// Includes caching, lazy loading, and performance monitoring

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

class Cache {
  private storage = new Map<string, CacheEntry<unknown>>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Clean expired entries
    this.cleanup();

    // Remove oldest entry if cache is full
    if (this.storage.size >= this.maxSize) {
      const oldestKey = this.storage.keys().next().value || '';
      this.storage.delete(oldestKey);
    }

    this.storage.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.storage.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.storage.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  size(): number {
    this.cleanup();
    return this.storage.size;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.storage.delete(key);
      }
    }
  }
}

// Global cache instance
export const cache = new Cache();

// API response caching
export const cachedFetch = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> => {
  // Check cache first
  const cached = cache.get<T>(key);
  if (cached) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();
  cache.set(key, data, ttl);
  return data;
};



// Component lazy loading with preloading
export const lazyLoadComponent = <T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  preload = false
) => {
  const Component = React.lazy(importFn);

  if (preload) {
    // Preload the component
    importFn();
  }

  return Component;
};

// Performance monitoring
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();

  startTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  recordMetric(name: string, duration: number, metadata?: Record<string, unknown>): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`, metadata);
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name);
    }
    return [...this.metrics];
  }

  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  // Monitor long tasks
  startLongTaskMonitoring(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.recordMetric('long-task', entry.duration, {
              startTime: entry.startTime,
              name: entry.name
            });
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', observer);
    }
  }

  // Monitor memory usage
  startMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        this.recordMetric('memory-usage', memory.usedJSHeapSize, {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }, 30000); // Every 30 seconds
    }
  }

  // Monitor network requests
  startNetworkMonitoring(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming & { transferSize?: number };
            this.recordMetric('network-request', resourceEntry.duration, {
              name: resourceEntry.name,
              initiatorType: resourceEntry.initiatorType,
              transferSize: resourceEntry.transferSize || 0
            });
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', observer);
    }
  }

  stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Resource preloading
export const preloadResource = (href: string, as: string): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Critical CSS inlining
export const inlineCriticalCSS = (css: string): void => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Bundle size monitoring
export const getBundleSize = (): number => {
  if ('performance' in window) {
    const entries = performance.getEntriesByType('resource');
    const jsEntries = entries.filter(entry => 
      entry.name.includes('.js') || entry.name.includes('.mjs')
    );
    
    return jsEntries.reduce((total, entry) => {
      const resourceEntry = entry as PerformanceResourceTiming & { transferSize?: number };
      return total + (resourceEntry.transferSize || 0);
    }, 0);
  }
  return 0;
};

// Service Worker performance
export const measureServiceWorkerPerformance = async (): Promise<number> => {
  if ('serviceWorker' in navigator) {
    const start = performance.now();
    await navigator.serviceWorker.ready;
    const duration = performance.now() - start;
    performanceMonitor.recordMetric('service-worker-ready', duration);
    return duration;
  }
  return 0;
};

// PWA install performance
export const measurePWAInstallPerformance = (): void => {
  window.addEventListener('beforeinstallprompt', () => {
    performanceMonitor.recordMetric('pwa-install-prompt', 0, {
      type: 'beforeinstallprompt'
    });
  });

  window.addEventListener('appinstalled', () => {
    performanceMonitor.recordMetric('pwa-installed', 0, {
      type: 'appinstalled'
    });
  });
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = (): void => {
  // Start monitoring
  performanceMonitor.startLongTaskMonitoring();
  performanceMonitor.startMemoryMonitoring();
  performanceMonitor.startNetworkMonitoring();
  measurePWAInstallPerformance();

  // Monitor page load performance
  window.addEventListener('load', () => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        performanceMonitor.recordMetric('page-load', navigation.loadEventEnd - navigation.loadEventStart);
        performanceMonitor.recordMetric('dom-content-loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        performanceMonitor.recordMetric('first-paint', navigation.loadEventEnd - navigation.fetchStart);
      }
    }
  });
};

// React performance optimization hooks
export const usePerformanceTimer = (name: string) => {
  const startTimer = React.useCallback(() => {
    return performanceMonitor.startTimer(name);
  }, [name]);

  return startTimer;
};

export const useDebouncedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
) => {
  return React.useCallback(
    (...args: Parameters<T>) => {
      const timeoutId = setTimeout(() => callback(...args), delay);
      return () => clearTimeout(timeoutId);
    },
    [callback, delay]
  );
};

export const useThrottledCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
) => {
  return React.useCallback(
    (...args: Parameters<T>) => {
      let lastCall = 0;
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback(...args);
      }
    },
    [callback, delay]
  );
};