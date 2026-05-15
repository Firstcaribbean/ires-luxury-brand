"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCartCount, onCartUpdated } from "@/lib/cart/repository";

export function CartLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(getCartCount());
    refresh();
    return onCartUpdated(refresh);
  }, []);

  return (
    <Link
      href="/cart"
      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent-soft)]/40 px-4 py-2 text-sm text-[color:var(--color-ink)] transition hover:border-[color:var(--color-accent-soft)] hover:text-[color:var(--color-accent-strong)]"
    >
      Cart
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] px-2 text-xs font-semibold text-white">
        {count}
      </span>
    </Link>
  );
}
