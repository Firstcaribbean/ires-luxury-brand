"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  collection,
} from "firebase/firestore";

import { getFirebaseServices } from "@/lib/firebase/client";
import { parseOrderRecord } from "@/lib/orders/shared";
import type { OrderRecord } from "@/lib/orders/types";

export type CustomerProfile = {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
};

const CUSTOMER_SESSION_KEY = "ires-luxury-brand-customer-session";
const LOCAL_ORDERS_KEY = "mdp-orders";

function isBrowser() {
  return typeof window !== "undefined";
}

function readStoredSession() {
  if (!isBrowser()) {
    return null;
  }

  const stored = window.localStorage.getItem(CUSTOMER_SESSION_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as CustomerProfile;
  } catch {
    return null;
  }
}

function writeStoredSession(profile: CustomerProfile | null) {
  if (!isBrowser()) {
    return;
  }

  if (!profile) {
    window.localStorage.removeItem(CUSTOMER_SESSION_KEY);
    return;
  }

  window.localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(profile));
}

export function getStoredCustomerSession() {
  return readStoredSession();
}

export async function registerCustomer(input: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
}) {
  const firebase = getFirebaseServices();

  if (!firebase) {
    const profile: CustomerProfile = {
      uid: `local-${Date.now()}`,
      email: input.email.trim(),
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
    };
    writeStoredSession(profile);
    return profile;
  }

  const credentials = await createUserWithEmailAndPassword(
    firebase.auth,
    input.email.trim(),
    input.password,
  );

  const profile: CustomerProfile = {
    uid: credentials.user.uid,
    email: credentials.user.email ?? input.email.trim(),
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    address: input.address.trim(),
  };

  await setDoc(doc(firebase.db, "customers", credentials.user.uid), profile);
  writeStoredSession(profile);
  return profile;
}

export async function signInCustomer(email: string, password: string) {
  const firebase = getFirebaseServices();

  if (!firebase) {
    const existing = readStoredSession();

    if (!existing || existing.email !== email.trim()) {
      throw new Error("Customer account could not be found in local mode.");
    }

    return existing;
  }

  const credentials = await signInWithEmailAndPassword(
    firebase.auth,
    email.trim(),
    password,
  );

  const snapshot = await getDoc(doc(firebase.db, "customers", credentials.user.uid));

  if (!snapshot.exists()) {
    throw new Error("Customer profile is missing. Please create the account again.");
  }

  const profile = snapshot.data() as CustomerProfile;
  writeStoredSession(profile);
  return profile;
}

export async function signOutCustomer() {
  const firebase = getFirebaseServices();

  if (firebase) {
    await signOut(firebase.auth);
  }

  writeStoredSession(null);
}

export async function listOrdersForCustomer(email: string) {
  const firebase = getFirebaseServices();

  if (!firebase) {
    if (!isBrowser()) {
      return [] as OrderRecord[];
    }

    const stored = window.localStorage.getItem(LOCAL_ORDERS_KEY);

    if (!stored) {
      return [] as OrderRecord[];
    }

    try {
      const parsed = JSON.parse(stored) as Array<Record<string, unknown>>;
      return parsed
        .map((entry, index) => parseOrderRecord(entry, String(entry.id ?? index)))
        .filter((entry) => entry.customerEmail === email);
    } catch {
      return [] as OrderRecord[];
    }
  }

  const snapshot = await getDocs(
    query(collection(firebase.db, "orders"), where("customerEmail", "==", email)),
  );

  return snapshot.docs.map((entry) => parseOrderRecord(entry.data(), entry.id));
}
