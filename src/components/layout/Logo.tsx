import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-display text-lg tracking-tight",
        dark ? "text-white" : "text-ms-black",
        className
      )}
    >
      MS <span className="italic font-normal">Investor</span>
    </Link>
  );
}
