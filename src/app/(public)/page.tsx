import { ArrowUpRight, LineChart, ShieldCheck, FileStack, LayoutGrid, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/domain/ProjectCard";
import { LegalDisclaimer } from "@/components/layout/LegalDisclaimer";
import { getFeaturedProjects } from "@/lib/data/projects";

const STEPS = [
  {
    number: "01",
    title: "Conheça",
    description: "Explore oportunidades imobiliárias selecionadas, com informações claras e organizadas.",
  },
  {
    number: "02",
    title: "Invista",
    description: "Quando desejar investir, você será direcionado à plataforma parceira responsável pela operação.",
  },
  {
    number: "03",
    title: "Acompanhe",
    description: "Tenha acesso às informações, documentos e atualizações do seu investimento em um único lugar.",
  },
];

const BENEFITS = [
  { icon: ShieldCheck, title: "Transparência", description: "Informações organizadas sobre cada empreendimento, sem ruído." },
  { icon: LineChart, title: "Acompanhamento", description: "Evolução da obra e do seu investimento em tempo real." },
  { icon: FileStack, title: "Informação", description: "Documentos e comunicados centralizados e sempre acessíveis." },
  { icon: LayoutGrid, title: "Organização", description: "Todos os seus investimentos reunidos em um só painel." },
  { icon: Smartphone, title: "Acesso digital", description: "Uma experiência pensada para o seu dia a dia, em qualquer dispositivo." },
];

export default async function LandingPage() {
  const featured = await getFeaturedProjects();

  return (
    <>
      {/* HERO */}
      <section className="grain relative overflow-hidden bg-ms-black text-white">
        {/* ilustração de skyline autoral, em baixa opacidade + desfoque, só para dar profundidade */}
        <div
          className="pointer-events-none absolute inset-0 bg-skyline opacity-50 blur-[1px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,13,12,0.55) 0%, rgba(11,13,12,0.35) 40%, rgba(11,13,12,0.92) 100%), radial-gradient(60% 50% at 80% 0%, rgba(31,90,67,0.45) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Investimentos imobiliários selecionados
          </p>
          <h1 className="mt-6 max-w-3xl animate-fade-up font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl [animation-delay:100ms]">
            Invista no desenvolvimento imobiliário com visão de longo prazo.
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-lg text-white/70 [animation-delay:200ms]">
            Tenha acesso a oportunidades selecionadas e acompanhe seus
            investimentos em um único ambiente.
          </p>
          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:300ms] sm:flex-row">
            <Button href="/investimentos" variant="light" size="lg">
              Conhecer oportunidades
              <ArrowUpRight size={18} />
            </Button>
            <Button href="/login" variant="outline" size="lg" className="border-white/20 text-white hover:border-white/40 hover:bg-white/5">
              Entrar na minha conta
            </Button>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-14 max-w-lg">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-green-900">
            Como funciona
          </span>
          <h2 className="mt-3 font-display text-3xl text-ms-black sm:text-4xl">
            Um caminho simples, do primeiro acesso ao acompanhamento.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="border-t border-ms-black/10 pt-6">
              <span className="font-display text-3xl text-ms-black/20">{step.number}</span>
              <h3 className="mt-4 font-display text-xl text-ms-black">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ms-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EMPREENDIMENTOS EM DESTAQUE */}
      <section className="bg-ms-gray-100/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-lg">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-green-900">
                Empreendimentos em destaque
              </span>
              <h2 className="mt-3 font-display text-3xl text-ms-black sm:text-4xl">
                Oportunidades selecionadas com critério.
              </h2>
            </div>
            <Button href="/investimentos" variant="outline">
              Ver todas
              <ArrowUpRight size={16} />
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* SEU PATRIMÔNIO */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-14 max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-green-900">
            Acompanhamento
          </span>
          <h2 className="mt-3 font-display text-3xl text-ms-black sm:text-4xl">
            Seu patrimônio. Sua visão. Seu acompanhamento.
          </h2>
        </div>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ms-green-900/[0.08] text-ms-green-900">
                <benefit.icon size={20} />
              </div>
              <div>
                <h3 className="font-display text-lg text-ms-black">{benefit.title}</h3>
                <p className="mt-1 text-sm text-ms-gray-500">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="grain relative overflow-hidden bg-ms-black py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-skyline opacity-35" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,13,12,0.85) 0%, rgba(11,13,12,0.6) 45%, rgba(11,13,12,0.95) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Comece agora
          </span>
          <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
            Sua próxima decisão de investimento merece o acompanhamento certo.
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/investimentos" variant="light" size="lg">
              Conhecer oportunidades
              <ArrowUpRight size={18} />
            </Button>
            <Button href="/cadastro" variant="outline" size="lg" className="border-white/20 text-white hover:border-white/40 hover:bg-white/5">
              Criar conta
            </Button>
          </div>
          <LegalDisclaimer className="mx-auto mt-14 max-w-2xl text-white/40" />
        </div>
      </section>
    </>
  );
}
