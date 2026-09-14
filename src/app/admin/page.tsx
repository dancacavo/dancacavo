"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Users, Star, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/domain/MetricCard";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { formatDate } from "@/lib/utils/format";
import { getProjects } from "@/lib/data/projects";
import { getAllUsers } from "@/lib/data/users";
import { getAllInvestments } from "@/lib/data/investments";
import type { Investment, Project, UserProfile } from "@/types";

type Activity = {
  id: string;
  label: string;
  at: string;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<{
    projects: Project[];
    users: UserProfile[];
    investments: Investment[];
  } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProjects(), getAllUsers(), getAllInvestments()])
      .then(([projects, users, investments]) => {
        if (cancelled) return;
        setData({ projects, users, investments });
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (data === null) {
    return (
      <div>
        <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-ms-gray-500">Visão geral da plataforma MS Investor.</p>
        <div className="mt-8">{error ? <ErrorState /> : <LoadingState />}</div>
      </div>
    );
  }

  const { projects, users, investments } = data;
  const activeProjects = projects.filter((p) => p.active !== false);
  const publishedOpportunities = activeProjects.filter((p) => p.showInOpportunities !== false);
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Atividades recentes: derivadas de dados reais já existentes (cadastro de
  // usuários, criação/atualização de empreendimentos, novos investimentos) —
  // nenhum dado é inventado; se não houver nada, a seção fica vazia.
  const activity: Activity[] = [
    ...users.map((u) => ({ id: `user-${u.id}`, label: `Novo usuário cadastrado: ${u.name || u.email}`, at: u.createdAt })),
    ...projects.map((p) => ({ id: `project-${p.id}`, label: `Empreendimento atualizado: ${p.name}`, at: p.updatedAt })),
    ...investments.map((i) => ({ id: `investment-${i.id}`, label: `Novo investimento registrado (${i.projectId})`, at: i.createdAt })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-ms-gray-500">Visão geral da plataforma MS Investor.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Total de usuários" value={users.length} icon={<Users size={18} />} />
        <MetricCard label="Empreendimentos" value={projects.length} icon={<Building2 size={18} />} />
        <MetricCard label="Empreendimentos ativos" value={activeProjects.length} icon={<Building2 size={18} />} />
        <MetricCard label="Oportunidades publicadas" value={publishedOpportunities.length} icon={<Star size={18} />} />
        <MetricCard label="Cadastros recentes" value={recentUsers.length} icon={<UserPlus size={18} />} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-lg text-ms-black">Usuários cadastrados recentemente</h2>
          <div className="mt-4">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-ms-gray-500">Nenhum usuário cadastrado ainda.</p>
            ) : (
              <ul className="space-y-1">
                {recentUsers.map((u) => (
                  <li key={u.id}>
                    <Link
                      href={`/admin/usuarios/${u.id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-ms-black/[0.03]"
                    >
                      <span className="font-medium text-ms-black">{u.name || u.email}</span>
                      <span className="text-ms-gray-500">{formatDate(u.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-lg text-ms-black">Atividades recentes</h2>
          <div className="mt-4">
            {activity.length === 0 ? (
              <p className="text-sm text-ms-gray-500">Nenhuma atividade registrada ainda.</p>
            ) : (
              <ul className="space-y-1">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm">
                    <span className="text-ms-black">{a.label}</span>
                    <span className="shrink-0 text-ms-gray-500">{formatDate(a.at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
