import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductsGrid } from "@/components/products/products-grid";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ProductsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <SectionHeading
          eyebrow="Collection"
          title="Choose your perfumes, add them to cart, and book when you are ready."
          body="Customers can add items to cart first, then save the order on the site before moving to WhatsApp for payment."
        />

        <div className="mt-12">
          <ProductsGrid />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
