import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingProvider } from './hooks/useLoadingContext';
import App from './App';
import './index.css';

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Install prompt handling
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1, // Reduce retries to improve performance
      refetchOnWindowFocus: false, // Disable refetch on window focus
      refetchOnReconnect: true, // Enable refetch on reconnect
    },
  },
});

// Preload critical resources
const preloadImages = () => {
  const images = [
    '/OuRhizome Dark CRM Background Removed Background Removed.png'
  ];
  
  images.forEach(src => {
    const img = new Image();
    img.src = src;
    img.fetchPriority = 'high';
  });
};

// Execute preloading
preloadImages();

// Remove loading placeholder
const removePlaceholder = () => {
  const placeholder = document.querySelector('.loading-placeholder');
  if (placeholder) {
    placeholder.classList.add('fade-out');
    setTimeout(() => {
      placeholder.remove();
    }, 300);
  }
};

// Create root with error boundary
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <LoadingProvider>
              <App />
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );

  // Remove placeholder after render
  window.addEventListener('load', () => {
    removePlaceholder();
  });
}

// Export for install functionality
export { deferredPrompt };