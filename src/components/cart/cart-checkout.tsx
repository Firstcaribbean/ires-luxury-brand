"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { getBrandSettings, getDefaultBrandSettings, type BrandSettings } from "@/lib/brand/repository";
import { clearCart, onCartUpdated, readCart, removeFromCart, updateCartQuantity } from "@/lib/cart/repository";
import type { CartItem } from "@/lib/cart/types";
import { formatNaira } from "@/lib/currency";
import { getStoredCustomerSession } from "@/lib/customers/repository";
import { createOrder } from "@/lib/orders/repository";

type SavedOrderState = {
  trackingId: string;
  whatsappLink: string;
};

export function CartCheckout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [savedOrder, setSavedOrder] = useState<SavedOrderState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(
    getDefaultBrandSettings(),
  );

  useEffect(() => {
    const refresh = () => setCartItems(readCart());
    refresh();
    return onCartUpdated(refresh);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const session = getStoredCustomerSession();

      if (session) {
        setCustomerName(session.fullName);
        setPhone(session.phone);
        setAddress(session.address);
      }
    }, 0);

    void getBrandSettings().then(setBrandSettings);

    return () => window.clearTimeout(timer);
  }, []);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const totalAmount = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      ),
    [cartItems],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customerName,
        customerEmail: getStoredCustomerSession()?.email,
        customerUid: getStoredCustomerSession()?.uid,
        phone,
        address,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          size: item.size,
        })),
      });

      const lines = cartItems.map(
        (item) =>
          `- ${item.productName} (${item.size}) x${item.quantity} = ${formatNaira(
            item.unitPrice * item.quantity,
          )}`,
      );

      const message = [
        `Hello ${brandSettings.brandName}, I want to complete my order.`,
        `Name: ${customerName}`,
        `Phone: ${phone}`,
        `Delivery Address: ${address}`,
        `Tracking ID: ${order.trackingId}`,
        "Items:",
        ...lines,
        `Total Items: ${totalItems}`,
        `Total Amount: ${formatNaira(totalAmount)}`,
      ].join("\n");

      setSavedOrder({
        trackingId: order.trackingId,
        whatsappLink: `https://wa.me/${brandSettings.vendorWhatsappNumber}?text=${encodeURIComponent(message)}`,
      });
      clearCart();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Order could not be saved.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (savedOrder) {
    return (
      <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/20 bg-white p-6 shadow-sm">
        <p className="section-kicker">Order Saved</p>
        <h2 className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">
          Your booking has been saved
        </h2>
        <p className="mt-3 text-base text-[color:var(--color-muted)]">
          Tracking ID:{" "}
          <span className="font-semibold text-[color:var(--color-accent-strong)]">
            {savedOrder.trackingId}
          </span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={savedOrder.whatsappLink}
            className="button-gold"
            target="_blank"
            rel="noreferrer"
          >
            Message vendor on WhatsApp
          </a>
          <Link href="/track" className="button-ghost">
            Track this order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/20 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Selected Items</p>
            <h2 className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">
              Your cart
            </h2>
          </div>
          <span className="rounded-full bg-[color:var(--color-accent-soft)]/12 px-4 py-2 text-sm font-medium text-[color:var(--color-accent-strong)]">
            {totalItems} items
          </span>
        </div>

        {cartItems.length ? (
          <div className="mt-8 space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.productId}
                className="rounded-[1.5rem] border border-[color:var(--color-accent-soft)]/15 bg-[color:var(--color-panel)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[color:var(--color-ink)]">
                      {item.productName}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                      {item.size}
                    </p>
                    <p className="mt-2 text-base font-medium text-[color:var(--color-accent-strong)]">
                      {formatNaira(item.unitPrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateCartQuantity(item.productId, Number(event.target.value))
                      }
                      className="input-shell w-24"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="rounded-full border border-[color:var(--color-accent-soft)]/25 px-4 py-2 text-sm text-[color:var(--color-ink)] transition hover:border-[color:var(--color-accent-soft)] hover:text-[color:var(--color-accent-strong)]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.5rem] border border-dashed border-[color:var(--color-accent-soft)]/25 bg-[color:var(--color-panel)] p-6">
            <p className="text-base text-[color:var(--color-muted)]">
              Your cart is empty. Add perfumes from the collection first.
            </p>
            <Link href="/products" className="button-gold mt-4">
              Shop perfumes
            </Link>
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/20 bg-white p-6 shadow-sm">
        <p className="section-kicker">Book Order</p>
        <h2 className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">
          Save order, then pay on WhatsApp
        </h2>
        <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
          Save the order on the website first. After that, click the WhatsApp
          button to message the vendor and complete payment.
        </p>
        <p className="mt-2 text-sm text-[color:var(--color-muted-soft)]">
          Signed-in customers will see their details filled automatically.
        </p>
        {!getStoredCustomerSession() ? (
          <p className="mt-2 text-sm text-[color:var(--color-muted)]">
            Want faster checkout next time? Create a customer account from the
            account page before booking.
          </p>
        ) : null}

        <div className="mt-6 rounded-[1.25rem] bg-[color:var(--color-panel)] p-4">
          <p className="text-sm text-[color:var(--color-muted)]">Total amount</p>
          <p className="mt-2 font-serif text-3xl text-[color:var(--color-accent-strong)]">
            {formatNaira(totalAmount)}
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            required
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Full name"
            className="input-shell"
          />
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone number"
            className="input-shell"
          />
          <textarea
            required
            rows={4}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Delivery address"
            className="input-shell resize-none"
          />
          <button
            type="submit"
            disabled={!cartItems.length || isSubmitting}
            className="button-gold w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving order..." : "Save booking"}
          </button>

          {error ? (
            <div className="rounded-[1.25rem] border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : null}
        </form>
      </section>
    </div>
  );
}
