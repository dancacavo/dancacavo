"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InvestmentStatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DocumentCard } from "@/components/domain/DocumentCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getInvestmentById } from "@/lib/data/investments";
import { getProjectById } from "@/lib/data/projects";
import { getUserDocuments } from "@/lib/data/documents";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Investment, Project, DocumentItem } from "@/types";

export function InvestmentDetail({ id }: { id: string }) {
  const { user } = useAuth();
  const [state, setState] = useState<{
    investment: Investment | null;
    project: Project | null;
    documents: DocumentItem[];
  } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const investment = await getInvestmentById(id);
        if (!investment || investment.userId !== user.uid) {
          if (!cancelled) setState({ investment: null, project: null, documents: [] });
          return;
        }
        const [project, allDocs] = await Promise.all([
          getProjectById(investment.projectId),
          getUserDocuments(user.uid),
        ]);
        if (!cancelled) {
          setState({
            investment,
            project,
            documents: allDocs.filter((d) => d.projectId === investment.projectId),
          });
        }
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  if (error) return <ErrorState />;
  if (!state) return <LoadingState label="Carregando investimento…" />;
  if (!state.investment) {
    return (
      <EmptyState
        title="Investimento não encontrado"
        description="Verifique o link acessado ou volte para seus investimentos."
      />
    );
  }

  const { investment, project, documents } = state;

  return (
    <div>
      <Link href="/dashboard/investimentos" className="inline-flex items-center gap-1.5 text-sm text-ms-gray-500 hover:text-ms-black">
        <ArrowLeft size={15} /> Meus investimentos
      </Link>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-ms-gray-100">
          {project?.coverImage && (
            <Image src={project.coverImage} alt={project.name} fill className="object-cover" sizes="96px" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl text-ms-black sm:text-3xl">
              {project?.name ?? "Empreendimento"}
            </h1>
            <InvestmentStatusBadge status={investment.status} />
          </div>
          <p className="mt-1 text-sm text-ms-gray-500">
            Investido em {formatDate(investment.investedAt)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-ms-black/[0.06] p-6">
          <p className="text-xs text-ms-gray-500">Valor investido</p>
          <p className="mt-1 font-display text-2xl text-ms-black">
            {formatCurrency(investment.amount)}
          </p>
        </div>
        {project && (
          <div className="rounded-2xl border border-ms-black/[0.06] p-6">
            <ProgressBar value={project.constructionProgress} label="Progresso da obra" />
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg text-ms-black">Documentos</h2>
        <div className="mt-4">
          {documents.length === 0 ? (
            <EmptyState title="Nenhum documento vinculado a este investimento" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {documents.map((d) => (
                <DocumentCard key={d.id} document={d} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
