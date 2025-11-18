# Stripe Payment Integration Guide

## 📦 What's Included

The RSF Fitness app now has complete Stripe payment integration infrastructure:

- ✅ Stripe SDK setup
- ✅ Payment context provider
- ✅ Checkout form component
- ✅ Subscription card component
- ✅ Error handling for payments
- ✅ Security best practices

## 🔑 Setup Steps

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete business verification
3. Get your API keys from [Dashboard → API Keys](https://dashboard.stripe.com/apikeys)

### 2. Add Environment Variables

Add to your `.env` file:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
```

**Important:** 
- Use `pk_test_` for testing
- Use `pk_live_` for production
- NEVER commit your `.env` file

### 3. Backend Setup (Supabase Functions or Separate Server)

You need a backend to:
1. Create payment intents
2. Handle webhooks
3. Manage subscriptions

#### Option A: Supabase Edge Functions

Create a Supabase Edge Function:

```bash
supabase functions new create-payment-intent
```

```typescript
// supabase/functions/create-payment-intent/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

serve(async (req) => {
  try {
    const { amount, planId } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: { planId },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

Deploy:
```bash
supabase functions deploy create-payment-intent --no-verify-jwt
```

#### Option B: Express Server

```javascript
// server/stripe.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.post('/create-payment-intent', async (req, res) => {
  const { amount, planId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: { planId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000);
```

### 4. Set up Stripe Webhooks

Webhooks notify your backend of payment events:

1. **Go to:** [Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. **Add endpoint:** `https://your-domain.com/webhook/stripe`
3. **Select events:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

4. **Save webhook secret** to your environment:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 5. Handle Webhooks

```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '')

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        // Update Supabase: user successfully paid
        console.log('Payment succeeded:', paymentIntent.id)
        break

      case 'payment_intent.payment_failed':
        const failed = event.data.object
        // Handle failed payment
        console.log('Payment failed:', failed.id)
        break

      case 'customer.subscription.created':
        const subscription = event.data.object
        // Create subscription in Supabase
        console.log('Subscription created:', subscription.id)
        break
    }

    return new Response(JSON.stringify({ received: true }))
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
```

## 💻 Frontend Usage

### Wrap App with PaymentProvider

```tsx
// src/main.tsx
import { PaymentProvider } from './contexts/PaymentContext';

<PaymentProvider>
  <App />
</PaymentProvider>
```

### Use in Pricing Page

```tsx
import { useState } from 'react';
import { CheckoutForm } from '../components/payment/CheckoutForm';
import { SubscriptionCard } from '../components/payment/SubscriptionCard';
import { subscriptionPlans } from '../data/subscriptions';

export const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleSelectPlan = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  return (
    <div>
      {!showCheckout ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>
      ) : (
        <CheckoutForm
          amount={selectedPlan.price}
          planName={selectedPlan.name}
          onSuccess={() => {
            // Handle successful payment
            console.log('Payment successful!');
          }}
          onCancel={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};
```

## 🔐 Security Best Practices

### ✅ DO:
- Use Stripe Elements for card input (PCI compliant)
- Validate on the backend
- Use webhooks to confirm payments
- Store Stripe customer IDs in your database
- Use test mode during development
- Implement idempotency for payments
- Log all transactions

### ❌ DON'T:
- Never store card numbers
- Never expose secret keys
- Don't trust client-side payment confirmations
- Don't skip webhook signature verification
- Don't hardcode amounts in frontend

## 📊 Database Schema

Add to your Supabase migrations:

```sql
-- Stripe customers table
CREATE TABLE stripe_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table (extend existing)
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Payment history
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  plan_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own stripe data"
  ON stripe_customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);
```

## 🧪 Testing

### Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
Insufficient funds: 4000 0000 0000 9995
```

Use any future expiry date and any 3-digit CVC.

### Test Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/webhook/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
```

## 📈 Going to Production

1. **Switch to live keys**
   - Get live keys from Stripe dashboard
   - Update environment variables
   - Update webhook endpoints

2. **Enable production features**
   - Set up proper error monitoring
   - Enable email receipts
   - Configure subscription management portal

3. **Compliance**
   - Review Stripe's terms
   - Update privacy policy
   - Add refund policy
   - Display pricing clearly

## 🚨 Troubleshooting

### Payment fails silently
- Check browser console for errors
- Verify Stripe keys are correct
- Check network tab for API errors
- Ensure CORS is configured

### Webhook not received
- Verify webhook endpoint is accessible
- Check webhook signature verification
- Review Stripe dashboard webhook logs
- Ensure webhook secret is correct

### Duplicate charges
- Implement idempotency keys
- Check for multiple form submissions
- Add loading states to prevent double-clicks

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React](https://stripe.com/docs/stripe-js/react)
- [Testing Stripe](https://stripe.com/docs/testing)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

**Status:** ✅ Frontend Integration Complete | ⏳ Backend Webhooks Needed

You have all the frontend components ready. Next step is to set up the backend endpoints and webhooks for full payment processing.

