import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductDetailView } from "@/components/products/product-detail-view";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <ProductDetailView slug={slug} />
      </main>
      <SiteFooter />
    </>
  );
}
