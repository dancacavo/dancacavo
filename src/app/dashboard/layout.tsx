import { RequireAuth } from "@/components/layout/RequireAuth";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { MobileNavbar } from "@/components/layout/MobileNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-ms-gray-100/40">
        <DashboardSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardTopbar />
          <main className="flex-1 px-5 pb-24 pt-6 sm:px-8 sm:pb-10 sm:pt-10">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
        <MobileNavbar />
      </div>
    </RequireAuth>
  );
}
