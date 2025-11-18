# Analytics & Insights Tracking Guide

## 📊 What's Been Implemented

Your RSF Fitness app now has comprehensive analytics tracking:

- ✅ Google Analytics 4 integration
- ✅ Vercel Analytics (privacy-friendly, zero-config)
- ✅ Custom event tracking
- ✅ Automatic page view tracking
- ✅ User behavior analytics
- ✅ Conversion tracking
- ✅ Error tracking
- ✅ Session tracking

## 🚀 Setup

### 1. Google Analytics 4

#### Get GA4 Tracking ID

1. Go to [Google Analytics](https://analytics.google.com)
2. Create property (GA4)
3. Get Measurement ID (format: `G-XXXXXXXXXX`)

#### Add to Environment Variables

```env
# .env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_APP_ENV=production
```

#### Verify Installation

```typescript
// Analytics initializes automatically on app load
// Check browser console for "✅ Google Analytics initialized"
```

### 2. Vercel Analytics (Already Integrated)

No configuration needed! It works automatically when deployed to Vercel.

- Privacy-friendly (no cookies)
- GDPR compliant
- Real-time insights
- Zero configuration

### 3. Custom Analytics (Optional)

Store analytics in Supabase for custom insights:

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_agent TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  page_url TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy for admins
CREATE POLICY "Admins can view analytics"
ON analytics_events FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'superadmin')
  )
);
```

## 📈 Available Tracking Functions

### Page Views (Automatic)

```typescript
// Automatically tracked on route changes
// No code needed - uses usePageTracking hook in App.tsx
```

### Custom Events

```typescript
import { trackEvent } from '../lib/analytics';

// Generic event
trackEvent('button_clicked', {
  button_name: 'Get Started',
  location: 'hero_section',
});
```

### User Actions

```typescript
import {
  trackSignup,
  trackLogin,
  trackLogout,
  trackBooking,
  trackWorkoutLogged,
  trackGoalCreated,
  trackSubscription,
} from '../lib/analytics';

// Track signup
trackSignup('email'); // or 'google', 'facebook', etc.

// Track login
trackLogin('email');

// Track booking
trackBooking('service-123', 'Personal Training');

// Track workout
trackWorkoutLogged(45, 'strength'); // 45 minutes, strength training

// Track goal creation
trackGoalCreated('Lose 10 lbs', 'weight_loss');

// Track subscription purchase
trackSubscription('pro', 'Pro Plan', 149);
```

### Interactions

```typescript
import { trackClick, trackFormSubmit, trackSearch } from '../lib/analytics';

// Track button clicks
trackClick('signup_button', {
  page: 'homepage',
  section: 'hero',
});

// Track form submissions
trackFormSubmit('contact_form', true); // success = true/false

// Track search
trackSearch('personal training', 5); // 5 results found
```

### User Properties

```typescript
import { setUserProperties } from '../lib/analytics';

// Set user properties (after login)
setUserProperties(user.id, {
  plan: 'pro',
  signup_date: user.created_at,
  fitness_level: 'intermediate',
  goals: ['weight_loss', 'muscle_gain'],
});
```

### Error Tracking

```typescript
import { trackError } from '../lib/analytics';

try {
  // Some operation
} catch (error) {
  trackError('api_call_failed', error.message);
}
```

## 🎯 Usage Examples

### Track Booking Flow

```typescript
// pages/ServicesPage.tsx
import { trackEvent, trackBooking } from '../lib/analytics';

const handleBookService = async (service) => {
  trackEvent('booking_started', {
    service_id: service.id,
    service_name: service.name,
  });

  const result = await createBooking(service.id);

  if (result.success) {
    trackBooking(service.id, service.name);
    trackEvent('booking_completed', {
      service_id: service.id,
      booking_id: result.booking.id,
    });
  } else {
    trackEvent('booking_failed', {
      service_id: service.id,
      error: result.error,
    });
  }
};
```

### Track Purchase Funnel

```typescript
// pages/PricingPage.tsx
import { trackEvent, trackSubscription } from '../lib/analytics';

const handleSelectPlan = (plan) => {
  trackEvent('plan_selected', {
    plan_id: plan.id,
    plan_name: plan.name,
    price: plan.price,
  });
};

const handlePaymentSuccess = (plan, transactionId) => {
  trackSubscription(plan.id, plan.name, plan.price);
  trackEvent('purchase_completed', {
    transaction_id: transactionId,
    plan_id: plan.id,
  });
};
```

### Track User Engagement

```typescript
// components/dashboard/ProgressChart.tsx
import { trackEvent } from '../lib/analytics';

const handleViewDetails = () => {
  trackEvent('progress_viewed', {
    metric: 'weight',
    time_range: 'month',
  });
};

const handleExport = () => {
  trackEvent('data_exported', {
    type: 'progress_chart',
  });
};
```

## 📊 Key Metrics to Track

### Business Metrics

```typescript
// Signups
trackSignup(method);

