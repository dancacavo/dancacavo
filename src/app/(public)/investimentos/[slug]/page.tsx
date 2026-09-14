import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/components/domain/ProjectDetailView";
import { getProjectBySlug } from "@/lib/data/projects";
import { getProjectDocuments } from "@/lib/data/documents";

// Sem generateStaticParams: a página é sempre renderizada por acesso (nunca
// pré-gerada em build), para que um empreendimento novo/editado no /admin
// apareça imediatamente e o Firestore nunca seja consultado durante o build
// (onde o ambiente de rede é mais restrito).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Empreendimento" };
  return {
    title: project.name,
    description: project.shortDescription,
    openGraph: {
      title: project.name,
      description: project.shortDescription,
      images: [{ url: project.coverImage }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const documents = await getProjectDocuments(project.id);

  return <ProjectDetailView project={project} documents={documents} />;
}
