import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ms-black/[0.06] bg-white shadow-[0_1px_2px_rgba(11,13,12,0.04)] transition-shadow duration-300",
        className
      )}
      {...props}
    />
  );
}

export function CardHover({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ms-black/[0.06] bg-white shadow-[0_1px_2px_rgba(11,13,12,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(11,13,12,0.08)] hover:border-ms-black/10",
        className
      )}
      {...props}
    />
  );
}
