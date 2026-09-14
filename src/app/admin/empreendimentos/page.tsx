"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Eye, Pencil, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { ProjectStatusBadge, DemoBadge } from "@/components/ui/StatusBadge";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { getProjects, setProjectActive, deleteProject } from "@/lib/data/projects";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Project } from "@/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState(false);
  const [toDelete, setToDelete] = useState<Project | null>(null);
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

  const handleToggleActive = async (project: Project) => {
    setBusyId(project.id);
    const nextActive = !(project.active !== false);
    setProjects((prev) => prev?.map((p) => (p.id === project.id ? { ...p, active: nextActive } : p)) ?? prev);
    try {
      await setProjectActive(project.id, nextActive);
    } catch {
      // reverte em caso de falha
      setProjects((prev) => prev?.map((p) => (p.id === project.id ? { ...p, active: project.active } : p)) ?? prev);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setBusyId(toDelete.id);
    try {
      await deleteProject(toDelete.id);
      setProjects((prev) => prev?.filter((p) => p.id !== toDelete.id) ?? prev);
      setToDelete(null);
    } catch {
      // mantém o item na lista se a exclusão falhar
    } finally {
      setBusyId(null);
    }
  };

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
            {projects.map((project) => {
              const active = project.active !== false;
              return (
                <Card key={project.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <Link href={`/admin/empreendimentos/${project.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ms-gray-100">
                      <Image src={project.coverImage} alt={project.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-ms-black">{project.name}</p>
                        {project.isDemo && <DemoBadge />}
                        {!active && (
                          <span className="rounded-full bg-ms-gray-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ms-gray-500">
                            Inativo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ms-gray-500">{project.city} · {project.state}</p>
                      <p className="mt-0.5 text-xs text-ms-gray-500">
                        Criado em {formatDate(project.createdAt)} · Atualizado em {formatDate(project.updatedAt)}
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3 sm:shrink-0">
                    <div className="hidden text-sm text-ms-gray-500 sm:block">
                      {formatCurrency(project.investmentMinimum)}
                    </div>
                    <ProjectStatusBadge status={project.status} />
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/empreendimentos/${project.id}/preview`}
                        title="Visualizar prévia"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-ms-gray-500 transition-colors hover:bg-ms-black/[0.04] hover:text-ms-black"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/empreendimentos/${project.id}`}
                        title="Editar"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-ms-gray-500 transition-colors hover:bg-ms-black/[0.04] hover:text-ms-black"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        title={active ? "Desativar" : "Ativar"}
                        disabled={busyId === project.id}
                        onClick={() => handleToggleActive(project)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-ms-gray-500 transition-colors hover:bg-ms-black/[0.04] hover:text-ms-black disabled:opacity-40"
                      >
                        <Power size={16} className={active ? "text-emerald-600" : undefined} />
                      </button>
                      <button
                        type="button"
                        title="Excluir"
                        disabled={busyId === project.id}
                        onClick={() => setToDelete(project)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-ms-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Excluir empreendimento">
        <p className="text-sm text-ms-gray-500">
          Tem certeza de que deseja excluir <span className="font-medium text-ms-black">{toDelete?.name}</span>?
          Essa ação não pode ser desfeita e o empreendimento deixará de aparecer em qualquer lugar da plataforma.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setToDelete(null)}>
            Cancelar
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={busyId === toDelete?.id}
            onClick={handleDelete}
          >
            {busyId === toDelete?.id ? "Excluindo…" : "Excluir definitivamente"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
