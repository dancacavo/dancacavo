"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ShieldOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { UserStatusBadge, InvestmentStatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/States";
import { formatCurrency, formatDate, formatDateLong } from "@/lib/utils/format";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getUserById, updateUserRole, updateUserStatus } from "@/lib/data/users";
import { getUserInvestments } from "@/lib/data/investments";
import { getProjects } from "@/lib/data/projects";
import type { Investment, Project, UserAccountStatus, UserProfile } from "@/types";

const STATUS_OPTIONS: UserAccountStatus[] = ["ativo", "inativo", "bloqueado"];

export function UserDetail({ id }: { id: string }) {
  const { profile: currentAdmin } = useAuth();

  const [user, setUser] = useState<UserProfile | null | undefined>(undefined);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmRoleChange, setConfirmRoleChange] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getUserById(id), getUserInvestments(id), getProjects()])
      .then(([u, inv, proj]) => {
        if (cancelled) return;
        setUser(u);
        setInvestments(inv);
        setProjects(proj);
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleStatusChange = async (status: UserAccountStatus) => {
    if (!user) return;
    setSaving(true);
    setUser({ ...user, status });
    try {
      await updateUserStatus(user.id, status);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAdmin = async () => {
    if (!user) return;
    setSaving(true);
    const role = user.role === "admin" ? "investor" : "admin";
    try {
      await updateUserRole(user.id, role);
      setUser({ ...user, role });
    } finally {
      setSaving(false);
      setConfirmRoleChange(false);
    }
  };

  if (user === undefined) return error ? <ErrorState /> : <LoadingState />;
  if (user === null) return <EmptyState title="Usuário não encontrado" />;

  const isSelf = currentAdmin?.id === user.id;

  return (
    <div>
      <Link href="/admin/usuarios" className="flex items-center gap-1.5 text-sm text-ms-gray-500 hover:text-ms-black">
        <ArrowLeft size={15} /> Voltar para usuários
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ms-black sm:text-3xl">{user.name || "Sem nome"}</h1>
          <p className="mt-1 text-ms-gray-500">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {user.role === "admin" && (
            <span className="rounded-full bg-ms-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Administrador
            </span>
          )}
          <UserStatusBadge status={user.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* DADOS PESSOAIS */}
        <Card className="p-6">
          <h2 className="font-display text-lg text-ms-black">Dados pessoais</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Nome" value={user.name || "—"} />
            <Row label="E-mail" value={user.email} />
            {user.phone && <Row label="Telefone" value={user.phone} />}
            {user.birthDate && <Row label="Data de nascimento" value={formatDate(user.birthDate)} />}
            {user.cpf && <Row label="CPF" value={user.cpf} />}
            <Row label="Data de cadastro" value={formatDateLong(user.createdAt)} />
          </dl>
        </Card>

        {/* PERFIL */}
        <Card className="p-6">
          <h2 className="font-display text-lg text-ms-black">Perfil</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Status da conta" value={<UserStatusBadge status={user.status} />} />
            <Row label="Último acesso" value={user.lastLoginAt ? formatDateLong(user.lastLoginAt) : "Não disponível"} />
            <Row label="Papel" value={user.role === "admin" ? "Administrador" : "Investidor"} />
          </dl>

          <div className="mt-5 space-y-3 border-t border-ms-black/[0.06] pt-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ms-gray-500">Alterar status da conta</label>
              <select
                value={user.status}
                onChange={(e) => handleStatusChange(e.target.value as UserAccountStatus)}
                disabled={saving || isSelf}
                className="h-10 w-full rounded-lg border border-ms-black/10 bg-white px-3 text-sm outline-none focus:border-ms-gold-900 disabled:opacity-50"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s === "ativo" ? "Ativo" : s === "inativo" ? "Inativo" : "Bloqueado"}</option>
                ))}
              </select>
              {isSelf && <p className="mt-1 text-xs text-ms-gray-500">Você não pode alterar o status da sua própria conta.</p>}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={saving || isSelf}
              onClick={() => setConfirmRoleChange(true)}
              className="w-full"
            >
              {user.role === "admin" ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
              {user.role === "admin" ? "Remover acesso de administrador" : "Promover a administrador"}
            </Button>
            {isSelf && <p className="text-xs text-ms-gray-500">Você não pode alterar seu próprio papel.</p>}
          </div>
        </Card>
      </div>

      {/* INVESTIMENTOS */}
      <div className="mt-8">
        <h2 className="font-display text-lg text-ms-black">Investimentos</h2>
        <div className="mt-4">
          {investments.length === 0 ? (
            <EmptyState
              title="Nenhum investimento registrado para este usuário"
              description="Registros aparecem aqui conforme confirmados pela plataforma parceira SONICA."
            />
          ) : (
            <div className="space-y-3">
              {investments.map((inv) => {
                const project = projects.find((p) => p.id === inv.projectId);
                return (
                  <Card key={inv.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-ms-black">{project?.name ?? inv.projectId}</p>
                      <p className="text-sm text-ms-gray-500">{formatDate(inv.investedAt)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-ms-black">{formatCurrency(inv.amount)}</span>
                      <InvestmentStatusBadge status={inv.status} />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={confirmRoleChange}
        onClose={() => setConfirmRoleChange(false)}
        title={user.role === "admin" ? "Remover acesso de administrador" : "Promover a administrador"}
      >
        <p className="text-sm text-ms-gray-500">
          {user.role === "admin"
            ? `Tem certeza de que deseja remover o acesso administrativo de ${user.name || user.email}? A pessoa deixará de acessar o painel /admin imediatamente.`
            : `Tem certeza de que deseja conceder acesso total ao painel administrativo para ${user.name || user.email}?`}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setConfirmRoleChange(false)}>Cancelar</Button>
          <Button disabled={saving} onClick={handleToggleAdmin}>
            {saving ? "Salvando…" : "Confirmar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ms-gray-500">{label}</dt>
      <dd className="font-medium text-ms-black">{value}</dd>
    </div>
  );
}
