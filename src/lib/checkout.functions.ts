import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const checkoutInput = z.object({
  quantity: z.number().int().min(1).max(20),
});

function originFrom(request: Request) {
  const envOrigin = process.env["PUBLIC_SITE_URL"];
  if (envOrigin) return envOrigin.replace(/\/$/, "");
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    return `${forwardedProto ?? url.protocol.replace(":", "")}://${forwardedHost}`;
  }
  return url.origin;
}

/** Creates a Stripe Checkout session and returns its hosted URL. */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutInput.parse(data))
  .handler(async ({ data }) => {
    const { getStripe, PRODUCT } = await import("@/lib/stripe.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const stripe = getStripe();
    const origin = originFrom(getRequest());

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: data.quantity,
          price_data: {
            currency: PRODUCT.currency,
            unit_amount: PRODUCT.unitAmount,
            product_data: {
              name: PRODUCT.name,
              description: PRODUCT.description,
            },
          },
        },
      ],
      // Physical product: collect a shipping address.
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancelled`,
      metadata: { quantity: String(data.quantity) },
    });

    // Record the pending order up front so we can reconcile even if the
    // customer never returns to the success page.
    const { error } = await supabaseAdmin.from("orders").upsert(
      {
        stripe_session_id: session.id,
        quantity: data.quantity,
        amount_total: session.amount_total ?? PRODUCT.unitAmount * data.quantity,
        currency: PRODUCT.currency,
        status: "pending",
      },
      { onConflict: "stripe_session_id" },
    );
    if (error) console.error("Failed to record pending order", error);

    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return { url: session.url };
  });

/** Public order status lookup by Checkout session id (no sensitive fields). */
export const getOrderStatus = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ sessionId: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("status, quantity, amount_total, currency, customer_email")
      .eq("stripe_session_id", data.sessionId)
      .maybeSingle();

    if (order && order.status === "paid") return order;

    // Fall back to Stripe in case the webhook has not landed yet.
    const { getStripe } = await import("@/lib/stripe.server");
    try {
      const session = await getStripe().checkout.sessions.retrieve(data.sessionId);
      return {
        status: session.payment_status === "paid" ? "paid" : (order?.status ?? "pending"),
        quantity: order?.quantity ?? Number(session.metadata?.["quantity"] ?? 1),
        amount_total: session.amount_total ?? order?.amount_total ?? null,
        currency: session.currency ?? order?.currency ?? "usd",
        customer_email: session.customer_details?.email ?? order?.customer_email ?? null,
      };
    } catch {
      return order ?? null;
    }
  });
