import type { Project } from "@/types";

/**
 * DADOS DE DEMONSTRAÇÃO.
 * Nenhum valor financeiro aqui é real — servem apenas para popular a
 * interface enquanto o Firestore não está configurado ou não possui
 * empreendimentos cadastrados. Todo projeto mock traz `isDemo: true`.
 */
export const MOCK_PROJECTS: Project[] = [
  {
    id: "ms-tower",
    name: "MS Tower Village",
    slug: "ms-tower",
    description:
      "MS Tower Village é um empreendimento residencial de alto padrão, projetado para unir localização estratégica, arquitetura contemporânea e gestão profissional de longo prazo. O projeto contempla torres residenciais com área de conveniência integrada, pensado para gerar valor sustentável ao longo do ciclo de desenvolvimento imobiliário.",
    shortDescription:
      "Empreendimento residencial de alto padrão em localização estratégica, com gestão profissional de longo prazo.",
    location: "Orla da Baía Sul",
    city: "Florianópolis",
    state: "SC",
    status: "captacao",
    coverImage: "/projects/ms-tower/fachada-entardecer.jpg",
    gallery: [
      "/projects/ms-tower/fachada-dia.jpg",
      "/projects/ms-tower/hall-recepcao.jpg",
      "/projects/ms-tower/hall-vista.jpg",
      "/projects/ms-tower/academia.jpg",
      "/projects/ms-tower/terraco-gourmet.jpg",
      "/projects/ms-tower/gastronomia.jpg",
    ],
    expectedDelivery: "4º trimestre de 2028 (previsão)",
    totalArea: "18.500 m²",
    availableUnits: 42,
    investmentMinimum: 9000,
    investmentType: "equity",
    targetReturn: "Projeção — não constitui garantia de rentabilidade",
    projectedReturn:
      "De R$ 9.000/m² (captação) a R$ 25.000/m² na venda — projeção por fase, sem garantia",
    pricePerSqm: 9000,
    valuationPhases: [
      { phase: "Captação", pricePerSqm: 9000 },
      { phase: "Lançamento", pricePerSqm: 12000 },
      { phase: "Início das obras", pricePerSqm: 15000 },
      { phase: "Meio das obras", pricePerSqm: 18000 },
      { phase: "Venda dos imóveis", pricePerSqm: 25000 },
    ],
    constructionProgress: 32,
    featured: true,
    isDemo: true,
    highlights: [
      {
        title: "Localização",
        description:
          "Região consolidada, com alta demanda histórica e infraestrutura urbana madura.",
      },
      {
        title: "Projeto",
        description:
          "Arquitetura contemporânea assinada, com eficiência construtiva e certificações ambientais em avaliação.",
      },
      {
        title: "Mercado",
        description:
          "Segmento com histórico de resiliência em ciclos de médio e longo prazo na região.",
      },
      {
        title: "Estratégia",
        description:
          "Estruturação pensada para transparência de acompanhamento e relacionamento contínuo com investidores.",
      },
      {
        title: "Potencial",
        description:
          "Plano de negócios com marcos claros de obra, comercialização e entrega, sujeitos a revisão periódica.",
      },
    ],
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
  },
];

export const MOCK_PROJECT_DOCUMENTS = [
  {
    id: "doc-mst-1",
    title: "Apresentação institucional — MS Tower Village",
    category: "informacoes" as const,
    projectId: "ms-tower",
    fileUrl: "#",
    fileType: "PDF",
    sizeLabel: "DEMONSTRAÇÃO",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "doc-mst-2",
    title: "Memorial descritivo (resumo)",
    category: "informacoes" as const,
    projectId: "ms-tower",
    fileUrl: "#",
    fileType: "PDF",
    sizeLabel: "DEMONSTRAÇÃO",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];
