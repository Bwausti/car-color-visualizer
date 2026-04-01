import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

// Re-export as getter for convenience
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Stripe IDs
export const PRODUCT_ID = "prod_UFzxsbGeXp2CWA";
export const BASE_PRICE_ID = "price_1THTxMEJAWe8oXZ1akuyPXC6";
export const USAGE_PRICE_ID = "price_1THTxaEJAWe8oXZ1ZtH47w7n";
export const METER_EVENT_NAME = "colorshift_visualization";
export const PAYMENT_LINK = "https://buy.stripe.com/bJe6oHc2y3x0cbS2Xe3oA00";
