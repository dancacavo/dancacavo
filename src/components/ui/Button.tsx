import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ms-green-700 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-ms-black text-white hover:bg-ms-green-900 active:scale-[0.98]",
        secondary:
          "bg-ms-green-900 text-white hover:bg-ms-green-700 active:scale-[0.98]",
        outline:
          "border border-ms-black/15 text-ms-black hover:border-ms-black/40 hover:bg-ms-black/[0.02]",
        ghost: "text-ms-black hover:bg-ms-black/[0.04]",
        light: "bg-white text-ms-black hover:bg-white/90",
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
