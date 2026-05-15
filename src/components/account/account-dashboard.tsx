"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { formatNaira } from "@/lib/currency";
import {
  getStoredCustomerSession,
  listOrdersForCustomer,
  signOutCustomer,
  type CustomerProfile,
} from "@/lib/customers/repository";
import type { OrderRecord } from "@/lib/orders/types";

export function AccountDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const session = getStoredCustomerSession();

      if (!session) {
        router.replace("/account/login");
        return;
      }

      setProfile(session);

      try {
        const nextOrders = await listOrdersForCustomer(session.email);
        setOrders(nextOrders);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Orders could not be loaded.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [router]);

  async function handleSignOut() {
    await signOutCustomer();
    router.push("/account/login");
  }

  if (!profile && isLoading) {
    return <p className="text-[color:var(--color-muted)]">Loading account...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Customer Account</p>
          <h1 className="mt-3 font-serif text-4xl text-[color:var(--color-ink)] sm:text-5xl">
            Welcome back{profile ? `, ${profile.fullName}` : ""}
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-[color:var(--color-muted)]">
            Shop perfumes, save bookings faster, and review your recent orders
            from one place.
          </p>
        </div>

        <button type="button" className="button-ghost" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      {profile ? (
        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-6 shadow-sm">
            <p className="section-kicker">Profile</p>
            <div className="mt-4 space-y-3 text-[color:var(--color-muted)]">
              <p>{profile.fullName}</p>
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
              <p className="leading-7">{profile.address}</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/16 bg-[color:var(--color-panel)] p-6 shadow-sm">
            <p className="section-kicker">Quick Actions</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/products" className="button-gold">
                Shop collection
              </Link>
              <Link href="/cart" className="button-ghost">
                Open cart
              </Link>
              <Link href="/track" className="button-ghost">
                Track order
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {error ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-[2rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Order History</p>
            <h2 className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">
              Your bookings
            </h2>
          </div>
          <Link href="/confirm-delivery" className="button-ghost">
            Confirm delivery
          </Link>
        </div>

        {isLoading ? (
          <p className="mt-8 text-[color:var(--color-muted)]">Loading orders...</p>
        ) : orders.length ? (
          <div className="mt-8 grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-[1.5rem] border border-[color:var(--color-accent-soft)]/14 bg-[color:var(--color-panel)] p-5"
              >
                <p className="text-xs uppercase tracking-[0.26em] text-[color:var(--color-muted-soft)]">
                  {order.trackingId}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-[color:var(--color-ink)]">
                  {order.productName}
                </h3>
                <p className="mt-2 text-[color:var(--color-muted)]">
                  {order.status} / Qty {order.quantity}
                </p>
                <p className="mt-2 font-medium text-[color:var(--color-accent-strong)]">
                  {formatNaira(order.totalAmount)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-[color:var(--color-muted)]">
            No saved orders yet. Once you book a perfume, it will appear here.
          </p>
        )}
      </section>
    </div>
  );
}
