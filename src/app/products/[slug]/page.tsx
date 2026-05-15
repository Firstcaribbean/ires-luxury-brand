import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPerfumeBySlug, perfumes } from "@/data/perfumes";
import { formatNaira } from "@/lib/currency";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return perfumes.map((perfume) => ({
    slug: perfume.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const perfume = getPerfumeBySlug(slug);

  if (!perfume) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--color-accent-soft)]/15 bg-white p-8 shadow-sm sm:p-10">
              <div
                className="pointer-events-none absolute inset-x-12 top-6 h-40 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${perfume.heroAccent} 0%, transparent 72%)`,
                }}
              />
              <div className="relative space-y-5">
                <p className="section-kicker">{perfume.fragranceFamily}</p>
                <h1 className="max-w-2xl font-serif text-4xl text-[color:var(--color-ink)] sm:text-5xl">
                  {perfume.name}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[color:var(--color-muted)]">
                  {perfume.story}
                </p>
                <div className="flex flex-wrap items-center gap-5 pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted-soft)]">
                      Format
                    </p>
                    <p className="mt-2 text-[color:var(--color-muted)]">{perfume.size}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted-soft)]">
                      Price
                    </p>
                    <p className="mt-2 font-serif text-2xl text-[color:var(--color-accent-strong)]">
                      {formatNaira(perfume.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted-soft)]">
                      Mood
                    </p>
                    <p className="mt-2 text-[color:var(--color-muted)]">{perfume.mood}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-[color:var(--color-accent-soft)]/15 bg-white p-6 shadow-sm">
                <p className="section-kicker">Top Notes</p>
                <ul className="mt-4 space-y-2 text-[color:var(--color-muted)]">
                  {perfume.topNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-[color:var(--color-accent-soft)]/15 bg-white p-6 shadow-sm">
                <p className="section-kicker">Heart Notes</p>
                <ul className="mt-4 space-y-2 text-[color:var(--color-muted)]">
                  {perfume.heartNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-[color:var(--color-accent-soft)]/15 bg-white p-6 shadow-sm">
                <p className="section-kicker">Base Notes</p>
                <ul className="mt-4 space-y-2 text-[color:var(--color-muted)]">
                  {perfume.baseNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/15 bg-white p-8 shadow-sm">
              <p className="section-kicker">Product Story</p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[color:var(--color-muted)]">
                {perfume.description} Add the item to cart first, then open the
                cart when you are done selecting products. From there you can
                save the order and continue to WhatsApp for payment.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products" className="button-ghost">
                  Back to collection
                </Link>
                <Link href="/cart" className="button-gold">
                  Open cart
                </Link>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/15 bg-white p-6 shadow-sm">
              <p className="section-kicker">Add Selection</p>
              <h2 className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">
                Add this perfume to cart
              </h2>
              <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
                When you finish picking items, open the cart, save the order on
                the website, and then message the vendor on WhatsApp.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <AddToCartButton perfume={perfume} fullWidth />
                <Link href="/cart" className="button-ghost w-full text-center">
                  Go to cart
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
