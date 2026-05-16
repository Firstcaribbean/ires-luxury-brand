import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { SiteHeader } from "@/components/layout/site-header";

export default function AdminDashboardPage() {
  return (
    <>
      <SiteHeader showNavigation={false} showActions={false} adminLabel="Vendor Dashboard" />
      <main className="min-h-[calc(100vh-81px)] bg-[color:var(--color-panel)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[96rem]">
          <AdminDashboard />
        </div>
      </main>
    </>
  );
}
