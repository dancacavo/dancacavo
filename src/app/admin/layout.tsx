import { RequireAuth } from "@/components/layout/RequireAuth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth requireRole="admin">
      <div className="flex min-h-screen bg-ms-gray-100/40">
        <AdminSidebar />
        <main className="flex-1 px-5 py-8 sm:px-10 sm:py-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </RequireAuth>
  );
}
