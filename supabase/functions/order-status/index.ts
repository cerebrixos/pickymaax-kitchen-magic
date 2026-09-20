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

  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Missing session_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("status, quantity, amount_total, currency, customer_email")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (order && order.status === "paid") {
      return new Response(JSON.stringify(order), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fall back to Stripe in case the webhook hasn't landed yet.
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (stripeKey) {
      const stripe = new Stripe(stripeKey, {
        httpClient: Stripe.createFetchHttpClient(),
      });
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return new Response(
          JSON.stringify({
            status: session.payment_status === "paid" ? "paid" : (order?.status ?? "pending"),
            quantity: order?.quantity ?? Number(session.metadata?.["quantity"] ?? 1),
            amount_total: session.amount_total ?? order?.amount_total ?? null,
            currency: session.currency ?? order?.currency ?? "usd",
            customer_email: session.customer_details?.email ?? order?.customer_email ?? null,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      } catch {
        // fall through
      }
    }

    return new Response(JSON.stringify(order ?? null), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("order-status error", err);
    return new Response(JSON.stringify({ error: "Lookup failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
