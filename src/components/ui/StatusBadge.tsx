import { cn } from "@/lib/utils/cn";
import type { InvestmentStatus, ProjectStatus } from "@/types";

const PROJECT_LABELS: Record<ProjectStatus, string> = {
  em_breve: "Em breve",
  captacao: "Captação em andamento",
  em_construcao: "Em construção",
  concluido: "Concluído",
  encerrado: "Encerrado",
};

const INVESTMENT_LABELS: Record<InvestmentStatus, string> = {
  ativo: "Ativo",
  em_analise: "Em análise",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const TONE: Record<string, string> = {
  positive: "bg-ms-green-900/[0.08] text-ms-green-900",
  neutral: "bg-ms-gray-500/[0.1] text-ms-gray-500",
  warning: "bg-amber-500/10 text-amber-700",
};

function toneForProject(status: ProjectStatus) {
  if (status === "captacao" || status === "em_construcao") return "positive";
  if (status === "concluido") return "neutral";
  if (status === "encerrado") return "neutral";
  return "warning";
}

function toneForInvestment(status: InvestmentStatus) {
  if (status === "ativo") return "positive";
  if (status === "em_analise") return "warning";
  if (status === "concluido") return "neutral";
  return "neutral";
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        TONE[toneForProject(status)]
      )}
    >
      {PROJECT_LABELS[status]}
    </span>
  );
}

export function InvestmentStatusBadge({ status }: { status: InvestmentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        TONE[toneForInvestment(status)]
      )}
    >
      {INVESTMENT_LABELS[status]}
    </span>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-ms-gray-500/30 bg-ms-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ms-gray-500",
        className
      )}
    >
      Demonstração
    </span>
  );
}
