"use client";

import { FormEvent, useState } from "react";

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
        className="rounded-[2rem] border border-white/10 bg-[color:var(--color-panel-strong)] p-6"
      >
        <p className="section-kicker">Live Demo Tracking</p>
        <h3 className="mt-3 font-serif text-3xl text-white">
          Search by tracking ID or phone number
        </h3>
        <p className="mt-3 leading-7 text-white/65">
          Try <span className="text-[color:var(--color-gold-soft)]">MDP-10425</span> or{" "}
          <span className="text-[color:var(--color-gold-soft)]">+1 555-120-5589</span>.
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
          className="mt-4 inline-flex rounded-full border border-[color:var(--color-gold-soft)] px-6 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)] transition hover:bg-[color:var(--color-gold-soft)] hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSearching ? "Checking..." : "Check status"}
        </button>

        {error ? (
          <div className="mt-4 rounded-2xl border border-amber-200/20 bg-amber-100/10 p-4 text-sm leading-6 text-amber-100">
            {error}
          </div>
        ) : null}
      </form>

      <div className="rounded-[2rem] border border-white/10 bg-[color:var(--color-panel)] p-6">
        {!searched ? (
          <div className="space-y-3">
            <p className="section-kicker">Order Timeline</p>
            <h3 className="font-serif text-3xl text-white">
              Status updates appear here
            </h3>
            <p className="leading-7 text-white/65">
              Once a customer books a scent, the tracking dashboard shows each
              movement from order receipt to final delivery confirmation.
            </p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="section-kicker">Tracking Result</p>
                <h3 className="mt-3 font-serif text-3xl text-white">
                  {result.trackingId}
                </h3>
                <p className="mt-2 text-white/65">
                  {result.customerName} • {result.productName} • Qty {result.quantity}
                </p>
              </div>
              <div className="rounded-full border border-[color:var(--color-gold-soft)] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--color-gold-soft)]">
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
                            ? "border-[color:var(--color-gold-soft)] bg-[color:var(--color-gold-soft)]"
                            : "border-white/20 bg-transparent"
                        }`}
                      />
                      {index < orderStatuses.length - 1 ? (
                        <span className="timeline-line" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-base text-white">{status}</p>
                      <p className="mt-1 text-sm text-white/45">
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
          </div>
        ) : (
          <div className="space-y-3">
            <p className="section-kicker">No Match</p>
            <h3 className="font-serif text-3xl text-white">
              We could not find that order
            </h3>
            <p className="leading-7 text-white/65">
              Double-check the tracking ID or the phone number used during
              booking, then try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
