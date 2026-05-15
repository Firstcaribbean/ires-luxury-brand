"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { registerCustomer } from "@/lib/customers/repository";

export function CustomerRegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await registerCustomer({
        fullName,
        email,
        phone,
        address,
        password,
      });
      router.push("/account");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Account creation failed.",
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
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full name"
          className="input-shell"
        />
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
          placeholder="Default delivery address"
          className="input-shell resize-none"
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      {error ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-700">
          {error}
        </div>
      ) : null}

      <p className="text-sm leading-7 text-[color:var(--color-muted)]">
        Already have an account?{" "}
        <Link href="/account/login" className="font-medium text-[color:var(--color-accent-strong)]">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
