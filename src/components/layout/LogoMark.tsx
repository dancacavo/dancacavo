import { cn } from "@/lib/utils/cn";

/**
 * Símbolo oficial Marques Silveira / MS Investor: "V" formado por dois
 * conjuntos de quatro traços diagonais em leque, convergindo em um ponto
 * central (ver public/brand/logo.pdf — arquivo de origem oficial).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 46 40"
      className={cn("h-6 w-7", className)}
      role="img"
      aria-label="Símbolo Marques Silveira"
    >
      <defs>
        <linearGradient id="msGoldMark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A968" />
          <stop offset="100%" stopColor="#7C6230" />
        </linearGradient>
      </defs>
      <g fill="url(#msGoldMark)">
        {/* braço esquerdo do V */}
        <polygon points="0,0 6,0 26,40 20,40" />
        <polygon points="9,0 15,0 31.5,33 25.5,33" />
        <polygon points="18,0 24,0 37,26 31,26" />
        <polygon points="27,0 33,0 42.5,19 36.5,19" />
        {/* braço direito do V (espelhado) */}
        <polygon points="46,0 40,0 20,40 26,40" />
        <polygon points="37,0 31,0 14.5,33 20.5,33" />
        <polygon points="28,0 22,0 9,26 15,26" />
        <polygon points="19,0 13,0 3.5,19 9.5,19" />
      </g>
    </svg>
  );
}
