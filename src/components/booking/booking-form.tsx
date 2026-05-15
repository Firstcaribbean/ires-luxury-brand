"use client";

import { FormEvent, useState } from "react";

import { siteConfig } from "@/data/site-config";
import { createOrder } from "@/lib/orders/repository";
import { formatNaira } from "@/lib/currency";

type BookingFormProps = {
  productId?: string;
  productName: string;
  unitPrice?: number;
  size?: string;
};

export function BookingForm({
  productId,
  productName,
  unitPrice = 0,
  size = "Standard",
}: BookingFormProps) {
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
        items: [
          {
            productId: productId ?? productName.toLowerCase().replace(/\s+/g, "-"),
            productName,
            quantity: Number(quantity),
            unitPrice,
            size,
          },
        ],
      });

      setTrackingId(order.trackingId);

      const message = [
        `Hello ${siteConfig.brandName}, I want to complete my order.`,
        `Name: ${customerName}`,
        `Phone: ${phone}`,
        `Delivery Address: ${address}`,
        `Tracking ID: ${order.trackingId}`,
        `Product: ${productName}`,
        `Quantity: ${quantity}`,
        `Total Amount: ${formatNaira(unitPrice * Number(quantity))}`,
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
    <div className="rounded-[2rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <p className="section-kicker">Book Your Scent</p>
        <h3 className="font-serif text-3xl text-[color:var(--color-ink)]">
          Save order and continue on WhatsApp
        </h3>
        <p className="leading-7 text-[color:var(--color-muted)]">
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
            className="input-shell"
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

        <div className="rounded-2xl border border-[color:var(--color-accent-soft)]/16 bg-[color:var(--color-panel)] p-4 text-sm text-[color:var(--color-muted)]">
          Your tracking ID is generated on submit{trackingId ? (
            <>
              {" "}
              and the latest preview is{" "}
              <span className="font-medium text-[color:var(--color-accent-strong)]">
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
          className="button-gold w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving booking..." : "Continue to WhatsApp"}
        </button>

        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-700">
            {error}
          </div>
        ) : null}
      </form>
    </div>
  );
}
