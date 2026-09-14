# MS Investor

Plataforma digital de relacionamento e acompanhamento de investidores em
empreendimentos imobiliários.

> **Importante — natureza da plataforma.** O MS Investor **não executa**
> a operação regulada de investimento. Ele apresenta oportunidades,
> cadastra e autentica investidores, qualifica e orienta usuários,
> disponibiliza informações e documentos dos empreendimentos e permite o
> acompanhamento do investimento. O processo de investimento em si é
> realizado inteiramente pela **plataforma parceira SONICA** — o botão
> "Investir" apenas redireciona o usuário para lá, após uma confirmação
> explícita.

---

## Stack

- **Next.js 16** (App Router, Turbopack, TypeScript, Server Components)
- **React 19**
- **Tailwind CSS v4** com paleta institucional customizada
- **Firebase**: Authentication, Firestore, Storage, Analytics (opcional)
- `lucide-react` (ícones), `class-variance-authority` + `tailwind-merge`
  (variantes de componentes)

O projeto foi criado do zero (o repositório estava vazio) já usando essa
stack, conforme solicitado.

## Identidade visual

Paleta oficial do Grupo Marques Silveira (cartela Pantone fornecida pelo
cliente), aplicada em `src/app/globals.css`:

| Token CSS | Pantone | Hex | Uso |
|---|---|---|---|
| `--color-ms-black` | 289 U (azul intenso) | `#0B1220` | base escura (fundo/texto principal) |
| `--color-ms-navy-700` | 288 U (azul 2) | `#13294B` | azul secundário |
| `--color-ms-gray-500` | 430 U (azul 3) | `#6E7075` | texto secundário |
| `--color-ms-gray-300` | 427 U (azul 4) | `#C7C6C4` | bordas/divisores |
| `--color-ms-gold-700` | 457 U (dourado crema) | `#9C7A3D` | destaque principal (dourado) |
| `--color-ms-gray-100` | 4545 U (crema), clareado | `#ECE7DD` | fundo claro de seção |

`--color-ms-gold-900` (`#7C6230`) e `--color-ms-gold-500` (`#C9A968`) são
variações mais escura/clara do dourado 457 U, usadas em hover e realces.

O símbolo institucional (`src/components/layout/LogoMark.tsx`) reproduz em
SVG o "V" de quatro traços dourados em leque do logotipo oficial —
arquivo de origem em `brand/logo-marques-silveira-oficial.pdf` (fora de
`public/`, pois é material de referência para design, não um asset
servido pela aplicação).

## Modo demonstração

**A aplicação roda imediatamente com `npm run dev`, sem nenhuma
configuração prévia do Firebase.** Se as variáveis `NEXT_PUBLIC_FIREBASE_*`
não estiverem definidas, o app entra automaticamente em **modo
demonstração**:

- Autenticação fica desativada (formulários exibem um aviso e os campos
  ficam desabilitados).
- Catálogo de empreendimentos usa dados **claramente marcados como
  DEMONSTRAÇÃO** (`src/lib/data/mock`) em vez de dados reais/inventados.
- Dados pessoais de investidores (investimentos, documentos privados,
  notificações) **nunca são inventados** — aparecem como listas vazias com
  o empty state apropriado, mesmo em modo demonstração.

Assim que as credenciais do Firebase são preenchidas em `.env.local`, a
mesma interface passa a ler e escrever dados reais no Firestore — nenhuma
tela precisa ser reconstruída.

## Como rodar

```bash
npm install
cp .env.local.example .env.local   # preencha com seu projeto Firebase (opcional)
npm run dev                        # http://localhost:3000
```

Outros comandos:

```bash
npm run build   # build de produção
npm run start   # servir o build de produção
npm run lint    # ESLint
```

Deploy das regras de segurança (requer Firebase CLI e login):

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Variáveis de ambiente

Veja `.env.local.example`. Nenhum valor é secreto (as chaves do Firebase
Web SDK são públicas por design — a segurança real vem das Security
Rules), mas mesmo assim ficam fora do código-fonte:

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Config do app Firebase Web |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | idem |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | idem |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | idem |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | idem |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | idem |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Analytics (opcional) |
| `NEXT_PUBLIC_SONICA_INVESTMENT_URL` | URL padrão de destino do botão "Investir" (pode ser sobrescrita por empreendimento) |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site (metadata, sitemap, robots) |

## Estrutura do projeto

```
src/
  app/
    (public)/          landing, /investimentos, /investimentos/[slug],
                        /sobre, /contato, /privacidade, /termos
    (auth)/             /login, /cadastro, /recuperar-senha
    dashboard/          área privada do investidor (guarded)
    admin/              painel administrativo (guarded, role=admin)
    sitemap.ts, robots.ts
  components/
    ui/                 Button, Card, Modal, StatusBadge, ProgressBar,
                        EmptyState/ErrorState/LoadingState/Skeleton
    domain/             ProjectCard, InvestmentCard, DocumentCard,
                        NotificationItem, MetricCard, InvestButton,
                        DemoModeNotice
    layout/             Navbar, MobileNavbar, Footer, DashboardSidebar,
                        AdminSidebar, RequireAuth, LegalDisclaimer
  lib/
    firebase/           client.ts (Auth/Firestore/Storage), config.ts,
                        storage.ts, utils.ts
    data/               projects.ts, investments.ts, documents.ts,
                        notifications.ts, announcements.ts, users.ts
                        (cada um: leitura com fallback a mock + mutações
                        de admin)
    data/mock/          dados de demonstração do MS Tower
    auth/               AuthProvider.tsx (contexto de autenticação)
    analytics/          events.ts (eventos padronizados GA4)
    utils/               cn(), formatCurrency(), formatDate()
  types/                modelos: Project, Investment, DocumentItem,
                        Notification, Announcement, UserProfile
firestore.rules
firestore.indexes.json
storage.rules
firebase.json
.env.local.example
```

