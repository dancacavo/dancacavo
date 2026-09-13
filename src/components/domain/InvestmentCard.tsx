import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { InvestmentStatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Investment, Project } from "@/types";

export function InvestmentCard({
  investment,
  project,
}: {
  investment: Investment;
  project?: Project | null;
}) {
  return (
    <Link href={`/dashboard/investimentos/${investment.id}`}>
      <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-[0_12px_32px_rgba(11,13,12,0.08)] sm:p-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ms-gray-100 sm:h-20 sm:w-20">
          {project?.coverImage && (
            <Image
              src={project.coverImage}
              alt={project?.name ?? "Empreendimento"}
              fill
              className="object-cover"
              sizes="80px"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-display text-lg text-ms-black">
              {project?.name ?? "Empreendimento"}
            </h3>
            <InvestmentStatusBadge status={investment.status} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ms-gray-500">
            <span>
              Valor investido:{" "}
              <span className="font-medium text-ms-black">
                {formatCurrency(investment.amount)}
              </span>
            </span>
            <span>Desde {formatDate(investment.investedAt)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
