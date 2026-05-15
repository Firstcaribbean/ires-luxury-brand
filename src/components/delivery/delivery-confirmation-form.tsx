"use client";

import { FormEvent, useState } from "react";

import { confirmDelivery } from "@/lib/orders/repository";

export function DeliveryConfirmationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [note, setNote] = useState("");
  const [receivedConfirmed, setReceivedConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await confirmDelivery({
        trackingId,
        note,
      });
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Delivery confirmation failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/20 bg-white p-6 shadow-sm">
      {!submitted ? (
        <>
          <div className="space-y-3">
            <p className="section-kicker">Delivery Confirmation</p>
            <h2 className="font-serif text-3xl text-[color:var(--color-ink)]">
              Confirm that your order has arrived
            </h2>
            <p className="leading-7 text-[color:var(--color-muted)]">
              Customers can tick the confirmation box, leave a review note, and
              submit the form after receiving the perfume.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              required
              value={trackingId}
              onChange={(event) => setTrackingId(event.target.value)}
              placeholder="Tracking ID"
              className="input-shell"
            />
            <textarea
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Review note or delivery comment"
              className="input-shell resize-none"
            />
            <label className="flex items-start gap-3 rounded-2xl border border-[color:var(--color-accent-soft)]/20 bg-[color:var(--color-panel)] p-4 text-sm text-[color:var(--color-muted)]">
              <input
                required
                type="checkbox"
                checked={receivedConfirmed}
                onChange={(event) => setReceivedConfirmed(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[color:var(--color-accent-soft)]"
              />
              <span>I confirm that the order was received in good condition.</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="button-gold disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending confirmation..." : "Confirm Order Received"}
            </button>

            {error ? (
              <div className="rounded-2xl border border-amber-200/20 bg-amber-100/10 p-4 text-sm leading-6 text-amber-100">
                {error}
              </div>
            ) : null}
          </form>
        </>
      ) : (
        <div className="space-y-3">
          <p className="section-kicker">Confirmation Sent</p>
          <h2 className="font-serif text-3xl text-[color:var(--color-ink)]">
            Delivery confirmation captured
          </h2>
          <p className="leading-7 text-[color:var(--color-muted)]">
            Thank you. Your confirmation and review note have been saved for
            the vendor.
          </p>
        </div>
      )}
    </div>
  );
}
