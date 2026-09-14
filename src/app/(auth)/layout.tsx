/**
 * As telas de autenticação montam sua própria casca visual (AuthShell)
 * com uma imagem diferente cada uma — ver login/page.tsx, cadastro/page.tsx
 * e recuperar-senha/page.tsx.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
