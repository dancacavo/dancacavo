import { cn } from "@/lib/utils/cn";

/**
 * Disclaimer jurídico padrão. Reutilizado na landing, na página de
 * empreendimento e no rodapé. Texto substituível por conteúdo jurídico
 * oficial posteriormente — ver /termos e /privacidade.
 */
export function LegalDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-ms-gray-500", className)}>
      O MS Investor é uma plataforma de apresentação de informações,
      relacionamento e acompanhamento de investidores em empreendimentos
      imobiliários. O MS Investor não realiza, intermedia ou executa a oferta,
      distribuição ou liquidação de valores mobiliários. Eventual processo de
      investimento é realizado exclusivamente por meio da plataforma parceira
      SONICA, responsável pela operação regulada. Projeções, estimativas e
      metas de retorno mencionadas são simulações e não constituem garantia de
      rentabilidade. Investimentos estão sujeitos a riscos, incluindo a
      possibilidade de perda do capital investido.
    </p>
  );
}
