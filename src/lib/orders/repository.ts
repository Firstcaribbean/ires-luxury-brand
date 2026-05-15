"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { demoSeedOrders } from "@/data/orders";
import { siteConfig } from "@/data/site-config";
import { getFirebaseServices } from "@/lib/firebase/client";
import type {
  AdminSession,
  BookingInput,
  DeliveryConfirmationInput,
  OrderItem,
  OrderRecord,
  OrderStatus,
  OrderStatusEntry,
} from "@/lib/orders/types";

const LOCAL_ORDERS_KEY = "mdp-orders";
const ADMIN_SESSION_KEY = "mdp-admin-session";

function isBrowser() {
  return typeof window !== "undefined";
}

function cloneDemoOrders() {
  return demoSeedOrders.map((order) => ({
    ...order,
    statusHistory: order.statusHistory.map((entry) => ({ ...entry })),
  }));
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function generateTrackingId() {
  const base = String(Date.now()).slice(-6);
  return `MDP-${base}`;
}

function summarizeItems(items: OrderItem[]) {
  if (!items.length) {
    return "Perfume order";
  }

  if (items.length === 1) {
    return items[0].productName;
  }

  return `${items[0].productName} + ${items.length - 1} more`;
}

function parseOrderRecord(raw: Record<string, unknown>, id: string): OrderRecord {
  const statusHistory = Array.isArray(raw.statusHistory)
    ? (raw.statusHistory as OrderStatusEntry[])
    : [];
  const items = Array.isArray(raw.items) ? (raw.items as OrderItem[]) : [];

  return {
    id,
    trackingId: String(raw.trackingId ?? id),
    customerName: String(raw.customerName ?? ""),
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

function readLocalOrders() {
  if (!isBrowser()) {
    return cloneDemoOrders();
  }

  const stored = window.localStorage.getItem(LOCAL_ORDERS_KEY);

  if (!stored) {
    const seeded = cloneDemoOrders();
    window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(stored) as OrderRecord[];
    return parsed.length ? parsed : cloneDemoOrders();
  } catch {
    const seeded = cloneDemoOrders();
    window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function writeLocalOrders(orders: OrderRecord[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
}

function upsertStatusHistory(
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

export async function createOrder(input: BookingInput) {
  const createdAt = new Date().toISOString();
  const trackingId = generateTrackingId();
  const totalAmount = input.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const quantity = input.items.reduce((sum, item) => sum + item.quantity, 0);
  const order: OrderRecord = {
    id: trackingId,
    trackingId,
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    normalizedPhone: normalizePhone(input.phone),
    address: input.address.trim(),
    productName: summarizeItems(input.items),
    quantity,
    totalAmount,
    items: input.items,
    status: "Order Received",
    statusHistory: [{ status: "Order Received", updatedAt: createdAt }],
    deliveryNote: "",
    orderReceivedConfirmed: false,
    createdAt,
    updatedAt: createdAt,
  };

  const firebase = getFirebaseServices();

  if (firebase) {
    const docRef = await addDoc(collection(firebase.db, "orders"), order);
    return { ...order, id: docRef.id };
  }

  const orders = readLocalOrders();
  const nextOrders = [order, ...orders];
  writeLocalOrders(nextOrders);
  return order;
}

export async function findOrderByQuery(searchValue: string) {
  const normalizedSearch = searchValue.trim();

  if (!normalizedSearch) {
    return null;
  }

  const firebase = getFirebaseServices();

  if (firebase) {
    const trackingSnapshot = await getDocs(
      query(
        collection(firebase.db, "orders"),
        where("trackingId", "==", normalizedSearch),
        limit(1),
      ),
    );

    if (!trackingSnapshot.empty) {
      const match = trackingSnapshot.docs[0];
      return parseOrderRecord(match.data(), match.id);
    }

    const phoneSnapshot = await getDocs(
      query(
        collection(firebase.db, "orders"),
        where("normalizedPhone", "==", normalizePhone(normalizedSearch)),
        limit(1),
      ),
    );

    if (!phoneSnapshot.empty) {
      const match = phoneSnapshot.docs[0];
      return parseOrderRecord(match.data(), match.id);
    }

    return null;
  }

  const orders = readLocalOrders();

  return (
    orders.find(
      (order) =>
        order.trackingId.toLowerCase() === normalizedSearch.toLowerCase() ||
        order.normalizedPhone === normalizePhone(normalizedSearch),
    ) ?? null
  );
}

export async function getOrderById(id: string) {
  const firebase = getFirebaseServices();

  if (firebase) {
    const snapshot = await getDoc(doc(firebase.db, "orders", id));

    if (!snapshot.exists()) {
      return null;
    }

    return parseOrderRecord(snapshot.data(), snapshot.id);
  }

  return readLocalOrders().find((order) => order.id === id) ?? null;
}

export async function listOrders() {
  const firebase = getFirebaseServices();

  if (firebase) {
    const snapshot = await getDocs(
      query(collection(firebase.db, "orders"), orderBy("createdAt", "desc")),
    );

    return snapshot.docs.map((entry) => parseOrderRecord(entry.data(), entry.id));
  }

  return readLocalOrders().sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const updatedAt = new Date().toISOString();
  const firebase = getFirebaseServices();

  if (firebase) {
    const current = await getOrderById(orderId);

    if (!current) {
      throw new Error("Order could not be found.");
    }

    const statusHistory = upsertStatusHistory(
      current.statusHistory,
      status,
      updatedAt,
    );

    await updateDoc(doc(firebase.db, "orders", orderId), {
      status,
      statusHistory,
      updatedAt,
      orderReceivedConfirmed:
        status === "Delivered" ? current.orderReceivedConfirmed : false,
    });

    return getOrderById(orderId);
  }

  const orders = readLocalOrders();
  const nextOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status,
          updatedAt,
          statusHistory: upsertStatusHistory(order.statusHistory, status, updatedAt),
        }
      : order,
  );

  writeLocalOrders(nextOrders);
  return nextOrders.find((order) => order.id === orderId) ?? null;
}

export async function confirmDelivery({
  trackingId,
  note,
}: DeliveryConfirmationInput) {
  const order = await findOrderByQuery(trackingId);

  if (!order) {
    throw new Error("We could not find an order with that tracking ID.");
  }

  const updatedAt = new Date().toISOString();

  const statusHistory = upsertStatusHistory(
    order.statusHistory,
    "Delivered",
    updatedAt,
  );

  const nextRecord: Partial<OrderRecord> = {
    status: "Delivered",
    statusHistory,
    deliveryNote: note.trim(),
    orderReceivedConfirmed: true,
    updatedAt,
  };

  const firebase = getFirebaseServices();

  if (firebase) {
    await updateDoc(doc(firebase.db, "orders", order.id), nextRecord);
    return getOrderById(order.id);
  }

  const orders = readLocalOrders();
  const nextOrders = orders.map((entry) =>
    entry.id === order.id ? { ...entry, ...nextRecord } : entry,
  );
  writeLocalOrders(nextOrders);
  return nextOrders.find((entry) => entry.id === order.id) ?? null;
}

export function getStoredAdminSession() {
  if (!isBrowser()) {
    return null;
  }

  const stored = window.localStorage.getItem(ADMIN_SESSION_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AdminSession;
  } catch {
    return null;
  }
}

function setStoredAdminSession(session: AdminSession | null) {
  if (!isBrowser()) {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    return;
  }

  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export async function signInAdmin(email: string, password: string) {
  const firebase = getFirebaseServices();

  if (firebase) {
    await signInWithEmailAndPassword(firebase.auth, email, password);
    const session: AdminSession = {
      email,
      mode: "firebase",
      signedInAt: new Date().toISOString(),
    };
    setStoredAdminSession(session);
    return session;
  }

  const demoEmail =
    process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? siteConfig.demoAdminEmail;
  const demoPassword =
    process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "MaisonDemo123!";

  if (email.trim() !== demoEmail || password !== demoPassword) {
    throw new Error(
      `Demo mode is active. Use ${demoEmail} / ${demoPassword} to continue.`,
    );
  }

  const session: AdminSession = {
    email: demoEmail,
    mode: "demo",
    signedInAt: new Date().toISOString(),
  };
  setStoredAdminSession(session);
  return session;
}

export async function signOutAdmin() {
  const firebase = getFirebaseServices();

  if (firebase) {
    await signOut(firebase.auth);
  }

  setStoredAdminSession(null);
}
