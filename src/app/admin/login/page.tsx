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
        <section className="rounded-[2rem] border border-white/10 bg-[color:var(--color-panel-strong)] p-8">
          <p className="section-kicker">Vendor Access</p>
          <h1 className="mt-4 font-serif text-5xl text-white">Admin sign-in</h1>
          <p className="mt-4 max-w-xl leading-7 text-white/65">
            This is the shell for the private vendor panel. In the next phase,
            it will connect to Firebase Authentication for a protected order
            management experience.
          </p>

          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-[color:var(--color-panel)] p-8">
            <p className="section-kicker">Dashboard Preview</p>
            <h2 className="mt-4 font-serif text-4xl text-white">
              What the vendor panel will manage
            </h2>
            <p className="mt-4 leading-7 text-white/65">
              Orders, tracking IDs, dispatch updates, and delivery proof all
              live in one workspace for the perfume vendor.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {adminPreviewStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.75rem] border border-white/10 bg-black/25 p-6"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/35">
                  {item.label}
                </p>
                <p className="mt-4 font-serif text-5xl text-[color:var(--color-gold-soft)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-8">
            <p className="leading-7 text-white/65">
              Once we connect Firebase, this area becomes the real working
              dashboard for the business.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
