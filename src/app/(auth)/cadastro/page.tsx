import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Criar conta" };

export default function CadastroPage() {
  return (
    <AuthShell
      imageSrc="/projects/ms-tower/terraco-gourmet.jpg"
      imageAlt="Terraço com vista para a Baía Sul, Florianópolis"
      quote="Seu patrimônio merece um acompanhamento à altura das suas decisões."
    >
      <SignupForm />
    </AuthShell>
  );
}
