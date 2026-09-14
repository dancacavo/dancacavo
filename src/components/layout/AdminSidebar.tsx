"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  Star,
  Users,
  Settings,
  TrendingUp,
  FileText,
  Megaphone,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/auth/AuthProvider";

// Estrutura principal do painel administrativo.
const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/empreendimentos", label: "Empreendimentos", icon: Building2 },
  { href: "/admin/oportunidades", label: "Oportunidades", icon: Star },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

// Áreas complementares (já existentes) — mantidas para não remover
// funcionalidades, agrupadas separadamente da IA principal solicitada.
const SECONDARY_ITEMS = [
  { href: "/admin/investimentos", label: "Investimentos", icon: TrendingUp },
  { href: "/admin/documentos", label: "Documentos", icon: FileText },
  { href: "/admin/comunicados", label: "Comunicados", icon: Megaphone },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ms-black/[0.06] bg-ms-black px-5 py-6 md:flex">
      <div className="px-2">
        <Logo dark />
        <span className="ml-1 mt-1 block text-[11px] font-semibold uppercase tracking-wider text-white/40">
          Painel administrativo
        </span>
      </div>
      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {ITEMS.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-white text-ms-black" : "text-white/70 hover:bg-white/10"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        <span className="mb-1 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">
          Outras áreas
        </span>
        {SECONDARY_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-white text-ms-black" : "text-white/70 hover:bg-white/10"
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
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}
