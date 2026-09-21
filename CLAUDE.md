# CLAUDE.md

Guia para o Claude Code trabalhar neste repositório. Veja o [README.md](README.md) para o contexto completo do produto e da organização (Programadores do Amanhã).

## O que é este projeto

Portal que lista perfis de alunos do PdA, agregando dados públicos do **LinkedIn** e do **GitHub** para dar visibilidade a jovens em formação/empregabilidade em tecnologia.

## Stack e arquitetura

Monorepo gerenciado com **NX** (npm workspaces):

- `apps/frontend` — **React + Next.js** (App Router).
- `apps/backend` — **Node.js + NestJS**, estrutura em `apps/backend/src`:
  - `app/` — módulo raiz (bootstrap da aplicação).
  - `modules/github/` — `GithubService` (implementa `GithubProfileProvider`, injetado via token `GITHUB_PROFILE_PROVIDER`) e DTO de perfil do GitHub.
  - `modules/linkedin/` — `LinkedinService` (implementa `LinkedinProfileProvider`, token `LINKEDIN_PROFILE_PROVIDER`); nunca faz scraping, apenas serve dados autorizados pelo aluno.
  - `modules/profiles/` — `ProfilesController` + `ProfilesService`, que agrega os dados dos providers de GitHub e LinkedIn via injeção pelos tokens acima (DIP).

## Padrões a seguir

- **MVC** no backend: controllers finos (rota → chamada de serviço → resposta), regras de negócio isoladas em services/módulos de domínio, DTOs/models para o shape dos dados — nunca lógica de negócio dentro de controllers.
- **SOLID**, com ênfase em:
  - **SRP**: um service por responsabilidade (ex.: um serviço para integração com GitHub, outro para LinkedIn, outro para agregação de perfil — não um "God service").
  - **DIP**: módulos de integração externa (LinkedIn/GitHub) devem ser acessados via interfaces/tokens injetáveis do NestJS, nunca instanciados diretamente nos consumidores, para permitir mock em testes.
- Padrões idiomáticos do NestJS (módulos, injeção de dependência, DTOs com `class-validator`) e do Next.js (App Router, componentes de servidor por padrão, client components só quando necessário).

## Integrações externas

- **GitHub**: dados via API pública/REST ou GraphQL do GitHub. Respeitar rate limits (usar token autenticado quando disponível) e nunca commitar tokens/segredos — usar variáveis de ambiente.
- **LinkedIn**: LinkedIn restringe fortemente scraping e acesso a dados de perfis de terceiros. Qualquer integração deve usar APIs oficiais/autorizadas ou dados que o próprio aluno forneça/autorize explicitamente — não implementar scraping do LinkedIn.

## Convenções gerais

- Preferir TypeScript estrito em frontend e backend.
- Não introduzir abstrações além do que a tarefa pede (ver diretrizes gerais de engenharia da sessão).
- Novos módulos de domínio no backend seguem o mesmo padrão de `modules/github` e `modules/linkedin`: uma interface em `interfaces/`, um token em `<nome>.tokens.ts`, a implementação em `<nome>.service.ts` e o registro do provider (token → classe) no `<nome>.module.ts`.
- Nomes de projetos NX: `@projeto-ai/frontend` e `@projeto-ai/backend`.

## Comandos

- `npx nx serve backend` — API NestJS em `http://localhost:3000/api` (usa `.env` na raiz; veja `.env.example`).
- `npx nx dev frontend` — Next.js em modo desenvolvimento.
- `npx nx build backend` / `npx nx build frontend` — build de produção.
- `npx nx run-many -t lint test typecheck` — lint, testes e checagem de tipos de todos os projetos.
- `npx nx g @nx/nest:module modules/<nome> --project=@projeto-ai/backend` — gera um novo módulo NestJS dentro de `apps/backend/src`.


<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax


<!-- nx configuration end-->