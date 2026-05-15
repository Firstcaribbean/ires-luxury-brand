"use client";

import type { CartItem } from "@/lib/cart/types";

const CART_KEY = "ires-luxury-brand-cart";
const CART_UPDATED_EVENT = "ires-luxury-brand-cart-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function emitCartUpdated() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}

export function onCartUpdated(listener: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  window.addEventListener(CART_UPDATED_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function readCart() {
  if (!isBrowser()) {
    return [] as CartItem[];
  }

  const stored = window.localStorage.getItem(CART_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  emitCartUpdated();
}

export function addToCart(item: CartItem) {
  const current = readCart();
  const existing = current.find((entry) => entry.productId === item.productId);

  if (existing) {
    writeCart(
      current.map((entry) =>
        entry.productId === item.productId
          ? { ...entry, quantity: entry.quantity + item.quantity }
          : entry,
      ),
    );
    return;
  }

  writeCart([...current, item]);
}

export function updateCartQuantity(productId: string, quantity: number) {
  writeCart(
    readCart()
      .map((entry) =>
        entry.productId === productId ? { ...entry, quantity } : entry,
      )
      .filter((entry) => entry.quantity > 0),
  );
}

export function removeFromCart(productId: string) {
  writeCart(readCart().filter((entry) => entry.productId !== productId));
}

export function clearCart() {
  writeCart([]);
}

export function getCartCount() {
  return readCart().reduce((sum, entry) => sum + entry.quantity, 0);
}
