"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Formulário de contato. Ainda não integrado a um serviço de envio de
 * e-mail/CRM — próximo passo natural da arquitetura (ver README). Por ora,
 * confirma o envio localmente para validar a experiência de ponta a ponta.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-ms-green-900/20 bg-ms-green-900/[0.05] p-6">
        <p className="font-medium text-ms-black">Mensagem recebida.</p>
        <p className="mt-1 text-sm text-ms-gray-500">
          Nosso time entrará em contato em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="Nome"
          className="h-11 rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-green-900"
        />
        <input
          required
          type="email"
          placeholder="E-mail"
          className="h-11 rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-green-900"
        />
      </div>
      <textarea
        required
        rows={5}
        placeholder="Sua mensagem"
        className="w-full rounded-xl border border-ms-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-ms-green-900"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Enviando…" : "Enviar mensagem"}
      </Button>
    </form>
  );
}
