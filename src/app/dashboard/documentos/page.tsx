"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { DocumentCard } from "@/components/domain/DocumentCard";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getUserDocuments } from "@/lib/data/documents";
import type { DocumentItem, DocumentCategory } from "@/types";

const CATEGORY_ORDER: DocumentCategory[] = [
  "contratos",
  "informacoes",
  "relatorios",
  "comunicados",
  "outros",
];

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  contratos: "Contratos",
  informacoes: "Informações do empreendimento",
  relatorios: "Relatórios",
  comunicados: "Comunicados",
  outros: "Outros",
};

export default function DocumentosPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[] | null>(null);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!user) return; // sem sessão (ex.: modo demonstração): nada a buscar
    let cancelled = false;
    getUserDocuments(user.uid)
      .then((docs) => !cancelled && setDocuments(docs))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [user, retryKey]);

  const resolvedDocuments = user ? documents : [];

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Documentos</h1>
      <p className="mt-1 text-ms-gray-500">
        Contratos, relatórios e comunicados vinculados aos seus investimentos.
      </p>

      <div className="mt-8">
        {resolvedDocuments === null ? (
          error ? (
            <ErrorState onRetry={() => { setError(false); setRetryKey((k) => k + 1); }} />
          ) : (
            <LoadingState />
          )
        ) : resolvedDocuments.length === 0 ? (
          <EmptyState
            icon={<FileText size={20} />}
            title="Nenhum documento disponível"
            description="Assim que houver documentos vinculados à sua conta, eles aparecerão aqui."
          />
        ) : (
          <div className="space-y-8">
            {CATEGORY_ORDER.map((category) => {
              const items = resolvedDocuments.filter((d) => d.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-ms-gray-500">
                    {CATEGORY_LABELS[category]}
                  </h2>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    {items.map((doc) => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
