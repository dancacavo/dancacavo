"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Building2, Activity } from "lucide-react";
import { DashboardGreeting } from "@/components/layout/DashboardTopbar";
import { MetricCard } from "@/components/domain/MetricCard";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { DemoModeNotice } from "@/components/domain/DemoModeNotice";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getUserInvestments } from "@/lib/data/investments";
import { formatCurrency } from "@/lib/utils/format";
import type { Investment } from "@/types";

export default function DashboardPage() {
  const { user, isDemoMode } = useAuth();
  const [investments, setInvestments] = useState<Investment[] | null>(null);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!user) return; // sem sessão (ex.: modo demonstração): nada a buscar
    let cancelled = false;
    getUserInvestments(user.uid)
      .then((data) => !cancelled && setInvestments(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [user, retryKey]);

  // Sem usuário autenticado (modo demonstração), tratamos como "sem
  // investimentos" em vez de ficar carregando indefinidamente.
  const resolvedInvestments = user ? investments : [];

  const totalInvested = resolvedInvestments?.reduce((sum, inv) => sum + inv.amount, 0) ?? 0;
  const activeCount = resolvedInvestments?.filter((i) => i.status === "ativo").length ?? 0;
  const uniqueProjects = new Set(resolvedInvestments?.map((i) => i.projectId)).size;

  return (
    <div className="space-y-8">
      <DashboardGreeting />

      {isDemoMode && <DemoModeNotice />}

      {resolvedInvestments === null ? (
        error ? (
          <ErrorState onRetry={() => { setError(false); setRetryKey((k) => k + 1); }} />
        ) : (
          <LoadingState label="Carregando seus investimentos…" />
        )
      ) : resolvedInvestments.length === 0 ? (
        <EmptyState
          icon={<Wallet size={20} />}
          title="Você ainda não possui investimentos."
          description="Explore as oportunidades disponíveis e comece a acompanhar seu primeiro investimento."
          action={<Button href="/investimentos">Conhecer oportunidades</Button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total investido"
            value={formatCurrency(totalInvested)}
            icon={<Wallet size={18} />}
          />
          <MetricCard
            label="Número de investimentos"
            value={resolvedInvestments.length}
            icon={<TrendingUp size={18} />}
          />
          <MetricCard
            label="Empreendimentos"
            value={uniqueProjects}
            icon={<Building2 size={18} />}
          />
          <MetricCard
            label="Status"
            value={activeCount > 0 ? "Ativo" : "Sem atividade"}
            icon={<Activity size={18} />}
          />
        </div>
      )}
    </div>
  );
}
