import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductsGrid } from "@/components/products/products-grid";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SectionHeading } from "@/components/ui/section-heading";
import { demoSeedPerfumes } from "@/data/perfumes";
import { siteConfig } from "@/data/site-config";

const scrollScenes = [
  {
    title: "Discover the collection",
    body: "A softer, lighter storefront that still feels polished and premium from the first scroll.",
  },
  {
    title: "Add to cart with ease",
    body: "Customers can add perfumes as they browse, then move to one clear booking step when ready.",
  },
  {
    title: "Save and pay on WhatsApp",
    body: "The order is saved on the website first, then WhatsApp opens so the vendor can confirm payment.",
  },
];

const fragranceLayers = [
  {
    label: "Top Notes",
    copy: "A bright opening built with citrus, fruits, herbs, and airy first impressions.",
  },
  {
    label: "Heart Notes",
    copy: "The personality of the perfume where florals, spice, and texture start to bloom.",
  },
  {
    label: "Base Notes",
    copy: "The lasting finish of woods, musk, amber, vanilla, and soft sensual warmth.",
  },
];

const orderFlow = [
  "Browse the collection and add one or more perfumes to cart.",
  "Open the cart, enter delivery details, and save the booking on the website.",
  "Use the WhatsApp button to message the vendor and complete payment.",
  "Track the order status later and confirm delivery with a note once it arrives.",
];

