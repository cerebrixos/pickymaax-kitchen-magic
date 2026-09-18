import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getOrderStatus } from "@/lib/checkout.functions";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: z.object({ session_id: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Order confirmed — PickyMaax" },
      { name: "description", content: "Thank you for your PickyMaax order. Your life enhancing kibble topper is on its way." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Order confirmed — PickyMaax" },
      { property: "og:description", content: "Thank you for your PickyMaax order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { session_id } = Route.useSearch();
  const fetchStatus = useServerFn(getOrderStatus);

  const { data, isLoading } = useQuery({
    queryKey: ["order-status", session_id],
    queryFn: () => fetchStatus({ data: { sessionId: session_id! } }),
    enabled: Boolean(session_id),
    refetchInterval: (q) => (q.state.data?.status === "paid" ? false : 2000),
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Check size={28} strokeWidth={1.6} />
      </span>
      <h1 className="mt-8 font-display text-5xl">Thank you.</h1>
      <p className="mt-4 text-muted-foreground">
        {isLoading
          ? "Confirming your payment…"
          : data?.status === "paid"
            ? "Your payment went through and your order is confirmed."
            : "We have your order. Payment confirmation may take a moment."}
      </p>
      {data?.amount_total ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {data.quantity} × PickyMaax · ${(data.amount_total / 100).toFixed(2)}{" "}
          {data.currency?.toUpperCase()}
          {data.customer_email ? ` · receipt sent to ${data.customer_email}` : ""}
        </p>
      ) : null}
      <Button asChild variant="gold" className="mt-10">
        <Link to="/">Back to PickyMaax</Link>
      </Button>
    </main>
  );
}
