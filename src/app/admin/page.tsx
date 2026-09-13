"use client";

import { useEffect, useState } from "react";
import { Building2, Users, TrendingUp, FileText } from "lucide-react";
import { MetricCard } from "@/components/domain/MetricCard";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { getProjects } from "@/lib/data/projects";
import { getAllInvestors } from "@/lib/data/users";
import { getAllInvestments } from "@/lib/data/investments";
import { getAllDocuments } from "@/lib/data/documents";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<{
    projects: number;
    investors: number;
    investments: number;
    documents: number;
  } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProjects(), getAllInvestors(), getAllInvestments(), getAllDocuments()])
      .then(([projects, investors, investments, documents]) => {
        if (cancelled) return;
        setCounts({
          projects: projects.length,
          investors: investors.length,
          investments: investments.length,
          documents: documents.length,
        });
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Painel administrativo</h1>
      <p className="mt-1 text-ms-gray-500">Visão geral da plataforma MS Investor.</p>

      <div className="mt-8">
        {counts === null ? (
          error ? <ErrorState /> : <LoadingState />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Empreendimentos" value={counts.projects} icon={<Building2 size={18} />} />
            <MetricCard label="Investidores" value={counts.investors} icon={<Users size={18} />} />
            <MetricCard label="Investimentos" value={counts.investments} icon={<TrendingUp size={18} />} />
            <MetricCard label="Documentos" value={counts.documents} icon={<FileText size={18} />} />
          </div>
        )}
      </div>
    </div>
  );
}
