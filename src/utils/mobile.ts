// Mobile optimization utilities for Rhiz PWA

// Detect mobile devices
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

// Detect touch devices
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get viewport dimensions
export const getViewportDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  isLandscape: window.innerWidth > window.innerHeight
});

// Handle viewport changes
export const onViewportChange = (callback: (dimensions: ReturnType<typeof getViewportDimensions>) => void) => {
  const handleResize = () => {
    callback(getViewportDimensions());
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
};

// Prevent zoom on input focus (iOS)
export const preventZoomOnFocus = () => {
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      }
    });

    input.addEventListener('blur', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
      }
    });
  });
};

// Handle safe area insets (notch devices)
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--sat') || '0'),
    right: parseInt(style.getPropertyValue('--sar') || '0'),
    bottom: parseInt(style.getPropertyValue('--sab') || '0'),
    left: parseInt(style.getPropertyValue('--sal') || '0')
  };
};

// Add safe area CSS variables
export const initializeSafeAreas = () => {
  const updateSafeAreas = () => {
    const insets = getSafeAreaInsets();
    document.documentElement.style.setProperty('--sat', `${insets.top}px`);
    document.documentElement.style.setProperty('--sar', `${insets.right}px`);
    document.documentElement.style.setProperty('--sab', `${insets.bottom}px`);
    document.documentElement.style.setProperty('--sal', `${insets.left}px`);
  };

  updateSafeAreas();
  window.addEventListener('resize', updateSafeAreas);
  window.addEventListener('orientationchange', updateSafeAreas);
};

// Optimize for mobile performance
export const optimizeForMobile = () => {
  // Reduce motion on mobile
  if (isMobile()) {
    document.documentElement.style.setProperty('--transition-duration', '0.15s');
  }

  // Optimize touch targets
  const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
  touchTargets.forEach(target => {
    const rect = target.getBoundingClientRect();
    if (rect.height < 44 || rect.width < 44) {
      target.classList.add('min-h-[44px]', 'min-w-[44px]');
    }
  });
};

// Handle mobile gestures
export const handleMobileGestures = () => {
  let startY = 0;
  let startX = 0;
  let isScrolling = false;

  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
    isScrolling = false;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isScrolling) {
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      const deltaX = Math.abs(e.touches[0].clientX - startX);
      
      if (deltaY > deltaX && deltaY > 10) {
        isScrolling = true;
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isScrolling) {
      const deltaY = e.changedTouches[0].clientY - startY;
      const deltaX = e.changedTouches[0].clientX - startX;
      
      // Swipe up gesture
      if (deltaY < -50 && Math.abs(deltaX) < 50) {
        // Handle swipe up
        console.log('Swipe up detected');
      }
      
      // Swipe down gesture
      if (deltaY > 50 && Math.abs(deltaX) < 50) {
        // Handle swipe down
        console.log('Swipe down detected');
      }
    }
  };

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };
};

// Mobile-specific CSS classes
export const getMobileClasses = () => ({
  container: 'px-4 sm:px-6 lg:px-8',
  button: 'min-h-[44px] min-w-[44px] touch-manipulation',
  input: 'text-base', // Prevent zoom on iOS
  card: 'rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
  sidebar: 'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out',
  modal: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50',
  bottomSheet: 'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-lg shadow-lg transform transition-transform duration-300 ease-in-out'
});

// Initialize mobile optimizations
export const initializeMobileOptimizations = () => {
  if (isMobile()) {
    initializeSafeAreas();
    optimizeForMobile();
    preventZoomOnFocus();
    
    // Add mobile-specific meta tags
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
    }
    
    // Add mobile-specific CSS
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .mobile-optimized {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        
        .touch-target {
          min-height: 44px;
          min-width: 44px;
        }
        
        .safe-area-top {
          padding-top: env(safe-area-inset-top);
        }
        
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
    `;
    document.head.appendChild(style);
  }
}; 