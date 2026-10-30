import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
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
    status: (data.status as UserProfile["status"]) ?? "ativo",
    photoUrl: data.photoUrl as string | undefined,
    birthDate: data.birthDate as string | undefined,
    cpf: data.cpf as string | undefined,
    lastLoginAt: data.lastLoginAt ? toIso(data.lastLoginAt) : undefined,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

/**
 * Cria o documento de perfil no primeiro acesso (papel: investor, status:
 * pendente — o acesso só é liberado depois que um administrador aprova).
 *
 * Roda em transação porque pode ser chamada em paralelo pelo cadastro e pelo
 * listener de sessão (onAuthStateChanged); só uma das chamadas cria o
 * documento. Se o perfil já existe sem nome (criado pelo listener antes de o
 * cadastro definir o displayName), completa nome/telefone.
 */
export async function ensureUserProfile(params: {
  uid: string;
  name: string;
  email: string;
  phone?: string;
}) {
  const db = getFirebaseDb();
  if (!db) return;
  const ref = doc(db, "users", params.uid);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists()) {
      if (!snap.data().name && params.name) {
        tx.update(ref, {
          name: params.name,
          ...(params.phone ? { phone: params.phone } : {}),
          updatedAt: serverTimestamp(),
        });
      }
      return;
    }
    tx.set(ref, {
      name: params.name,
      email: params.email,
      phone: params.phone ?? null,
      role: "investor",
      status: "pendente",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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

/** [ADMIN] Alias semântico de getUserProfile para uso no painel administrativo. */
export const getUserById = getUserProfile;

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "name" | "phone" | "photoUrl">>
) {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
}

/**
 * Registra o último acesso (melhor esforço, não bloqueante). Só altera o
 * campo `lastLoginAt` — as Firestore Security Rules permitem que o próprio
 * usuário grave esse campo, mas nunca `role` ou `status`.
 */
export async function recordLogin(uid: string) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await updateDoc(doc(db, "users", uid), { lastLoginAt: serverTimestamp() });
  } catch {
    // melhor esforço — não deve travar o login do usuário
  }
}

/**
 * [ADMIN] Todos os usuários cadastrados (investidores e administradores),
 * mais recentes primeiro. A ordenação é feita no cliente: um `orderBy` no
 * Firestore descartaria silenciosamente documentos sem `createdAt`. Erros
 * (ex.: permissão negada) são propagados para a tela exibir o estado de erro
 * em vez de uma lista vazia enganosa.
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs
    .map((d) => mapUser(d.id, d.data()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Somente usuários com papel "investor" (uso legado — listagens antigas). */
export async function getAllInvestors(): Promise<UserProfile[]> {
  const users = await getAllUsers();
  return users.filter((u) => u.role === "investor");
}

/** [ADMIN] Promove/rebaixa um usuário entre "investor" e "admin". */
export async function updateUserRole(uid: string, role: UserProfile["role"]) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado — não é possível gravar dados.");
  await updateDoc(doc(db, "users", uid), { role, updatedAt: serverTimestamp() });
}

/** [ADMIN] Ativa, desativa ou bloqueia a conta de um usuário. */
export async function updateUserStatus(uid: string, status: UserProfile["status"]) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado — não é possível gravar dados.");
  await updateDoc(doc(db, "users", uid), { status, updatedAt: serverTimestamp() });
}
