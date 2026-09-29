# Plano do Frontend — PdA Perfis

Documento de referência para a evolução do `apps/frontend` (Next.js App Router). Complementa o [docs/backend-plan.md](backend-plan.md) — este aqui cobre a arquitetura de telas/dados; **estilo e direção visual têm doc próprio em [docs/design-plan.md](design-plan.md)**. Ver [CLAUDE.md](../CLAUDE.md) para convenções gerais.

## 1. Decisões fechadas

- **Design system aprovado**: ver [docs/design-plan.md](design-plan.md) — resumo: quatro vozes tipográficas com papéis separados (Dela Gothic no impacto, Bricolage Grotesque nos títulos, IBM Plex Sans/Mono na interface e nos dados), sistema de raio, material de vidro sobre luz ambiente, sombra em duas camadas e movimento com curvas únicas.
- **Identidade visual**: manual de marca do PdA recebido e aplicado (Roxo Profundo/Amarelo, proporção 60/25/10/5).
- **UI kit**: **shadcn/ui + Tailwind CSS**, com os componentes reestilizados pelos tokens do design system — nenhum componente shadcn entra com a aparência padrão.
- **Tema**: **dark/light com toggle**, **dark como padrão** (bate com a identidade oficial da marca — "fundo padrão: Roxo Profundo", ver [docs/design-plan.md](design-plan.md)).
- **Renderização**: **mista** — listagem e perfil individual em Server Components/SSR (bom para SEO e performance inicial); filtros e formulários interativos como Client Components.
- **Dados/cache no client**: **TanStack Query** para as partes interativas (filtros, formulários de edição, mutações).
- **Responsividade**: foco principal em **desktop**; mobile só precisa funcionar, não é prioridade de polimento nessa fase.
- **Acessibilidade**: seguir boas práticas (a11y) desde o início — shadcn/ui já ajuda bastante por ser baseado em Radix.
- **Testes automatizados de frontend**: adiado, decidir depois (backlog).
- **SEO investido / botões de compartilhamento**: adiado, decidir depois — mas como a renderização já é SSR nas páginas de conteúdo, o SEO básico (meta tags, HTML indexável) já vem de graça mesmo sem esforço extra.

## 2. Páginas e rotas (App Router)

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Home/landing com destaque do PdA e chamada pra vitrine | pública |
| `/alunos` | Vitrine — grade de perfis com busca/filtros (tecnologia, status, turma) | pública |
| `/alunos/[slug]` | Perfil individual do aluno (GitHub + LinkedIn + dados) | pública |
| `/sobre` | Institucional sobre o PdA | pública |
| `/entrar` | Login (admin ou aluno) | pública |
| `/primeiro-acesso` | Aluno define senha + aceita termo LGPD, a partir do token recebido por e-mail | token de uso único |
| `/minha-conta` | Área do aluno autenticado: editar LinkedIn, trocar slug, ocultar/reexibir perfil | aluno logado |
| `/admin` | Painel do admin: listar/cadastrar/importar alunos, editar qualquer perfil | admin logado |

Login, primeiro acesso e painel admin ficam **no mesmo projeto Next.js** (sem app separado), com rotas protegidas por middleware/guard checando o JWT emitido pelo backend.

### Slug do perfil (`/alunos/[slug]`)

- Slug **curto e legível** (ex. `joao-silva`), não UUID.
- **O aluno pode alterar o próprio slug** depois (via `/minha-conta`) — isso exige:
  - Checar unicidade antes de salvar (o backend precisa validar/rejeitar colisão).
  - Guardar o slug anterior redirecionando pra o novo por um tempo (301), pra não quebrar links já compartilhados — **fica como pendência de decisão** (ver seção 5), pode ficar de fora da v1 se for complexidade demais.

## 3. Vitrine (`/alunos`)

