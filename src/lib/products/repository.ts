"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import {
  demoSeedPerfumes,
  type Perfume,
} from "@/data/perfumes";
import { getFirebaseServices } from "@/lib/firebase/client";

const LOCAL_PRODUCTS_KEY = "ires-luxury-brand-products";
const PRODUCTS_UPDATED_EVENT = "ires-luxury-brand-products-updated";

export type ProductInput = Omit<Perfume, "id"> & { id?: string };

function isBrowser() {
  return typeof window !== "undefined";
}

function emitProductsUpdated() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT));
  }
}

function parseProduct(raw: Record<string, unknown>, id: string): Perfume {
  return {
    id,
    slug: String(raw.slug ?? ""),
    name: String(raw.name ?? ""),
    tagline: String(raw.tagline ?? ""),
    description: String(raw.description ?? ""),
    story: String(raw.story ?? ""),
    fragranceFamily: String(raw.fragranceFamily ?? ""),
    price: Number(raw.price ?? 0),
    size: String(raw.size ?? ""),
    imageUrl: String(raw.imageUrl ?? ""),
    topNotes: Array.isArray(raw.topNotes)
      ? raw.topNotes.map((note) => String(note))
      : [],
    heartNotes: Array.isArray(raw.heartNotes)
      ? raw.heartNotes.map((note) => String(note))
      : [],
    baseNotes: Array.isArray(raw.baseNotes)
      ? raw.baseNotes.map((note) => String(note))
      : [],
    mood: String(raw.mood ?? ""),
    heroAccent: String(raw.heroAccent ?? "rgba(255, 121, 176, 0.18)"),
  };
}

function readLocalProducts() {
  if (!isBrowser()) {
    return demoSeedPerfumes;
  }

  const stored = window.localStorage.getItem(LOCAL_PRODUCTS_KEY);

  if (!stored) {
    window.localStorage.setItem(
      LOCAL_PRODUCTS_KEY,
      JSON.stringify(demoSeedPerfumes),
    );
    return demoSeedPerfumes;
  }

  try {
    const parsed = JSON.parse(stored) as Perfume[];
    return parsed.length ? parsed : demoSeedPerfumes;
  } catch {
    window.localStorage.setItem(
      LOCAL_PRODUCTS_KEY,
      JSON.stringify(demoSeedPerfumes),
    );
    return demoSeedPerfumes;
  }
}

function writeLocalProducts(products: Perfume[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  emitProductsUpdated();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureFirebaseProductsSeeded() {
  const firebase = getFirebaseServices();

  if (!firebase) {
    return;
  }

  const snapshot = await getDocs(query(collection(firebase.db, "products")));

  if (!snapshot.empty) {
    return;
  }

  await Promise.all(
    demoSeedPerfumes.map((product) =>
      setDoc(doc(firebase.db, "products", product.id), product),
    ),
  );
}

export function subscribeToProducts(listener: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  window.addEventListener(PRODUCTS_UPDATED_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(PRODUCTS_UPDATED_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export async function listProducts() {
  const firebase = getFirebaseServices();

  if (firebase) {
    await ensureFirebaseProductsSeeded();

    const snapshot = await getDocs(query(collection(firebase.db, "products")));

    return snapshot.docs
      .map((entry) => parseProduct(entry.data(), entry.id))
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  return [...readLocalProducts()].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}

export async function getProductBySlug(slug: string) {
  const products = await listProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function createProduct(input: ProductInput) {
  const nextId = input.id?.trim() || `p-${Date.now()}`;
  const nextProduct: Perfume = {
    ...input,
    id: nextId,
    slug: slugify(input.slug || input.name),
  };

  const firebase = getFirebaseServices();

  if (firebase) {
    await setDoc(doc(firebase.db, "products", nextProduct.id), nextProduct);
    emitProductsUpdated();
    return nextProduct;
  }

  const products = readLocalProducts();
  writeLocalProducts([nextProduct, ...products]);
  return nextProduct;
}

export async function updateProduct(productId: string, input: ProductInput) {
  const nextProduct: Perfume = {
    ...input,
    id: productId,
    slug: slugify(input.slug || input.name),
  };

  const firebase = getFirebaseServices();

  if (firebase) {
    await updateDoc(doc(firebase.db, "products", productId), nextProduct);
    emitProductsUpdated();
    return nextProduct;
  }

  const products = readLocalProducts();
  writeLocalProducts(
    products.map((product) => (product.id === productId ? nextProduct : product)),
  );
  return nextProduct;
}

export async function deleteProduct(productId: string) {
  const firebase = getFirebaseServices();

  if (firebase) {
    await deleteDoc(doc(firebase.db, "products", productId));
    emitProductsUpdated();
    return;
  }

  writeLocalProducts(
    readLocalProducts().filter((product) => product.id !== productId),
  );
}

export async function getProductById(productId: string) {
  const firebase = getFirebaseServices();

  if (firebase) {
    const snapshot = await getDoc(doc(firebase.db, "products", productId));
    return snapshot.exists() ? parseProduct(snapshot.data(), snapshot.id) : null;
  }

  return readLocalProducts().find((product) => product.id === productId) ?? null;
}
