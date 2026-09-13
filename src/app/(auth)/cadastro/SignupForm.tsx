"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DemoModeNotice } from "@/components/domain/DemoModeNotice";
import { useAuth } from "@/lib/auth/AuthProvider";
import { track } from "@/lib/analytics/events";

export function SignupForm() {
  const { signup, isDemoMode } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password, phone || undefined);
      track("signup", { method: "password" });
      router.push("/dashboard");
    } catch {
      setError("Não foi possível criar sua conta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black">Criar conta</h1>
      <p className="mt-1.5 text-sm text-ms-gray-500">
        Coletamos apenas os dados necessários para o seu acompanhamento.
      </p>

      {isDemoMode && <div className="mt-6"><DemoModeNotice /></div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">Nome completo</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isDemoMode}
            className="h-11 w-full rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-green-900 disabled:opacity-50"
          />
        </div>
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
          <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">Telefone (opcional)</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isDemoMode}
            className="h-11 w-full rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-green-900 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">Senha</label>
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
          {loading ? "Criando conta…" : "Criar conta"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ms-gray-500">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-ms-black hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
