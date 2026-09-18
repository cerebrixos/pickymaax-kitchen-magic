import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/cancelled")({
  head: () => ({
    meta: [
      { title: "Checkout cancelled — PickyMaax" },
      { name: "description", content: "Your PickyMaax checkout was cancelled. Nothing was charged." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Checkout cancelled — PickyMaax" },
      { property: "og:description", content: "Nothing was charged. Your jar is still waiting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CancelledPage,
});

function CancelledPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-5xl">No worries.</h1>
      <p className="mt-4 text-muted-foreground">
        Your checkout was cancelled and nothing was charged. Max will keep the jar warm.
      </p>
      <Button asChild variant="gold" className="mt-10">
        <Link to="/" hash="shop">Return to the shop</Link>
      </Button>
    </main>
  );
}
