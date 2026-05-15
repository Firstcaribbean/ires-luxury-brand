import Link from "next/link";

import type { Perfume } from "@/data/perfumes";

type PerfumeCardProps = {
  perfume: Perfume;
};

export function PerfumeCard({ perfume }: PerfumeCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[color:var(--color-panel-strong)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1 hover:border-[color:var(--color-gold-soft)]">
      <div
        className="pointer-events-none absolute inset-x-10 top-6 h-32 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${perfume.heroAccent} 0%, transparent 72%)`,
        }}
      />
      <div className="relative flex min-h-[15rem] flex-col justify-between gap-8">
        <div className="space-y-4">
          <p className="section-kicker">{perfume.fragranceFamily}</p>
          <div>
            <h3 className="font-serif text-3xl text-white">{perfume.name}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-white/45">
              {perfume.size}
            </p>
          </div>
          <p className="max-w-sm leading-7 text-white/65">{perfume.description}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/35">
              Mood
            </p>
            <p className="mt-2 text-sm text-white/70">{perfume.mood}</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl text-[color:var(--color-gold-soft)]">
              {perfume.price}
            </p>
            <Link
              href={`/products/${perfume.slug}`}
              className="mt-3 inline-flex items-center rounded-full border border-[color:var(--color-gold-soft)] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--color-gold-soft)] transition hover:bg-[color:var(--color-gold-soft)] hover:text-black"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
