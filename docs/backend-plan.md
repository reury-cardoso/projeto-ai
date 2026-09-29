# Plano do Backend — PdA Perfis

Documento de referência para a evolução do `apps/backend` (NestJS). Descreve o que já existe, o que falta para o portal funcionar de ponta a ponta, e as decisões de arquitetura por trás disso. Ver [CLAUDE.md](../CLAUDE.md) para as convenções gerais do repo, [docs/entities-plan.md](entities-plan.md) para o **modelo de dados canônico** (cardinalidade, cascade) e [docs/flow-plan.md](flow-plan.md) para as regras de negócio e casos de borda que complementam os módulos abaixo.

## 1. O que o backend faz hoje

Só existe scaffolding funcional de um fluxo: **buscar o perfil de um único aluno por identificador**.

```
GET /api/profiles/:identifier
  → ProfilesController.getProfile
  → ProfilesService.getStudentProfile
      ├── GITHUB_PROFILE_PROVIDER.getProfileByUsername(identifier)   (chamada real à API do GitHub)
      └── LINKEDIN_PROFILE_PROVIDER.getProfileByStudentId(identifier) (Map em memória, sempre null hoje)
  → StudentProfileDto { identifier, github, linkedin }
```

Pontos relevantes do estado atual:

- **GitHub**: `GithubService` chama `GET https://api.github.com/users/:username` a cada request, sem cache.
- **LinkedIn**: `LinkedinService` é um `Map` em memória, sempre vazio — nunca faz scraping, por design.
- Não existe **listagem** de alunos, nem **persistência**, nem **autenticação**.

## 2. Visão do produto e fluxo de conta (decidido)

- A vitrine é **100% pública**, sem login — qualquer pessoa na internet navega pelos perfis.
- O **admin** (uma única conta de admin no MVP) cadastra o aluno — a partir de uma **planilha existente** para a carga inicial, e depois um a um pela interface. O perfil já **nasce público** com GitHub username, dados de LinkedIn que o admin já tiver, foto, turma e status.
- Ao cadastrar, o sistema **envia um e-mail automático** para o aluno com um link de **primeiro acesso** (token de uso único, com expiração).
- No primeiro acesso, o aluno define sua senha **e aceita um termo de consentimento (LGPD)** para exibição pública dos seus dados.
- Depois disso, o aluno loga normalmente e pode **editar seus próprios dados de LinkedIn** (publica na hora, sem aprovação do admin) e **ocultar/reexibir o próprio perfil** na vitrine a qualquer momento.
- GitHub nunca é editado manualmente — é sempre buscado pela API a partir do username cadastrado.

## 3. Modelo de dados

Ver **[docs/entities-plan.md](entities-plan.md)** para o modelo completo (todas as entidades, cardinalidade, FKs e regras de cascade). Resumo rápido pra contexto dos módulos abaixo:

- `Admin` e `Student` são entidades **separadas** (não um `User` genérico com role).
- `Student` tem 1:1 com `LinkedinProfile` e `GithubProfileCache` (tabelas próprias, não colunas embutidas), N:N com `Cohort` (via `StudentCohort`), e 1:N com `StudentLanguage`, `RefreshToken`, `StatusChangeRequest`, `ProfileView`.
- `ContactRequest` sobrevive à exclusão do aluno (histórico do PdA); as demais entidades pessoais são apagadas em cascade.

## 4. Módulos propostos

Seguindo o padrão de `modules/github` e `modules/linkedin` (interface + token + service + module):

### 4.1 `modules/students`
- `StudentsService`: `create()` (admin — cadastra e dispara o e-mail de primeiro acesso), `findAll()` (paginado, com filtros `status`/`cohort`/`tech`), `findById()`, `update()`, `toggleVisibility()`.
- `POST /api/students/import` — importação em lote a partir da planilha existente (CSV), admin-only, idempotente por e-mail.

### 4.2 `modules/auth` (novo)
- `POST /api/auth/first-access` — token + senha escolhida + aceite do termo LGPD → ativa a conta.
- `POST /api/auth/login` — email + senha (admin ou aluno) → JWT.
- Guard de rota com papéis `admin`/`student`.

### 4.3 `modules/email` (novo)
Mesmo padrão DIP dos outros módulos de integração externa: interface `EmailProvider` + token `EMAIL_PROVIDER` + implementação (Resend/SendGrid/SMTP — **a decidir**, ver seção 6).
- Usado por `StudentsService.create()` para enviar o link de primeiro acesso automaticamente.

### 4.4 `modules/linkedin` (evoluir o existente)
Trocar o `Map` por persistência real, mantendo a interface `LinkedinProfileProvider` intacta.
- `PUT /api/students/:id/linkedin` — admin (no cadastro) ou o próprio aluno autenticado (depois).
- Cada update gera uma entrada em `AuditLog`.

