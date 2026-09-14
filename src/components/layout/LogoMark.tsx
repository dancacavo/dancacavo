import { cn } from "@/lib/utils/cn";

/**
 * Símbolo institucional: quatro traços diagonais em leque, inspirados na
 * identidade do Grupo Marques Silveira / FIAM Investimentos. Vetor
 * autoral (não é o logotipo oficial) — substituir pelo arquivo de marca
 * oficial assim que disponível.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 46 42"
      className={cn("h-6 w-7", className)}
      role="img"
      aria-label="Símbolo MS Investor"
    >
      <defs>
        <linearGradient id="msGoldMark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8C97A" />
          <stop offset="100%" stopColor="#8A6D1F" />
        </linearGradient>
      </defs>
      <g fill="url(#msGoldMark)">
        <polygon points="0,0 6,0 26,40 20,40" />
        <polygon points="9,0 15,0 31.5,33 25.5,33" opacity="0.88" />
        <polygon points="18,0 24,0 37,26 31,26" opacity="0.74" />
        <polygon points="27,0 33,0 42.5,19 36.5,19" opacity="0.6" />
      </g>
    </svg>
  );
}
