# Plano de Entidades — Modelo de Dados Canônico

Este é o **documento canônico** do modelo de dados do backend: cardinalidade, dono de cada dado e comportamento de cascade. [docs/backend-plan.md](backend-plan.md) e [docs/flow-plan.md](flow-plan.md) descrevem os módulos e regras de negócio — aqui fica só a estrutura das entidades e como elas se relacionam.

## 1. Visão geral (diagrama textual)

```
Admin ──1:N── RefreshToken (adminId)
Admin ──1:N── StatusChangeRequest.resolvedByAdminId
Admin ──1:N── ContactRequest.resolvedByAdminId

Student ──1:1── LinkedinProfile
Student ──1:1── GithubProfileCache
Student ──1:N── StudentLanguage
Student ──N:N── Cohort (via StudentCohort)
Student ──1:N── RefreshToken (studentId)
Student ──1:N── StatusChangeRequest
Student ──1:N── ProfileView
Student ──0:N── ContactRequest (sobrevive à exclusão do aluno)

AuditLog ──registra ações de Admin/Student sobre qualquer entidade (sem FK real, ver §7)
```

## 2. Admin vs Student: entidades separadas

Papéis são estruturalmente diferentes (admin não tem GitHub/LinkedIn/turma/status), então **não** existe uma tabela `User` genérica com `role` — são duas tabelas.

### `Admin`
| Campo | Tipo |
|---|---|
| `id` | uuid |
| `name` | string |
| `email` | string (unique) |
| `passwordHash` | string |
| `createdAt` / `updatedAt` | date |

Tabela real desde já (não fixo via `.env`), mesmo com um único admin hoje — evita retrabalho se surgir um segundo admin.

