"use client";

import { FormEvent, useState } from "react";

import { formatNaira } from "@/lib/currency";
import { findOrderByQuery } from "@/lib/orders/repository";
import { orderStatuses, type OrderRecord } from "@/lib/orders/types";

export function TrackingSearch() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [result, setResult] = useState<OrderRecord | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSearching(true);
    setSearched(query);

    try {
      const nextResult = await findOrderByQuery(query);
      setResult(nextResult);
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Tracking lookup failed.",
      );
      setResult(null);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[1.9rem] border border-[color:var(--color-accent-soft)]/18 bg-white p-6 shadow-sm"
      >
        <p className="section-kicker">Tracking Lookup</p>
        <h3 className="mt-3 font-serif text-2xl text-[color:var(--color-ink)] sm:text-3xl">
          Search by tracking ID or phone number
        </h3>
        <p className="mt-3 leading-7 text-[color:var(--color-muted)]">
          Try <span className="font-medium text-[color:var(--color-accent-strong)]">MDP-10425</span> or{" "}
          <span className="font-medium text-[color:var(--color-accent-strong)]">+1 555-120-5589</span>.
        </p>
        <input
          required
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Enter tracking ID or phone number"
          className="input-shell mt-6"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="button-gold mt-4 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSearching ? "Checking..." : "Check status"}
        </button>

        {error ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-700">
            {error}
          </div>
        ) : null}
      </form>

      <div className="rounded-[1.9rem] border border-[color:var(--color-accent-soft)]/18 bg-[color:var(--color-panel)] p-6 shadow-sm">
        {!searched ? (
          <div className="space-y-3">
            <p className="section-kicker">Order Timeline</p>
            <h3 className="font-serif text-2xl text-[color:var(--color-ink)] sm:text-3xl">
              Status updates appear here
            </h3>
            <p className="leading-7 text-[color:var(--color-muted)]">
              After a booking is saved, this page shows every movement from
              order received to final delivery confirmation.
            </p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="section-kicker">Tracking Result</p>
                <h3 className="mt-3 font-serif text-2xl text-[color:var(--color-ink)] sm:text-3xl">
                  {result.trackingId}
                </h3>
                <p className="mt-2 text-[color:var(--color-muted)]">
                  {result.customerName} / {result.productName} / Qty {result.quantity}
                </p>
                <p className="mt-2 text-sm font-medium text-[color:var(--color-accent-strong)]">
                  Total: {formatNaira(result.totalAmount)}
                </p>
              </div>
              <div className="rounded-full border border-[color:var(--color-accent-soft)]/30 bg-white px-4 py-2 text-xs uppercase tracking-[0.22em] text-[color:var(--color-accent-strong)]">
                {result.status}
              </div>
            </div>

            <div className="space-y-4">
              {orderStatuses.map((status, index) => {
                const activeIndex = orderStatuses.indexOf(result.status);
                const complete = index <= activeIndex;

                return (
                  <div key={status} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-1 h-3.5 w-3.5 rounded-full border ${
                          complete
                            ? "border-[color:var(--color-accent-strong)] bg-[color:var(--color-accent-soft)]"
                            : "border-[color:var(--color-accent-soft)]/25 bg-transparent"
                        }`}
                      />
                      {index < orderStatuses.length - 1 ? (
                        <span className="timeline-line" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-base text-[color:var(--color-ink)]">{status}</p>
                      <p className="mt-1 text-sm text-[color:var(--color-muted-soft)]">
                        {complete
                          ? `Updated ${new Date(
                              result.statusHistory[index]?.updatedAt ??
                                result.updatedAt,
                            ).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}`
                          : "Pending next update"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {result.deliveryNote ? (
              <div className="rounded-[1.35rem] border border-[color:var(--color-accent-soft)]/18 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-muted-soft)]">
                  Customer Note
                </p>
                <p className="mt-2 leading-7 text-[color:var(--color-muted)]">
                  {result.deliveryNote}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="section-kicker">No Match</p>
            <h3 className="font-serif text-2xl text-[color:var(--color-ink)] sm:text-3xl">
              We could not find that order
            </h3>
            <p className="leading-7 text-[color:var(--color-muted)]">
              Double-check the tracking ID or the phone number used during
              booking, then try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
