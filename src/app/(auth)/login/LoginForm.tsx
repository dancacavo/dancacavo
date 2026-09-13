"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DemoModeNotice } from "@/components/domain/DemoModeNotice";
import { useAuth } from "@/lib/auth/AuthProvider";
import { track } from "@/lib/analytics/events";

export function LoginForm() {
  const { login, loginWithGoogle, isDemoMode } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      track("login", { method: "password" });
      router.push("/dashboard");
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      track("login", { method: "google" });
      router.push("/dashboard");
    } catch {
      setError("Não foi possível entrar com o Google.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black">Entrar</h1>
      <p className="mt-1.5 text-sm text-ms-gray-500">Acesse sua conta MS Investor.</p>

      {isDemoMode && <div className="mt-6"><DemoModeNotice /></div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">E-mail</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isDemoMode}
            className="h-11 w-full rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-green-900 disabled:opacity-50"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-medium text-ms-gray-500">Senha</label>
            <Link href="/recuperar-senha" className="text-xs text-ms-gray-500 hover:text-ms-black">
              Esqueci minha senha
            </Link>
          </div>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isDemoMode}
            className="h-11 w-full rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-green-900 disabled:opacity-50"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading || isDemoMode}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-ms-gray-500">
        <div className="h-px flex-1 bg-ms-black/10" />
        ou
        <div className="h-px flex-1 bg-ms-black/10" />
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogle}
        disabled={isDemoMode}
      >
        Continuar com Google
      </Button>

      <p className="mt-8 text-center text-sm text-ms-gray-500">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-ms-black hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
