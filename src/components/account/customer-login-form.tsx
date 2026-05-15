"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { signInCustomer } from "@/lib/customers/repository";

export function CustomerLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signInCustomer(email, password);
      router.push("/account");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Sign in failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="input-shell"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="input-shell"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="button-gold disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-700">
          {error}
        </div>
      ) : null}

      <p className="text-sm leading-7 text-[color:var(--color-muted)]">
        New customer?{" "}
        <Link href="/account/register" className="font-medium text-[color:var(--color-accent-strong)]">
          Create an account
        </Link>
      </p>
    </div>
  );
}
