"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { DemoModeNotice } from "@/components/domain/DemoModeNotice";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createDocumentRecord } from "@/lib/data/documents";
import { uploadFile } from "@/lib/firebase/storage";
import { getProjects } from "@/lib/data/projects";
import { getAllInvestors } from "@/lib/data/users";
import type { DocumentCategory, Project, UserProfile } from "@/types";

const CATEGORY_OPTIONS: { value: DocumentCategory; label: string }[] = [
  { value: "contratos", label: "Contratos" },
  { value: "informacoes", label: "Informações do empreendimento" },
  { value: "relatorios", label: "Relatórios" },
  { value: "comunicados", label: "Comunicados" },
  { value: "outros", label: "Outros" },
];

const inputClass =
  "h-11 w-full rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-green-900 disabled:opacity-50";

export function DocumentUploadForm({ onCreated }: { onCreated?: () => void }) {
  const { isDemoMode } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [investors, setInvestors] = useState<UserProfile[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("informacoes");
  const [projectId, setProjectId] = useState("");
  const [userId, setUserId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects().then(setProjects).catch(() => {});
    getAllInvestors().then(setInvestors).catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file && !isDemoMode) {
      setError("Selecione um arquivo.");
      return;
    }
    setSaving(true);
    try {
      let fileUrl = "#";
      if (file) {
        fileUrl = await uploadFile(`documents/${Date.now()}-${file.name}`, file);
      }
      await createDocumentRecord({
        title,
        category,
        projectId: projectId || undefined,
        userId: userId || undefined,
        fileUrl,
        fileType: file?.type.includes("pdf") ? "PDF" : file?.type || "Arquivo",
      });
      setTitle("");
      setFile(null);
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar o documento.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-ms-black/[0.06] p-6">
      {isDemoMode && <DemoModeNotice />}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">Título</label>
        <input required className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} disabled={isDemoMode} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">Categoria</label>
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as DocumentCategory)} disabled={isDemoMode}>
            {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">Empreendimento (opcional)</label>
          <select className={inputClass} value={projectId} onChange={(e) => setProjectId(e.target.value)} disabled={isDemoMode}>
            <option value="">—</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">
            Investidor específico (opcional — deixe vazio para documento público do empreendimento)
          </label>
          <select className={inputClass} value={userId} onChange={(e) => setUserId(e.target.value)} disabled={isDemoMode}>
            <option value="">—</option>
            {investors.map((u) => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">Arquivo</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={isDemoMode}
          className="block w-full text-sm text-ms-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-ms-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" size="sm" disabled={saving || isDemoMode}>
        {saving ? "Enviando…" : "Adicionar documento"}
      </Button>
    </form>
  );
}
