import { notFound } from "next/navigation";
import { ProjectForm } from "../ProjectForm";
import { getProjectById } from "@/lib/data/projects";

export default async function EditarEmpreendimentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">{project.name}</h1>
      <p className="mt-1 text-ms-gray-500">Edite as informações do empreendimento.</p>
      <div className="mt-8 max-w-3xl">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
