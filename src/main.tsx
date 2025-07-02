import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './hooks/useLoadingContext';
import { NotificationProvider } from './context/NotificationContext';
import { initializePerformanceMonitoring } from './utils/performance';
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

// Initialize performance monitoring
initializePerformanceMonitoring();

// Install prompt handling
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
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

const queryClient = new QueryClient();

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
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </LoadingProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);

  // Remove placeholder after render
  removePlaceholder();
}

// Export for install functionality
export { deferredPrompt };