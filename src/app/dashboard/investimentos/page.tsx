"use client";

import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { InvestmentCard } from "@/components/domain/InvestmentCard";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getUserInvestments } from "@/lib/data/investments";
import { getProjects } from "@/lib/data/projects";
import type { Investment, Project } from "@/types";

export default function MyInvestmentsPage() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[] | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!user) return; // sem sessão (ex.: modo demonstração): nada a buscar
    let cancelled = false;
    Promise.all([getUserInvestments(user.uid), getProjects()])
      .then(([inv, proj]) => {
        if (cancelled) return;
        setInvestments(inv);
        setProjects(proj);
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [user, retryKey]);

  const resolvedInvestments = user ? investments : [];

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Meus investimentos</h1>
      <p className="mt-1 text-ms-gray-500">Acompanhe seus aportes em cada empreendimento.</p>

      <div className="mt-8">
        {resolvedInvestments === null ? (
          error ? (
            <ErrorState onRetry={() => { setError(false); setRetryKey((k) => k + 1); }} />
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )
        ) : resolvedInvestments.length === 0 ? (
          <EmptyState
            icon={<Wallet size={20} />}
            title="Você ainda não possui investimentos."
            action={<Button href="/investimentos">Conhecer oportunidades</Button>}
          />
        ) : (
          <div className="space-y-4">
            {resolvedInvestments.map((inv) => (
              <InvestmentCard
                key={inv.id}
                investment={inv}
                project={projects.find((p) => p.id === inv.projectId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
