import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  Check,
  ChevronDown,
  Instagram,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import logoAsset from "../assets/pickymaax-logo.png.asset.json";
import productImage from "../assets/pickymaax-product.jpg";
import maxImage from "../assets/max-story.jpg";

const productDetails = [
  { title: "Ingredients", content: "A simple, savory blend crafted to make everyday kibble more appealing. Final ingredient list coming soon." },
  { title: "Feeding instructions", content: "Sprinkle lightly over your dog’s regular food, toss gently, and serve. Adjust to your dog’s size and appetite." },
  { title: "Shipping", content: "Shipping details and delivery estimates will be confirmed at launch." },
];

const faqs: Array<[string, string]> = [
  ["What’s in PickyMaax?", "PickyMaax uses a focused blend of savory ingredients. The complete ingredient panel will be published before orders open."],
  ["How much should I use?", "Start with a light sprinkle over your dog’s usual serving, then toss to coat the kibble evenly."],
  ["What if my dog doesn’t like it?", "Every dog is different. Our final satisfaction policy will be clearly posted before checkout goes live."],
  ["Is it safe for puppies and senior dogs?", "Please check with your veterinarian before adding any new food product, especially for puppies, seniors, or dogs with dietary needs."],
  ["How long does shipping take?", "Shipping times will be shown at checkout once PickyMaax is ready to order."],
  ["What is your refund policy?", "Our complete refund policy will be available before launch. We want every order to feel straightforward and fair."],
];

