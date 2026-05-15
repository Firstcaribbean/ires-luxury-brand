import { CartCheckout } from "@/components/cart/cart-checkout";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionHeading } from "@/components/ui/section-heading";

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <SectionHeading
          eyebrow="Cart & Booking"
          title="Review your perfumes and save the order before payment."
          body="Add one or more items to cart, save the order on the website, then open WhatsApp to message the vendor and pay."
        />

        <div className="mt-10">
          <CartCheckout />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
