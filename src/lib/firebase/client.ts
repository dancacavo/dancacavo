// Observação: este módulo NÃO tem "use client" — Auth/Firestore/Storage
// funcionam tanto em Server Components (leitura de dados) quanto no
// cliente. Apenas o Analytics é restrito ao browser (ver checagem abaixo).

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { isSupported, getAnalytics, type Analytics } from "firebase/analytics";
import { firebaseConfig, isFirebaseConfigured } from "./config";

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;
let analyticsInstance: Analytics | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

/** Retorna a instância de Auth, ou null se o Firebase não estiver configurado
 * (modo demonstração). */
export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!authInstance) authInstance = getAuth(a);
  return authInstance;
}

export function getFirebaseDb(): Firestore | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!dbInstance) dbInstance = getFirestore(a);
  return dbInstance;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!storageInstance) storageInstance = getStorage(a);
  return storageInstance;
}

/** Analytics só pode ser inicializado no browser e quando suportado. */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  const a = getFirebaseApp();
  if (!a) return null;
  if (analyticsInstance) return analyticsInstance;
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;
  analyticsInstance = getAnalytics(a);
  return analyticsInstance;
}

export { isFirebaseConfigured };
