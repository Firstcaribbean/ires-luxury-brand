"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/data/site-config";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { signInAdmin } from "@/lib/orders/repository";

export function AdminLoginForm() {
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
      await signInAdmin(email, password);
      router.push("/admin/dashboard");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Sign in failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const demoMode = !isFirebaseConfigured();

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Admin email"
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
          className="inline-flex rounded-full bg-[color:var(--color-gold-soft)] px-6 py-3 text-sm font-medium uppercase tracking-[0.25em] text-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error ? (
        <div className="rounded-[1.5rem] border border-amber-200/20 bg-amber-100/10 p-4 text-sm leading-6 text-amber-100">
          {error}
        </div>
      ) : null}

      <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/60">
        {demoMode ? (
          <>
            Demo mode is active until Firebase keys are added. Use
            {" "}
            <span className="text-[color:var(--color-gold-soft)]">
              {siteConfig.demoAdminEmail}
            </span>
            {" / "}
            <span className="text-[color:var(--color-gold-soft)]">
              MaisonDemo123!
            </span>
            .
          </>
        ) : (
          "Firebase mode is active. Use the admin credentials you create in Firebase Authentication."
        )}
      </div>
    </div>
  );
}
