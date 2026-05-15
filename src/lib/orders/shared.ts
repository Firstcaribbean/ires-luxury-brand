import type {
  OrderItem,
  OrderRecord,
  OrderStatus,
  OrderStatusEntry,
} from "@/lib/orders/types";

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function generateTrackingId() {
  const base = String(Date.now()).slice(-6);
  return `MDP-${base}`;
}

export function summarizeItems(items: OrderItem[]) {
  if (!items.length) {
    return "Perfume order";
  }

  if (items.length === 1) {
    return items[0].productName;
  }

  return `${items[0].productName} + ${items.length - 1} more`;
}

export function upsertStatusHistory(
  statusHistory: OrderStatusEntry[],
  status: OrderStatus,
  updatedAt: string,
) {
  const lastEntry = statusHistory.at(-1);

  if (lastEntry?.status === status) {
    return statusHistory;
  }

  return [...statusHistory, { status, updatedAt }];
}

export function parseOrderRecord(
  raw: Record<string, unknown>,
  id: string,
): OrderRecord {
  const statusHistory = Array.isArray(raw.statusHistory)
    ? (raw.statusHistory as OrderStatusEntry[])
    : [];
  const items = Array.isArray(raw.items) ? (raw.items as OrderItem[]) : [];

  return {
    id,
    trackingId: String(raw.trackingId ?? id),
    customerName: String(raw.customerName ?? ""),
    customerEmail: String(raw.customerEmail ?? ""),
    customerUid: String(raw.customerUid ?? ""),
    phone: String(raw.phone ?? ""),
    normalizedPhone: String(raw.normalizedPhone ?? ""),
    address: String(raw.address ?? ""),
    productName: String(raw.productName ?? summarizeItems(items)),
    quantity: Number(raw.quantity ?? 1),
    totalAmount: Number(raw.totalAmount ?? 0),
    items,
    status: raw.status as OrderStatus,
    statusHistory,
    deliveryNote: String(raw.deliveryNote ?? ""),
    orderReceivedConfirmed: Boolean(raw.orderReceivedConfirmed),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  };
}
