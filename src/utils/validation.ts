// Input validation and sanitization utilities for Rhiz PWA
// Ensures data integrity and security across the application

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  phone?: boolean;
  custom?: (value: unknown) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: unknown;
}

export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Sanitization functions
export const sanitizeString = (value: string): string => {
  if (typeof value !== 'string') return '';
  
  // Remove potentially dangerous characters
  return value
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 10000); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  return sanitizeString(email).toLowerCase();
};

export const sanitizePhone = (phone: string): string => {
  return sanitizeString(phone).replace(/[^\d+\-()\s]/g, '');
};

export const sanitizeUrl = (url: string): string => {
  const sanitized = sanitizeString(url);
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    return `https://${sanitized}`;
  }
  return sanitized;
};

// Validation functions
export const validateRequired = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  return phoneRegex.test(cleanPhone);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateLength = (value: string, min?: number, max?: number): boolean => {
  if (min !== undefined && value.length < min) return false;
  if (max !== undefined && value.length > max) return false;
  return true;
};

// Main validation function
export const validate = (value: unknown, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];
  let sanitizedValue = value;

  // Sanitize string values
  if (typeof value === 'string') {
    sanitizedValue = sanitizeString(value);
  }

  // Required validation
  if (rules.required && !validateRequired(sanitizedValue)) {
    errors.push(rules.message || 'This field is required');
    return { isValid: false, errors, sanitizedValue };
  }

  // Skip other validations if value is empty and not required
  if (!validateRequired(sanitizedValue)) {
    return { isValid: true, errors: [], sanitizedValue };
  }

  // Length validation
  if (typeof sanitizedValue === 'string') {
    if (!validateLength(sanitizedValue, rules.minLength, rules.maxLength)) {
      const message = rules.message || 
        `Length must be between ${rules.minLength || 0} and ${rules.maxLength || 'unlimited'} characters`;
      errors.push(message);
    }
  }

  // Pattern validation
  if (rules.pattern && typeof sanitizedValue === 'string' && !rules.pattern.test(sanitizedValue)) {
    errors.push(rules.message || 'Invalid format');
  }

  // Email validation
  if (rules.email && typeof sanitizedValue === 'string' && !validateEmail(sanitizedValue)) {
    errors.push(rules.message || 'Invalid email address');
  }

  // Phone validation
  if (rules.phone && typeof sanitizedValue === 'string' && !validatePhone(sanitizedValue)) {
    errors.push(rules.message || 'Invalid phone number');
  }

  // URL validation
  if (rules.url && typeof sanitizedValue === 'string' && !validateUrl(sanitizedValue)) {
    errors.push(rules.message || 'Invalid URL');
  }

  // Custom validation
  if (rules.custom && !rules.custom(sanitizedValue)) {
    errors.push(rules.message || 'Invalid value');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue
  };
};

// Predefined validation rules
export const validationRules = {
  email: {
    required: true,
    email: true,
    maxLength: 254,
    message: 'Please enter a valid email address'
  },
  
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  },
  
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-']+$/,
    message: 'Name must be 2-100 characters with only letters, spaces, hyphens, and apostrophes'
  },
  
  phone: {
    required: false,
    phone: true,
    message: 'Please enter a valid phone number'
  },
  
  url: {
    required: false,
    url: true,
    maxLength: 2048,
    message: 'Please enter a valid URL'
  },
  
  company: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Company name must be 2-100 characters'
  },
  
  title: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Job title must be 2-100 characters'
  },
  
  bio: {
    required: false,
    maxLength: 500,
    message: 'Bio must be less than 500 characters'
  },
  
  goalTitle: {
    required: true,
    minLength: 5,
    maxLength: 200,
    message: 'Goal title must be 5-200 characters'
  },
  
  goalDescription: {
    required: false,
    maxLength: 1000,
    message: 'Goal description must be less than 1000 characters'
  }
};

// Form validation helper
export const validateForm = (data: Record<string, unknown>, rules: Record<string, ValidationRule>) => {
  const results: Record<string, ValidationResult> = {};
  let isValid = true;

  for (const [field, rule] of Object.entries(rules)) {
    const result = validate(data[field], rule);
    results[field] = result;
    if (!result.isValid) {
      isValid = false;
    }
  }

  return { isValid, results };
};

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  getRemainingAttempts(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return this.maxAttempts;
    return Math.max(0, this.maxAttempts - attempt.count);
  }

  getResetTime(key: string): number | null {
    const attempt = this.attempts.get(key);
    return attempt ? attempt.resetTime : null;
  }
}

// XSS prevention
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const safeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

// CSRF protection
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken;
}; 