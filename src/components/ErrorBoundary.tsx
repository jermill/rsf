import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to Sentry
    Sentry.withScope((scope) => {
      scope.setExtras({ errorInfo });
      Sentry.captureException(error);
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-dark via-gray-900 to-dark flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-6 mb-6">
                <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                We're sorry, but something unexpected happened. Our team has been notified and we'll fix it as soon as possible.
              </p>

              {/* Error details (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-8 text-left">
                  <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-2">
                      <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">
                        Component Stack
                      </summary>
                      <pre className="mt-2 overflow-auto max-h-64 p-2 bg-gray-50 dark:bg-gray-950 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                  variant="primary"
                  leftIcon={<RefreshCw className="w-5 h-5" />}
                  onClick={this.handleReset}
                  className="w-full sm:w-auto"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<Home className="w-5 h-5" />}
                  onClick={this.handleGoHome}
                  className="w-full sm:w-auto"
                >
                  Go Home
                </Button>
              </div>

              {/* Support message */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                If this problem persists, please contact support with error code:{' '}
                <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                  {Date.now().toString(36).toUpperCase()}
                </code>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Functional wrapper using Sentry's ErrorBoundary with custom fallback
export const SentryErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorBoundary fallback={null}>
          <div className="min-h-screen bg-gradient-to-br from-dark via-gray-900 to-dark flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="w-16 h-16 text-red-600 mb-4" />
                <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                <p className="text-gray-600 mb-8">{error.message}</p>
                <Button onClick={resetError} variant="primary">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      )}
      showDialog={false}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

