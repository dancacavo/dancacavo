import { formatCurrency } from "@/lib/utils/format";
import type { ValuationPhase } from "@/types";

/**
 * Linha do tempo de valorização projetada da cota, por fase do
 * empreendimento. Sempre uma simulação — nunca uma promessa de
 * rentabilidade (reforçado pelo LegalDisclaimer ao redor desta seção).
 */
export function ValuationTimeline({ phases }: { phases: ValuationPhase[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-5">
      {phases.map((phase, i) => (
        <div
          key={phase.phase}
          className="relative rounded-2xl border border-ms-black/[0.06] bg-white p-5"
        >
          {i > 0 && (
            <div
              className="absolute -left-4 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-ms-gold-700/40 sm:block"
              aria-hidden
            />
          )}
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ms-gray-500">
            {phase.phase}
          </span>
          <p className="mt-2 font-display text-xl text-ms-black">
            {formatCurrency(phase.pricePerSqm)}
            <span className="text-sm font-sans text-ms-gray-500">/m²</span>
          </p>
        </div>
      ))}
    </div>
  );
}