// Conversions (free → paid)
trackConversion('free_to_paid', planPrice);

// Subscription changes
trackEvent('plan_upgraded', { from: 'basic', to: 'pro' });
trackEvent('plan_cancelled', { plan: 'pro', reason: 'too_expensive' });

// Booking revenue
trackEvent('revenue', { amount: servicePrice, source: 'booking' });
```

### User Engagement

```typescript
// Feature usage
trackEvent('feature_used', { feature: 'meal_planner' });

// Time on page (automatic on page exit)
// See lib/analytics.ts - trackTimeOnPage()

// Content engagement
trackEvent('video_watched', { video_id: 'workout-123', duration: 300 });
trackEvent('article_read', { article_id: 'nutrition-101' });
```

### Performance Metrics

```typescript
// API response times
trackEvent('api_performance', {
  endpoint: '/api/bookings',
  duration: 245, // ms
  status: 200,
});

// Page load times
trackEvent('page_load', {
  page: window.location.pathname,
  duration: performance.timing.loadEventEnd - performance.timing.navigationStart,
});
```

## 📈 Viewing Analytics

### Google Analytics 4

1. **Realtime Report**: See current active users
2. **Engagement Report**: Page views, events, conversions
3. **User Report**: Demographics, devices, locations
4. **Conversion Report**: Goal completions, revenue
5. **Custom Reports**: Build your own dashboards

### Vercel Analytics

1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab
4. View real-time and historical data

### Custom Dashboards (Optional)

Create admin analytics page:

```typescript
// pages/admin/AnalyticsPage.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const { data } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // Last 30 days

    // Process and display data
    setStats(processData(data));
  };

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      {/* Display charts and metrics */}
    </div>
  );
};
```

## 🔍 Important Events to Track

### User Lifecycle

- [ ] Sign up
- [ ] First login
- [ ] Profile completed
- [ ] First booking
- [ ] First payment
- [ ] Subscription renewal
- [ ] Churn (cancellation)

### Engagement

- [ ] Page views
- [ ] Feature usage
- [ ] Session duration
- [ ] Return visits
- [ ] Content interactions

### Conversions

- [ ] Trial started
- [ ] Trial → Paid
- [ ] Plan upgrades
- [ ] Bookings created
- [ ] Goals completed

### Business

- [ ] Revenue by source
- [ ] Customer Lifetime Value (CLV)
- [ ] Churn rate
- [ ] Popular services
- [ ] Peak usage times

## 🎯 KPIs to Monitor

### User Metrics

- **Daily Active Users (DAU)**
- **Monthly Active Users (MAU)**
- **DAU/MAU Ratio** (stickiness)
- **User Retention Rate**
- **Churn Rate**

### Business Metrics

- **Monthly Recurring Revenue (MRR)**
- **Average Revenue Per User (ARPU)**
- **Customer Acquisition Cost (CAC)**
- **Lifetime Value (LTV)**
- **LTV:CAC Ratio**

### Product Metrics

- **Feature Adoption Rate**
- **Time to First Value**
- **Session Duration**
- **Bounce Rate**
- **Conversion Rate**

## 🔒 Privacy & Compliance

### GDPR Compliance

```typescript
// Allow users to opt-out
const handleOptOut = () => {
  localStorage.setItem('analytics_opt_out', 'true');
  window['ga-disable-' + GA_TRACKING_ID] = true;
};

// Check opt-out status
const hasOptedOut = localStorage.getItem('analytics_opt_out') === 'true';
if (!hasOptedOut) {
  initGoogleAnalytics();
}
```

### Cookie Consent

```typescript
// Show cookie banner
const [showBanner, setShowBanner] = useState(true);

const acceptCookies = () => {
  localStorage.setItem('cookies_accepted', 'true');
  setShowBanner(false);
  initGoogleAnalytics();
};
```

### Data Anonymization

Google Analytics 4 anonymizes IP addresses by default, but you can also:

```typescript
// In analytics initialization
gtag('config', GA_TRACKING_ID, {
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
});
```

## 🚨 Debugging

### Check if Analytics is Working

```javascript
// Open browser console
console.log('GA Tracking ID:', import.meta.env.VITE_GA_TRACKING_ID);
console.log('Analytics Enabled:', isAnalyticsEnabled());

// Check dataLayer
console.log(window.dataLayer);

// Manually trigger test event
trackEvent('test_event', { test: true });
```

### View Events in Real-Time

1. Google Analytics → Reports → Realtime
2. Perform action in your app
3. See event appear in GA dashboard

### Use GA Debugger Extension

Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) Chrome extension.

## 📚 Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Vercel Analytics](https://vercel.com/analytics)
- [Analytics Best Practices](https://segment.com/academy/collecting-data/best-practices-for-tracking-events/)

---

**Status:** ✅ Analytics fully implemented and tracking

Your app is now tracking all important user interactions and business metrics!

