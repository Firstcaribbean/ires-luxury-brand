"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ProductManagement } from "@/components/admin/product-management";
import { formatNaira } from "@/lib/currency";
import {
  deleteOrder,
  getStoredAdminSession,
  listOrders,
  signOutAdmin,
  updateOrderBooking,
  updateOrderStatus,
} from "@/lib/orders/repository";
import {
  orderStatuses,
  type OrderItem,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/orders/types";

type OrderEditForm = {
  customerName: string;
  phone: string;
  address: string;
  status: OrderStatus;
  itemsText: string;
};

function toItemsText(items: OrderItem[]) {
  return items
    .map(
      (item) =>
        `${item.productName} | ${item.size} | ${item.quantity} | ${item.unitPrice}`,
    )
    .join("\n");
}

function parseItemsText(value: string) {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    throw new Error("Add at least one item line before saving.");
  }

  return lines.map((line, index) => {
    const [productName, size, quantityRaw, unitPriceRaw] = line
      .split("|")
      .map((part) => part.trim());

    if (!productName || !size || !quantityRaw || !unitPriceRaw) {
      throw new Error(
        `Line ${index + 1} must use: Product name | Size | Quantity | Unit price`,
      );
    }

    const quantity = Number(quantityRaw);
    const unitPrice = Number(unitPriceRaw);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`Line ${index + 1} has an invalid quantity.`);
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error(`Line ${index + 1} has an invalid unit price.`);
    }

    return {
      productId: `manual-${index + 1}-${productName.toLowerCase().replace(/\s+/g, "-")}`,
      productName,
      size,
      quantity,
      unitPrice,
    } satisfies OrderItem;
  });
}

function toEditForm(order: OrderRecord): OrderEditForm {
  return {
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    status: order.status,
    itemsText: toItemsText(order.items),
  };
}

export function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingOrderId, setSavingOrderId] = useState("");
  const [editingOrderId, setEditingOrderId] = useState("");
  const [editForm, setEditForm] = useState<OrderEditForm | null>(null);

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

  function handleStartEdit(order: OrderRecord) {
    setEditingOrderId(order.id);
    setEditForm(toEditForm(order));
    setError("");
  }

  function handleCancelEdit() {
    setEditingOrderId("");
    setEditForm(null);
  }

  async function handleSaveEdit(orderId: string) {
    if (!editForm) {
      return;
    }

    setSavingOrderId(orderId);
    setError("");

    try {
      await updateOrderBooking(orderId, {
        customerName: editForm.customerName,
        phone: editForm.phone,
        address: editForm.address,
        status: editForm.status,
        items: parseItemsText(editForm.itemsText),
      });
      handleCancelEdit();
      await loadOrders();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Booking update failed.",
      );
    } finally {
      setSavingOrderId("");
    }
  }

  async function handleDeleteOrder(orderId: string) {
    setSavingOrderId(orderId);
    setError("");

    try {
      await deleteOrder(orderId);
      if (editingOrderId === orderId) {
        handleCancelEdit();
      }
      await loadOrders();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Order could not be deleted.",
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
    const totalRevenue = orders
      .filter((order) => order.status !== "Voided")
      .reduce((sum, order) => sum + order.totalAmount, 0);

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
            Review bookings, edit customer selections, void unpaid orders, or
            remove bookings entirely when a client changes their mind.
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
            Active order value
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
            {orders.map((order) => {
              const isEditing = editingOrderId === order.id && editForm;

              return (
                <article
                  key={order.id}
                  className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/14 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted-soft)]">
                        {order.trackingId}
                      </p>

                      {isEditing ? (
                        <div className="space-y-4">
                          <input
                            value={editForm.customerName}
                            onChange={(event) =>
                              setEditForm((current) =>
                                current
                                  ? { ...current, customerName: event.target.value }
                                  : current,
                              )
                            }
                            placeholder="Customer name"
                            className="input-shell"
                          />
                          <input
                            value={editForm.phone}
                            onChange={(event) =>
                              setEditForm((current) =>
                                current ? { ...current, phone: event.target.value } : current,
                              )
                            }
                            placeholder="Phone number"
                            className="input-shell"
                          />
                          <textarea
                            rows={3}
                            value={editForm.address}
                            onChange={(event) =>
                              setEditForm((current) =>
                                current
                                  ? { ...current, address: event.target.value }
                                  : current,
                              )
                            }
                            placeholder="Delivery address"
                            className="input-shell resize-none"
                          />
                          <textarea
                            rows={5}
                            value={editForm.itemsText}
                            onChange={(event) =>
                              setEditForm((current) =>
                                current
                                  ? { ...current, itemsText: event.target.value }
                                  : current,
                              )
                            }
                            placeholder="Product name | Size | Quantity | Unit price"
                            className="input-shell resize-none"
                          />
                          <p className="text-xs leading-6 text-[color:var(--color-muted-soft)]">
                            Use one line per item: Product name | Size | Quantity |
                            Unit price
                          </p>
                        </div>
                      ) : (
                        <>
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
                                  {item.productName} ({item.size}) x{item.quantity} /{" "}
                                  {formatNaira(item.unitPrice)}
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
                        </>
                      )}
                    </div>

                    <div className="flex min-w-[15rem] flex-col gap-3">
                      <label className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-muted-soft)]">
                        Update status
                      </label>
                      <select
                        value={isEditing ? editForm.status : order.status}
                        onChange={(event) => {
                          const nextStatus = event.target.value as OrderStatus;

                          if (isEditing) {
                            setEditForm((current) =>
                              current ? { ...current, status: nextStatus } : current,
                            );
                            return;
                          }

                          void handleStatusChange(order.id, nextStatus);
                        }}
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
                      <div className="flex flex-col gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => void handleSaveEdit(order.id)}
                              disabled={savingOrderId === order.id}
                              className="button-gold disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {savingOrderId === order.id ? "Saving..." : "Save booking"}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="button-ghost"
                            >
                              Cancel edit
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(order)}
                              className="button-gold"
                            >
                              Edit booking
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleStatusChange(order.id, "Voided")}
                              disabled={savingOrderId === order.id || order.status === "Voided"}
                              className="button-ghost disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Void booking
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteOrder(order.id)}
                              disabled={savingOrderId === order.id}
                              className="rounded-full border border-red-200 px-4 py-3 text-xs uppercase tracking-[0.22em] text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Delete booking
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 text-[color:var(--color-muted)]">No orders yet.</p>
        )}
      </section>

      <ProductManagement />
    </div>
  );
}
