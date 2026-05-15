import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const adminPreviewStats = [
  { label: "New bookings", value: "12" },
  { label: "In transit", value: "07" },
  { label: "Delivered this week", value: "19" },
];

export default function AdminLoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-20">
        <section className="rounded-[2rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-8 shadow-sm">
          <p className="section-kicker">Vendor Access</p>
          <h1 className="mt-4 font-serif text-4xl text-[color:var(--color-ink)] sm:text-5xl">
            Admin sign-in
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-[color:var(--color-muted)]">
            Sign in to manage bookings, update order status, and keep customer
            tracking information current.
          </p>

          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-[color:var(--color-accent-soft)]/16 bg-[color:var(--color-panel)] p-8 shadow-sm">
            <p className="section-kicker">Dashboard Preview</p>
            <h2 className="mt-4 font-serif text-3xl text-[color:var(--color-ink)] sm:text-4xl">
              What the vendor panel will manage
            </h2>
            <p className="mt-4 leading-7 text-[color:var(--color-muted)]">
              Orders, tracking IDs, dispatch updates, and customer delivery
              notes all live in one workspace for the vendor.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {adminPreviewStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-6 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted-soft)]">
                  {item.label}
                </p>
                <p className="mt-4 font-serif text-4xl text-[color:var(--color-accent-strong)] sm:text-5xl">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-8 shadow-sm">
            <p className="leading-7 text-[color:var(--color-muted)]">
              Once signed in, the vendor can review orders saved from the cart,
              send customers to WhatsApp payment, and update tracking from one
              place.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
