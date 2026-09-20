import Stripe from "stripe";

/**
 * Server-only Stripe client. Never import this from components or any
 * client-reachable module at top level.
 */
export function getStripe(): Stripe {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key, {
    // Workers runtime: use the fetch-based HTTP client.
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export const PRODUCT = {
  name: "PickyMaax",
  description: "Life enhancing kibble topper for picky dogs (pre-order, ships at launch)",
  unitAmount: 2400, // $24.00 in cents
  currency: "usd",
} as const;
