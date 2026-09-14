import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Building2, CalendarDays, Layers } from "lucide-react";
import { ProjectStatusBadge, DemoBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MetricCard } from "@/components/domain/MetricCard";
import { DocumentCard } from "@/components/domain/DocumentCard";
import { InvestButton } from "@/components/domain/InvestButton";
import { EmptyState } from "@/components/ui/States";
import { LegalDisclaimer } from "@/components/layout/LegalDisclaimer";
import { getProjectBySlug, getProjects } from "@/lib/data/projects";
import { getProjectDocuments } from "@/lib/data/documents";
import { formatCurrency } from "@/lib/utils/format";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

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

  return (
    <div>
      {/* HERO */}
      <section className="grain relative overflow-hidden bg-ms-black text-white">
        <div className="absolute inset-0">
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ms-black via-ms-black/55 to-ms-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-ms-black/40 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
          <div className="flex flex-wrap items-center gap-2">
            <ProjectStatusBadge status={project.status} />
            {project.isDemo && <DemoBadge />}
          </div>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
            {project.name}
          </h1>
          <div className="mt-4 flex items-center gap-1.5 text-white/70">
            <MapPin size={16} />
            <span>{project.location}, {project.city} · {project.state}</span>
          </div>
        </div>
      </section>

      {/* RESUMO */}
      <section className="border-b border-ms-black/[0.06] bg-ms-gray-100/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 sm:px-8 md:grid-cols-4">
          <div>
            <p className="text-xs text-ms-gray-500">Localização</p>
            <p className="mt-1 font-medium text-ms-black">{project.city} · {project.state}</p>
          </div>
          <div>
            <p className="text-xs text-ms-gray-500">Área total</p>
            <p className="mt-1 font-medium text-ms-black">{project.totalArea}</p>
          </div>
          <div>
            <p className="text-xs text-ms-gray-500">Previsão de entrega</p>
            <p className="mt-1 font-medium text-ms-black">{project.expectedDelivery}</p>
          </div>
          <div>
            <p className="text-xs text-ms-gray-500">Investimento a partir de</p>
            <p className="mt-1 font-medium text-ms-black">{formatCurrency(project.investmentMinimum)}</p>
          </div>
        </div>
      </section>

      {/* O PROJETO */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-gold-900">
              O projeto
            </span>
            <h2 className="mt-3 font-display text-2xl text-ms-black sm:text-3xl">
              Uma visão de longo prazo para {project.name}
            </h2>
            <p className="mt-5 whitespace-pre-line leading-relaxed text-ms-gray-500">
              {project.description}
            </p>
          </div>
          <div className="flex flex-col justify-between rounded-2xl border border-ms-black/[0.06] bg-ms-gray-100/60 p-6">
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Building2 size={16} className="text-ms-gold-900" />
                <span className="text-ms-gray-500">Tipo de investimento: <span className="font-medium text-ms-black capitalize">{project.investmentType}</span></span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-ms-gold-900" />
                <span className="text-ms-gray-500">Entrega prevista: <span className="font-medium text-ms-black">{project.expectedDelivery}</span></span>
              </div>
              {project.availableUnits && (
                <div className="flex items-center gap-3">
                  <Layers size={16} className="text-ms-gold-900" />
                  <span className="text-ms-gray-500">Unidades disponíveis: <span className="font-medium text-ms-black">{project.availableUnits}</span></span>
                </div>
              )}
            </div>
            <div className="mt-6">
              <InvestButton project={project} size="md" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE */}
      {project.highlights && project.highlights.length > 0 && (
        <section className="bg-ms-gray-100/60 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-gold-900">
              Por que {project.name}?
            </span>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {project.highlights.map((h) => (
                <div key={h.title} className="rounded-2xl border border-ms-black/[0.06] bg-white p-6">
                  <h3 className="font-display text-lg uppercase tracking-wide text-ms-black">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ms-gray-500">{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DADOS */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-gold-900">
          Dados do empreendimento
        </span>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Área total" value={project.totalArea} />
          <MetricCard label="Mínimo de investimento" value={formatCurrency(project.investmentMinimum)} />
          <MetricCard
            label="Retorno projetado"
            value={project.projectedReturn ?? "—"}
            hint="Projeção/simulação — não constitui garantia"
          />
          <MetricCard label="Progresso da obra" value={`${project.constructionProgress}%`} />
        </div>

        {/* PROGRESSO */}
        <div className="mt-10 rounded-2xl border border-ms-black/[0.06] p-6">
          <ProgressBar value={project.constructionProgress} label="Progresso da obra" />
        </div>
      </section>

      {/* GALERIA */}
      {project.gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-gold-900">
            Galeria
          </span>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ms-gray-100">
                <Image
                  src={src}
                  alt={`${project.name} — imagem ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 570px, 100vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DOCUMENTOS */}
      <section className="bg-ms-gray-100/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-gold-900">
            Documentos
          </span>
          <div className="mt-8">
            {documents.length === 0 ? (
              <EmptyState title="Nenhum documento público disponível" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {documents.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="grain relative overflow-hidden bg-ms-black py-20 text-center text-white sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-skyline opacity-35" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,13,12,0.85) 0%, rgba(11,13,12,0.55) 45%, rgba(11,13,12,0.95) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl px-5 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Quero investir
          </span>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl sm:text-4xl">
            Pronto para investir no {project.name}?
          </h2>
          <div className="mt-9 flex justify-center">
            <InvestButton project={project} />
          </div>
          <LegalDisclaimer className="mx-auto mt-12 max-w-2xl text-white/40" />
        </div>
      </section>
    </div>
  );
}
