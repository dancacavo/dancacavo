/**
 * Tipos centrais da plataforma MS Investor.
 *
 * Estes tipos espelham a modelagem do Firestore descrita na arquitetura do
 * produto (coleções: users, projects, investments, documents, notifications,
 * announcements). Mantenha este arquivo como fonte única de verdade para o
 * shape dos dados em todo o app.
 */

export type UserRole = "investor" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  photoUrl?: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export type ProjectStatus =
  | "em_breve" // em breve / pré-lançamento
  | "captacao" // captação em andamento
  | "em_construcao"
  | "concluido"
  | "encerrado";

export type InvestmentType = "equity" | "divida" | "hibrido";

export interface ProjectDocumentRef {
  id: string;
  title: string;
  category: DocumentCategory;
  url: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  location: string;
  city: string;
  state: string;
  status: ProjectStatus;
  coverImage: string;
  gallery: string[];
  video?: string;
  expectedDelivery: string; // ex: "Q4 2027"
  totalArea: string; // ex: "18.500 m²"
  availableUnits?: number;
  investmentMinimum: number;
  investmentType: InvestmentType;
  targetReturn?: string; // ex: "16% a.a. (projeção)"
  projectedReturn?: string;
  constructionProgress: number; // 0-100
  featured: boolean;
  highlights?: { title: string; description: string }[];
  isDemo?: boolean; // marca dados de demonstração, sem valor real
  investmentUrl?: string; // override do link Sonica por empreendimento
  createdAt: string;
  updatedAt: string;
}

export type InvestmentStatus = "ativo" | "em_analise" | "concluido" | "cancelado";

export interface Investment {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  status: InvestmentStatus;
  investedAt: string;
  externalProvider: "sonica";
  externalInvestmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory =
  | "contratos"
  | "informacoes"
  | "relatorios"
  | "comunicados"
  | "outros";

export interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  projectId?: string;
  userId?: string; // se definido, documento privado de um investidor específico
  fileUrl: string;
  fileType: string;
  sizeLabel?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  projectId?: string;
  audience: "todos" | "investidores" | "projeto";
  publishedAt: string;
  createdAt: string;
}