const heroShowcase = demoSeedPerfumes;
const movingHighlights = [
  "Luxury perfume picks",
  "Cart before WhatsApp",
  "Naira pricing",
  "Editable vendor catalog",
  "Classic feminine layout",
  "Track orders online",
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <section className="relative isolate border-b border-[color:var(--color-accent-soft)]/14">
          <div className="noise-overlay" />
          <div className="mx-auto grid min-h-[calc(100vh-81px)] w-full max-w-7xl gap-14 px-6 py-14 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-20">
            <div className="flex flex-col justify-center gap-8">
              <div className="reveal-rise space-y-5">
                <BrandLogo hero />
                <p className="section-kicker">Luxury Perfume Shopping</p>
                <h1 className="max-w-3xl font-serif text-4xl leading-tight text-[color:var(--color-ink)] sm:text-5xl lg:text-6xl">
                  A refined perfume store with soft cinematic styling and a
                  clear cart-to-WhatsApp order flow.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[color:var(--color-muted)] sm:text-lg">
                  {siteConfig.brandName} now combines a lighter luxury look,
                  add-to-cart shopping, saved bookings, and direct vendor
                  payment on WhatsApp in one easy customer journey.
                </p>
              </div>

              <div className="reveal-rise flex flex-wrap gap-4 [animation-delay:120ms]">
                <Link href="/products" className="button-gold">
                  Explore the collection
                </Link>
                <Link href="/cart" className="button-ghost">
                  View cart and book
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {scrollScenes.map((scene, index) => (
                  <div
                    key={scene.title}
                    className="reveal-rise hover-lift-soft relative overflow-hidden rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/14 bg-white p-5 shadow-sm"
                    style={{ animationDelay: `${180 + index * 100}ms` }}
                  >
                    <div className="card-sheen" />
                    <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted-soft)]">
                      0{index + 1}
                    </p>
                    <h2 className="mt-4 font-serif text-xl text-[color:var(--color-ink)] sm:text-2xl">
                      {scene.title}
                    </h2>
                    <p className="mt-3 leading-7 text-[color:var(--color-muted)]">
                      {scene.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-start justify-center pt-6 lg:justify-end lg:pt-2">
              <div className="ambient-orb ambient-orb-left" />
              <div className="ambient-orb ambient-orb-right" />
              <div className="hero-ripple hero-ripple-one" />
              <div className="hero-ripple hero-ripple-two" />
              <div className="perfume-stage reveal-rise [animation-delay:180ms]">
                <div className="hero-bottle-shell perfume-stage-core">
                  <div className="hero-bottle-cap" />
                  <div className="hero-bottle-glass">
                    <div className="hero-bottle-reflection" />
                    <div className="hero-bottle-label">
                      <span className="text-[0.62rem] uppercase tracking-[0.42em] text-[color:var(--color-muted-soft)]">
                        IRE&apos;S LUXURY
                      </span>
                      <span className="mt-3 font-serif text-3xl text-[color:var(--color-ink)] sm:text-4xl">
                        Pink Signature
                      </span>
                      <span className="mt-3 h-px w-10 bg-[color:var(--color-accent-soft)]" />
                      <span className="mt-3 text-xs uppercase tracking-[0.32em] text-[color:var(--color-accent-strong)]">
                        Eau de parfum
                      </span>
                    </div>
                  </div>
                </div>
                {heroShowcase.map((product, index) => (
                  <article
                    key={product.slug}
                    className={`stage-product-card reveal-rise stage-product-card-${index + 1}`}
                    style={{ animationDelay: `${260 + index * 100}ms` }}
                  >
                    <div
                      className="stage-product-glow"
                      style={{ background: product.heroAccent }}
                    />
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="stage-product-image"
                    />
                    <div className="stage-product-meta">
                      <p className="section-kicker">{product.fragranceFamily}</p>
                      <p className="mt-2 font-serif text-lg text-[color:var(--color-ink)]">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted-soft)]">
                        {product.size}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--color-accent-soft)]/14 bg-white/60">
          <div className="mx-auto w-full max-w-7xl px-6 py-5 lg:px-10">
            <div className="marquee-shell">
              <div className="marquee-track">
                {[...movingHighlights, ...movingHighlights].map((item, index) => (
                  <span key={`${item}-${index}`} className="marquee-pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--color-accent-soft)]/14 bg-[color:var(--color-panel)]/55">
          <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
            <div className="mb-6 reveal-rise">
              <SectionHeading
                eyebrow="Animated Showcase"
                title="A moving perfume spotlight that feels more visual and modern."
                body="This section keeps product imagery in motion so the page feels alive even after the first load."
              />
            </div>
            <div className="product-image-marquee-shell reveal-rise [animation-delay:120ms]">
              <div className="product-image-marquee-track">
                {[...heroShowcase, ...heroShowcase].map((product, index) => (
                  <article
                    key={`${product.slug}-${index}`}
                    className="product-image-marquee-card"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image-marquee-photo"
                    />
                    <div className="product-image-marquee-copy">
                      <p className="section-kicker">{product.fragranceFamily}</p>
                      <p className="mt-2 font-serif text-2xl text-[color:var(--color-ink)]">
                        {product.name}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                        {product.tagline}
                      </p>
                      <p className="mt-4 font-serif text-2xl text-[color:var(--color-accent-strong)]">
                        ₦{product.price.toLocaleString()}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--color-accent-soft)]/14">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.84fr_1.16fr] lg:px-10">
            <div className="reveal-rise lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Brand Story"
                title="A lighter boutique direction that still feels premium."
                body="The app now leans into soft pink, white, and editorial spacing so the experience feels welcoming, feminine, and easier to read without losing the luxury mood."
              />
            </div>
            <div className="grid gap-6">
              <div className="reveal-rise hover-lift-soft relative overflow-hidden rounded-[2rem] border border-[color:var(--color-accent-soft)]/14 bg-white p-8 shadow-sm [animation-delay:120ms]">
                <div className="card-sheen" />
                <p className="section-kicker">Editorial Layout</p>
                <p className="mt-4 max-w-2xl text-xl leading-9 text-[color:var(--color-ink)] sm:text-2xl">
                  Clean spacing, readable typography, and soft glass-like panels
                  keep the store premium while making the shopping flow much
                  easier to follow.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="reveal-rise hover-lift-soft rounded-[2rem] border border-[color:var(--color-accent-soft)]/14 bg-[color:var(--color-panel)] p-6 shadow-sm [animation-delay:180ms]">
                  <p className="section-kicker">Shopping Flow</p>
                  <p className="mt-4 leading-7 text-[color:var(--color-muted)]">
                    Instead of booking one product at a time, customers can now
                    collect their choices first, then save one order at checkout.
                  </p>
                </div>
                <div className="reveal-rise hover-lift-soft rounded-[2rem] border border-[color:var(--color-accent-soft)]/14 bg-[color:var(--color-panel)] p-6 shadow-sm [animation-delay:260ms]">
                  <p className="section-kicker">Readable Design</p>
                  <p className="mt-4 leading-7 text-[color:var(--color-muted)]">
                    The font sizes are calmer at normal zoom and still scale
                    naturally when the browser is enlarged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--color-accent-soft)]/14">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
            <div className="reveal-rise">
              <SectionHeading
              eyebrow="Fragrance Architecture"
              title="Each scent still tells a story in clear, elegant layers."
              body="The homepage keeps the product-storytelling idea, but with softer contrast and easier reading across desktop and mobile."
              align="center"
            />
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {fragranceLayers.map((layer, index) => (
                <article
                  key={layer.label}
                  className="reveal-rise hover-lift-soft relative overflow-hidden rounded-[2rem] border border-[color:var(--color-accent-soft)]/14 bg-white p-6 shadow-sm"
                  style={{ animationDelay: `${120 + index * 110}ms` }}
                >
                  <div className="card-sheen" />
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted-soft)]">
                    Layer 0{index + 1}
                  </p>
                  <h3 className="mt-4 font-serif text-2xl text-[color:var(--color-ink)] sm:text-3xl">
                    {layer.label}
                  </h3>
                  <p className="mt-4 leading-7 text-[color:var(--color-muted)]">
                    {layer.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--color-accent-soft)]/14">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
            <div className="reveal-rise">
              <SectionHeading
              eyebrow="Signature Collection"
              title="Shop the perfumes, add favorites, and continue when ready."
              body="Every product card now supports the cart flow so customers can browse multiple scents before they book and pay, while the admin can manage products from the vendor panel."
            />
            </div>
            <div className="mt-12">
              <ProductsGrid />
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--color-accent-soft)]/14">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="reveal-rise">
                <SectionHeading
                eyebrow="Service Journey"
                title="The business flow is now simpler and more practical."
                body="Customers can shop first, save later, and only move to WhatsApp once the full order is already recorded on the website."
              />
              </div>
              <div className="space-y-4">
                {orderFlow.map((step, index) => (
                  <div
                    key={step}
                    className="reveal-rise hover-lift-soft relative overflow-hidden rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/14 bg-white p-5 shadow-sm"
                    style={{ animationDelay: `${120 + index * 95}ms` }}
                  >
                    <div className="card-sheen" />
                    <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted-soft)]">
                      Step 0{index + 1}
                    </p>
                    <p className="mt-3 leading-7 text-[color:var(--color-muted)]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
          <div className="reveal-rise hover-lift-soft relative overflow-hidden rounded-[2.25rem] border border-[color:var(--color-accent-soft)]/18 bg-[linear-gradient(135deg,#fff8fb,#fff0f7)] p-8 shadow-sm sm:p-10">
            <div className="card-sheen" />
            <p className="section-kicker">Ready To Use</p>
            <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight text-[color:var(--color-ink)] sm:text-4xl">
              The store now supports lighter branding, naira pricing, cart
              selection, saved bookings, tracking, and vendor follow-up.
            </h2>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="button-gold">
                Start shopping
              </Link>
              <Link href="/admin/login" className="button-ghost">
                Preview vendor panel
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
