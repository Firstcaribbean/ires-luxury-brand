import Link from "next/link";

import { CartLink } from "@/components/cart/cart-link";
import { BrandLogo } from "@/components/ui/brand-logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Collection" },
  { href: "/cart", label: "Cart" },
  { href: "/track", label: "Track Order" },
  { href: "/confirm-delivery", label: "Confirm Delivery" },
  { href: "/admin/login", label: "Vendor Panel" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-accent-soft)]/15 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo compact />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[color:var(--color-muted)] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[color:var(--color-accent-strong)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <CartLink />
        </div>
      </div>
    </header>
  );
}
