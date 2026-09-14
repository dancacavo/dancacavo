import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Building2, Users } from "lucide-react";
import { LegalDisclaimer } from "@/components/layout/LegalDisclaimer";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a MS Investor e o papel da plataforma parceira SONICA no processo de investimento.",
};

export default function SobrePage() {
  return (
    <div>
      {/* HERO — foto institucional do Grupo Marques Silveira */}
      <section className="grain relative overflow-hidden bg-ms-black text-white">
        <Image
          src="/brand/grupo-marques-silveira.jpg"
          alt="Grupo Marques Silveira"
          fill
          priority
          className="object-cover object-bottom opacity-40"
        />
        <div className="absolute inset-0 bg-ms-black/70" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center sm:px-8 sm:py-36">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Sobre</span>
          <h1 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
            Relacionamento e transparência entre investidores e empreendimentos.
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="leading-relaxed text-ms-gray-500">
          O MS Investor nasceu para simplificar o relacionamento entre investidores
          e empreendimentos imobiliários. Nossa plataforma organiza informações,
          documentos e atualizações de cada projeto em um único ambiente digital,
          para que você acompanhe seu investimento com clareza, do início à entrega.
        </p>
        <p className="mt-4 leading-relaxed text-ms-gray-500">
          A MS Investor apresenta oportunidades, qualifica e orienta investidores
          e disponibiliza acompanhamento contínuo. O processo de investimento em
          si — regulado e operacional — é realizado pela nossa plataforma parceira,
          a <strong className="font-medium text-ms-black">SONICA</strong>, responsável
          pela execução da operação.
        </p>
        <p className="mt-4 leading-relaxed text-ms-gray-500">
          Os empreendimentos apresentados na plataforma são desenvolvidos pelo{" "}
          <strong className="font-medium text-ms-black">Grupo Marques Silveira</strong>,
          incorporadora responsável pelo projeto, execução e entrega das obras.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {[
            { icon: Building2, title: "Curadoria de projetos", description: "Empreendimentos do Grupo Marques Silveira, selecionados com critério e transparência." },
            { icon: ShieldCheck, title: "Parceiro regulado", description: "Operação de investimento conduzida pela plataforma parceira SONICA." },
            { icon: Users, title: "Foco no investidor", description: "Acompanhamento, documentos e comunicação centralizados." },
          ].map((item) => (
            <div key={item.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ms-gold-900/[0.08] text-ms-gold-900">
                <item.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg text-ms-black">{item.title}</h3>
              <p className="mt-1.5 text-sm text-ms-gray-500">{item.description}</p>
            </div>
          ))}
        </div>

        <LegalDisclaimer className="mt-16 border-t border-ms-black/[0.06] pt-8" />
      </div>
    </div>
  );
}
