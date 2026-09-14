"use client";

import { useState } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { track } from "@/lib/analytics/events";
import { SONICA_INVESTMENT_URL } from "@/lib/firebase/config";
import type { Project } from "@/types";

/**
 * Botão "Investir": a plataforma MS Investor não executa a operação de
 * investimento. Ao confirmar, o usuário é redirecionado à plataforma
 * parceira SONICA, responsável pelo processo regulado de investimento.
 * O link é configurável (NEXT_PUBLIC_SONICA_INVESTMENT_URL, ou por
 * empreendimento via `project.investmentUrl`) — nunca hardcoded na UI.
 */
export function InvestButton({
  project,
  className,
  size = "lg",
  label,
}: {
  project: Project;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const destination = project.investmentUrl || SONICA_INVESTMENT_URL;

  const handleOpen = () => {
    track("investment_cta_click", { projectId: project.id });
    setOpen(true);
  };

  const handleContinue = () => {
    track("external_investment_redirect", { projectId: project.id });
    window.open(destination, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <>
      <Button size={size} className={className} onClick={handleOpen}>
        {label ?? `INVESTIR NO ${project.name.toUpperCase()}`}
        <ArrowUpRight size={18} />
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Você está saindo do MS Investor">
        <div className="flex items-start gap-3 rounded-xl bg-ms-gray-100 p-4">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-ms-gold-900" />
          <p className="text-sm text-ms-gray-500">
            Você será direcionado à{" "}
            <span className="font-medium text-ms-black">plataforma parceira SONICA</span>,
            responsável pelo processo regulado de investimento em {project.name}. O
            MS Investor apresenta informações e acompanhamento, mas não realiza a
            operação de investimento.
          </p>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleContinue}>
            Continuar para investir
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </Modal>
    </>
  );
}
