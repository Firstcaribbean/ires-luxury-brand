import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TrackingSearch } from "@/components/tracking/tracking-search";
import { SectionHeading } from "@/components/ui/section-heading";

export default function TrackPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <SectionHeading
          eyebrow="Track Order"
          title="Check the current status of any saved order."
          body="Use the tracking ID or the phone number used during booking to check the current order status, review progress, and see any delivery note that was submitted."
        />

        <div className="mt-12">
          <TrackingSearch />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
