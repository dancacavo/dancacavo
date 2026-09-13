"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/investimentos", label: "Investimentos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-ms-black/[0.06] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm text-ms-gray-500 transition-colors hover:text-ms-black",
                pathname === link.href && "text-ms-black font-medium"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && user ? (
            <Button href="/dashboard" size="sm">
              Minha conta
            </Button>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Entrar
              </Button>
              <Button href="/cadastro" size="sm">
                Criar conta
              </Button>
            </>
          )}
        </div>

        <button
          className="-mr-2 p-2 text-ms-black md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ms-black/[0.06] bg-white px-5 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-ms-black/80 hover:bg-ms-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {!loading && user ? (
              <Button href="/dashboard" size="md">
                Minha conta
              </Button>
            ) : (
              <>
                <Button href="/cadastro" size="md">
                  Criar conta
                </Button>
                <Button href="/login" variant="outline" size="md">
                  Entrar
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
