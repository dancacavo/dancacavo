import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <AuthShell
      imageSrc="/projects/ms-tower/hall-vista.jpg"
      imageAlt="Vista da Baía Sul, Florianópolis"
      quote="Investir com visão de longo prazo é, antes de tudo, uma questão de acompanhamento."
    >
      <LoginForm />
    </AuthShell>
  );
}
