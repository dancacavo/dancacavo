"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { InvestmentStatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { getAllInvestments, updateInvestmentStatus } from "@/lib/data/investments";
import { getProjects } from "@/lib/data/projects";
import { getAllInvestors } from "@/lib/data/users";
import type { Investment, Project, UserProfile, InvestmentStatus } from "@/types";

const STATUS_OPTIONS: InvestmentStatus[] = ["em_analise", "ativo", "concluido", "cancelado"];

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[] | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [investors, setInvestors] = useState<UserProfile[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAllInvestments(), getProjects(), getAllInvestors()])
      .then(([inv, proj, users]) => {
        if (cancelled) return;
        setInvestments(inv);
        setProjects(proj);
        setInvestors(users);
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStatusChange = async (id: string, status: InvestmentStatus) => {
    setInvestments((prev) => prev?.map((i) => (i.id === id ? { ...i, status } : i)) ?? prev);
    await updateInvestmentStatus(id, status).catch(() => {});
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Investimentos</h1>
      <p className="mt-1 text-ms-gray-500">
        Registros de investimentos vindos da plataforma parceira SONICA.
      </p>

      <div className="mt-8">
        {investments === null ? (
          error ? <ErrorState /> : <LoadingState />
        ) : investments.length === 0 ? (
          <EmptyState
            icon={<TrendingUp size={20} />}
            title="Nenhum investimento registrado"
            description="Registros aparecem aqui conforme confirmados pela SONICA."
          />
        ) : (
          <div className="space-y-3">
            {investments.map((inv) => {
              const project = projects.find((p) => p.id === inv.projectId);
              const investor = investors.find((u) => u.id === inv.userId);
              return (
                <Card key={inv.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-ms-black">{project?.name ?? inv.projectId}</p>
                    <p className="text-sm text-ms-gray-500">
                      {investor ? (
                        <Link href={`/admin/usuarios/${investor.id}`} className="underline decoration-dotted hover:text-ms-black">
                          {investor.name}
                        </Link>
                      ) : (
                        inv.userId
                      )}{" "}
                      · {formatCurrency(inv.amount)} · {formatDate(inv.investedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <InvestmentStatusBadge status={inv.status} />
                    <select
                      value={inv.status}
                      onChange={(e) => handleStatusChange(inv.id, e.target.value as InvestmentStatus)}
                      className="h-9 rounded-lg border border-ms-black/10 bg-white px-2 text-xs outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