const reviews = [
  { name: "Jamie R.", dog: "Milo’s person", quote: "He went back to the bowl before I even put the jar away." },
  { name: "Priya S.", dog: "Luna’s person", quote: "Dinner stopped being a negotiation. That alone feels like magic." },
  { name: "Alex T.", dog: "Winnie’s person", quote: "A tiny sprinkle, a clean bowl, and one very proud little dog." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PickyMaax — Life Enhancing Kibble Topper for Picky Dogs" },
      { name: "description", content: "A savory, life enhancing kibble topper made to help picky dogs actually eat. Just sprinkle, toss, and serve." },
      { property: "og:title", content: "PickyMaax — Life Enhancing Kibble Topper for Picky Dogs" },
      { property: "og:description", content: "A savory, life enhancing topper that makes ordinary kibble irresistible." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: PickyMaaxPage,
});

function PickyMaaxPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [openDetail, setOpenDetail] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, menuOpen]);

  const addToCart = () => {
    setCartQuantity((current) => current + quantity);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? "border-b border-border bg-background/95 shadow-sm backdrop-blur" : "bg-transparent"}`}>
        <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14">
          <a href="#top" className="flex items-center gap-3" aria-label="PickyMaax home">
            <img src={logoAsset.url} alt="" width={96} height={96} className="size-16 rounded-full object-contain sm:size-[4.5rem]" />
            <span className="hidden font-display text-2xl tracking-[0.22em] sm:inline">PICKYMAAX</span>
          </a>
          <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">
            <a className="nav-link" href="#about">About</a>
            <a className="nav-link" href="#how-it-works">How It Works</a>
            <a className="nav-link" href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-1.5">
            <Button variant="icon" aria-label={`Open cart, ${cartQuantity} items`} onClick={() => setCartOpen(true)} className="relative">
              <ShoppingBag size={19} strokeWidth={1.7} />
              {cartQuantity > 0 && <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{cartQuantity}</span>}
            </Button>
            <a href="#shop" className="hidden min-h-10 items-center rounded-full bg-foreground px-6 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-primary hover:text-primary-foreground sm:inline-flex">Shop</a>
            <Button variant="icon" className="md:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={21} /></Button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative flex min-h-[94svh] items-center overflow-hidden pt-24">
          <div className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 pb-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-14 lg:pb-8">
            <div className="relative z-10 max-w-2xl animate-rise">
              <p className="eyebrow mb-6">Life enhancing kibble topper · For selective appetites</p>
              <h1 className="font-display text-[clamp(3.5rem,7vw,7.4rem)] leading-[0.92]">For the dog who turns up his nose.</h1>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">A savory topper that makes ordinary kibble irresistible.</p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <a href="#shop" className="inline-flex min-h-13 items-center rounded-full bg-primary px-8 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:-translate-y-0.5">Get PickyMaax</a>
                <a href="#about" className="group inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-sm font-medium">Read Max’s story <ArrowDown size={15} className="transition-transform group-hover:translate-y-1" /></a>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[670px] animate-rise-delayed lg:ml-auto">
              <div className="absolute left-[8%] top-[12%] size-[68%] rounded-full bg-primary/12 blur-3xl" />
              <img src={productImage} alt="Matte black PickyMaax savory kibble topper jar with a gold scoop" width={1408} height={1600} className="relative z-10 mx-auto max-h-[76svh] w-auto rounded-[2rem] object-contain shadow-product animate-float" />
            </div>
          </div>
        </section>

        <div className="overflow-hidden border-y border-primary/40 bg-foreground py-4 text-background" aria-label="Product highlights">
          <div className="marquee flex w-max items-center gap-12 whitespace-nowrap">
            {[0, 1].map((loop) => <div key={loop} className="flex items-center gap-12" aria-hidden={loop === 1}>
              {["Made for picky eaters", "Simple ingredients", "Just sprinkle and serve", "Dog-approved by Max"].map((item) => <span key={item} className="flex items-center gap-12 text-xs font-semibold uppercase tracking-[0.2em]"><span>{item}</span><Sparkles size={14} className="text-primary" /></span>)}
            </div>)}
          </div>
        </div>

        <section id="shop" className="section-pad scroll-mt-20 bg-secondary">
          <div className="mx-auto grid max-w-[1320px] gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-24 lg:px-14">
            <div className="overflow-hidden rounded-[1.5rem] bg-background shadow-soft">
              <img src={productImage} alt="PickyMaax savory kibble topper in premium black and gold packaging" loading="lazy" width={1408} height={1600} className="aspect-[4/4.7] h-full w-full object-cover" />
            </div>
            <div className="max-w-xl">
              <p className="eyebrow">The original blend</p>
              <h2 className="mt-5 font-display text-5xl leading-none sm:text-6xl">PickyMaax</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">A life enhancing kibble topper — a crave-worthy finishing touch for everyday bowls. Savory aroma, simple routine, cleaner bowls.</p>
              <p className="mt-8 text-2xl font-medium">$24 <span className="text-sm font-normal text-muted-foreground">placeholder price</span></p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-13 w-36 items-center justify-between rounded-full border border-border bg-background px-2" aria-label="Quantity selector">
                  <Button variant="icon" className="size-9 min-h-9" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus size={15} /></Button>
                  <span aria-live="polite" className="text-sm font-semibold">{quantity}</span>
                  <Button variant="icon" className="size-9 min-h-9" aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)}><Plus size={15} /></Button>
                </div>
                <Button variant="gold" onClick={addToCart} className="h-13 min-h-13 w-full flex-1 px-8 text-sm shadow-soft">Add to cart · ${(24 * quantity).toFixed(0)}</Button>
              </div>
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {["Enticing aroma", "Easy to serve", "Max approved"].map((benefit) => <li key={benefit} className="flex items-center gap-2 text-sm"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"><Check size={14} strokeWidth={2.5} /></span>{benefit}</li>)}
              </ul>
              <div className="mt-10 border-t border-border">
                {productDetails.map((item, index) => <AccordionRow key={item.title} title={item.title} content={item.content} open={openDetail === index} onToggle={() => setOpenDetail(openDetail === index ? null : index)} />)}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section-pad scroll-mt-20">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-14">
            <div className="text-center"><p className="eyebrow">Dinner in three gestures</p><h2 className="mt-5 font-display text-5xl sm:text-6xl">How it works</h2></div>
            <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-0">
              {["Sprinkle over kibble.", "Give it a gentle toss.", "Watch the bowl disappear."].map((step, index) => <li key={step} className="relative px-6 text-center md:border-l md:border-border md:first:border-l-0">
                <span className="font-display text-6xl text-primary/45">0{index + 1}</span><h3 className="mt-5 font-display text-2xl">{step}</h3>
              </li>)}
            </ol>
          </div>
        </section>

        <section id="about" className="scroll-mt-20 bg-foreground text-background">
          <div className="grid lg:grid-cols-2">
            <div className="min-h-[540px] lg:min-h-full"><img src={maxImage} alt="Golden retriever Max sitting beside his bowl in a warm kitchen" loading="lazy" width={1600} height={1312} className="h-full w-full object-cover" /></div>
            <article className="px-6 py-20 sm:px-12 lg:px-16 lg:py-28 xl:px-24">
              <p className="eyebrow text-primary">Our story</p>
              <h2 className="mt-6 font-display text-5xl leading-tight sm:text-6xl">PickyMaax started with one very stubborn dog.</h2>
              <div className="story-copy mt-10 space-y-6 text-background/72">
                <p>Max is my dog, and Max does not eat. He’d sniff his bowl, look up at me like I’d personally insulted him, and walk away. We tried every brand, every flavor, every “vet recommended” bag on the shelf. Some nights he’d skip dinner entirely, and I’d sit on the kitchen floor next to a full bowl feeling completely useless.</p>
                <p>So I started experimenting. I spent weeks mixing and testing different savory blends in our kitchen, trying to find something that would make his same old kibble actually smell like food worth eating. Most of them he ignored. And then one evening I sprinkled a new batch over his bowl, set it down, and he inhaled it. Gone in seconds. He licked the bowl, then looked up for more.</p>
                <p>That was it. That was the whole thing.</p>
                <blockquote className="my-12 border-l border-primary pl-7 font-display text-4xl italic leading-tight text-background sm:text-5xl">“I just wanted my dog to eat.”</blockquote>
                <p>I’m 15. I didn’t set out to start a company — I just wanted my dog to eat. But if PickyMaax can get one more picky dog to finish their dinner, and one more person off the kitchen floor, it’s worth sharing.</p>
              </div>
              <div className="mt-12 border-t border-background/15 pt-8"><p className="font-signature text-3xl text-primary">Max & me</p><p className="mt-2 text-xs uppercase tracking-[0.16em] text-background/55">Made by a 15-year-old and one very picky taste tester.</p></div>
            </article>
          </div>
        </section>

        <section className="section-pad bg-secondary">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-14">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Early taste tests</p><h2 className="mt-5 font-display text-5xl">Clean bowls, happy people.</h2></div><p className="text-xs text-muted-foreground">Sample reviews shown for layout</p></div>
            <div className="mt-14 grid gap-5 md:grid-cols-3">{reviews.map((review) => <figure key={review.name} className="rounded-xl border border-border bg-background p-8">
              <div className="flex gap-1 text-primary" aria-label="5 out of 5 stars">{[0,1,2,3,4].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div>
              <blockquote className="mt-7 font-display text-2xl leading-snug">“{review.quote}”</blockquote><figcaption className="mt-8 text-sm font-semibold">{review.name}<span className="mt-1 block font-normal text-muted-foreground">{review.dog}</span></figcaption>
            </figure>)}</div>
          </div>
        </section>

        <section id="faq" className="section-pad scroll-mt-20">
          <div className="mx-auto grid max-w-[1120px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-14">
            <div><p className="eyebrow">Good to know</p><h2 className="mt-5 font-display text-5xl sm:text-6xl">Questions, answered.</h2></div>
            <div className="border-t border-border">{faqs.map(([question, answer], index) => <AccordionRow key={question} title={question} content={answer} open={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? null : index)} large />)}</div>
          </div>
        </section>

        <section className="bg-primary px-5 py-20 text-primary-foreground sm:px-8">
          <div className="mx-auto max-w-3xl text-center"><p className="eyebrow text-primary-foreground/65">First dibs</p><h2 className="mt-4 font-display text-5xl sm:text-6xl">Join the pack.</h2><p className="mt-4 text-primary-foreground/75">Get early restock access and the occasional note from Max.</p>
            <form className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}><label htmlFor="email" className="sr-only">Email address</label><input id="email" type="email" required placeholder="you@example.com" className="h-14 flex-1 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/55 focus:border-primary-foreground" /><Button variant="dark" type="submit" className="h-14">Keep me posted</Button></form>
          </div>
        </section>
      </main>

      <footer className="bg-foreground px-5 py-14 text-background sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1320px]"><div className="flex flex-col justify-between gap-10 border-b border-background/15 pb-12 md:flex-row md:items-start"><div className="flex items-center gap-4"><img src={logoAsset.url} alt="PickyMaax dog logo" width={72} height={72} className="size-16 rounded-full object-contain" /><span className="font-display text-2xl tracking-[0.2em]">PICKYMAAX</span></div><div className="grid grid-cols-2 gap-x-16 gap-y-4 text-sm"><a href="#about">About</a><a href="#shop">Shop</a><a href="#how-it-works">How it works</a><a href="#faq">FAQ</a><a href="mailto:hello@pickymaax.com">hello@pickymaax.com</a><div className="flex gap-3"><a href="#instagram" aria-label="Instagram"><Instagram size={18} /></a><a href="#tiktok" aria-label="TikTok" className="text-xs font-bold">TK</a></div></div></div><p className="pt-8 text-xs leading-relaxed text-background/55">PickyMaax · Made with love (and a lot of failed batches) by a 15-year-old and Max.</p></div>
      </footer>

      {menuOpen && <div className="fixed inset-0 z-50 bg-foreground text-background md:hidden"><div className="flex h-20 items-center justify-between px-5"><span className="font-display tracking-[0.2em]">PICKYMAAX</span><Button variant="icon" className="text-background hover:bg-background/10" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X /></Button></div><nav className="flex flex-col gap-8 px-8 pt-16 font-display text-4xl"><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a><a href="#shop" className="text-primary" onClick={() => setMenuOpen(false)}>Shop</a></nav></div>}

      {cartOpen && <><button className="fixed inset-0 z-50 bg-foreground/55" aria-label="Close cart" onClick={() => setCartOpen(false)} /><aside role="dialog" aria-modal="true" aria-labelledby="cart-title" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background p-6 shadow-drawer animate-slide-in"><div className="flex items-center justify-between border-b border-border pb-5"><h2 id="cart-title" className="font-display text-3xl">Your cart</h2><Button variant="icon" aria-label="Close cart" onClick={() => setCartOpen(false)}><X size={20} /></Button></div>
        {cartQuantity > 0 ? <><div className="flex flex-1 gap-4 py-7"><img src={productImage} alt="PickyMaax topper" width={104} height={124} className="h-28 w-24 rounded-lg object-cover" /><div className="flex-1"><h3 className="font-display text-xl">PickyMaax</h3><p className="mt-1 text-sm text-muted-foreground">Life enhancing kibble topper</p><div className="mt-4 flex items-center justify-between"><div className="flex items-center rounded-full border border-border"><Button variant="icon" className="size-8 min-h-8" aria-label="Remove one" onClick={() => setCartQuantity((q) => Math.max(0, q - 1))}><Minus size={13} /></Button><span className="w-7 text-center text-sm">{cartQuantity}</span><Button variant="icon" className="size-8 min-h-8" aria-label="Add one" onClick={() => setCartQuantity((q) => q + 1)}><Plus size={13} /></Button></div><span className="font-semibold">${(cartQuantity * 24).toFixed(2)}</span></div><button className="mt-4 text-xs underline text-muted-foreground" onClick={() => setCartQuantity(0)}>Remove</button></div></div><div className="border-t border-border pt-6"><div className="flex justify-between text-lg"><span>Subtotal</span><strong>${(cartQuantity * 24).toFixed(2)}</strong></div><p className="mt-2 text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p><Button className="mt-6 h-14 w-full" disabled>Checkout coming soon</Button></div></> : <div className="flex flex-1 flex-col items-center justify-center text-center"><ShoppingBag size={36} strokeWidth={1.3} className="text-primary" /><h3 className="mt-5 font-display text-3xl">Your cart is waiting.</h3><p className="mt-2 text-sm text-muted-foreground">Max recommends starting with one jar.</p><Button className="mt-7" onClick={() => setCartOpen(false)}>Continue shopping</Button></div>}
      </aside></>}
    </div>
  );
}

function AccordionRow({ title, content, open, onToggle, large = false }: { title: string; content: string; open: boolean; onToggle: () => void; large?: boolean }) {
  return <div className="border-b border-border"><button type="button" onClick={onToggle} aria-expanded={open} className={`flex w-full items-center justify-between gap-5 py-5 text-left font-medium ${large ? "text-lg" : "text-sm"}`}><span>{title}</span><ChevronDown size={18} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} /></button><div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}><div className="overflow-hidden"><p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{content}</p></div></div></div>;
}
