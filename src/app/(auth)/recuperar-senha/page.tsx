import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function RecuperarSenhaPage() {
  return (
    <AuthShell
      imageSrc="/projects/ms-tower/hall-recepcao.jpg"
      imageAlt="Hall com vista para a Baía Sul, Florianópolis"
      quote="Transparência é acompanhar cada etapa com clareza — inclusive o acesso à sua conta."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
