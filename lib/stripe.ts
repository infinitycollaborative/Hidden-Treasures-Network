import Stripe from 'stripe';

// Lazy initialization to avoid build-time failures when STRIPE_SECRET_KEY is not set
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
    });
  }
  return stripeInstance;
}

// For backward compatibility - may be null if STRIPE_SECRET_KEY is not configured
export const stripe = {
  get paymentIntents() {
    const instance = getStripe();
    if (!instance) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    return instance.paymentIntents;
  },
  get customers() {
    const instance = getStripe();
    if (!instance) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    return instance.customers;
  },
  get subscriptions() {
    const instance = getStripe();
    if (!instance) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    return instance.subscriptions;
  },
};
