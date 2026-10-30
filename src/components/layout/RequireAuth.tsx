"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShieldOff } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingState } from "@/components/ui/States";

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
    if (requireRole && profile?.role !== requireRole) {
      router.replace("/dashboard");
    }
  }, [loading, user, profile, requireRole, router, isDemoMode]);

  if (loading) {
    return <LoadingState label="Carregando sua conta…" />;
  }

  if (!isDemoMode && !user) {
    return <LoadingState label="Redirecionando para o login…" />;
  }

  if (!isDemoMode && requireRole && profile?.role !== requireRole) {
    return <LoadingState label="Redirecionando…" />;
  }

  // Investidores só acessam a área logada depois de aprovados por um
  // administrador. Administradores nunca ficam retidos aqui.
  if (!isDemoMode && profile?.role !== "admin" && profile?.status !== "ativo") {
    return <AccessGate status={profile?.status} />;
  }

  return <>{children}</>;
}

function AccessGate({ status }: { status?: string }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const content =
    status === "pendente"
      ? {
          icon: <Clock size={20} />,
          title: "Cadastro aguardando aprovação",
          description:
            "Recebemos seu cadastro. Assim que um administrador aprovar seu acesso, você poderá entrar na plataforma normalmente.",
        }
      : status === undefined
        ? {
            icon: <Clock size={20} />,
            title: "Não foi possível carregar seu cadastro",
            description: "Tente entrar novamente em instantes. Se o problema persistir, entre em contato com nosso time.",
          }
        : {
            icon: <ShieldOff size={20} />,
            title: "Acesso indisponível",
            description: "Sua conta está desativada no momento. Entre em contato com nosso time para mais informações.",
          };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <EmptyState
        className="w-full max-w-md"
        {...content}
        action={<Button variant="outline" onClick={handleLogout}>Sair</Button>}
      />
    </div>
  );
}
