# CLAUDE.md

Guia para o Claude Code trabalhar neste repositório. Veja o [README.md](README.md) para o contexto completo do produto e da organização (Programadores do Amanhã).

## O que é este projeto

Portal que lista perfis de alunos do PdA, agregando dados públicos do **LinkedIn** e do **GitHub** para dar visibilidade a jovens em formação/empregabilidade em tecnologia.

## Stack e arquitetura (definida, scaffolding pendente)

Monorepo gerenciado com **NX**:

- `apps/frontend` — **React + Next.js**.
- `apps/backend` — **Node.js + NestJS**.

> O workspace NX e os apps ainda não foram gerados neste repositório. Antes de assumir caminhos como `apps/frontend` ou `apps/backend` como existentes, confirme com `ls`/`Glob` — este arquivo será atualizado assim que o scaffolding for feito.

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
- Ao criar o scaffolding do NX, atualizar este arquivo com: comandos reais de build/test/lint/dev, estrutura de pastas final, e convenções de nomeação de libs/apps do workspace.

## Comandos

> A preencher assim que o workspace NX existir (ex.: `nx serve frontend`, `nx serve backend`, `nx test`, `nx lint`).
