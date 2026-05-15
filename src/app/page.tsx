import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PerfumeCard } from "@/components/products/perfume-card";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SectionHeading } from "@/components/ui/section-heading";
import { perfumes } from "@/data/perfumes";
import { siteConfig } from "@/data/site-config";

const scrollScenes = [
  {
    title: "Discover the signature",
    body: "A cinematic introduction designed to feel like a perfume campaign instead of a standard storefront.",
  },
  {
    title: "Book with intention",
    body: "Every product detail page moves customers straight into a guided WhatsApp booking flow.",
  },
  {
    title: "Track every delivery",
    body: "The customer journey continues after purchase with order tracking and delivery confirmation.",
  },
];

const fragranceLayers = [
  {
    label: "Top Notes",
    copy: "A bright first impression built with citrus, pepper, and crisp aromatic lift.",
  },
  {
    label: "Heart Notes",
    copy: "The emotional center where florals, incense, and texture give the fragrance identity.",
  },
  {
    label: "Base Notes",
    copy: "A long luxurious finish of woods, amber, resin, and skin-like warmth.",
  },
];

const orderFlow = [
  "Select your perfume and reserve it with a Book Now request.",
  "Share customer details, quantity, and address in a pre-filled WhatsApp message.",
  "Vendor confirms payment, dispatches the order, and updates tracking progress.",
  "Customer receives the order and uploads photo proof on delivery confirmation.",
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <section className="relative isolate border-b border-white/10">
          <div className="noise-overlay" />
          <div className="mx-auto grid min-h-[calc(100vh-81px)] w-full max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-24">
            <div className="flex flex-col justify-center gap-8">
              <div className="space-y-5">
                <BrandLogo hero />
                <p className="section-kicker">Luxury Perfume Commerce</p>
                <h1 className="max-w-3xl font-serif text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
                  A bold perfume experience with cinematic scroll, signature
                  style, and concierge ordering.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/65">
                  {siteConfig.brandName} blends editorial design, layered motion, and
                  a concierge WhatsApp checkout flow into one premium digital
                  experience.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="button-gold">
                  Explore the collection
                </Link>
                <Link href="/track" className="button-ghost">
                  Track an order
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {scrollScenes.map((scene, index) => (
                  <div
                    key={scene.title}
                    className="rounded-[1.75rem] border border-white/10 bg-[color:var(--color-panel)] p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                      0{index + 1}
                    </p>
                    <h2 className="mt-4 font-serif text-2xl text-white">
                      {scene.title}
                    </h2>
                    <p className="mt-3 leading-7 text-white/60">{scene.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="ambient-orb ambient-orb-left" />
              <div className="ambient-orb ambient-orb-right" />
              <div className="hero-bottle-shell">
                <div className="hero-bottle-cap" />
                <div className="hero-bottle-glass">
                  <div className="hero-bottle-reflection" />
                  <div className="hero-bottle-label">
                    <span className="text-[0.65rem] uppercase tracking-[0.45em] text-white/45">
                      IRE&apos;S LUXURY
                    </span>
                    <span className="mt-3 font-serif text-4xl text-white">
                      Pink Signature
                    </span>
                    <span className="mt-3 h-px w-10 bg-[color:var(--color-gold-soft)]" />
                    <span className="mt-3 text-sm uppercase tracking-[0.35em] text-[color:var(--color-gold-soft)]">
                      Eau de parfum
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Brand Story"
                title="Designed like a luxury campaign, not a commodity catalog."
                body="The homepage is structured as a scroll narrative: mood, bottle, ingredients, collection, and service. That gives your perfume brand a stronger identity before the customer even reaches the booking step."
              />
            </div>
            <div className="grid gap-6">
              <div className="rounded-[2rem] border border-white/10 bg-[color:var(--color-panel)] p-8">
                <p className="section-kicker">Editorial Layout</p>
                <p className="mt-4 max-w-2xl text-2xl leading-10 text-white/80">
                  Dramatic spacing, restrained motion, and layered light effects
                  create the premium feeling that commodity templates usually
                  miss.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6">
                  <p className="section-kicker">Luxury UI</p>
                  <p className="mt-4 leading-7 text-white/65">
                    Black, ivory, and branded pink are supported by elegant
                    typography and subtle glass textures.
                  </p>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6">
                  <p className="section-kicker">Mobile First</p>
                  <p className="mt-4 leading-7 text-white/65">
                    The structure is responsive from the beginning so the
                    premium mood still holds up on smaller screens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
            <SectionHeading
              eyebrow="Fragrance Architecture"
              title="Each scent unfolds in layers, just like the site experience."
              body="These note blocks preview how we can tell the product story with motion and structure before customers book."
              align="center"
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {fragranceLayers.map((layer, index) => (
                <article
                  key={layer.label}
                  className="rounded-[2rem] border border-white/10 bg-[color:var(--color-panel-strong)] p-6"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                    Layer 0{index + 1}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl text-white">
                    {layer.label}
                  </h3>
                  <p className="mt-4 leading-7 text-white/65">{layer.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
            <SectionHeading
              eyebrow="Signature Collection"
              title="A first look at the perfumes in your luxury catalogue."
              body="These are seeded as structured content so we can reuse them across the homepage, collection page, detail pages, and later the admin panel."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {perfumes.map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <SectionHeading
                eyebrow="Service Journey"
                title="The order flow stays elegant from booking to proof of delivery."
                body="This structure gives you a functional business flow without forcing customers through a complicated checkout system."
              />
              <div className="space-y-4">
                {orderFlow.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-[1.75rem] border border-white/10 bg-[color:var(--color-panel)] p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                      Step 0{index + 1}
                    </p>
                    <p className="mt-3 leading-7 text-white/70">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
          <div
            className="rounded-[2.25rem] border bg-[linear-gradient(135deg,rgba(28,21,13,0.96),rgba(8,8,10,0.96))] p-8 sm:p-10"
            style={{ borderColor: "rgba(255, 41, 142, 0.35)" }}
          >
            <p className="section-kicker">Project Foundation Ready</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl">
              The front-end luxury direction is in place. Next we connect
              booking, tracking, storage, and admin data with Firebase.
            </h2>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="button-gold">
                View product pages
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
