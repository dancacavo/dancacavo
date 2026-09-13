"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProjectStatusBadge, DemoBadge } from "@/components/ui/StatusBadge";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { getProjects } from "@/lib/data/projects";
import { formatCurrency } from "@/lib/utils/format";
import type { Project } from "@/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProjects()
      .then((data) => !cancelled && setProjects(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Empreendimentos</h1>
          <p className="mt-1 text-ms-gray-500">Gerencie os empreendimentos publicados na plataforma.</p>
        </div>
        <Button href="/admin/empreendimentos/novo" size="sm">
          <Plus size={16} /> Novo
        </Button>
      </div>

      <div className="mt-8">
        {projects === null ? (
          error ? <ErrorState /> : <LoadingState />
        ) : projects.length === 0 ? (
          <EmptyState title="Nenhum empreendimento cadastrado" action={<Button href="/admin/empreendimentos/novo">Criar empreendimento</Button>} />
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/admin/empreendimentos/${project.id}`}>
                <Card className="flex items-center gap-4 p-4 hover:shadow-[0_12px_32px_rgba(11,13,12,0.08)]">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ms-gray-100">
                    <Image src={project.coverImage} alt={project.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ms-black">{project.name}</p>
                      {project.isDemo && <DemoBadge />}
                    </div>
                    <p className="text-sm text-ms-gray-500">{project.city} · {project.state}</p>
                  </div>
                  <div className="hidden text-sm text-ms-gray-500 sm:block">
                    {formatCurrency(project.investmentMinimum)}
                  </div>
                  <ProjectStatusBadge status={project.status} />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
