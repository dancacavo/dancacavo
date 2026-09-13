"use client";

import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "@/lib/firebase/client";

/**
 * Nomes de eventos padronizados da plataforma. Mantenha esta lista como
 * único ponto de referência para instrumentação de analytics.
 *
 * IMPORTANTE: nunca envie dados financeiros sensíveis (valores investidos,
 * CPF, dados bancários) como parâmetros de evento.
 */
export type AnalyticsEventName =
  | "page_view"
  | "signup"
  | "login"
  | "project_view"
  | "investment_cta_click"
  | "external_investment_redirect"
  | "document_view"
  | "document_download";

export async function track(
  event: AnalyticsEventName,
  params?: Record<string, string | number | boolean | undefined>
) {
  try {
    const analytics = await getFirebaseAnalytics();
    if (!analytics) return; // modo demo ou SSR: no-op silencioso
    // O SDK tipa fortemente apenas um subconjunto de nomes de evento padrão
    // do GA4; os demais (customizados) são aceitos em runtime normalmente.
    logEvent(analytics, event as never, params);
  } catch {
    // Analytics nunca deve quebrar a experiência do usuário.
  }
}
