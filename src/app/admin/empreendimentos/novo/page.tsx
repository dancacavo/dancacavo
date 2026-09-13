import { ProjectForm } from "../ProjectForm";

export default function NovoEmpreendimentoPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Novo empreendimento</h1>
      <p className="mt-1 text-ms-gray-500">Preencha as informações do empreendimento.</p>
      <div className="mt-8 max-w-3xl">
        <ProjectForm />
      </div>
    </div>
  );
}
