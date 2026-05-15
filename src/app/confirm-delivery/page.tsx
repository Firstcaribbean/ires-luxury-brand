import { DeliveryConfirmationForm } from "@/components/delivery/delivery-confirmation-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function ConfirmDeliveryPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-10 lg:py-20">
        <DeliveryConfirmationForm />
      </main>
      <SiteFooter />
    </>
  );
}
