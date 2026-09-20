import { supabase } from "@/integrations/supabase/client";

function edgeUrl(slug: string, params?: Record<string, string>): string {
  const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
  if (!supabaseUrl) throw new Error("SUPABASE_URL is not configured");
  const base = `${supabaseUrl}/functions/v1/${slug}`;
  if (params) {
    const search = new URLSearchParams(params);
    return `${base}?${search}`;
  }
  return base;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) {
    headers["Authorization"] = `Bearer ${data.session.access_token}`;
  }
  return headers;
}

export async function createCheckoutSession(quantity: number): Promise<{ url: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch(edgeUrl("create-checkout"), {
    method: "POST",
    headers,
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Checkout failed" }));
    throw new Error(body.error ?? "Checkout failed");
  }
  return res.json();
}

export async function getOrderStatus(
  sessionId: string,
): Promise<{
  status: string;
  quantity: number;
  amount_total: number | null;
  currency: string | null;
  customer_email: string | null;
} | null> {
  const headers = await getAuthHeaders();
  const res = await fetch(edgeUrl("order-status", { session_id: sessionId }), {
    method: "GET",
    headers,
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getMyOrders(): Promise<
  Array<{
    id: string;
    created_at: string;
    updated_at: string;
    status: string;
    quantity: number;
    amount_total: number | null;
    currency: string | null;
    customer_email: string | null;
    shipping_address: unknown;
    stripe_session_id: string;
  }>
> {
  const headers = await getAuthHeaders();
  const res = await fetch(edgeUrl("my-orders"), { method: "GET", headers });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}
