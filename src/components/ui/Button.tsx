import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ms-gold-700 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // sombra em duas camadas + leve realce interno no topo (efeito "lacado")
        // para transmitir peso e acabamento, sem exagerar em brilho.
        primary:
          "bg-ms-black text-white shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_10px_24px_-8px_rgba(11,13,12,0.45)] hover:bg-ms-gold-900 hover:shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_16px_32px_-8px_rgba(124,98,48,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        // texto grafite (não branco) sobre dourado: contraste AA garantido no
        // preenchimento sólido, mais fiel também ao padrão da marca de referência.
        secondary:
          "bg-ms-gold-700 text-ms-black shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_24px_-8px_rgba(124,98,48,0.45)] hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        outline:
          "border border-ms-black/15 text-ms-black hover:border-ms-black/40 hover:bg-ms-black/[0.02] hover:-translate-y-0.5 active:translate-y-0",
        ghost: "text-ms-black hover:bg-ms-black/[0.04]",
        light:
          "bg-white text-ms-black shadow-[0_10px_24px_-8px_rgba(11,13,12,0.35)] hover:bg-white/90 hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[15px]",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export function Button({ className, variant, size, href, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {props.children}
      </Link>
    );
  }
  return <button className={classes} {...props} />;
}
