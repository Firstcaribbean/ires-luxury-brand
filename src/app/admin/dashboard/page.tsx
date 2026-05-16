import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[color:var(--color-panel)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[96rem]">
        <AdminDashboard />
      </div>
    </main>
  );
}
