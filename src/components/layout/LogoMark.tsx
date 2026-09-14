import { cn } from "@/lib/utils/cn";

/**
 * Monograma MS Investor: um traço único e contínuo que começa como um
 * "M" geométrico e se transforma em um "S" fluido — as duas letras
 * fundidas num só símbolo, exclusivo da plataforma (distinto do símbolo
 * "V" do Grupo Marques Silveira).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-2 -2 46 38"
      className={cn("h-7 w-7", className)}
      role="img"
      aria-label="Monograma MS Investor"
    >
      <defs>
        <linearGradient id="msMonogram" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D9BA7A" />
          <stop offset="55%" stopColor="#B8902E" />
          <stop offset="100%" stopColor="#7C6230" />
        </linearGradient>
      </defs>
      <path
        d="M4 30 L4 6 L13 20 L22 6 C34 6 12 16 26 18 C40 20 14 30 28 30"
        fill="none"
        stroke="url(#msMonogram)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
