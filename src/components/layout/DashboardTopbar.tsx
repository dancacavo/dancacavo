"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth/AuthProvider";

export function DashboardTopbar({ unreadCount = 0 }: { unreadCount?: number }) {
  return (
    <div className="flex items-center justify-between border-b border-ms-black/[0.06] bg-white/80 px-5 py-4 backdrop-blur-md md:hidden">
      <Logo />
      <Link
        href="/dashboard/notificacoes"
        className="relative rounded-full p-2 text-ms-black/70 hover:bg-ms-gray-100"
        aria-label="Notificações"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-ms-green-900" />
        )}
      </Link>
    </div>
  );
}

export function DashboardGreeting() {
  const { profile } = useAuth();
  const firstName = profile?.name?.split(" ")[0];

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">
        Olá{firstName ? `, ${firstName}` : ""}.
      </h1>
      <p className="mt-1 text-ms-gray-500">Veja como estão seus investimentos.</p>
    </div>
  );
}
