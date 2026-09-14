import { cn } from "@/lib/utils/cn";

/**
 * Símbolo MS Investor: um "V" sólido em duas facetas, com um corte fino
 * no centro (efeito de joia/precisão). Reduzido a duas formas para ficar
 * legível em qualquer tamanho — inspirado no "V" do Grupo Marques
 * Silveira, mas simplificado para uso como ícone de app/navbar.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 30"
      className={cn("h-6 w-6", className)}
      role="img"
      aria-label="Símbolo MS Investor"
    >
      <defs>
        <linearGradient id="msGoldMark" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#D9BA7A" />
          <stop offset="100%" stopColor="#8A6D1F" />
        </linearGradient>
        <linearGradient id="msGoldMarkDark" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#C9A968" />
          <stop offset="100%" stopColor="#6E5827" />
        </linearGradient>
      </defs>
      {/* faceta esquerda */}
      <polygon points="1,1 11,1 16.2,27.5 14.2,27.5" fill="url(#msGoldMark)" />
      {/* faceta direita, ligeiramente mais escura para dar volume */}
      <polygon points="31,1 21,1 15.8,27.5 17.8,27.5" fill="url(#msGoldMarkDark)" />
    </svg>
  );
}
