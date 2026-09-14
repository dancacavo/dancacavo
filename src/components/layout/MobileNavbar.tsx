"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, TrendingUp, FileText, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { href: "/dashboard", label: "Início", icon: LayoutGrid },
  { href: "/dashboard/investimentos", label: "Investimentos", icon: TrendingUp },
  { href: "/dashboard/documentos", label: "Documentos", icon: FileText },
  { href: "/dashboard/notificacoes", label: "Avisos", icon: Bell },
  { href: "/dashboard/perfil", label: "Perfil", icon: User },
];

export function MobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ms-black/[0.06] bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex max-w-6xl items-stretch justify-between px-2">
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
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors",
                active ? "text-ms-gold-900" : "text-ms-gray-500"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
