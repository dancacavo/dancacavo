import { cn } from "@/lib/utils/cn";
import type { InvestmentStatus, ProjectStatus, UserAccountStatus } from "@/types";

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

const USER_STATUS_LABELS: Record<UserAccountStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  bloqueado: "Bloqueado",
};

const TONE: Record<string, string> = {
  positive: "bg-ms-gold-900/[0.08] text-ms-gold-900",
  neutral: "bg-ms-gray-500/[0.1] text-ms-gray-500",
  warning: "bg-amber-500/10 text-amber-700",
  danger: "bg-red-500/10 text-red-700",
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

function toneForUserStatus(status: UserAccountStatus) {
  if (status === "ativo") return "positive";
  if (status === "inativo") return "neutral";
  return "danger";
}

export function ProjectStatusBadge({
  status,
  solid,
}: {
  status: ProjectStatus;
  /** Fundo sólido em vez de tingido — usar sobre fotos, onde o tom
   * translúcido perde contraste. */
  solid?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        solid
          ? "bg-white text-ms-black shadow-sm"
          : TONE[toneForProject(status)]
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

export function UserStatusBadge({ status }: { status: UserAccountStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        TONE[toneForUserStatus(status)]
      )}
    >
      {USER_STATUS_LABELS[status]}
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

/**
 * Indicador de disponibilidade — bolinha verde piscando lentamente,
 * sinalizando que a captação está aberta. Usar apenas quando o
 * empreendimento está de fato em captação.
 */
export function AvailabilityBadge({
  label = "Em captação",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ms-black shadow-sm",
        className
      )}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-blink-slow" />
      {label}
    </span>
  );
}
