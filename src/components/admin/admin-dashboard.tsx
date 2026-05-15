"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { formatNaira } from "@/lib/currency";
import {
  getStoredAdminSession,
  listOrders,
  signOutAdmin,
  updateOrderStatus,
} from "@/lib/orders/repository";
import {
  orderStatuses,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/orders/types";

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
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    return {
      bookings: orders.length,
      delivered: deliveredCount,
      inTransit: inTransitCount,
      totalRevenue,
    };
  }, [orders]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Vendor Dashboard</p>
          <h1 className="mt-3 font-serif text-4xl text-[color:var(--color-ink)] sm:text-5xl">
            Order management
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-[color:var(--color-muted)]">
            Review bookings, update order status, and keep customers informed
            from one lighter, easier-to-use workspace.
          </p>
        </div>

        <button type="button" className="button-ghost" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted-soft)]">
            Total bookings
          </p>
          <p className="mt-4 font-serif text-4xl text-[color:var(--color-accent-strong)]">
            {stats.bookings}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted-soft)]">
            In transit
          </p>
          <p className="mt-4 font-serif text-4xl text-[color:var(--color-accent-strong)]">
            {stats.inTransit}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted-soft)]">
            Delivered
          </p>
          <p className="mt-4 font-serif text-4xl text-[color:var(--color-accent-strong)]">
            {stats.delivered}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted-soft)]">
            Total order value
          </p>
          <p className="mt-4 font-serif text-3xl text-[color:var(--color-accent-strong)]">
            {formatNaira(stats.totalRevenue)}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-[2rem] border border-[color:var(--color-accent-soft)]/16 bg-[color:var(--color-panel)] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Bookings</p>
            <h2 className="mt-3 font-serif text-2xl text-[color:var(--color-ink)] sm:text-3xl">
              Customer orders
            </h2>
          </div>
          <Link href="/track" className="button-ghost">
            Review customer tracking
          </Link>
        </div>

        {isLoading ? (
          <p className="mt-8 text-[color:var(--color-muted)]">Loading orders...</p>
        ) : orders.length ? (
          <div className="mt-8 grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/14 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted-soft)]">
                      {order.trackingId}
                    </p>
                    <h3 className="font-serif text-2xl text-[color:var(--color-ink)]">
                      {order.customerName}
                    </h3>
                    <p className="text-[color:var(--color-muted)]">
                      {order.productName} / Qty {order.quantity}
                    </p>
                    <p className="text-sm font-medium text-[color:var(--color-accent-strong)]">
                      {formatNaira(order.totalAmount)}
                    </p>
                    <p className="text-sm text-[color:var(--color-muted-soft)]">
                      {order.phone}
                    </p>
                    <p className="max-w-xl text-sm leading-6 text-[color:var(--color-muted)]">
                      {order.address}
                    </p>
                    <div className="rounded-[1.2rem] bg-[color:var(--color-panel)] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-muted-soft)]">
                        Items
                      </p>
                      <div className="mt-2 space-y-2 text-sm text-[color:var(--color-muted)]">
                        {order.items.map((item) => (
                          <p key={`${order.id}-${item.productId}`}>
                            {item.productName} ({item.size}) x{item.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                    {order.deliveryNote ? (
                      <div className="rounded-[1.2rem] border border-[color:var(--color-accent-soft)]/16 bg-[color:var(--color-panel)] p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-muted-soft)]">
                          Delivery note
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                          {order.deliveryNote}
                        </p>
                      </div>
                    ) : null}
                    {order.orderReceivedConfirmed ? (
                      <p className="text-sm font-medium text-[color:var(--color-accent-strong)]">
                        Customer marked this order as received.
                      </p>
                    ) : null}
                  </div>

                  <div className="flex min-w-[14rem] flex-col gap-3">
                    <label className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-muted-soft)]">
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
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-[color:var(--color-muted-soft)]">
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
          <p className="mt-8 text-[color:var(--color-muted)]">No orders yet.</p>
        )}
      </section>
    </div>
  );
}
