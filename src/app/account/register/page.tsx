import { CustomerRegisterForm } from "@/components/account/customer-register-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function AccountRegisterPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-10 lg:py-20">
        <section className="rounded-[2rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-8 shadow-sm">
          <p className="section-kicker">Create Account</p>
          <h1 className="mt-4 font-serif text-4xl text-[color:var(--color-ink)] sm:text-5xl">
            Join before you shop
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-[color:var(--color-muted)]">
            Create a customer account so your details can be reused during
            booking and your order history stays easy to access.
          </p>

          <div className="mt-8">
            <CustomerRegisterForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
