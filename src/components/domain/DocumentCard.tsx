"use client";

import { Download, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils/format";
import { track } from "@/lib/analytics/events";
import type { DocumentItem } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  contratos: "Contrato",
  informacoes: "Informações do empreendimento",
  relatorios: "Relatório",
  comunicados: "Comunicado",
  outros: "Outro",
};

export function DocumentCard({ document }: { document: DocumentItem }) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ms-gold-900/[0.08] text-ms-gold-900">
        <FileText size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ms-black">{document.title}</p>
        <p className="mt-0.5 text-xs text-ms-gray-500">
          {CATEGORY_LABELS[document.category]} · {formatDate(document.createdAt)}
          {document.sizeLabel ? ` · ${document.sizeLabel}` : ""}
        </p>
      </div>
      <a
        href={document.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("document_download", { documentId: document.id })}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ms-gray-500 transition-colors hover:bg-ms-black/[0.05] hover:text-ms-black"
        aria-label={`Baixar ${document.title}`}
      >
        <Download size={17} />
      </a>
    </Card>
  );
}
