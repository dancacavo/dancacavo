import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { toIso } from "@/lib/firebase/utils";
import { MOCK_PROJECT_DOCUMENTS } from "@/lib/data/mock/projects";
import type { DocumentItem } from "@/types";

function mapDocument(id: string, data: Record<string, unknown>): DocumentItem {
  return {
    id,
    title: (data.title as string) ?? "Documento",
    description: data.description as string | undefined,
    category: (data.category as DocumentItem["category"]) ?? "outros",
    projectId: data.projectId as string | undefined,
    userId: data.userId as string | undefined,
    fileUrl: (data.fileUrl as string) ?? "#",
    fileType: (data.fileType as string) ?? "PDF",
    sizeLabel: data.sizeLabel as string | undefined,
    createdAt: toIso(data.createdAt),
  };
}

/** Documentos públicos de um empreendimento (ex.: apresentação, memorial). */
export async function getProjectDocuments(projectId: string): Promise<DocumentItem[]> {
  const db = getFirebaseDb();
  if (!db) return MOCK_PROJECT_DOCUMENTS.filter((d) => d.projectId === projectId);

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "documents"),
        where("projectId", "==", projectId),
        where("userId", "==", null)
      )
    );
    if (snapshot.empty) {
      return MOCK_PROJECT_DOCUMENTS.filter((d) => d.projectId === projectId);
    }
    return snapshot.docs.map((d) => mapDocument(d.id, d.data()));
  } catch {
    return MOCK_PROJECT_DOCUMENTS.filter((d) => d.projectId === projectId);
  }
}

/**
 * Documentos privados de um investidor. Regra de acesso: um investidor só
 * pode ler documentos cujo `userId` seja o dele (reforçado também pelas
 * Firestore Security Rules — ver firestore.rules).
 */
export async function getUserDocuments(userId: string): Promise<DocumentItem[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "documents"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      )
    );
    return snapshot.docs.map((d) => mapDocument(d.id, d.data()));
  } catch {
    return [];
  }
}

export async function getAllDocuments(): Promise<DocumentItem[]> {
  const db = getFirebaseDb();
  if (!db) return MOCK_PROJECT_DOCUMENTS;
  try {
    const snapshot = await getDocs(
      query(collection(db, "documents"), orderBy("createdAt", "desc"))
    );
    return snapshot.docs.map((d) => mapDocument(d.id, d.data()));
  } catch {
    return MOCK_PROJECT_DOCUMENTS;
  }
}

export type DocumentInput = Omit<DocumentItem, "id" | "createdAt">;

/** [ADMIN] Registra os metadados de um documento já enviado ao Storage. */
export async function createDocumentRecord(input: DocumentInput) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado — não é possível gravar dados.");
  await addDoc(collection(db, "documents"), {
    ...input,
    createdAt: serverTimestamp(),
  });
}

export async function deleteDocumentRecord(id: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado — não é possível gravar dados.");
  await deleteDoc(doc(db, "documents", id));
}
