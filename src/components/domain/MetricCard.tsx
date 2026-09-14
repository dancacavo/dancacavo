import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export function MetricCard({
  label,
  value,
  icon,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-ms-gray-500">{label}</span>
        {icon && <span className="text-ms-gold-900">{icon}</span>}
      </div>
      <div className="mt-3 font-display text-2xl text-ms-black sm:text-3xl">
        {value}
      </div>
      {hint && <p className="mt-1 text-xs text-ms-gray-500">{hint}</p>}
    </Card>
  );
}
