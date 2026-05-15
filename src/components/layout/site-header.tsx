"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CartLink } from "@/components/cart/cart-link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { getStoredCustomerSession } from "@/lib/customers/repository";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Collection" },
  { href: "/cart", label: "Cart" },
  { href: "/track", label: "Track Order" },
  { href: "/confirm-delivery", label: "Confirm Delivery" },
  { href: "/admin/login", label: "Vendor Panel" },
];

export function SiteHeader() {
  const [accountLabel, setAccountLabel] = useState("Account");
  const [accountHref, setAccountHref] = useState("/account/login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const session = getStoredCustomerSession();

      if (session) {
        setAccountLabel(session.fullName.split(" ")[0] || "My Account");
        setAccountHref("/account");
        return;
      }

      setAccountLabel("Account");
      setAccountHref("/account/login");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-accent-soft)]/15 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
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
          <Link
            href={accountHref}
            className="transition hover:text-[color:var(--color-accent-strong)]"
          >
            {accountLabel}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href={accountHref} className="button-ghost">
            {accountLabel}
          </Link>
          <CartLink />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={accountHref}
            className="inline-flex items-center rounded-full border border-[color:var(--color-accent-soft)]/30 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--color-accent-strong)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Account
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center rounded-full border border-[color:var(--color-accent-soft)]/30 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--color-accent-strong)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cart
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-accent-soft)]/30 text-[color:var(--color-accent-strong)]"
          >
            <span className="flex flex-col gap-1">
              <span className="h-0.5 w-4 bg-current" />
              <span className="h-0.5 w-4 bg-current" />
              <span className="h-0.5 w-4 bg-current" />
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-[color:var(--color-accent-soft)]/15 bg-white px-4 py-4 md:hidden">
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl bg-[color:var(--color-panel)] px-4 py-3 text-sm text-[color:var(--color-ink)] transition hover:text-[color:var(--color-accent-strong)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={accountHref}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-2xl bg-[color:var(--color-panel)] px-4 py-3 text-sm text-[color:var(--color-ink)] transition hover:text-[color:var(--color-accent-strong)]"
            >
              {accountLabel}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
