import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage } from "./client";

/**
 * Envia um arquivo para o Firebase Storage em um caminho controlado e
 * retorna a URL pública de download. Usado pelo admin para imagens de
 * galeria e documentos, e por qualquer fluxo de upload no app.
 */
export async function uploadFile(path: string, file: File): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase Storage não configurado.");
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}
