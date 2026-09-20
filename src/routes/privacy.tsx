import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";


export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — PickyMaax" },
      {
        name: "description",
        content:
          "The privacy policy for PickyMaax, a life enhancing kibble topper for picky dogs.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Privacy Policy — PickyMaax" },
      {
        property: "og:description",
        content: "Privacy policy for PickyMaax.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "1. What we collect",
    body: "When you place a pre-order we collect your name, email address, shipping address, and payment details. Payment information is processed securely by Stripe and is never stored on our servers. If you sign in to track your orders, we also store the email address linked to your account.",
  },
  {
    title: "2. How we use your information",
    body: "We use your information to fulfill pre-orders, send shipping updates, and respond to your questions. If you join the email list, we will send occasional launch and restock updates. You can unsubscribe from those emails at any time.",
  },
  {
    title: "3. What we don't do",
    body: "We do not sell or rent your personal information to anyone. We do not share your data with third parties for advertising or tracking purposes. The only third parties who see your data are the services we rely on to run the store — our payment processor (Stripe) and our hosting provider — and only what they need to do their job.",
  },
  {
    title: "4. Cookies",
    body: "This site uses minimal cookies to keep you signed in and to remember what's in your cart. We do not use advertising or cross-site tracking cookies.",
  },
  {
    title: "5. Data retention",
    body: "We keep your order information for as long as needed to fulfill your pre-order and handle any post-order support. If you ask us to delete your account, we will remove your personal data from our active systems, except where we are required to keep it for tax or legal reasons.",
  },
  {
    title: "6. Your rights",
    body: "You can ask to see, correct, or delete the personal information we hold about you at any time. Email hello@pickymaax.com and we will respond promptly. Depending on where you live, you may have additional rights under local privacy laws.",
  },
  {
    title: "7. Children's privacy",
    body: "PickyMaax is run by a 15-year-old founder, but the site is intended for adults placing orders on behalf of their dogs. We do not knowingly collect information from children under 13. If you believe a child has provided us personal data, contact us and we will remove it.",
  },
  {
    title: "8. Security",
    body: "We take reasonable steps to protect your information, but no system is perfectly secure. Payment details are handled entirely by Stripe, which meets industry security standards.",
  },
  {
    title: "9. Changes to this policy",
    body: "We may update this Privacy Policy as PickyMaax grows. If we make a material change we will note it on this page. Your continued use of the site after a change means you accept the updated policy.",
  },
  {
    title: "10. Contact",
    body: "Questions about your privacy or this policy? Email hello@pickymaax.com and we will get back to you.",
  },
];

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-24 max-w-[1100px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="PickyMaax home">
            <img
              src="/pickymaax-logo.webp"
              alt=""
              width={64}
              height={64}
              className="size-12 rounded-full object-contain"
            />
            <span className="hidden font-display text-xl tracking-[0.22em] sm:inline">
              PICKYMAAX
            </span>
          </Link>
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/">
              <ArrowLeft size={16} /> Back to site
            </Link>
          </Button>
        </div>
      </header>

      <article className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 lg:py-24">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-5 text-sm text-muted-foreground">
          Last updated September 20, 2026.
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl">{section.title}</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            PickyMaax · Made with love (and a lot of failed batches) by a
            15-year-old and Max.
          </p>
        </div>
      </article>
    </main>
  );
}
