import Stripe from "https://esm.sh/stripe@17.2.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PRODUCT = {
  name: "PickyMaax",
  description:
    "Life enhancing kibble topper for picky dogs (pre-order, ships at launch)",
  unitAmount: 2400,
  currency: "usd",
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const quantity = Number(body?.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return new Response(JSON.stringify({ error: "Invalid quantity" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Stripe not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const stripe = new Stripe(stripeKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Determine origin from request headers.
    const url = new URL(req.url);
    const forwardedHost = req.headers.get("x-forwarded-host");
    const forwardedProto = req.headers.get("x-forwarded-proto");
    const origin = forwardedHost
      ? `${forwardedProto ?? "https"}://${forwardedHost}`
      : url.origin;

    // Optional: attach order to signed-in user.
    let userId: string | null = null;
    let userEmail: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: claimsData } = await supabaseAdmin.auth.getClaims(token);
      const claims = claimsData?.claims as { sub?: string; email?: string } | undefined;
      if (claims?.sub) {
        userId = claims.sub;
        userEmail = claims.email ?? null;
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity,
          price_data: {
            currency: PRODUCT.currency,
            unit_amount: PRODUCT.unitAmount,
            product_data: { name: PRODUCT.name, description: PRODUCT.description },
          },
        },
      ],
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancelled`,
      ...(userEmail ? { customer_email: userEmail } : {}),
      metadata: {
        quantity: String(quantity),
        ...(userId ? { user_id: userId } : {}),
      },
    });

    const { error } = await supabaseAdmin.from("orders").upsert(
      {
        stripe_session_id: session.id,
        quantity,
        amount_total: session.amount_total ?? PRODUCT.unitAmount * quantity,
        currency: PRODUCT.currency,
        status: "pending",
        user_id: userId,
        customer_email: userEmail,
      },
      { onConflict: "stripe_session_id" },
    );
    if (error) console.error("Failed to record pending order", error);

    if (!session.url) {
      return new Response(JSON.stringify({ error: "No checkout URL" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-checkout error", err);
    return new Response(JSON.stringify({ error: "Checkout failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
