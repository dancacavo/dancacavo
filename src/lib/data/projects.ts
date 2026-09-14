import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { toIso } from "@/lib/firebase/utils";
import { MOCK_PROJECTS } from "@/lib/data/mock/projects";
import type { Project } from "@/types";

function mapProject(id: string, data: Record<string, unknown>): Project {
  return {
    id,
    name: (data.name as string) ?? "",
    slug: (data.slug as string) ?? id,
    description: (data.description as string) ?? "",
    shortDescription: (data.shortDescription as string) ?? "",
    location: (data.location as string) ?? "",
    city: (data.city as string) ?? "",
    state: (data.state as string) ?? "",
    status: (data.status as Project["status"]) ?? "captacao",
    coverImage: (data.coverImage as string) ?? "/projects/placeholder/cover.svg",
    gallery: (data.gallery as string[]) ?? [],
    video: data.video as string | undefined,
    expectedDelivery: (data.expectedDelivery as string) ?? "A definir",
    totalArea: (data.totalArea as string) ?? "—",
    availableUnits: data.availableUnits as number | undefined,
    investmentMinimum: (data.investmentMinimum as number) ?? 0,
    investmentType: (data.investmentType as Project["investmentType"]) ?? "equity",
    targetReturn: data.targetReturn as string | undefined,
    projectedReturn: data.projectedReturn as string | undefined,
    pricePerSqm: data.pricePerSqm as number | undefined,
    valuationPhases: data.valuationPhases as Project["valuationPhases"],
    constructionProgress: (data.constructionProgress as number) ?? 0,
    featured: Boolean(data.featured),
    highlights: data.highlights as Project["highlights"],
    isDemo: Boolean(data.isDemo),
    investmentUrl: data.investmentUrl as string | undefined,
    // dados antigos (sem os campos abaixo) são tratados como
    // ativos/publicados, para não sumirem do site ao migrar o schema.
    active: data.active === undefined ? true : Boolean(data.active),
    showInOpportunities:
      data.showInOpportunities === undefined ? true : Boolean(data.showInOpportunities),
    opportunityOrder: (data.opportunityOrder as number) ?? 0,
    ctaText: data.ctaText as string | undefined,
    additionalInfo: data.additionalInfo as string | undefined,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

/**
 * Lista TODOS os empreendimentos (ativos ou não), para uso administrativo.
 * Usa Firestore quando configurado e populado; caso contrário, retorna os
 * dados de DEMONSTRAÇÃO para que a interface nunca fique vazia enquanto o
 * backend não está pronto.
 */
export async function getProjects(): Promise<Project[]> {
  const db = getFirebaseDb();
  if (!db) return MOCK_PROJECTS;

  try {
    const snapshot = await getDocs(
      query(collection(db, "projects"), orderBy("createdAt", "desc"))
    );
    if (snapshot.empty) return MOCK_PROJECTS;
    return snapshot.docs.map((d) => mapProject(d.id, d.data()));
  } catch {
    return MOCK_PROJECTS;
  }
}

/** Empreendimentos visíveis publicamente (interruptor "ativo" ligado). */
export async function getPublicProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.active !== false);
}

/**
 * Empreendimentos que aparecem na aba "Oportunidades" (e nos destaques da
 * home): precisam estar ativos E marcados para aparecer em oportunidades.
 * Ordenados pelo campo `opportunityOrder` definido no admin.
 */
export async function getOpportunities(): Promise<Project[]> {
  const projects = await getPublicProjects();
  return projects
    .filter((p) => p.showInOpportunities !== false)
    .sort((a, b) => (a.opportunityOrder ?? 0) - (b.opportunityOrder ?? 0));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const opportunities = await getOpportunities();
  const featured = opportunities.filter((p) => p.featured);
  return featured.length ? featured : opportunities.slice(0, 3);
}

/** Busca por slug para as páginas PÚBLICAS — só retorna empreendimentos ativos. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = getFirebaseDb();
  if (!db) {
    const p = MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
    return p && p.active !== false ? p : null;
  }

  try {
    const snapshot = await getDocs(
      query(collection(db, "projects"), where("slug", "==", slug))
    );
    if (snapshot.empty) {
      const p = MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
      return p && p.active !== false ? p : null;
    }
    const d = snapshot.docs[0];
    const project = mapProject(d.id, d.data());
    return project.active !== false ? project : null;
  } catch {
    const p = MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
    return p && p.active !== false ? p : null;
  }
}

/** [ADMIN] Busca por id sem filtro de visibilidade — usado para editar/pré-visualizar. */
export async function getProjectById(id: string): Promise<Project | null> {
  const db = getFirebaseDb();
  if (!db) return MOCK_PROJECTS.find((p) => p.id === id) ?? null;

  try {
    const snap = await getDoc(doc(db, "projects", id));
    if (!snap.exists()) return MOCK_PROJECTS.find((p) => p.id === id) ?? null;
    return mapProject(snap.id, snap.data());
  } catch {
    return MOCK_PROJECTS.find((p) => p.id === id) ?? null;
  }
}

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt" | "isDemo">;

/** [ADMIN] Cria um novo empreendimento no Firestore. */
export async function createProject(input: ProjectInput): Promise<string> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado — não é possível gravar dados.");
  const ref = await addDoc(collection(db, "projects"), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** [ADMIN] Atualiza um empreendimento existente. */
export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado — não é possível gravar dados.");
  await setDoc(
    doc(db, "projects", id),
    { ...input, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/** [ADMIN] Atualiza apenas o progresso de obra (0-100). */
export async function updateProjectProgress(id: string, progress: number) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado — não é possível gravar dados.");
  await updateDoc(doc(db, "projects", id), {
    constructionProgress: progress,
    updatedAt: serverTimestamp(),
  });
}

/** [ADMIN] Ativa/desativa (interruptor geral de visibilidade pública). */
export async function setProjectActive(id: string, active: boolean) {
  await updateProject(id, { active });
}

/** [ADMIN] Mostra/remove o card da aba "Oportunidades" sem apagar o empreendimento. */
export async function setProjectShowInOpportunities(id: string, show: boolean) {
  await updateProject(id, { showInOpportunities: show });
}

/** [ADMIN] Define a ordem de exibição do card na aba "Oportunidades". */
export async function setProjectOpportunityOrder(id: string, order: number) {
  await updateProject(id, { opportunityOrder: order });
}

/** [ADMIN] Exclui definitivamente um empreendimento. */
export async function deleteProject(id: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado — não é possível gravar dados.");
  await deleteDoc(doc(db, "projects", id));
}
