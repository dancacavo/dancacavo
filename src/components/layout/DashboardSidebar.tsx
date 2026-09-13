"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, TrendingUp, FileText, Bell, User, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/auth/AuthProvider";

const ITEMS = [
  { href: "/dashboard", label: "Início", icon: LayoutGrid },
  { href: "/dashboard/investimentos", label: "Meus investimentos", icon: TrendingUp },
  { href: "/dashboard/documentos", label: "Documentos", icon: FileText },
  { href: "/dashboard/notificacoes", label: "Notificações", icon: Bell },
  { href: "/dashboard/perfil", label: "Perfil", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ms-black/[0.06] bg-white px-5 py-6 md:flex">
      <div className="px-2">
        <Logo />
      </div>
      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-ms-green-900 text-white"
                  : "text-ms-black/70 hover:bg-ms-gray-100"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={async () => {
          await logout();
          router.push("/");
        }}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ms-gray-500 transition-colors hover:bg-ms-gray-100 hover:text-ms-black"
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}
