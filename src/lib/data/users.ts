import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { toIso } from "@/lib/firebase/utils";
import type { UserProfile } from "@/types";

function mapUser(id: string, data: Record<string, unknown>): UserProfile {
  return {
    id,
    name: (data.name as string) ?? "",
    email: (data.email as string) ?? "",
    phone: data.phone as string | undefined,
    role: (data.role as UserProfile["role"]) ?? "investor",
    photoUrl: data.photoUrl as string | undefined,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

/** Cria o documento de perfil no primeiro acesso (papel padrão: investor). */
export async function ensureUserProfile(params: {
  uid: string;
  name: string;
  email: string;
  phone?: string;
}) {
  const db = getFirebaseDb();
  if (!db) return;
  const ref = doc(db, "users", params.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  await setDoc(ref, {
    name: params.name,
    email: params.email,
    phone: params.phone ?? null,
    role: "investor",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseDb();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return mapUser(snap.id, snap.data());
  } catch {
    return null;
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "name" | "phone" | "photoUrl">>
) {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
}

export async function getAllInvestors(): Promise<UserProfile[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  try {
    const snapshot = await getDocs(
      query(collection(db, "users"), orderBy("createdAt", "desc"))
    );
    return snapshot.docs
      .map((d) => mapUser(d.id, d.data()))
      .filter((u) => u.role === "investor");
  } catch {
    return [];
  }
}
