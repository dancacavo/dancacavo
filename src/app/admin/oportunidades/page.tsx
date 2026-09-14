"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowDown, Star, Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProjectStatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import {
  getProjects,
  setProjectShowInOpportunities,
  setProjectOpportunityOrder,
  updateProject,
} from "@/lib/data/projects";
import { formatCurrency } from "@/lib/utils/format";
import type { Project } from "@/types";

export default function AdminOpportunitiesPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProjects()
      .then((data) => !cancelled && setProjects(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (projects === null) return error ? <ErrorState /> : <LoadingState />;

  const showcased = [...projects]
    .filter((p) => p.showInOpportunities !== false)
    .sort((a, b) => (a.opportunityOrder ?? 0) - (b.opportunityOrder ?? 0));
  const hidden = projects.filter((p) => p.showInOpportunities === false);

  const move = async (index: number, direction: -1 | 1) => {
    const target = showcased[index + direction];
    const current = showcased[index];
    if (!target || !current) return;
    setBusyId(current.id);
    const currentOrder = current.opportunityOrder ?? 0;
    const targetOrder = target.opportunityOrder ?? 0;
    setProjects((prev) =>
      prev?.map((p) => {
        if (p.id === current.id) return { ...p, opportunityOrder: targetOrder };
        if (p.id === target.id) return { ...p, opportunityOrder: currentOrder };
        return p;
      }) ?? prev
    );
    try {
      await Promise.all([
        setProjectOpportunityOrder(current.id, targetOrder),
        setProjectOpportunityOrder(target.id, currentOrder),
      ]);
    } finally {
      setBusyId(null);
    }
  };

  const toggleFeatured = async (project: Project) => {
    setBusyId(project.id);
    const featured = !project.featured;
    setProjects((prev) => prev?.map((p) => (p.id === project.id ? { ...p, featured } : p)) ?? prev);
    try {
      await updateProject(project.id, { featured });
    } finally {
      setBusyId(null);
    }
  };

  const removeFromShowcase = async (project: Project) => {
    setBusyId(project.id);
    setProjects((prev) => prev?.map((p) => (p.id === project.id ? { ...p, showInOpportunities: false } : p)) ?? prev);
    try {
      await setProjectShowInOpportunities(project.id, false);
    } finally {
      setBusyId(null);
    }
  };

  const addToShowcase = async (project: Project) => {
    setBusyId(project.id);
    const nextOrder = (showcased.at(-1)?.opportunityOrder ?? 0) + 1;
    setProjects((prev) =>
      prev?.map((p) =>
        p.id === project.id ? { ...p, showInOpportunities: true, opportunityOrder: nextOrder } : p
      ) ?? prev
    );
    try {
      await updateProject(project.id, { showInOpportunities: true, opportunityOrder: nextOrder });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Oportunidades</h1>
        <p className="mt-1 text-ms-gray-500">
          Controle quais empreendimentos aparecem como cards na aba &quot;Oportunidades&quot; do
          site e na home, em qual ordem, e quais estão em destaque. Cada card está sempre
          vinculado a um empreendimento existente — nada é duplicado aqui.
        </p>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ms-gray-500">
          Na vitrine ({showcased.length})
        </p>
        {showcased.length === 0 ? (
          <EmptyState title="Nenhum empreendimento na vitrine de Oportunidades" />
        ) : (
          <div className="space-y-3">
            {showcased.map((project, index) => (
              <Card key={project.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || busyId === project.id}
                    onClick={() => move(index, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-ms-gray-500 hover:bg-ms-black/[0.04] disabled:opacity-30"
                    title="Mover para cima"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    disabled={index === showcased.length - 1 || busyId === project.id}
                    onClick={() => move(index, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-ms-gray-500 hover:bg-ms-black/[0.04] disabled:opacity-30"
                    title="Mover para baixo"
                  >
                    <ArrowDown size={15} />
                  </button>
                </div>
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ms-gray-100">
                  <Image src={project.coverImage} alt={project.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-ms-black">{project.name}</p>
                    {project.active === false && (
                      <span className="rounded-full bg-ms-gray-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ms-gray-500">
                        Empreendimento inativo
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-1 text-sm text-ms-gray-500">{project.shortDescription}</p>
                  <p className="mt-0.5 text-xs text-ms-gray-500">
                    {project.city} · {project.state} · {formatCurrency(project.investmentMinimum)}
                    {project.targetReturn ? ` · ${project.targetReturn}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:shrink-0">
                  <ProjectStatusBadge status={project.status} />
                  <button
                    type="button"
                    title={project.featured ? "Remover destaque" : "Destacar na home"}
                    disabled={busyId === project.id}
                    onClick={() => toggleFeatured(project)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ms-gray-500 transition-colors hover:bg-ms-black/[0.04] disabled:opacity-40"
                  >
                    <Star size={16} className={project.featured ? "fill-ms-gold-700 text-ms-gold-700" : undefined} />
                  </button>
                  <button
                    type="button"
                    title="Remover da vitrine (não exclui o empreendimento)"
                    disabled={busyId === project.id}
                    onClick={() => removeFromShowcase(project)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ms-gray-500 transition-colors hover:bg-ms-black/[0.04] disabled:opacity-40"
                  >
                    <EyeOff size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {hidden.length > 0 && (
        <div className="mt-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ms-gray-500">
            Fora da vitrine ({hidden.length})
          </p>
          <div className="space-y-3">
            {hidden.map((project) => (
              <Card key={project.id} className="flex items-center gap-4 p-4 opacity-80">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-ms-gray-100">
                  <Image src={project.coverImage} alt={project.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ms-black">{project.name}</p>
                  <p className="text-sm text-ms-gray-500">{project.city} · {project.state}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === project.id}
                  onClick={() => addToShowcase(project)}
                >
                  <Plus size={14} /> Adicionar à vitrine
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 flex items-center gap-2 text-xs text-ms-gray-500">
        <Eye size={13} />
        Empreendimentos completos são gerenciados em{" "}
        <Link href="/admin/empreendimentos" className="underline hover:text-ms-black">Empreendimentos</Link>.
      </p>
    </div>
  );
}
