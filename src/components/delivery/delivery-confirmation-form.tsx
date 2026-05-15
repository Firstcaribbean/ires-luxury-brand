"use client";

import { FormEvent, useState } from "react";

import { confirmDelivery } from "@/lib/orders/repository";

export function DeliveryConfirmationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
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
        file,
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
    <div className="rounded-[2rem] border border-white/10 bg-[color:var(--color-panel-strong)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      {!submitted ? (
        <>
          <div className="space-y-3">
            <p className="section-kicker">Proof of Delivery</p>
            <h2 className="font-serif text-4xl text-white">
              Confirm that your order has arrived
            </h2>
            <p className="leading-7 text-white/65">
              Customers can upload a quick photo and mark the perfume as
              received. In the final version, this will be stored in Firebase
              Storage for the vendor panel.
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
              placeholder="Optional delivery note"
              className="input-shell resize-none"
            />
            <label className="flex cursor-pointer flex-col gap-3 rounded-[1.5rem] border border-dashed border-white/20 bg-black/25 p-5 text-white/70 transition hover:border-[color:var(--color-gold-soft)] hover:text-white">
              <span>Upload photo of received item</span>
              <input
                required
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null;
                  setFile(nextFile);
                  setFileName(nextFile?.name ?? "");
                }}
              />
              <span className="text-sm text-white/45">
                {fileName || "No file selected yet"}
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/65">
              <input required type="checkbox" className="mt-1 h-4 w-4 accent-[color:var(--color-gold-soft)]" />
              <span>I confirm that the order was received in good condition.</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex rounded-full bg-[color:var(--color-gold-soft)] px-6 py-3 text-sm font-medium uppercase tracking-[0.25em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
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
          <h2 className="font-serif text-4xl text-white">
            Delivery confirmation captured
          </h2>
          <p className="leading-7 text-white/65">
            The final build will save this confirmation, photo proof, and
            timestamp into Firebase for the vendor to review.
          </p>
        </div>
      )}
    </div>
  );
}
