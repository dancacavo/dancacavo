"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DemoModeNotice } from "@/components/domain/DemoModeNotice";
import { useAuth } from "@/lib/auth/AuthProvider";

export function ResetPasswordForm() {
  const { resetPassword, isDemoMode } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError("Não foi possível enviar o e-mail de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div>
        <h1 className="font-display text-2xl text-ms-black">Verifique seu e-mail</h1>
        <p className="mt-2 text-sm text-ms-gray-500">
          Se houver uma conta associada a <strong>{email}</strong>, você
          receberá um link para redefinir sua senha.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm font-medium text-ms-black hover:underline">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black">Recuperar senha</h1>
      <p className="mt-1.5 text-sm text-ms-gray-500">
        Informe seu e-mail para receber um link de redefinição.
      </p>

      {isDemoMode && <div className="mt-6"><DemoModeNotice /></div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          required
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isDemoMode}
          className="h-11 w-full rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-green-900 disabled:opacity-50"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading || isDemoMode}>
          {loading ? "Enviando…" : "Enviar link de recuperação"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ms-gray-500">
        <Link href="/login" className="font-medium text-ms-black hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
