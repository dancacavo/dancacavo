import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ms-black/[0.06] bg-white shadow-elevate transition-shadow duration-300",
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
        "rounded-2xl border border-ms-black/[0.06] bg-white shadow-elevate transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-elevate-lg hover:border-ms-green-900/15",
        className
      )}
      {...props}
    />
  );
}
