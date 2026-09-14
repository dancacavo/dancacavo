"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { updateUserProfile } from "@/lib/data/users";
import { Button } from "@/components/ui/Button";
import { DemoModeNotice } from "@/components/domain/DemoModeNotice";

export default function PerfilPage() {
  const { user, profile, isDemoMode, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateUserProfile(user.uid, { name, phone });
      await refreshProfile();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Perfil</h1>
      <p className="mt-1 text-ms-gray-500">Mantenha seus dados de contato atualizados.</p>

      {isDemoMode && <div className="mt-6"><DemoModeNotice /></div>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">Nome completo</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isDemoMode}
            className="h-11 w-full rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-gold-900 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">E-mail</label>
          <input
            value={profile?.email ?? user?.email ?? ""}
            disabled
            className="h-11 w-full rounded-xl border border-ms-black/10 bg-ms-gray-100 px-4 text-sm text-ms-gray-500 outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">Telefone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isDemoMode}
            className="h-11 w-full rounded-xl border border-ms-black/10 bg-white px-4 text-sm outline-none transition-colors focus:border-ms-gold-900 disabled:opacity-50"
          />
        </div>

        {saved && <p className="text-sm text-ms-gold-900">Dados atualizados.</p>}

        <Button type="submit" disabled={saving || isDemoMode}>
          {saving ? "Salvando…" : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
