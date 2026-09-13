import { cn } from "@/lib/utils/cn";

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-ms-gray-500">{label}</span>
          <span className="font-medium text-ms-black">{clamped}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ms-black/[0.06]">
        <div
          className="h-full rounded-full bg-ms-green-900 transition-[width] duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
