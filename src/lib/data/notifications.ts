import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { toIso } from "@/lib/firebase/utils";
import type { Notification } from "@/types";

function mapNotification(id: string, data: Record<string, unknown>): Notification {
  return {
    id,
    userId: (data.userId as string) ?? "",
    title: (data.title as string) ?? "",
    message: (data.message as string) ?? "",
    read: Boolean(data.read),
    link: data.link as string | undefined,
    createdAt: toIso(data.createdAt),
  };
}

/** Notificações são sempre dados reais do usuário — nunca mockadas. */
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      )
    );
    return snapshot.docs.map((d) => mapNotification(d.id, d.data()));
  } catch {
    return [];
  }
}

export async function markNotificationRead(id: string) {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, "notifications", id), { read: true });
}
