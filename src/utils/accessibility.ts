// Accessibility utilities for Rhiz PWA
// Improves keyboard navigation, screen reader support, and overall accessibility

// Keyboard navigation utilities
export const handleKeyDown = (
  event: React.KeyboardEvent,
  handlers: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onTab?: () => void;
  }
) => {
  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      handlers.onEnter?.();
      break;
    case ' ':
      event.preventDefault();
      handlers.onSpace?.();
      break;
    case 'Escape':
      event.preventDefault();
      handlers.onEscape?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      handlers.onArrowUp?.();
      break;
    case 'ArrowDown':
      event.preventDefault();
      handlers.onArrowDown?.();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      handlers.onArrowLeft?.();
      break;
    case 'ArrowRight':
      event.preventDefault();
      handlers.onArrowRight?.();
      break;
    case 'Tab':
      handlers.onTab?.();
      break;
  }
};

// Focus management
export const focusFirstInteractive = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
};

export const trapFocus = (container: HTMLElement) => {
  const focusableElements = Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// ARIA helpers
export const getAriaLabel = (element: string, context?: string) => {
  if (context) {
    return `${element} ${context}`;
  }
  return element;
};

export const getAriaDescribedBy = (description: string) => {
  return description ? `${description}-description` : undefined;
};

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map(c => {
      if (c <= 0.03928) {
        return c / 12.92;
      }
      return Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);

  return (brightest + 0.05) / (darkest + 0.05);
};

export const isHighContrast = (color1: string, color2: string): boolean => {
  return getContrastRatio(color1, color2) >= 4.5;
};

// Skip link component props
export const getSkipLinkProps = (targetId: string, label: string) => ({
  href: `#${targetId}`,
  className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded z-50',
  children: label
});

// Form accessibility
export const getFormFieldProps = (
  id: string,
  label: string,
  error?: string,
  description?: string
) => ({
  id,
  'aria-label': label,
  'aria-describedby': description ? `${id}-description` : undefined,
  'aria-invalid': error ? 'true' : 'false',
  'aria-errormessage': error ? `${id}-error` : undefined
});

// Loading states
export const getLoadingProps = (isLoading: boolean, loadingText: string) => ({
  'aria-busy': isLoading,
  'aria-live': 'polite',
  'aria-label': isLoading ? loadingText : undefined
});

// Progress indicators
export const getProgressProps = (current: number, total: number, label: string) => ({
  role: 'progressbar',
  'aria-valuenow': current,
  'aria-valuemin': 0,
  'aria-valuemax': total,
  'aria-label': label
});

// Status messages
export const getStatusProps = (type: 'success' | 'error' | 'warning' | 'info') => ({
  role: 'status',
  'aria-live': 'polite',
  'aria-label': `${type} message`
});

// Navigation helpers
export const getNavigationProps = (current: boolean, label: string) => ({
  'aria-current': current ? 'page' : undefined,
  'aria-label': label
});

// Button accessibility
export const getButtonProps = (
  type: 'button' | 'submit' | 'reset',
  label: string,
  pressed?: boolean,
  expanded?: boolean
) => ({
  type,
  'aria-label': label,
  'aria-pressed': pressed,
  'aria-expanded': expanded
});

// Modal accessibility
export const getModalProps = (title: string, description?: string) => ({
  role: 'dialog',
  'aria-modal': 'true',
  'aria-labelledby': `${title}-title`,
  'aria-describedby': description ? `${title}-description` : undefined
});

// List accessibility
export const getListProps = (type: 'list' | 'listbox' | 'menu' | 'tree') => ({
  role: type,
  'aria-label': `${type} items`
});

// Table accessibility
export const getTableProps = (caption: string) => ({
  role: 'table',
  'aria-label': caption
});

// Image accessibility
export const getImageProps = (alt: string, decorative: boolean = false) => ({
  alt: decorative ? '' : alt,
  role: decorative ? 'presentation' : undefined
});

// Link accessibility
export const getLinkProps = (href: string, label: string, external: boolean = false) => ({
  href,
  'aria-label': label,
  ...(external && {
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-describedby': 'external-link'
  })
});

// Input accessibility
export const getInputProps = (
  type: string,
  label: string,
  required: boolean = false,
  error?: string
) => ({
  type,
  'aria-label': label,
  'aria-required': required,
  'aria-invalid': error ? 'true' : 'false',
  'aria-errormessage': error ? `${label}-error` : undefined
});

// Select accessibility
export const getSelectProps = (
  label: string,
  options: string[],
  selectedValue?: string
) => ({
  'aria-label': label,
  'aria-haspopup': 'listbox',
  'aria-expanded': false,
  'aria-activedescendant': selectedValue ? `${selectedValue}-option` : undefined
});

// Checkbox/Radio accessibility
export const getCheckboxProps = (
  label: string,
  checked: boolean,
  type: 'checkbox' | 'radio' = 'checkbox'
) => ({
  type,
  'aria-label': label,
  'aria-checked': checked,
  role: type
});

// Toggle accessibility
export const getToggleProps = (label: string, checked: boolean) => ({
  role: 'switch',
  'aria-label': label,
  'aria-checked': checked
});

// Tooltip accessibility
export const getTooltipProps = (content: string) => ({
  'aria-label': content,
  role: 'tooltip'
});

// Live regions
export const getLiveRegionProps = (type: 'polite' | 'assertive' | 'off') => ({
  'aria-live': type,
  'aria-atomic': 'true'
});

// Error handling
export const announceError = (error: string) => {
  announceToScreenReader(`Error: ${error}`, 'assertive');
};

export const announceSuccess = (message: string) => {
  announceToScreenReader(`Success: ${message}`, 'polite');
};

export const announceLoading = (message: string) => {
  announceToScreenReader(`Loading: ${message}`, 'polite');
};

// Keyboard shortcuts
export const registerKeyboardShortcut = (
  key: string,
  callback: () => void,
  ctrlKey: boolean = false,
  shiftKey: boolean = false,
  altKey: boolean = false
) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.key === key &&
      event.ctrlKey === ctrlKey &&
      event.shiftKey === shiftKey &&
      event.altKey === altKey
    ) {
      event.preventDefault();
      callback();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};

// Focus restoration
export const saveFocus = () => {
  const activeElement = document.activeElement as HTMLElement;
  return () => {
    if (activeElement && typeof activeElement.focus === 'function') {
      activeElement.focus();
    }
  };
};

// High contrast mode detection
export const isHighContrastMode = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Screen reader detection (basic)
export const isScreenReaderActive = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
         document.documentElement.classList.contains('sr-only');
}; 