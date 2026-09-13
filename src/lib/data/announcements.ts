import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { toIso } from "@/lib/firebase/utils";
import type { Announcement } from "@/types";

function mapAnnouncement(id: string, data: Record<string, unknown>): Announcement {
  return {
    id,
    title: (data.title as string) ?? "",
    message: (data.message as string) ?? "",
    projectId: data.projectId as string | undefined,
    audience: (data.audience as Announcement["audience"]) ?? "todos",
    publishedAt: toIso(data.publishedAt),
    createdAt: toIso(data.createdAt),
  };
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  try {
    const snapshot = await getDocs(
      query(collection(db, "announcements"), orderBy("publishedAt", "desc"))
    );
    return snapshot.docs.map((d) => mapAnnouncement(d.id, d.data()));
  } catch {
    return [];
  }
}

/** [ADMIN] Publica um novo comunicado. */
export async function createAnnouncement(input: {
  title: string;
  message: string;
  projectId?: string;
  audience: Announcement["audience"];
}) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase não configurado — não é possível gravar dados.");
  await addDoc(collection(db, "announcements"), {
    ...input,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}
