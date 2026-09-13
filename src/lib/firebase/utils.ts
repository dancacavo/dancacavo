import { Timestamp } from "firebase/firestore";

/** Converte Timestamp do Firestore (ou string/Date) em ISO string segura. */
export function toIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}
