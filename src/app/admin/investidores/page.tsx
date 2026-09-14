import { redirect } from "next/navigation";

/**
 * Rota mantida por compatibilidade: a listagem de usuários (investidores e
 * administradores) foi unificada em /admin/usuarios, com busca, filtros e
 * página de detalhe por usuário.
 */
export default function AdminInvestorsRedirectPage() {
  redirect("/admin/usuarios");
}
