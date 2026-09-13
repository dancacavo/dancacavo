/**
 * Configuração do Firebase lida exclusivamente de variáveis de ambiente
 * públicas (NEXT_PUBLIC_*). Nenhuma credencial secreta deve viver aqui.
 *
 * Se as variáveis não estiverem definidas, `isFirebaseConfigured` é `false`
 * e o restante da aplicação cai automaticamente em modo de DEMONSTRAÇÃO,
 * usando dados mockados em src/lib/data/mock. Isso permite rodar
 * `npm run dev` imediatamente, sem projeto Firebase configurado, e trocar
 * para dados reais apenas preenchendo o .env.local.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

/** URL da plataforma parceira SONICA para onde o fluxo de investimento é
 * redirecionado. Configurável via ambiente para nunca ficar hardcoded. */
export const SONICA_INVESTMENT_URL =
  process.env.NEXT_PUBLIC_SONICA_INVESTMENT_URL ?? "https://sonica.example.com/investir";
