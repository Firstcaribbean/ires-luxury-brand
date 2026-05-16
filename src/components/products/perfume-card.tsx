import Link from "next/link";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { Perfume } from "@/data/perfumes";
import { formatNaira } from "@/lib/currency";

type PerfumeCardProps = {
  perfume: Perfume;
};

export function PerfumeCard({ perfume }: PerfumeCardProps) {
  const hasImage = Boolean(perfume.imageUrl.trim());

  return (
    <article className="group relative overflow-hidden rounded-[1.5rem] border border-[color:var(--color-accent-soft)]/15 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[color:var(--color-accent-soft)]/45">
      <div
        className="pointer-events-none absolute inset-x-8 top-4 h-24 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${perfume.heroAccent} 0%, transparent 72%)`,
        }}
      />
      <div className="relative flex min-h-[12.5rem] flex-col justify-between gap-4">
        <div className="grid gap-4 sm:grid-cols-[6.5rem_1fr] sm:items-start">
          <div className="overflow-hidden rounded-[1.15rem] bg-[color:var(--color-panel)]">
            {hasImage ? (
              <img
                src={perfume.imageUrl}
                alt={perfume.name}
                className="h-28 w-full object-cover sm:h-32"
              />
            ) : (
              <div className="flex h-28 w-full items-center justify-center bg-[color:var(--color-panel-strong)] px-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-muted-soft)] sm:h-32">
                Image coming soon
              </div>
            )}
          </div>
          <div className="space-y-3">
            <p className="section-kicker">{perfume.fragranceFamily}</p>
            <div>
              <h3 className="font-serif text-[1.7rem] leading-tight text-[color:var(--color-ink)]">
                {perfume.name}
              </h3>
              <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted-soft)]">
                {perfume.size}
              </p>
            </div>
            <p className="max-w-sm text-[0.95rem] leading-7 text-[color:var(--color-muted)]">
              {perfume.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted-soft)]">
              Mood
            </p>
            <p className="mt-1.5 text-sm text-[color:var(--color-muted)]">{perfume.mood}</p>
          </div>
          <div className="flex flex-col items-start gap-2.5 sm:items-end">
            <p className="font-serif text-[1.8rem] text-[color:var(--color-accent-strong)]">
              {formatNaira(perfume.price)}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <AddToCartButton perfume={perfume} />
              <Link
                href={`/products/${perfume.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-accent-soft)]/26 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent-strong)] transition hover:bg-[color:var(--color-panel)] hover:text-[color:var(--color-ink)]"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
