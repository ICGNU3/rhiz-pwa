// Error tracking utility for Rhiz PWA
// Can be extended to integrate with Sentry, LogRocket, or other error tracking services

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  userId?: string;
  url?: string;
  timestamp: string;
  userAgent?: string;
  additionalData?: Record<string, unknown>;
}

class ErrorTracker {
  private isEnabled: boolean;
  private endpoint?: string;
  private userId?: string;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true';
    this.endpoint = import.meta.env.VITE_ERROR_TRACKING_ENDPOINT;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  captureError(error: Error, additionalData?: Record<string, unknown>) {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      userId: this.userId,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      additionalData,
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error captured:', errorInfo);
    }

    // Send to external service if configured
    if (this.isEnabled && this.endpoint) {
      this.sendToExternalService(errorInfo);
    }

    // Store in localStorage for debugging
    this.storeLocally(errorInfo);
  }

  captureReactError(error: Error, errorInfo: React.ErrorInfo) {
    this.captureError(error, {
      componentStack: errorInfo.componentStack,
      type: 'react-error-boundary',
    });
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    const errorInfo: ErrorInfo = {
      message,
      userId: this.userId,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      additionalData: { level },
    };

    if (import.meta.env.DEV) {
      console.log(`[${level.toUpperCase()}] ${message}`, errorInfo);
    }

    if (this.isEnabled && this.endpoint) {
      this.sendToExternalService(errorInfo);
    }
  }

  private async sendToExternalService(errorInfo: ErrorInfo) {
    try {
      await fetch(this.endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      });
    } catch (err) {
      console.error('Failed to send error to tracking service:', err);
    }
  }

  private storeLocally(errorInfo: ErrorInfo) {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('rhiz-errors') || '[]');
      storedErrors.push(errorInfo);
      
      // Keep only last 50 errors
      if (storedErrors.length > 50) {
        storedErrors.splice(0, storedErrors.length - 50);
      }
      
      localStorage.setItem('rhiz-errors', JSON.stringify(storedErrors));
    } catch (err) {
      console.error('Failed to store error locally:', err);
    }
  }

  getStoredErrors(): ErrorInfo[] {
    try {
      return JSON.parse(localStorage.getItem('rhiz-errors') || '[]');
    } catch {
      return [];
    }
  }

  clearStoredErrors() {
    localStorage.removeItem('rhiz-errors');
  }

  // Performance monitoring
  capturePerformanceMetric(name: string, duration: number, additionalData?: Record<string, unknown>) {
    const metric = {
      name,
      duration,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.userId,
      additionalData,
    };

    if (import.meta.env.DEV) {
      console.log(`Performance metric: ${name} took ${duration}ms`, metric);
    }

    // Could send to analytics service here
  }

  // User interaction tracking
  captureUserAction(action: string, target?: string, additionalData?: Record<string, unknown>) {
    const actionInfo = {
      action,
      target,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.userId,
      additionalData,
    };

    if (import.meta.env.DEV) {
      console.log('User action:', actionInfo);
    }

    // Could send to analytics service here
  }
}

// Global error tracker instance
export const errorTracker = new ErrorTracker();

// Global error handlers
window.addEventListener('error', (event: ErrorEvent) => {
  errorTracker.captureError(event.error, {
    type: 'unhandled-error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  const reason = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  errorTracker.captureError(reason, {
    type: 'unhandled-promise-rejection',
  });
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      errorTracker.capturePerformanceMetric('page-load', navigation.loadEventEnd - navigation.loadEventStart);
    }
  });
}

export default errorTracker; 