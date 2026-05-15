import Link from "next/link";

import { BrandLogo } from "@/components/ui/brand-logo";
import { siteConfig } from "@/data/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--color-accent-soft)]/15 bg-[#fff7fb]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 text-sm text-[color:var(--color-muted)] lg:grid-cols-[1.6fr_1fr_1fr] lg:px-10">
        <div className="space-y-3">
          <BrandLogo />
          <p className="max-w-md leading-7">
            Elegant perfumes, simple booking, and direct WhatsApp payment made
            easy for your customers.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted-soft)]">
            Explore
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/products" className="transition hover:text-[color:var(--color-accent-strong)]">
              Collection
            </Link>
            <Link href="/cart" className="transition hover:text-[color:var(--color-accent-strong)]">
              Cart
            </Link>
            <Link href="/track" className="transition hover:text-[color:var(--color-accent-strong)]">
              Track an order
            </Link>
            <Link
              href="/confirm-delivery"
              className="transition hover:text-[color:var(--color-accent-strong)]"
            >
              Confirm delivery
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted-soft)]">
            Concierge
          </p>
          <div className="space-y-2">
            <p>{siteConfig.supportPhone}</p>
            <p>{siteConfig.supportEmail}</p>
            <p>WhatsApp ordering available daily</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
