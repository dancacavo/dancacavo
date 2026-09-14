import type { Metadata } from "next";
import { ProjectCard } from "@/components/domain/ProjectCard";
import { EmptyState } from "@/components/ui/States";
import { getProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Investimentos",
  description:
    "Conheça os empreendimentos imobiliários selecionados disponíveis para acompanhamento e investimento.",
};

export default async function InvestimentosPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="max-w-xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-gold-900">
          Investimentos
        </span>
        <h1 className="mt-3 font-display text-3xl text-ms-black sm:text-4xl">
          Oportunidades imobiliárias selecionadas.
        </h1>
        <p className="mt-4 text-ms-gray-500">
          Cada empreendimento passa por curadoria antes de ser apresentado na
          plataforma. Explore os detalhes e, quando desejar, inicie o
          processo de investimento junto à plataforma parceira.
        </p>
      </div>

      <div className="mt-12">
        {projects.length === 0 ? (
          <EmptyState
            title="Nenhum empreendimento disponível no momento"
            description="Novas oportunidades serão publicadas em breve."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
