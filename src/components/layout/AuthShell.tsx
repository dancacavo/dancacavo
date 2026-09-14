import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

/**
 * Casca visual compartilhada pelas telas de autenticação (login, cadastro,
 * recuperar senha). Cada página passa sua própria foto e citação —
 * assim cada uma tem uma imagem diferente, em vez de repetir o mesmo
 * fundo abstrato.
 */
export function AuthShell({
  children,
  imageSrc,
  imageAlt,
  quote,
}: {
  children: ReactNode;
  imageSrc: string;
  imageAlt: string;
  quote: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel visual — visível a partir de telas grandes, estilo "private banking" */}
      <div className="relative hidden overflow-hidden bg-ms-black text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(11,13,12,0.55) 0%, rgba(11,13,12,0.25) 45%, rgba(11,13,12,0.85) 100%)",
          }}
        />
        <div className="relative">
          <Logo dark />
        </div>
        <div className="relative max-w-sm">
          <p className="font-display text-2xl italic leading-snug text-white/90">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">
            MS Investor · Grupo Marques Silveira
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex flex-col bg-ms-gray-100/40">
        <div className="px-5 pt-8 sm:px-8 lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <div className="pb-8 text-center text-xs text-ms-gray-500">
          <Link href="/" className="hover:text-ms-black">Voltar ao site</Link>
        </div>
      </div>
    </div>
  );
}
