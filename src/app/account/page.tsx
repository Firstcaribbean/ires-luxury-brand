import { AccountDashboard } from "@/components/account/account-dashboard";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <AccountDashboard />
      </main>
      <SiteFooter />
    </>
  );
}
