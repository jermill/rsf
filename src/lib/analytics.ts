/**
 * Analytics tracking module
 * Supports multiple analytics providers
 */

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// Track if analytics is enabled
export const isAnalyticsEnabled = () => {
  return APP_ENV !== 'development' && (!!GA_TRACKING_ID || window.location.hostname !== 'localhost');
};

/**
 * Initialize Google Analytics
 */
export const initGoogleAnalytics = () => {
  if (!GA_TRACKING_ID) {
    console.log('ℹ️ Google Analytics not configured');
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    send_page_view: false, // We'll handle page views manually
  });

  console.log('✅ Google Analytics initialized');
};

/**
 * Track page views
 */
export const trackPageView = (path: string, title?: string) => {
  if (!isAnalyticsEnabled()) return;

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }

  // Custom analytics (you can add your own backend)
  trackCustomEvent('page_view', {
    path,
    title: title || document.title,
  });
};

/**
 * Track custom events
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (!isAnalyticsEnabled()) return;

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }

  // Custom analytics
  trackCustomEvent(eventName, eventParams);
};

/**
 * Track user interactions
 */
export const trackClick = (elementName: string, additionalData?: Record<string, any>) => {
  trackEvent('click', {
    element: elementName,
    ...additionalData,
  });
};

export const trackFormSubmit = (formName: string, success: boolean) => {
  trackEvent('form_submit', {
    form_name: formName,
    success,
  });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

/**
 * Track user signup/login
 */
export const trackSignup = (method: string = 'email') => {
  trackEvent('sign_up', {
    method,
  });
};

export const trackLogin = (method: string = 'email') => {
  trackEvent('login', {
    method,
  });
};

export const trackLogout = () => {
  trackEvent('logout');
};

/**
 * Track user actions
 */
export const trackBooking = (serviceId: string, serviceName: string) => {
  trackEvent('booking_created', {
    service_id: serviceId,
    service_name: serviceName,
  });
};

export const trackWorkoutLogged = (duration: number, type: string) => {
  trackEvent('workout_logged', {
    duration,
    type,
  });
};

export const trackGoalCreated = (goalName: string, goalType: string) => {
  trackEvent('goal_created', {
    goal_name: goalName,
    goal_type: goalType,
  });
};

export const trackSubscription = (planId: string, planName: string, amount: number) => {
  trackEvent('purchase', {
    transaction_id: Date.now().toString(),
    value: amount,
    currency: 'USD',
    items: [{
      item_id: planId,
      item_name: planName,
      price: amount,
    }],
  });
};

/**
 * Track errors
 */
export const trackError = (errorName: string, errorMessage?: string) => {
  trackEvent('exception', {
    description: errorName,
    message: errorMessage,
    fatal: false,
  });
};

/**
 * Set user properties
 */
export const setUserProperties = (userId: string, properties: Record<string, any>) => {
  if (!isAnalyticsEnabled()) return;

  if (window.gtag) {
    window.gtag('set', 'user_properties', properties);
    window.gtag('config', GA_TRACKING_ID, {
      user_id: userId,
    });
  }
};

/**
 * Custom analytics backend (store in Supabase)
 */
const trackCustomEvent = async (
  eventName: string,
  eventData?: Record<string, any>
) => {
  try {
    // Get session ID
    const sessionId = getSessionId();

    // Prepare analytics data
    const analyticsData = {
      event_name: eventName,
      event_data: eventData || {},
      session_id: sessionId,
      user_agent: navigator.userAgent,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_path: window.location.pathname,
      referrer: document.referrer,
    };

    // Send to your backend (optional)
    // await supabase.from('analytics_events').insert(analyticsData);
    
    // For now, just log in development
    if (APP_ENV === 'development') {
      console.log('📊 Analytics:', eventName, eventData);
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

/**
 * Get or create session ID
 */
const getSessionId = (): string => {
  const SESSION_KEY = 'analytics_session_id';
  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

  let sessionData = localStorage.getItem(SESSION_KEY);
  
  if (sessionData) {
    try {
      const { id, timestamp } = JSON.parse(sessionData);
      const age = Date.now() - timestamp;
      
      if (age < SESSION_DURATION) {
        return id;
      }
    } catch (e) {
      // Invalid session data
    }
  }

  // Create new session
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    id: newSessionId,
    timestamp: Date.now(),
  }));

  return newSessionId;
};

/**
 * Track time on page
 */
let pageLoadTime = Date.now();

export const trackTimeOnPage = () => {
  const timeSpent = Math.round((Date.now() - pageLoadTime) / 1000); // seconds
  
  trackEvent('time_on_page', {
    seconds: timeSpent,
    page_path: window.location.pathname,
  });
};

// Track time on page before user leaves
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', trackTimeOnPage);
}

/**
 * Conversion tracking
 */
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value,
  });
};

// Type declarations for global gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

