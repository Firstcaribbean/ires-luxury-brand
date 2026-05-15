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
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { demoSeedOrders } from "@/data/orders";
import { siteConfig } from "@/data/site-config";
import { getStoredCustomerSession } from "@/lib/customers/repository";
import { getFirebaseServices } from "@/lib/firebase/client";
import {
  generateTrackingId,
  normalizePhone,
  parseOrderRecord,
  summarizeItems,
  upsertStatusHistory,
} from "@/lib/orders/shared";
import type {
  AdminSession,
  BookingInput,
  DeliveryConfirmationInput,
  OrderRecord,
  OrderStatus,
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

export async function createOrder(input: BookingInput) {
  const createdAt = new Date().toISOString();
  const trackingId = generateTrackingId();
  const totalAmount = input.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const quantity = input.items.reduce((sum, item) => sum + item.quantity, 0);
  const session = getStoredCustomerSession();
  const order: OrderRecord = {
    id: trackingId,
    trackingId,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail?.trim() || session?.email || "",
    customerUid: input.customerUid?.trim() || session?.uid || "",
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

async function ensureAdminAccount(email: string, uid: string) {
  const firebase = getFirebaseServices();

  if (!firebase) {
    return;
  }

  const snapshot = await getDocs(query(collection(firebase.db, "admins"), limit(1)));

  if (snapshot.empty) {
    await setDoc(doc(firebase.db, "admins", uid), {
      email,
      uid,
      createdAt: new Date().toISOString(),
    });
    return;
  }

  const existing = await getDoc(doc(firebase.db, "admins", uid));

  if (existing.exists()) {
    return;
  }

  const emailMatch = await getDocs(
    query(collection(firebase.db, "admins"), where("email", "==", email), limit(1)),
  );

  if (emailMatch.empty) {
    throw new Error(
      "This account is not approved for vendor access. Sign in with the vendor admin account.",
    );
  }
}

export async function signInAdmin(email: string, password: string) {
  const firebase = getFirebaseServices();

  if (firebase) {
    const credentials = await signInWithEmailAndPassword(
      firebase.auth,
      email,
      password,
    );
    try {
      await ensureAdminAccount(email, credentials.user.uid);
    } catch (error) {
      await signOut(firebase.auth);
      throw error;
    }
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
