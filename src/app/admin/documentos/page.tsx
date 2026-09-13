"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText } from "lucide-react";
import { DocumentCard } from "@/components/domain/DocumentCard";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { DocumentUploadForm } from "./DocumentUploadForm";
import { getAllDocuments } from "@/lib/data/documents";
import type { DocumentItem } from "@/types";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    getAllDocuments()
      .then((docs) => {
        setError(false);
        setDocuments(docs);
      })
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Documentos</h1>
      <p className="mt-1 text-ms-gray-500">Envie e gerencie documentos vinculados a empreendimentos ou investidores.</p>

      <div className="mt-8">
        <DocumentUploadForm onCreated={load} />
      </div>

      <div className="mt-8">
        {documents === null ? (
          error ? <ErrorState /> : <LoadingState />
        ) : documents.length === 0 ? (
          <EmptyState icon={<FileText size={20} />} title="Nenhum documento enviado ainda" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