### Rota "Meus investimentos"

O briefing original lista `/investimentos` tanto na área pública (catálogo
de oportunidades) quanto na área privada (investimentos do usuário) — o
que colidiria na mesma URL. Optei por manter `/investimentos` público (o
catálogo) e colocar a área privada em **`/dashboard/investimentos`** e
**`/dashboard/investimentos/[id]`**, seguindo o mesmo padrão das demais
rotas privadas (`/dashboard/documentos`, `/dashboard/notificacoes`,
`/dashboard/perfil`).

## Banco de dados (Firestore)

Coleções: `users`, `projects`, `investments`, `documents`,
`notifications`, `announcements` — shapes completos em `src/types/index.ts`.
Índices compostos necessários já estão em `firestore.indexes.json`.

## Autenticação

Firebase Authentication: e-mail/senha, Google, recuperação de senha,
logout e proteção de rotas privadas (`RequireAuth`, client-side + reforçado
pelas Security Rules no servidor). No primeiro login, um documento
`users/{uid}` é criado com `role: "investor"` — o papel `admin` é atribuído
manualmente no Firestore (nunca pelo próprio usuário, reforçado pelas
regras).

Dados coletados no cadastro: nome, e-mail, telefone (opcional). Nenhum CPF,
data de nascimento ou endereço é coletado, seguindo o princípio de
minimização de dados — adicione esses campos apenas se o compliance da
SONICA/regulatório exigir.

## Segurança (Firestore/Storage Rules)

- Um investidor só lê seu próprio perfil, seus próprios investimentos,
  documentos endereçados a ele (ou públicos) e suas próprias notificações.
- `role` do usuário nunca pode ser alterado por ele mesmo (só por admin).
- `projects` e `announcements` são de leitura pública, escrita restrita a
  admin.
- `investments` só são criados/editados por admin (o registro real de
  investimento vem da SONICA; a plataforma MS apenas o reflete).
- Ver `firestore.rules` e `storage.rules` para o detalhamento comentado.

## Integração com a SONICA

O botão "Investir" (`InvestButton`) sempre:
1. Abre um modal de confirmação explicando que o usuário será
   redirecionado à plataforma parceira SONICA.
2. Só após "Continuar para investir" abre a URL configurável (nunca
   hardcoded): `project.investmentUrl` (override por empreendimento) ou
   `NEXT_PUBLIC_SONICA_INVESTMENT_URL` (padrão).
3. Dispara os eventos de analytics `investment_cta_click` e
   `external_investment_redirect`.

## Analytics

Eventos padronizados em `src/lib/analytics/events.ts`: `page_view`,
`signup`, `login`, `project_view`, `investment_cta_click`,
`external_investment_redirect`, `document_view`, `document_download`.
Nenhum dado financeiro sensível é enviado como parâmetro.

## Testes realizados

- `npm run build` — build de produção completo, sem erros (27 rotas
  geradas).
- `npm run lint` — sem erros/avisos.
- Verificação visual com Playwright (Chromium) em 390px (mobile) e
  1440px (desktop) das principais telas: landing, catálogo, página do MS
  Tower (com abertura do modal de investimento), login, cadastro, sobre,
  contato, dashboard e admin em modo demonstração.
- Fluxo `Landing → empreendimento → Investir → confirmação → link
  SONICA` validado manualmente (modal + `window.open`).
- Fluxo `Cadastro → Login → Dashboard → Meus investimentos → Documentos →
  Notificações` validado na navegação e nos empty states (sem projeto
  Firebase real conectado nesta sessão, o fluxo de escrita/leitura real do
  Firestore não pôde ser exercitado ponta a ponta — ver "Próximos passos").

## Problemas encontrados e decisões

- O Next.js 16 exige `params` como `Promise` em páginas dinâmicas — todas
  as rotas `[slug]`/`[id]` foram implementadas de acordo.
- O SDK do Firebase Analytics tipa fortemente apenas alguns nomes de
  evento do GA4; o wrapper `track()` faz um cast controlado para aceitar
  os nomes de evento customizados da plataforma.
- Uma regra nova do ESLint (`react-hooks/set-state-in-effect`) proíbe
  `setState` síncrono direto no corpo de `useEffect`; todos os efeitos de
  busca de dados foram reestruturados para só atualizar estado dentro de
  callbacks assíncronos (`.then`/`.catch`/IIFE async), nunca de forma
  síncrona no corpo do efeito.
- Conflito de rota `/investimentos` (público vs. privado) resolvido
  conforme explicado acima.

## Próximos passos sugeridos

1. Criar o projeto Firebase real, preencher `.env.local` e rodar
   `firebase deploy --only firestore:rules,firestore:indexes,storage`.
2. Popular a coleção `projects` com o(s) empreendimento(s) reais
   (substituindo os dados de demonstração do MS Tower).
3. Definir manualmente `role: "admin"` no documento do primeiro usuário
   administrador (via Firebase Console ou Admin SDK).
4. Integrar o formulário de contato a um serviço real de e-mail/CRM.
5. Conectar o cadastro de investimentos a um webhook/Cloud Function que
   receba confirmações da SONICA e grave em `investments` automaticamente
   (hoje o registro é manual pelo admin).
6. Cloud Function opcional para, ao publicar um comunicado, gerar
   `notifications` para o público-alvo automaticamente.
7. Substituir os textos de Termos de Uso e Política de Privacidade pelos
   documentos jurídicos oficiais revisados por compliance.
8. Trocar as imagens de demonstração (SVGs gerados) por fotos/renders reais
   do empreendimento.