### `Student`
| Campo | Tipo | Observação |
|---|---|---|
| `id` | uuid | |
| `name` | string | |
| `email` | string (unique) | |
| `slug` | string (unique) | editável pelo próprio aluno (ver [docs/frontend-plan.md §2](frontend-plan.md#slug-do-perfil-alunosslug)) |
| `photoUrl` | string \| null | |
| `githubUsername` | string | |
| `status` | enum `in_training` \| `graduated` \| `employed` | só o admin edita direto; aluno sugere via `StatusChangeRequest` |
| `visible` | boolean (default `true`) | |
| `passwordHash` | string \| null | `null` até o primeiro acesso |
| `accountStatus` | enum `pending_first_access` \| `active` \| `pending_deletion` | |
| `firstAccessToken` / `firstAccessTokenExpiresAt` | string / date \| null | |
| `consentAcceptedAt` | date \| null | |
| `createdAt` / `updatedAt` | date | |

## 3. Sessões (`RefreshToken`)

FK direta e separada (não o padrão genérico do `AuditLog`) — mais simples de mapear no ORM e com integridade referencial real.

| Campo | Tipo |
|---|---|
| `id` | uuid |
| `studentId` | uuid \| null (FK → `Student`, cascade delete) |
| `adminId` | uuid \| null (FK → `Admin`, cascade delete) |
| `tokenHash` | string |
| `expiresAt` | date |
| `revokedAt` | date \| null |

Regra de aplicação: exatamente um entre `studentId`/`adminId` é preenchido. **Múltiplas linhas simultâneas** por aluno/admin são permitidas (login em vários dispositivos ao mesmo tempo).

## 4. Perfil agregado: LinkedIn e GitHub

Tabelas **separadas** de `Student` (cada uma com ciclo de vida próprio — GitHub expira e é refeito, LinkedIn não).

### `LinkedinProfile` (1:1, cascade delete com o `Student`)
`id`, `studentId` (FK única), `headline`, `currentPosition`, `education`, `profileUrl`, `updatedAt`, `updatedBy` (`admin` \| `student`).

### `GithubProfileCache` (1:1, cascade delete com o `Student`)
`id`, `studentId` (FK única), `username`, `name`, `avatarUrl`, `bio`, `publicRepos`, `followers`, `profileUrl`, `featuredRepos` (jsonb — só exibido, não precisa ser filtrável, por isso fica como JSON e não vira tabela própria), `fetchedAt`. Ao dar refetch, **sobrescreve** — não guarda histórico de versões anteriores.

### `StudentLanguage` (N:1 com `Student`, cascade delete)
Tabela relacional própria (não um JSON) — é o que permite o filtro "alunos que usam React" virar uma query SQL direta em vez de filtro em memória.

| Campo | Tipo |
|---|---|
| `id` | uuid |
| `studentId` | FK → `Student` |
| `language` | string |
| `usageCount` | int (peso pra ordenar/relevância) |

Constraint: único por (`studentId`, `language`).

## 5. Turmas (`Cohort` / `StudentCohort`)

Catálogo **gerenciado pelo admin** (CRUD próprio), não tag livre — evita "2025.2" vs "2025-2" digitado diferente em cada cadastro.

### `Cohort`
`id`, `name` (unique), `startDate` (opcional).

### `StudentCohort` (N:N, cascade delete do lado do `Student`)
Só `studentId` + `cohortId` — **sem** `joinedAt`/`completedAt` (decisão: "participou" já é suficiente, sem necessidade de datas por turma).

## 6. Solicitações (`StatusChangeRequest`, `ContactRequest`)

### `StatusChangeRequest`
| Campo | Tipo |
|---|---|
| `id` | uuid |
| `studentId` | FK → `Student`, cascade delete |
| `requestedStatus` | enum (mesmo enum de `Student.status`) |
| `status` | `pending` \| `approved` \| `rejected` |
| `resolvedByAdminId` | FK → `Admin`, nullable |
| `createdAt` / `resolvedAt` | date |

Regra de aplicação: só **uma pendência por vez** por aluno — uma nova sugestão substitui a pendente anterior (não acumula).

### `ContactRequest`
| Campo | Tipo |
|---|---|
| `id` | uuid |
| `studentId` | FK → `Student`, **`SetNull`** ao excluir o aluno (não cascade — ver §7) |
| `studentNameSnapshot` | string, capturado no momento da criação | garante que o histórico continue legível mesmo depois do `studentId` virar null |
| `recruiterName` / `recruiterEmail` / `company` / `message` | string | |
| `status` | `pending` \| `contacted` | |
| `resolvedByAdminId` | FK → `Admin`, nullable | |
| `createdAt` | date | |

Ambas guardam `resolvedByAdminId` diretamente no próprio registro (consulta direta "quem resolveu", sem precisar cruzar com `AuditLog`).

## 7. Exclusão definitiva do aluno (cascade)

Regra geral: **cascade total** dos dados pessoais/comportamentais do aluno. Duas exceções abaixo.

| Entidade | Ao excluir o `Student` |
|---|---|
| `LinkedinProfile`, `GithubProfileCache`, `StudentLanguage`, `StudentCohort`, `RefreshToken`, `StatusChangeRequest`, `ProfileView` | **cascade delete** (FK real no banco) |
| `ContactRequest` | **não é apagado** — `studentId` vira `null` (`SetNull`), fica só o `studentNameSnapshot` — mantém o histórico de quem o PdA já contatou |
| `AuditLog` | **sem FK real** (`entityId` genérico, ver §8) — não cascateia sozinho no banco; a limpeza dos registros relacionados ao aluno é feita **pela aplicação** (rotina explícita de exclusão remove/anonimiza as linhas correspondentes) |

## 8. `AuditLog`

`entityId` **genérico, sem FK real** — permite logar qualquer tipo de entidade (`student`, `linkedin`, `contactRequest`, etc.) sem precisar de uma coluna de FK por tipo.

| Campo | Tipo |
|---|---|
| `id` | uuid |
| `actorType` | `admin` \| `student` |
| `actorId` | uuid (sem FK real) |
| `action` | string (ex.: `student.created`, `linkedin.updated`) |
| `entityType` | string |
| `entityId` | uuid (sem FK real) |
| `metadata` | jsonb |
| `createdAt` | date |

## 9. `ProfileView`

`id`, `studentId` (FK → `Student`, cascade delete), `viewedAt`, `ipHash`.

## 10. Retenção

`AuditLog` e `ProfileView` **crescem sem limite por enquanto** — sem job de expurgo automático no MVP. Revisar só se o volume virar problema real de custo/performance.
