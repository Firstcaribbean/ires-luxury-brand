"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { Perfume } from "@/data/perfumes";
import { formatNaira } from "@/lib/currency";
import { getProductBySlug, subscribeToProducts } from "@/lib/products/repository";

type ProductDetailViewProps = {
  slug: string;
};

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const nextPerfume = await getProductBySlug(slug);
        setPerfume(nextPerfume);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Product details could not be loaded.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void load();
    return subscribeToProducts(() => {
      void load();
    });
  }, [slug]);

  if (isLoading) {
    return <p className="text-[color:var(--color-muted)]">Loading product...</p>;
  }

  if (error) {
    return (
      <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        {error}
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-3xl text-[color:var(--color-ink)]">
          Product not found
        </h1>
        <p className="mt-3 text-[color:var(--color-muted)]">
          This perfume may have been removed or renamed by the vendor.
        </p>
        <Link href="/products" className="button-gold mt-6">
          Back to collection
        </Link>
      </div>
    );
  }

  const hasImage = Boolean(perfume.imageUrl.trim());

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--color-accent-soft)]/15 bg-white p-8 shadow-sm sm:p-10">
          <div
            className="pointer-events-none absolute inset-x-12 top-6 h-40 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${perfume.heroAccent} 0%, transparent 72%)`,
            }}
          />
          <div className="relative grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="overflow-hidden rounded-[1.5rem] bg-[color:var(--color-panel)]">
              {hasImage ? (
                <img
                  src={perfume.imageUrl}
                  alt={perfume.name}
                  className="h-full min-h-[20rem] w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[20rem] w-full items-center justify-center bg-[color:var(--color-panel-strong)] px-6 text-center text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-muted-soft)]">
                  Product image coming soon
                </div>
              )}
            </div>
            <div className="space-y-5">
              <p className="section-kicker">{perfume.fragranceFamily}</p>
              <h1 className="max-w-2xl font-serif text-4xl text-[color:var(--color-ink)] sm:text-5xl">
                {perfume.name}
              </h1>
              <p className="text-base uppercase tracking-[0.18em] text-[color:var(--color-muted-soft)]">
                {perfume.tagline}
              </p>
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
            {perfume.description} Add the item to cart first, then open the cart
            when you are done selecting products. From there you can save the
            order and continue to WhatsApp for payment.
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
            When you finish picking items, open the cart, save the order on the
            website, and then message the vendor on WhatsApp.
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
  );
}
