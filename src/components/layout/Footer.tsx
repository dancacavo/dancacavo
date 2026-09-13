import Link from "next/link";
import { Logo } from "./Logo";
import { LegalDisclaimer } from "./LegalDisclaimer";

export function Footer() {
  return (
    <footer className="border-t border-ms-black/[0.06] bg-ms-gray-100/60">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm text-ms-gray-500">
              Relacionamento e acompanhamento de investidores em
              empreendimentos imobiliários selecionados.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:flex sm:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ms-gray-500">
                Plataforma
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ms-black/80">
                <li><Link href="/investimentos" className="hover:text-ms-black">Investimentos</Link></li>
                <li><Link href="/sobre" className="hover:text-ms-black">Sobre</Link></li>
                <li><Link href="/contato" className="hover:text-ms-black">Contato</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ms-gray-500">
                Legal
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ms-black/80">
                <li><Link href="/termos" className="hover:text-ms-black">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-ms-black">Privacidade</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-ms-black/[0.06] pt-8">
          <LegalDisclaimer className="max-w-3xl" />
          <p className="mt-6 text-xs text-ms-gray-500/70">
            © {new Date().getFullYear()} MS Investor. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
