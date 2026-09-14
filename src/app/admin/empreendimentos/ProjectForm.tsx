"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { DemoModeNotice } from "@/components/domain/DemoModeNotice";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createProject, updateProject, type ProjectInput } from "@/lib/data/projects";
import type { Project, ProjectStatus, InvestmentType } from "@/types";

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "em_breve", label: "Em breve" },
  { value: "captacao", label: "Captação em andamento" },
  { value: "em_construcao", label: "Em construção" },
  { value: "concluido", label: "Concluído" },
  { value: "encerrado", label: "Encerrado" },
];

const TYPE_OPTIONS: { value: InvestmentType; label: string }[] = [
  { value: "equity", label: "Equity" },
  { value: "divida", label: "Dívida" },
  { value: "hibrido", label: "Híbrido" },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-gold-900 disabled:opacity-50";
const textareaClass =
  "w-full rounded-xl border border-ms-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-ms-gold-900 disabled:opacity-50";

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const { isDemoMode } = useAuth();
  const isEditing = Boolean(project);

  const [form, setForm] = useState({
    name: project?.name ?? "",
    slug: project?.slug ?? "",
    shortDescription: project?.shortDescription ?? "",
    description: project?.description ?? "",
    location: project?.location ?? "",
    city: project?.city ?? "",
    state: project?.state ?? "",
    status: project?.status ?? "captacao",
    coverImage: project?.coverImage ?? "",
    gallery: project?.gallery?.join(", ") ?? "",
    expectedDelivery: project?.expectedDelivery ?? "",
    totalArea: project?.totalArea ?? "",
    availableUnits: project?.availableUnits?.toString() ?? "",
    investmentMinimum: project?.investmentMinimum?.toString() ?? "",
    investmentType: project?.investmentType ?? "equity",
    targetReturn: project?.targetReturn ?? "",
    projectedReturn: project?.projectedReturn ?? "",
    constructionProgress: project?.constructionProgress?.toString() ?? "0",
    featured: project?.featured ?? false,
    investmentUrl: project?.investmentUrl ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const input: ProjectInput = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        shortDescription: form.shortDescription,
        description: form.description,
        location: form.location,
        city: form.city,
        state: form.state,
        status: form.status,
        coverImage: form.coverImage || "/projects/placeholder/cover.svg",
        gallery: form.gallery
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        expectedDelivery: form.expectedDelivery,
        totalArea: form.totalArea,
        availableUnits: form.availableUnits ? Number(form.availableUnits) : undefined,
        investmentMinimum: Number(form.investmentMinimum) || 0,
        investmentType: form.investmentType,
        targetReturn: form.targetReturn || undefined,
        projectedReturn: form.projectedReturn || undefined,
        constructionProgress: Number(form.constructionProgress) || 0,
        featured: form.featured,
        investmentUrl: form.investmentUrl || undefined,
      };

      if (isEditing && project) {
        await updateProject(project.id, input);
      } else {
        await createProject(input);
      }
      router.push("/admin/empreendimentos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isDemoMode && <DemoModeNotice />}

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome">
          <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} required disabled={isDemoMode} />
        </Field>
        <Field label="Slug (URL)">
          <input className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="ms-tower" disabled={isDemoMode} />
        </Field>
        <Field label="Cidade">
          <input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} disabled={isDemoMode} />
        </Field>
        <Field label="Estado (UF)">
          <input className={inputClass} value={form.state} onChange={(e) => set("state", e.target.value)} disabled={isDemoMode} />
        </Field>
        <Field label="Endereço/localização">
          <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} disabled={isDemoMode} />
        </Field>
        <Field label="Status">
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => set("status", e.target.value as ProjectStatus)}
            disabled={isDemoMode}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
      </section>

      <section className="space-y-4">
        <Field label="Descrição curta">
          <input className={inputClass} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} disabled={isDemoMode} />
        </Field>
        <Field label="Descrição completa">
          <textarea rows={5} className={textareaClass} value={form.description} onChange={(e) => set("description", e.target.value)} disabled={isDemoMode} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Imagem de capa (URL)">
          <input className={inputClass} value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="/projects/.../cover.svg" disabled={isDemoMode} />
        </Field>
        <Field label="Galeria (URLs separadas por vírgula)">
          <input className={inputClass} value={form.gallery} onChange={(e) => set("gallery", e.target.value)} disabled={isDemoMode} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Field label="Área total">
          <input className={inputClass} value={form.totalArea} onChange={(e) => set("totalArea", e.target.value)} placeholder="18.500 m²" disabled={isDemoMode} />
        </Field>
        <Field label="Previsão de entrega">
          <input className={inputClass} value={form.expectedDelivery} onChange={(e) => set("expectedDelivery", e.target.value)} placeholder="4º trim. 2028" disabled={isDemoMode} />
        </Field>
        <Field label="Unidades disponíveis">
          <input type="number" className={inputClass} value={form.availableUnits} onChange={(e) => set("availableUnits", e.target.value)} disabled={isDemoMode} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Field label="Investimento mínimo (R$)">
          <input type="number" className={inputClass} value={form.investmentMinimum} onChange={(e) => set("investmentMinimum", e.target.value)} disabled={isDemoMode} />
        </Field>
        <Field label="Tipo de investimento">
          <select className={inputClass} value={form.investmentType} onChange={(e) => set("investmentType", e.target.value as InvestmentType)} disabled={isDemoMode}>
            {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Progresso da obra (%)">
          <input type="number" min={0} max={100} className={inputClass} value={form.constructionProgress} onChange={(e) => set("constructionProgress", e.target.value)} disabled={isDemoMode} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Meta de retorno (texto/projeção)">
          <input className={inputClass} value={form.targetReturn} onChange={(e) => set("targetReturn", e.target.value)} placeholder="Projeção — não garante rentabilidade" disabled={isDemoMode} />
        </Field>
        <Field label="Retorno projetado (texto)">
          <input className={inputClass} value={form.projectedReturn} onChange={(e) => set("projectedReturn", e.target.value)} disabled={isDemoMode} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Link de investimento (SONICA) — opcional, sobrepõe o padrão">
          <input className={inputClass} value={form.investmentUrl} onChange={(e) => set("investmentUrl", e.target.value)} placeholder="https://sonica.example.com/..." disabled={isDemoMode} />
        </Field>
        <label className="flex items-center gap-2.5 pt-6 text-sm text-ms-black">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} disabled={isDemoMode} className="h-4 w-4 rounded border-ms-black/20" />
          Destacar na página inicial
        </label>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || isDemoMode}>
          {saving ? "Salvando…" : isEditing ? "Salvar alterações" : "Criar empreendimento"}
        </Button>
      </div>
    </form>
  );
}
