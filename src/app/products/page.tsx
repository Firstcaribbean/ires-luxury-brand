import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PerfumeCard } from "@/components/products/perfume-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { perfumes } from "@/data/perfumes";

export default function ProductsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <SectionHeading
          eyebrow="Collection"
          title="A curated perfume line designed for a premium digital storefront."
          body="Each fragrance already has the core content we need for a cinematic product page and a booking-first sales flow."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {perfumes.map((perfume) => (
            <PerfumeCard key={perfume.id} perfume={perfume} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
