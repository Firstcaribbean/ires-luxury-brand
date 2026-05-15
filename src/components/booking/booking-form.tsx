"use client";

import { FormEvent, useState } from "react";

import { createOrder } from "@/lib/orders/repository";
import { siteConfig } from "@/data/site-config";

type BookingFormProps = {
  productId?: string;
  productName: string;
};

export function BookingForm({ productId, productName }: BookingFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customerName,
        phone,
        address,
        productId,
        productName,
        quantity: Number(quantity),
      });

      setTrackingId(order.trackingId);

      const message = [
        `Hello ${siteConfig.brandName}, I would like to book an order.`,
        `Name: ${customerName}`,
        `Phone: ${phone}`,
        `Product: ${productName}`,
        `Quantity: ${quantity}`,
        `Delivery Address: ${address}`,
        `Tracking ID: ${order.trackingId}`,
      ].join("\n");

      const encodedMessage = encodeURIComponent(message);
      window.location.href = `https://wa.me/${siteConfig.vendorWhatsappNumber}?text=${encodedMessage}`;
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Booking failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[color:var(--color-panel-strong)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="space-y-3">
        <p className="section-kicker">Book Your Scent</p>
        <h3 className="font-serif text-3xl text-white">Reserve via WhatsApp</h3>
        <p className="leading-7 text-white/65">
          Submit your details and continue the payment and delivery confirmation
          directly with the vendor on WhatsApp.
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Delivery address"
          rows={4}
          className="input-shell resize-none"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            readOnly
            value={productName}
            className="input-shell text-white/75"
          />
          <input
            required
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="input-shell"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-white/55">
          Your tracking ID is generated on submit{trackingId ? (
            <>
              {" "}
              and the latest preview is{" "}
              <span className="text-[color:var(--color-gold-soft)]">
                {trackingId}
              </span>
              .
            </>
          ) : (
            "."
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-[color:var(--color-gold-soft)] px-6 py-3 text-sm font-medium uppercase tracking-[0.28em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving booking..." : "Continue to WhatsApp"}
        </button>

        {error ? (
          <div className="rounded-2xl border border-amber-200/20 bg-amber-100/10 p-4 text-sm leading-6 text-amber-100">
            {error}
          </div>
        ) : null}
      </form>
    </div>
  );
}
