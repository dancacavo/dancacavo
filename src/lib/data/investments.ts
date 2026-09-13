import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { toIso } from "@/lib/firebase/utils";
import type { Investment } from "@/types";

function mapInvestment(id: string, data: Record<string, unknown>): Investment {
  return {
    id,
    userId: (data.userId as string) ?? "",
    projectId: (data.projectId as string) ?? "",
    amount: (data.amount as number) ?? 0,
    status: (data.status as Investment["status"]) ?? "ativo",
    investedAt: toIso(data.investedAt),
    externalProvider: "sonica",
    externalInvestmentId: data.externalInvestmentId as string | undefined,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

/**
 * Investimentos são sempre dados reais do usuário — nunca mockados.
 * Sem Firebase configurado, ou sem registros, retorna lista vazia e a UI
 * deve exibir o empty state apropriado.
 */
export async function getUserInvestments(userId: string): Promise<Investment[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "investments"),
        where("userId", "==", userId),
        orderBy("investedAt", "desc")
      )
    );
    return snapshot.docs.map((d) => mapInvestment(d.id, d.data()));
  } catch {
    return [];
  }
}

export async function getInvestmentById(id: string): Promise<Investment | null> {
  const db = getFirebaseDb();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "investments", id));
    if (!snap.exists()) return null;
    return mapInvestment(snap.id, snap.data());
  } catch {
    return null;
  }
}

export async function getAllInvestments(): Promise<Investment[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  try {
    const snapshot = await getDocs(
      query(collection(db, "investments"), orderBy("investedAt", "desc"))
    );
    return snapshot.docs.map((d) => mapInvestment(d.id, d.data()));
  } catch {
    return [];
  }
}

/** [ADMIN] Atualiza o status de um investimento. */
export async function updateInvestmentStatus(id: string, status: Investment["status"]) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado.");
  await updateDoc(doc(db, "investments", id), { status, updatedAt: serverTimestamp() });
}

export async function createInvestmentRecord(input: {
  userId: string;
  projectId: string;
  amount: number;
  status?: Investment["status"];
  externalInvestmentId?: string;
}) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado.");
  await addDoc(collection(db, "investments"), {
    ...input,
    status: input.status ?? "em_analise",
    externalProvider: "sonica",
    investedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
