import Link from "next/link";

import { BrandLogo } from "@/components/ui/brand-logo";
import { siteConfig } from "@/data/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/85">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 text-sm text-white/65 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-10">
        <div className="space-y-3">
          <BrandLogo />
          <p className="max-w-md leading-7">
            Modern luxury perfumery designed around cinematic storytelling,
            concierge ordering, and white-glove delivery updates.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Explore
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/products" className="transition hover:text-white">
              Collection
            </Link>
            <Link href="/track" className="transition hover:text-white">
              Track an order
            </Link>
            <Link
              href="/confirm-delivery"
              className="transition hover:text-white"
            >
              Confirm delivery
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
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
