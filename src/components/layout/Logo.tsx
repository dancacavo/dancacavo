import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { LogoMark } from "./LogoMark";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-display text-lg tracking-tight",
        dark ? "text-white" : "text-ms-black",
        className
      )}
    >
      <LogoMark />
      MS <span className="italic font-normal">Investor</span>
    </Link>
  );
}
