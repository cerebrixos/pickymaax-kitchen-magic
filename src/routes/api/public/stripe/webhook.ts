import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";

export const Route = createFileRoute("/api/public/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secret) return new Response("Webhook not configured", { status: 500 });

        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 400 });

        const body = await request.text();
        const { getStripe } = await import("@/lib/stripe.server");
        const stripe = getStripe();

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

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

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
          // Let the event be retried by Stripe.
          await supabaseAdmin.from("stripe_events").delete().eq("id", event.id);
          return new Response("Handler error", { status: 500 });
        }

        return new Response("ok");
      },
    },
  },
});