### 4.5 `modules/github` (evoluir o existente)
- Cache em banco (`GithubProfileCache`) com TTL — essencial aqui porque o escopo cresceu: além do perfil básico, busca **linguagens mais usadas** (agregando a linguagem dos repositórios) e **repositórios em destaque** (ordenados por estrelas), o que significa várias chamadas à API por aluno.

### 4.6 `modules/profiles` (evoluir o existente)
- `GET /api/profiles?status=&cohort=&tech=&page=` — lista pública, só retorna alunos com `visible=true`, com filtro por status/turma/tecnologia.
- Trata falha de qualquer provider como `null` no agregado (mesmo padrão já usado para o GitHub hoje).

### 4.7 `modules/audit` (novo)
- `AuditService.log()` chamado pelos outros services em toda escrita (cadastro, edição de LinkedIn, toggle de visibilidade).
- `GET /api/audit` (admin) — consulta do histórico. Pode ficar de fora da v1 se não for prioridade imediata.

### 4.8 Persistência
- **Postgres** + TypeORM ou Prisma, configurado no `AppModule` via `ConfigService` (connection string em `.env`).

### 4.9 Observabilidade
- **Sentry** (ou similar) inicializado em `main.ts`, DSN via variável de ambiente — captura erros não tratados em produção.

## 5. Contratos de API (proposta)

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/profiles` | Lista paginada, com filtros `status`/`cohort`/`tech` | pública |
| GET | `/api/profiles/:identifier` | Perfil agregado de 1 aluno | pública |
| POST | `/api/students` | Admin cadastra aluno → dispara e-mail de primeiro acesso | admin |
| POST | `/api/students/import` | Importa alunos em lote via CSV | admin |
| PUT | `/api/students/:id` | Edita dados básicos (nome, turma, status, foto, github username) | admin |
| PUT | `/api/students/:id/linkedin` | Atualiza dados de LinkedIn | admin ou o próprio aluno |
| PATCH | `/api/students/:id/visibility` | Oculta/reexibe o próprio perfil | o próprio aluno (ou admin) |
| POST | `/api/auth/first-access` | Define senha + aceite LGPD usando o token recebido por e-mail | token de uso único |
| POST | `/api/auth/login` | Login (admin ou aluno) → JWT | pública |
| GET | `/api/audit` | Histórico de alterações | admin (opcional na v1) |

## 6. Decisões fechadas

- **Acesso**: vitrine 100% pública, sem login para visualizar.
- **Cadastro**: admin único cria os alunos; carga inicial vem de planilha existente (import CSV), cadastro seguinte é manual.
- **Conteúdo do perfil**: GitHub (básico + linguagens + repositórios em destaque) + LinkedIn + foto + turma + status.
- **Busca**: filtro por tecnologia e status na listagem.
- **Edição pelo aluno**: publica na hora, sem aprovação do admin; aluno pode ocultar o próprio perfil.
- **Primeiro acesso**: e-mail automático com link + token de uso único; aceite de termo LGPD nesse momento.
- **Banco de dados**: Postgres.
- **Hospedagem**: VPS própria.
- **CI automático**: adiado — não é prioridade agora (fica registrado como backlog, não bloqueia o desenvolvimento).
- **Auditoria**: log básico de quem alterou o quê.
- **Observabilidade**: Sentry (ou similar) desde o MVP.

### Pendências técnicas menores (não bloqueiam o desenho, mas precisam de resposta antes de codar)

- **Provedor de e-mail**: Resend, SendGrid, SMTP próprio? (afeta só a implementação de `modules/email`, não o contrato).
- **Formato da planilha de import**: preciso ver as colunas reais (nome, e-mail, github username, campos de LinkedIn já existem?) pra desenhar o parser do `POST /api/students/import`.
- **Foto de perfil**: confirmar se URL é suficiente para o MVP ou se já precisa de upload de arquivo (S3/disco).

## 7. Ordem de implementação sugerida

1. Persistência base (Postgres + TypeORM/Prisma no `AppModule`).
2. `modules/students` (entidade completa) + import da planilha inicial.
3. `modules/email` + integração no `StudentsService.create()`.
4. `modules/auth` (primeiro acesso com aceite LGPD + login + guards).
5. `modules/linkedin` migrando para Postgres + edição autenticada pelo aluno.
6. `modules/audit` plugado nos pontos de escrita (students, linkedin, visibilidade).
7. `PATCH /api/students/:id/visibility` (ocultar perfil).
8. `GET /api/profiles` com filtros (status, turma, tecnologia).
9. `modules/github` enriquecido (linguagens + repositórios em destaque) com cache — é o item mais caro em chamadas de API, por isso fica por último.
10. Observabilidade (Sentry).

**Fora da ordem imediata (backlog explícito)**: CI automático no GitHub Actions e deploy na VPS — combinados como não-prioritários agora, mas retomar antes de ir pra produção.

Cada item é incremental e não quebra os contratos (`GithubProfileProvider`, `LinkedinProfileProvider`) já definidos — só troca a implementação por trás do token injetado, como o DIP do projeto prevê.
