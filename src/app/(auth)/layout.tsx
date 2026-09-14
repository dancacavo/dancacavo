import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel visual — visível a partir de telas grandes, estilo "private banking" */}
      <div className="grain relative hidden overflow-hidden bg-ms-black text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-skyline opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(11,13,12,0.55) 0%, rgba(11,13,12,0.35) 45%, rgba(11,13,12,0.95) 100%)",
          }}
        />
        <div className="relative">
          <Logo dark />
        </div>
        <div className="relative max-w-sm">
          <p className="font-display text-2xl italic leading-snug text-white/90">
            &ldquo;Investir com visão de longo prazo é, antes de tudo, uma
            questão de acompanhamento.&rdquo;
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
