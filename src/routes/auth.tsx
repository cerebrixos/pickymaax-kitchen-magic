import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import logoAsset from "@/assets/pickymaax-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — PickyMaax" },
      {
        name: "description",
        content: "Sign in to PickyMaax to view and track your kibble topper orders.",
      },
      { property: "og:title", content: "Sign in — PickyMaax" },
      { property: "og:description", content: "Sign in to track your PickyMaax orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate({ to: "/orders" });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/orders" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signInWithGoogle = async () => {
    setError(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("We couldn't start Google sign-in. Please try again.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/orders" });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <img src={logoAsset.url} alt="" width={96} height={96} className="size-20 rounded-full object-contain" />
      <h1 className="mt-8 font-display text-4xl">Your orders</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Sign in with Google to see your PickyMaax orders and track their status.
      </p>
      <Button variant="gold" className="mt-8 h-12 w-full" onClick={signInWithGoogle} disabled={busy}>
        {busy ? "Opening Google…" : "Continue with Google"}
      </Button>
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      <a href="/" className="mt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
        Back to PickyMaax
      </a>
    </main>
  );
}
