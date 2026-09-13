import {
  addDoc,
  collection,
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
    constructionProgress: (data.constructionProgress as number) ?? 0,
    featured: Boolean(data.featured),
    highlights: data.highlights as Project["highlights"],
    isDemo: Boolean(data.isDemo),
    investmentUrl: data.investmentUrl as string | undefined,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

/**
 * Lista empreendimentos. Usa Firestore quando configurado e populado;
 * caso contrário, retorna os dados de DEMONSTRAÇÃO para que a interface
 * nunca fique vazia enquanto o backend não está pronto.
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

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  return featured.length ? featured : projects.slice(0, 3);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = getFirebaseDb();
  if (!db) return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;

  try {
    const snapshot = await getDocs(
      query(collection(db, "projects"), where("slug", "==", slug))
    );
    if (snapshot.empty) {
      return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
    }
    const d = snapshot.docs[0];
    return mapProject(d.id, d.data());
  } catch {
    return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}

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
