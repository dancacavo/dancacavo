import type { Metadata } from "next";

export const metadata: Metadata = { title: "Termos de Uso" };

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-green-900">Legal</span>
      <h1 className="mt-3 font-display text-3xl text-ms-black sm:text-4xl">Termos de Uso</h1>
      <p className="mt-4 text-sm text-ms-gray-500">
        Documento placeholder — substituir pelo texto jurídico oficial revisado
        pela área de compliance antes do lançamento em produção.
      </p>

      <div className="prose prose-neutral mt-10 max-w-none space-y-6 text-sm leading-relaxed text-ms-black/80">
        <section>
          <h2 className="font-display text-lg text-ms-black">1. Natureza da plataforma</h2>
          <p>
            O MS Investor é uma plataforma de apresentação de informações,
            relacionamento e acompanhamento de investidores em
            empreendimentos imobiliários. O MS Investor não é uma instituição
            financeira, corretora ou plataforma de investimento, e não realiza,
            intermedia ou executa a oferta, distribuição ou liquidação de
            valores mobiliários.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-ms-black">2. Plataforma parceira</h2>
          <p>
            O processo de investimento é realizado exclusivamente por meio da
            plataforma parceira SONICA, responsável pela operação regulada.
            Ao clicar em &ldquo;Investir&rdquo;, o usuário será redirecionado
            para o ambiente da SONICA.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-ms-black">3. Projeções e retorno</h2>
          <p>
            Quaisquer projeções, estimativas ou metas de retorno apresentadas
            na plataforma são simulações e não constituem promessa ou garantia
            de rentabilidade. Investimentos estão sujeitos a riscos, incluindo
            a possibilidade de perda do capital investido.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-ms-black">4. Conta e cadastro</h2>
          <p>
            O usuário é responsável pela veracidade das informações fornecidas
            no cadastro e pela guarda de suas credenciais de acesso.
          </p>
        </section>
      </div>
    </div>
  );
}
