import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";


export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — PickyMaax" },
      {
        name: "description",
        content:
          "The terms of service and pre-order policy for PickyMaax, a life enhancing kibble topper for picky dogs.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Terms of Service — PickyMaax" },
      {
        property: "og:description",
        content: "Terms of service and pre-order policy for PickyMaax.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "1. About PickyMaax",
    body: "PickyMaax is a life enhancing kibble topper intended for dogs. These Terms of Service (\"Terms\") govern your use of pickymaax.com and any pre-order placed through the site. By placing a pre-order you agree to these Terms.",
  },
  {
    title: "2. Pre-orders, not purchases",
    body: "PickyMaax is not yet shipping. When you place an order on this site you are placing a pre-order, not completing a purchase. Your card is charged at the time of pre-order to reserve your jar, and your order will be fulfilled once PickyMaax begins shipping. We will keep you updated on the expected ship date by email.",
  },
  {
    title: "3. Pricing and payment",
    body: "All prices are listed in US dollars and are subject to change before PickyMaax officially launches. If the final price at launch differs from your pre-order price, you will be charged the pre-order price you agreed to at checkout. Taxes and shipping are calculated at checkout.",
  },
  {
    title: "4. Shipping",
    body: "Pre-ordered jars ship once production is complete. We will email you an estimated shipping window as soon as it is confirmed. Shipping is currently limited to the United States and Canada. We are not responsible for carrier delays once a package has left our hands.",
  },
  {
    title: "5. Cancellations and refunds",
    body: "You may cancel your pre-order for a full refund at any time before your jar has shipped. To cancel, email hello@pickymaax.com with the email address you used at checkout. Once an order has shipped it is no longer eligible for cancellation, but if your jar arrives damaged or incorrect, contact us and we will make it right.",
  },
  {
    title: "6. Product expectations",
    body: "PickyMaax is a savory topper designed to make kibble more appealing to picky dogs. We do not guarantee that every dog will respond the same way. Final ingredient lists and feeding guidance will be published before launch. Always consult your veterinarian before introducing a new product, especially for puppies, seniors, or dogs with dietary restrictions.",
  },
  {
    title: "7. Your account",
    body: "If you create an account or sign in, you are responsible for keeping your login details secure. Orders are linked to the email address you use at checkout so you can track their status.",
  },
  {
    title: "8. Intellectual property",
    body: "All content on this site — the PickyMaax name, logo, copy, and imagery — is owned by PickyMaax and may not be copied or reused without written permission.",
  },
  {
    title: "9. Changes to these terms",
    body: "We may update these Terms as PickyMaax grows. If we make a material change we will note it on this page. Your continued use of the site after a change means you accept the updated Terms.",
  },
  {
    title: "10. Contact",
    body: "Questions about these Terms or your pre-order? Email hello@pickymaax.com and we will get back to you.",
  },
];

function TermsPage() {
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
          Terms of Service
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

        <div className="mt-16 border-t border-border pt-8 flex flex-wrap gap-x-6 gap-y-2">
          <p className="text-sm text-muted-foreground">
            PickyMaax · Made with love (and a lot of failed batches) by a
            15-year-old and Max.
          </p>
          <Link to="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
            Privacy Policy
          </Link>
        </div>
      </article>
    </main>
  );
}
