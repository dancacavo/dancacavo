"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { formatDateLong } from "@/lib/utils/format";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getAllUsers } from "@/lib/data/users";
import type { UserProfile } from "@/types";

export default function AdminSettingsPage() {
  const { profile, isDemoMode } = useAuth();
  const [admins, setAdmins] = useState<UserProfile[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAllUsers()
      .then((data) => !cancelled && setAdmins(data.filter((u) => u.role === "admin")))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Configurações</h1>
      <p className="mt-1 text-ms-gray-500">Conta administrativa e controle de acesso ao painel.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-lg text-ms-black">Sua conta</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ms-gray-500">Nome</dt>
              <dd className="font-medium text-ms-black">{profile?.name ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ms-gray-500">E-mail</dt>
              <dd className="font-medium text-ms-black">{profile?.email ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ms-gray-500">Administrador desde</dt>
              <dd className="font-medium text-ms-black">{profile ? formatDateLong(profile.createdAt) : "—"}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-ms-gold-900" />
            <h2 className="font-display text-lg text-ms-black">Administradores</h2>
          </div>
          <p className="mt-1 text-sm text-ms-gray-500">
            Somente contas com papel &quot;admin&quot; acessam este painel. Gerencie quem tem
            acesso a partir da página de cada usuário.
          </p>
          <div className="mt-4">
            {admins === null ? (
              error ? <ErrorState /> : <LoadingState />
            ) : (
              <ul className="space-y-2">
                {admins.map((admin) => (
                  <li key={admin.id}>
                    <Link
                      href={`/admin/usuarios/${admin.id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-ms-black/[0.03]"
                    >
                      <span className="font-medium text-ms-black">{admin.name || admin.email}</span>
                      <span className="text-ms-gray-500">{admin.email}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href="/admin/usuarios" className="mt-4 inline-block text-sm font-medium text-ms-gold-900 hover:underline">
            Ver todos os usuários →
          </Link>
        </Card>
      </div>

      <Card className="mt-6 flex gap-3 p-6">
        <Info size={18} className="mt-0.5 shrink-0 text-ms-gold-900" />
        <div className="text-sm text-ms-gray-500">
          <p className="font-medium text-ms-black">Como funciona a autorização do admin</p>
          <p className="mt-1">
            O acesso ao painel é controlado pelo campo <code className="rounded bg-ms-gray-100 px-1 py-0.5">role</code> do
            usuário (<code className="rounded bg-ms-gray-100 px-1 py-0.5">investor</code> ou{" "}
            <code className="rounded bg-ms-gray-100 px-1 py-0.5">admin</code>), verificado tanto na navegação quanto nas
            regras de segurança do banco de dados — nunca só na interface. Um administrador só pode ser promovido por
            outro administrador já existente, a partir da página de detalhe do usuário em Usuários.
          </p>
          {isDemoMode && (
            <p className="mt-2 text-amber-700">
              Modo demonstração: sem Firebase configurado, este painel é acessível livremente para fins de visualização.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
