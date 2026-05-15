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
          title="A simple dashboard for customers who want delivery visibility."
          body="This demo already lets you search sample orders. In the production build, the same interface will read from Firebase using a tracking ID or phone number."
        />

        <div className="mt-12">
          <TrackingSearch />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
