import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './contexts/AuthContext';
import { CMSProvider } from './contexts/CMSContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { initSentry } from './lib/sentry';
import { initGoogleAnalytics } from './lib/analytics';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

// Initialize error tracking
initSentry();

// Initialize analytics
initGoogleAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <CMSProvider>
            <AuthProvider>
              <App />
              <Analytics />
            </AuthProvider>
          </CMSProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);