- Grade de cards com estética translúcida/glass (blur, transparência, sombras suaves) — não a listagem tradicional em tabela.
- **Busca + filtros na lateral/topo** (sempre visíveis, padrão job board): por tecnologia, status (`em formação`/`formado`/`empregado`), turma.
- Filtros aplicados via query params na URL (ex. `/alunos?status=graduated&tech=react`) para manter shareable/bookmarkable e compatível com SSR inicial + refinamento client-side.
- Paginação (a definir: paginação numerada ou infinite scroll — sugestão: numerada é mais simples e previsível para o MVP).

## 4. Perfil individual (`/alunos/[slug]`)

Seção com: foto, nome, turma, status, dados do GitHub (bio, repositórios em destaque, linguagens mais usadas), dados do LinkedIn (headline, cargo atual, formação, link), botão para o perfil do GitHub/LinkedIn originais.

- Renderizado via Server Component, busca os dados direto do backend (`GET /api/profiles/:identifier`).
- Metadata (`generateMetadata`) usando nome/bio do aluno — ajuda o SEO básico sem esforço extra, mesmo com "SEO avançado" adiado.

## 5. Área do aluno (`/minha-conta`)

- **Primeiro acesso** (`/primeiro-acesso?token=...`): formulário de senha + checkbox de aceite do termo LGPD → chama `POST /api/auth/first-access`.
- **Login** (`/entrar`): formulário simples de e-mail/senha → `POST /api/auth/login`, guarda o JWT (cookie httpOnly, não localStorage, por segurança).
- **Edição de LinkedIn**: formulário controlado (headline, cargo atual, formação, URL) com TanStack Query mutation → `PUT /api/students/:id/linkedin`, publica na hora (sem aprovação).
- **Alterar slug**: campo de texto com validação de formato + feedback de "já em uso" antes de salvar.
- **Ocultar/reexibir perfil**: toggle simples → `PATCH /api/students/:id/visibility`.

## 6. Painel admin (`/admin`)

- Lista de alunos (com busca), ação de **cadastrar aluno** (formulário) e **importar planilha** (upload de CSV).
- Editar qualquer aluno (mesmos campos que o aluno edita, + dados que só o admin mexe: nome, turma, status, github username, foto).
- Cadastro dispara automaticamente o e-mail de primeiro acesso (`modules/email` do backend) — o admin só confirma que foi enviado, não precisa copiar link manualmente.
- Fora da v1, mas fácil de encaixar depois: tela de histórico (`GET /api/audit`).

## 7. Pendências (precisam de resposta/material antes de implementar)

- ~~**Manual de marca do PdA**~~ — resolvido: recebido e aplicado em [docs/design-plan.md](design-plan.md) (Roxo Profundo/Amarelo + Dela Gothic One/IBM Plex Sans).
- **Troca de slug**: decidir se mantemos redirect do slug antigo (301) ou se aceitamos quebrar links antigos na v1 (mais simples).
- **Paginação da vitrine**: numerada vs. infinite scroll.
- **SEO/compartilhamento**: ainda "decidir depois" — não bloqueia a v1, mas registrar aqui pra não esquecer.

## 8. Ordem de implementação sugerida

1. Setup do design system: Tailwind + shadcn/ui + tema dark/light (`next-themes`, **dark como padrão**), tokens do design system (ver [docs/design-plan.md §2–§4](design-plan.md#2-cor)).
2. Layout base + navegação (`/`, `/sobre`).
3. Vitrine `/alunos` (Server Component, sem filtro ainda) consumindo `GET /api/profiles`.
4. Perfil individual `/alunos/[slug]`.
5. Filtros e busca (client-side, TanStack Query) na vitrine.
6. Fluxo de autenticação: `/entrar`, `/primeiro-acesso`, guard de rotas protegidas.
7. `/minha-conta`: edição de LinkedIn, troca de slug, toggle de visibilidade.
8. `/admin`: listagem, cadastro, import de planilha.
9. Acessibilidade e revisão de responsividade (mobile funcional).

Essa ordem acompanha o backlog do backend em [docs/backend-plan.md](backend-plan.md) — cada tela só é implementada quando o endpoint correspondente já existir.
