import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getMyOrders } from "@/lib/orders.functions";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My orders — PickyMaax" },
      {
        name: "description",
        content: "Track the status of your PickyMaax life enhancing kibble topper orders.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "My orders — PickyMaax" },
      { property: "og:description", content: "Track your PickyMaax orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrdersPage,
});

const statusCopy: Record<string, string> = {
  pending: "Awaiting payment confirmation",
  awaiting_payment: "Awaiting payment confirmation",
  paid: "Paid — preparing your order",
  failed: "Payment failed",
  expired: "Checkout expired",
  refunded: "Refunded",
};

function OrdersPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const fetchOrders = useServerFn(getMyOrders);

  useEffect(() => {
    let done = false;
    // Give the client a moment to finish restoring the session (e.g. right
    // after the Google redirect) before deciding the visitor is signed out.
    const timer = setTimeout(() => {
      if (done) return;
      supabase.auth.getSession().then(({ data }) => {
        if (done) return;
        done = true;
        setAuthed(Boolean(data.session));
        setEmail(data.session?.user.email ?? null);
        if (!data.session) navigate({ to: "/auth" });
      });
    }, 2000);
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (done && !session) return;
      if (session) {
        done = true;
        clearTimeout(timer);
      }
      setAuthed(Boolean(session));
      setEmail(session?.user.email ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && !done) {
        done = true;
        clearTimeout(timer);
        setAuthed(true);
        setEmail(data.session.user.email ?? null);
      }
    });
    return () => {
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => fetchOrders(),
    enabled: authed === true,
    refetchInterval: 15000,
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Your orders</h1>
          {email ? <p className="mt-2 text-sm text-muted-foreground">{email}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/">Shop</Link>
          </Button>
          <Button variant="ghost" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        {authed === null || isLoading ? (
          <p className="text-sm text-muted-foreground">Loading your orders…</p>
        ) : !orders || orders.length === 0 ? (
          <div className="rounded-2xl border border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No orders yet. Orders placed with this email address will show up here.
            </p>
            <Button asChild variant="gold" className="mt-6">
              <Link to="/">Get PickyMaax</Link>
            </Button>
          </div>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-border p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl">
                  {order.quantity} × PickyMaax
                </h2>
                <span className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-3 text-sm">
                <span className="font-semibold text-primary">
                  {statusCopy[order.status] ?? order.status}
                </span>
              </p>
              {order.amount_total ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  ${(order.amount_total / 100).toFixed(2)} {order.currency?.toUpperCase()}
                </p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
