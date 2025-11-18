import { logError, logMessage } from '../lib/sentry';
import { showNotification } from './notifications';

interface ErrorHandlerOptions {
  showToUser?: boolean;
  logToConsole?: boolean;
  logToSentry?: boolean;
  context?: Record<string, any>;
  customMessage?: string;
}

/**
 * Centralized error handler
 */
export const handleError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
): void => {
  const {
    showToUser = true,
    logToConsole = true,
    logToSentry = true,
    context,
    customMessage,
  } = options;

  // Convert error to Error object if it isn't already
  const errorObj = error instanceof Error ? error : new Error(String(error));

  // Log to console
  if (logToConsole) {
    console.error('Error handled:', errorObj, context);
  }

  // Log to Sentry
  if (logToSentry) {
    logError(errorObj, context);
  }

  // Show to user
  if (showToUser) {
    const userMessage = customMessage || getUserFriendlyMessage(errorObj);
    showNotification(userMessage, 'error');
  }
};

/**
 * Get user-friendly error message
 */
const getUserFriendlyMessage = (error: Error): string => {
  const message = error.message.toLowerCase();

  // Network errors
  if (message.includes('fetch') || message.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }

  // Authentication errors
  if (message.includes('auth') || message.includes('unauthorized')) {
    return 'Authentication failed. Please log in again.';
  }

  // Permission errors
  if (message.includes('permission') || message.includes('forbidden')) {
    return "You don't have permission to perform this action.";
  }

  // Validation errors
  if (message.includes('invalid') || message.includes('validation')) {
    return 'Invalid input. Please check your data and try again.';
  }

  // Database errors
  if (message.includes('database') || message.includes('query')) {
    return 'Database error. Please try again later.';
  }

  // Default message
  return 'Something went wrong. Please try again.';
};

/**
 * Handle async operations with error handling
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error, options);
    return null;
  }
};

/**
 * Supabase error handler
 */
export const handleSupabaseError = (
  error: any,
  operation: string,
  customMessage?: string
): void => {
  const context = {
    operation,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
  };

  handleError(error, {
    context,
    customMessage: customMessage || `Failed to ${operation}`,
  });
};

/**
 * Retry logic for failed operations
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    onError?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> => {
  const { maxAttempts = 3, delay = 1000, onError } = options;

  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (onError) {
        onError(lastError, attempt);
      }

      if (attempt < maxAttempts) {
        logMessage(
          `Retry attempt ${attempt}/${maxAttempts} after error: ${lastError.message}`,
          'warning',
          { attempt, maxAttempts }
        );
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
};

/**
 * Safe JSON parse with error handling
 */
export const safeJsonParse = <T>(
  json: string,
  defaultValue: T
): T => {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    logMessage('JSON parse error', 'warning', { json, error });
    return defaultValue;
  }
};

/**
 * Safe localStorage operations
 */
export const safeLocalStorage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      logMessage('localStorage get error', 'warning', { key, error });
      return defaultValue;
    }
  },

  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      logMessage('localStorage set error', 'error', { key, error });
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logMessage('localStorage remove error', 'warning', { key, error });
      return false;
    }
  },
};

