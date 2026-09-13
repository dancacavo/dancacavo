"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { Megaphone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { DemoModeNotice } from "@/components/domain/DemoModeNotice";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getAnnouncements, createAnnouncement } from "@/lib/data/announcements";
import { getProjects } from "@/lib/data/projects";
import { formatDate } from "@/lib/utils/format";
import type { Announcement, Project } from "@/types";

const inputClass =
  "h-11 w-full rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-green-900 disabled:opacity-50";
const textareaClass =
  "w-full rounded-xl border border-ms-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-ms-green-900 disabled:opacity-50";

export default function ComunicadosPage() {
  const { isDemoMode } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Announcement["audience"]>("todos");
  const [projectId, setProjectId] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    getAnnouncements()
      .then((data) => {
        setError(false);
        setAnnouncements(data);
      })
      .catch(() => setError(true));
    getProjects().then(setProjects).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAnnouncement({
        title,
        message,
        audience,
        projectId: audience === "projeto" ? projectId || undefined : undefined,
      });
      setTitle("");
      setMessage("");
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Comunicados</h1>
      <p className="mt-1 text-ms-gray-500">Publique atualizações para os investidores.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-ms-black/[0.06] p-6">
        {isDemoMode && <DemoModeNotice />}
        <input required placeholder="Título" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} disabled={isDemoMode} />
        <textarea required rows={4} placeholder="Mensagem" className={textareaClass} value={message} onChange={(e) => setMessage(e.target.value)} disabled={isDemoMode} />
        <div className="grid gap-4 sm:grid-cols-2">
          <select className={inputClass} value={audience} onChange={(e) => setAudience(e.target.value as Announcement["audience"])} disabled={isDemoMode}>
            <option value="todos">Todos</option>
            <option value="investidores">Investidores</option>
            <option value="projeto">Investidores de um empreendimento</option>
          </select>
          {audience === "projeto" && (
            <select className={inputClass} value={projectId} onChange={(e) => setProjectId(e.target.value)} disabled={isDemoMode}>
              <option value="">Selecione o empreendimento</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
        </div>
        <Button type="submit" size="sm" disabled={saving || isDemoMode}>
          {saving ? "Publicando…" : "Publicar comunicado"}
        </Button>
      </form>

      <div className="mt-8">
        {announcements === null ? (
          error ? <ErrorState /> : <LoadingState />
        ) : announcements.length === 0 ? (
          <EmptyState icon={<Megaphone size={20} />} title="Nenhum comunicado publicado ainda" />
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <Card key={a.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ms-black">{a.title}</p>
                  <span className="text-xs text-ms-gray-500">{formatDate(a.publishedAt)}</span>
                </div>
                <p className="mt-1 text-sm text-ms-gray-500">{a.message}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
