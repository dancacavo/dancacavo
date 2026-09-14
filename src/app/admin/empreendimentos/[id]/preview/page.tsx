import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { ProjectDetailView } from "@/components/domain/ProjectDetailView";
import { getProjectById } from "@/lib/data/projects";
import { getProjectDocuments } from "@/lib/data/documents";

/**
 * Prévia administrativa: renderiza a mesma página que o investidor verá,
 * mesmo que o empreendimento ainda esteja inativo/despublicado — por isso
 * usa `getProjectById` (sem filtro de visibilidade), diferente da rota
 * pública que usa `getProjectBySlug` (só ativos).
 */
export default async function AdminProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const documents = await getProjectDocuments(project.id);

  return (
    <div className="-mx-5 -my-8 sm:-mx-10 sm:-my-10">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
          <Eye size={16} />
          Prévia — assim a página aparecerá para o investidor
          {project.active === false && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
              Ainda inativo, não visível publicamente
            </span>
          )}
        </div>
        <Link
          href={`/admin/empreendimentos/${project.id}`}
          className="flex items-center gap-1.5 text-sm font-medium text-amber-800 hover:underline"
        >
          <ArrowLeft size={15} />
          Voltar para edição
        </Link>
      </div>
      <ProjectDetailView project={project} documents={documents} />
    </div>
  );
}
