"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Users, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserStatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { formatDate } from "@/lib/utils/format";
import { getAllUsers } from "@/lib/data/users";
import type { UserAccountStatus, UserProfile } from "@/types";

const STATUS_FILTERS: { value: UserAccountStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos os status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "bloqueado", label: "Bloqueado" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserAccountStatus | "todos">("todos");
  const [dateFrom, setDateFrom] = useState("");

  useEffect(() => {
    let cancelled = false;
    getAllUsers()
      .then((data) => !cancelled && setUsers(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      if (term && !u.name.toLowerCase().includes(term) && !u.email.toLowerCase().includes(term)) {
        return false;
      }
      if (status !== "todos" && u.status !== status) return false;
      if (dateFrom && new Date(u.createdAt) < new Date(dateFrom)) return false;
      return true;
    });
  }, [users, search, status, dateFrom]);

  return (
    <div>
      <h1 className="font-display text-2xl text-ms-black sm:text-3xl">Usuários</h1>
      <p className="mt-1 text-ms-gray-500">Investidores e administradores cadastrados na plataforma.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ms-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail…"
            className="h-11 w-full rounded-xl border border-ms-black/10 bg-white pl-10 pr-4 text-sm outline-none transition-colors focus:border-ms-gold-900"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as UserAccountStatus | "todos")}
          className="h-11 rounded-xl border border-ms-black/10 bg-white px-3 text-sm outline-none focus:border-ms-gold-900"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          title="Cadastrados a partir de"
          className="h-11 rounded-xl border border-ms-black/10 bg-white px-3 text-sm outline-none focus:border-ms-gold-900"
        />
      </div>

      <div className="mt-6">
        {users === null ? (
          error ? <ErrorState /> : <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={20} />}
            title={users.length === 0 ? "Nenhum usuário cadastrado ainda" : "Nenhum usuário encontrado com esses filtros"}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((user) => (
              <Link key={user.id} href={`/admin/usuarios/${user.id}`}>
                <Card className="flex flex-col gap-2 p-4 hover:shadow-[0_12px_32px_rgba(11,13,12,0.08)] sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ms-black">{user.name || "Sem nome"}</p>
                      {user.role === "admin" && (
                        <span className="rounded-full bg-ms-black px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ms-gray-500">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-ms-gray-500">
                    <span>Desde {formatDate(user.createdAt)}</span>
                    <UserStatusBadge status={user.status} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
