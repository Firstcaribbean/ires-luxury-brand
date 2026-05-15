import Link from "next/link";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { Perfume } from "@/data/perfumes";
import { formatNaira } from "@/lib/currency";

type PerfumeCardProps = {
  perfume: Perfume;
};

export function PerfumeCard({ perfume }: PerfumeCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/15 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[color:var(--color-accent-soft)]/45">
      <div
        className="pointer-events-none absolute inset-x-10 top-6 h-32 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${perfume.heroAccent} 0%, transparent 72%)`,
        }}
      />
      <div className="relative flex min-h-[15rem] flex-col justify-between gap-6">
        <div className="space-y-4">
          <p className="section-kicker">{perfume.fragranceFamily}</p>
          <div>
            <h3 className="font-serif text-2xl text-[color:var(--color-ink)]">{perfume.name}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[color:var(--color-muted-soft)]">
              {perfume.size}
            </p>
          </div>
          <p className="max-w-sm leading-7 text-[color:var(--color-muted)]">{perfume.description}</p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted-soft)]">
              Mood
            </p>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">{perfume.mood}</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="font-serif text-2xl text-[color:var(--color-accent-strong)]">
              {formatNaira(perfume.price)}
            </p>
            <div className="flex flex-wrap gap-3">
              <AddToCartButton perfume={perfume} />
              <Link href={`/products/${perfume.slug}`} className="button-ghost">
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
