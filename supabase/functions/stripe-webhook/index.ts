import Stripe from "https://esm.sh/stripe@17.2.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) {
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response("Stripe not configured", { status: 500 });
  }
  const stripe = new Stripe(stripeKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      secret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (err) {
    console.error("Stripe signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Idempotency: the primary key rejects a replayed event id.
  const { error: dupeError } = await supabaseAdmin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });
  if (dupeError) {
    if (dupeError.code === "23505") return new Response("ok (duplicate)");
    console.error("Failed to record stripe event", dupeError);
    return new Response("Storage error", { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        const paid = session.payment_status === "paid";
        await supabaseAdmin.from("orders").upsert(
          {
            stripe_session_id: session.id,
            stripe_payment_intent_id:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
            stripe_customer_id:
              typeof session.customer === "string" ? session.customer : null,
            customer_email: session.customer_details?.email ?? null,
            customer_name: session.customer_details?.name ?? null,
            shipping_address:
              (session.collected_information?.shipping_details ??
                session.customer_details?.address ??
                null) as never,
            quantity: Number(session.metadata?.["quantity"] ?? 1),
            amount_total: session.amount_total,
            currency: session.currency ?? "usd",
            status: paid ? "paid" : "awaiting_payment",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "stripe_session_id" },
        );
        break;
      }
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await supabaseAdmin
          .from("orders")
          .update({
            status: event.type === "checkout.session.expired" ? "expired" : "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_session_id", session.id);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (typeof charge.payment_intent === "string") {
          await supabaseAdmin
            .from("orders")
            .update({ status: "refunded", updated_at: new Date().toISOString() })
            .eq("stripe_payment_intent_id", charge.payment_intent);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handling failed", err);
    await supabaseAdmin.from("stripe_events").delete().eq("id", event.id);
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok");
});
