"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { LoadingState } from "@/components/ui/States";

/**
 * Protege rotas privadas no cliente: redireciona para /login quando não há
 * sessão ativa. A autorização definitiva de dados sensíveis é sempre feita
 * pelas Firestore Security Rules (ver firestore.rules) — este componente
 * cuida apenas da experiência de navegação.
 */
export function RequireAuth({
  children,
  requireRole,
}: {
  children: React.ReactNode;
  requireRole?: "admin";
}) {
  const { user, profile, loading, isDemoMode } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || isDemoMode) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requireRole && profile && profile.role !== requireRole) {
      router.replace("/dashboard");
    }
  }, [loading, user, profile, requireRole, router, isDemoMode]);

  if (loading) {
    return <LoadingState label="Carregando sua conta…" />;
  }

  if (!isDemoMode && !user) {
    return <LoadingState label="Redirecionando para o login…" />;
  }

  if (!isDemoMode && requireRole && profile && profile.role !== requireRole) {
    return <LoadingState label="Redirecionando…" />;
  }

  return <>{children}</>;
}
