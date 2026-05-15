import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingForm } from "@/components/booking/booking-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPerfumeBySlug, perfumes } from "@/data/perfumes";

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
            <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[color:var(--color-panel)] p-8 sm:p-10">
              <div
                className="pointer-events-none absolute inset-x-12 top-6 h-40 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${perfume.heroAccent} 0%, transparent 72%)`,
                }}
              />
              <div className="relative space-y-5">
                <p className="section-kicker">{perfume.fragranceFamily}</p>
                <h1 className="max-w-2xl font-serif text-5xl text-white sm:text-6xl">
                  {perfume.name}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/65">
                  {perfume.story}
                </p>
                <div className="flex flex-wrap items-center gap-5 pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                      Format
                    </p>
                    <p className="mt-2 text-white/75">{perfume.size}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                      Price
                    </p>
                    <p className="mt-2 font-serif text-3xl text-[color:var(--color-gold-soft)]">
                      {perfume.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                      Mood
                    </p>
                    <p className="mt-2 text-white/75">{perfume.mood}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
                <p className="section-kicker">Top Notes</p>
                <ul className="mt-4 space-y-2 text-white/70">
                  {perfume.topNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
                <p className="section-kicker">Heart Notes</p>
                <ul className="mt-4 space-y-2 text-white/70">
                  {perfume.heartNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
                <p className="section-kicker">Base Notes</p>
                <ul className="mt-4 space-y-2 text-white/70">
                  {perfume.baseNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[color:var(--color-panel)] p-8">
              <p className="section-kicker">Product Story</p>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">
                {perfume.description} This page is already structured for the
                next stage, where product data will come from Firebase instead
                of static content. That means the same page can later support
                real inventory, availability, and admin-managed updates.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products" className="button-ghost">
                  Back to collection
                </Link>
                <Link href="/track" className="button-gold">
                  Track an existing order
                </Link>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <BookingForm productId={perfume.id} productName={perfume.name} />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
