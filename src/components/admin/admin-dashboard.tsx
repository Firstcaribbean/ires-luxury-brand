"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getStoredAdminSession,
  listOrders,
  signOutAdmin,
  updateOrderStatus,
} from "@/lib/orders/repository";
import { orderStatuses, type OrderRecord, type OrderStatus } from "@/lib/orders/types";

export function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingOrderId, setSavingOrderId] = useState("");

  async function loadOrders() {
    setError("");

    try {
      const nextOrders = await listOrders();
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

  useEffect(() => {
    const session = getStoredAdminSession();

    if (!session) {
      router.replace("/admin/login");
      return;
    }

    const loadTimer = window.setTimeout(() => {
      void loadOrders();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [router]);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setSavingOrderId(orderId);

    try {
      await updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Status update failed.",
      );
    } finally {
      setSavingOrderId("");
    }
  }

  async function handleSignOut() {
    await signOutAdmin();
    router.push("/admin/login");
  }

  const stats = useMemo(() => {
    const deliveredCount = orders.filter(
      (order) => order.status === "Delivered",
    ).length;
    const inTransitCount = orders.filter(
      (order) =>
        order.status === "Dispatched from Store" ||
        order.status === "With Delivery Company" ||
        order.status === "Out for Delivery",
    ).length;

    return {
      bookings: orders.length,
      delivered: deliveredCount,
      inTransit: inTransitCount,
    };
  }, [orders]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Vendor Dashboard</p>
          <h1 className="mt-3 font-serif text-5xl text-white">
            Order management
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-white/65">
            Update delivery status, review bookings, and keep customer tracking
            information current from one panel.
          </p>
        </div>

        <button type="button" className="button-ghost" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[1.75rem] border border-white/10 bg-[color:var(--color-panel)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/35">
            Total bookings
          </p>
          <p className="mt-4 font-serif text-5xl text-[color:var(--color-gold-soft)]">
            {stats.bookings}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-[color:var(--color-panel)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/35">
            In transit
          </p>
          <p className="mt-4 font-serif text-5xl text-[color:var(--color-gold-soft)]">
            {stats.inTransit}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-[color:var(--color-panel)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/35">
            Delivered
          </p>
          <p className="mt-4 font-serif text-5xl text-[color:var(--color-gold-soft)]">
            {stats.delivered}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-[1.5rem] border border-amber-200/20 bg-amber-100/10 p-4 text-sm leading-6 text-amber-100">
          {error}
        </div>
      ) : null}

      <section className="rounded-[2rem] border border-white/10 bg-[color:var(--color-panel-strong)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Bookings</p>
            <h2 className="mt-3 font-serif text-3xl text-white">
              Customer orders
            </h2>
          </div>
          <Link href="/track" className="button-ghost">
            Review customer tracking
          </Link>
        </div>

        {isLoading ? (
          <p className="mt-8 text-white/55">Loading orders...</p>
        ) : orders.length ? (
          <div className="mt-8 grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/35">
                      {order.trackingId}
                    </p>
                    <h3 className="font-serif text-2xl text-white">
                      {order.customerName}
                    </h3>
                    <p className="text-white/65">
                      {order.productName} • Qty {order.quantity}
                    </p>
                    <p className="text-sm text-white/45">{order.phone}</p>
                    <p className="text-sm leading-6 text-white/45">
                      {order.address}
                    </p>
                    {order.proofImageUrl ? (
                      <a
                        href={order.proofImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-[color:var(--color-gold-soft)]"
                      >
                        View delivery proof
                      </a>
                    ) : null}
                  </div>

                  <div className="flex min-w-[14rem] flex-col gap-3">
                    <label className="text-xs uppercase tracking-[0.25em] text-white/35">
                      Update status
                    </label>
                    <select
                      value={order.status}
                      onChange={(event) =>
                        void handleStatusChange(
                          order.id,
                          event.target.value as OrderStatus,
                        )
                      }
                      disabled={savingOrderId === order.id}
                      className="input-shell"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status} className="bg-black">
                          {status}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-white/45">
                      Last updated{" "}
                      {new Date(order.updatedAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-white/55">No orders yet.</p>
        )}
      </section>
    </div>
  );
}
