import { loadStripe, Stripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    if (!STRIPE_PUBLIC_KEY) {
      console.warn('⚠️ Stripe public key not found. Payment features will be disabled.');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const isStripeEnabled = () => {
  return !!STRIPE_PUBLIC_KEY;
};

