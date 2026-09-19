import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Orders belonging to the signed-in customer (RLS scoped to their id / email). */
export const getMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select(
        "id, created_at, updated_at, status, quantity, amount_total, currency, customer_email, shipping_address, stripe_session_id",
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);
    return data ?? [];
  });
