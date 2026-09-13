import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-green-900">Legal</span>
      <h1 className="mt-3 font-display text-3xl text-ms-black sm:text-4xl">Política de Privacidade</h1>
      <p className="mt-4 text-sm text-ms-gray-500">
        Documento placeholder — substituir pelo texto jurídico oficial revisado
        pela área de compliance antes do lançamento em produção.
      </p>

      <div className="prose prose-neutral mt-10 max-w-none space-y-6 text-sm leading-relaxed text-ms-black/80">
        <section>
          <h2 className="font-display text-lg text-ms-black">1. Dados coletados</h2>
          <p>
            Coletamos apenas os dados necessários para cadastro, autenticação e
            relacionamento com o investidor: nome, e-mail, telefone e, quando
            aplicável, dados adicionais exigidos para conformidade. Aplicamos o
            princípio de minimização de dados.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-ms-black">2. Uso dos dados</h2>
          <p>
            Os dados são utilizados para autenticação, comunicação sobre
            empreendimentos e investimentos, e para cumprimento de obrigações
            legais e regulatórias.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-ms-black">3. Compartilhamento</h2>
          <p>
            Dados podem ser compartilhados com a plataforma parceira SONICA
            exclusivamente para viabilizar o processo de investimento
            solicitado pelo usuário.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg text-ms-black">4. Direitos do titular</h2>
          <p>
            Você pode solicitar acesso, correção ou exclusão dos seus dados a
            qualquer momento, conforme a legislação aplicável.
          </p>
        </section>
      </div>
    </div>
  );
}
