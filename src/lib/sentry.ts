import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

export const initSentry = () => {
  // Only initialize Sentry if DSN is provided and not in development
  if (SENTRY_DSN && APP_ENV !== 'development') {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: APP_ENV,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // Adjust in production
      tracesSampleRate: APP_ENV === 'production' ? 0.1 : 1.0,
      
      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      // Filter out known errors
      beforeSend(event, hint) {
        const error = hint.originalException;
        
        // Filter out network errors (often user-related)
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message).toLowerCase();
          if (message.includes('network') || message.includes('fetch')) {
            return null;
          }
        }
        
        return event;
      },
    });

    console.log('✅ Sentry initialized');
  } else {
    console.log('ℹ️ Sentry disabled (no DSN or in development)');
  }
};

// Helper to log errors manually
export const logError = (error: Error, context?: Record<string, any>) => {
  console.error('Error:', error, context);
  
  if (SENTRY_DSN && APP_ENV !== 'development') {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

// Helper to log messages
export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) => {
  console[level === 'warning' ? 'warn' : level === 'error' ? 'error' : 'log'](message, context);
  
  if (SENTRY_DSN && APP_ENV !== 'development') {
    Sentry.captureMessage(message, {
      level: level as Sentry.SeverityLevel,
      extra: context,
    });
  }
};

// Set user context
export const setUserContext = (user: { id: string; email?: string; role?: string }) => {
  if (SENTRY_DSN && APP_ENV !== 'development') {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }
};

// Clear user context (on logout)
export const clearUserContext = () => {
  if (SENTRY_DSN && APP_ENV !== 'development') {
    Sentry.setUser(null);
  }
};

export default Sentry;

