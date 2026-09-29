# Plano de Fluxo — Regras de Negócio e Casos de Borda

Complementa [docs/backend-plan.md](backend-plan.md), [docs/frontend-plan.md](frontend-plan.md) e [docs/entities-plan.md](entities-plan.md) (modelo de dados canônico): aqui ficam as regras de **como o sistema se comporta** no dia a dia — ciclo de vida da conta, conflitos, erros e casos de borda que não cabem só em "modelo de dados" ou "tela".

## 1. Primeiro acesso, login e sessão

- **Token de primeiro acesso expirado**: o próprio aluno pode pedir reenvio (`POST /api/auth/resend-first-access` com o e-mail cadastrado) — não depende do admin.
- **Esqueci minha senha**: fluxo padrão por e-mail (`POST /api/auth/forgot-password` → `POST /api/auth/reset-password`), disponível pra aluno e admin.
- **Sessão**: access token JWT de **6h** + **refresh token** — renovação silenciosa (`POST /api/auth/refresh`) sem precisar logar de novo toda hora, mas sem ficar logado indefinidamente.
- **Rate limiting**: endpoints públicos (`/api/profiles*`, `/api/auth/*`) têm limite básico por IP (ex.: `@nestjs/throttler`) pra evitar scraping em massa e brute-force de login.

## 2. Alteração de status do aluno (em formação / formado / empregado)

- Admin altera o status **diretamente**, sem aprovação.
- Aluno pode **sugerir** uma mudança (ex.: "consegui emprego"), mas ela fica **pendente até o admin aprovar** — não muda o status "oficial" sozinha.
- Modelo: `StatusChangeRequest { id, studentId, requestedStatus, status: pending|approved|rejected, createdAt, resolvedAt }`.
- Endpoints: `POST /api/students/:id/status-change-requests` (aluno sugere), `POST /api/status-change-requests/:id/approve` / `.../reject` (admin).
- **Notificação por e-mail**: só dispara quando uma mudança de status é efetivada (seja direta pelo admin, seja aprovação de uma sugestão) — outras edições do admin (nome, turma, foto) não notificam o aluno.

## 3. Exclusão de conta (duas etapas)

- O **próprio aluno** pode solicitar a exclusão da conta (com tela de confirmação/alerta clara sobre o que isso significa).
- Ao solicitar: conta marcada como `pending_deletion` e **some da vitrine imediatamente** (mesmo efeito de "oculto"), mas os dados continuam no banco.
- O **admin** revisa e executa a **exclusão definitiva** (hard delete, remove os registros relacionados — LinkedIn, cache de GitHub, contatos, etc.) — esse é o passo que efetivamente apaga os dados (atende pedido de exclusão via LGPD).
- Endpoints: `POST /api/students/:id/request-deletion` (aluno), `DELETE /api/students/:id` (admin, exclusão real).

## 4. Import de planilha

- Processa linha a linha; se uma linha tiver **erro** (campo obrigatório faltando) ou **e-mail duplicado**, ela é **pulada**, não trava o import inteiro.
- Ao final, retorna um **resumo**: quantos importados com sucesso, quantos pulados e por quê (lista de erros com o número da linha).

## 5. Cache de GitHub

- Atualização **sob demanda**: quando alguém acessa o perfil e o cache (`GithubProfileCache.fetchedAt`) está expirado (TTL vencido), busca de novo na API do GitHub antes de responder. Sem job agendado rodando sozinho em background.
- Se o `githubUsername` for inválido (não existe/deletado), o perfil mostra **"GitHub indisponível"** e o resto do perfil (LinkedIn, dados básicos) funciona normalmente — mesmo padrão defensivo que `ProfilesService` já usa hoje (`.catch(() => null)`).

## 6. Edição concorrente (admin x aluno no LinkedIn)

- **Última edição vence**, sem detecção de conflito nem aviso — cenário raro (admin e aluno editando ao mesmo tempo), não justifica a complexidade de versionamento no MVP.

## 7. Turmas (múltiplas por aluno)

- Um aluno pode ter passado por **mais de uma turma** (repetiu curso, fez mais de um curso do PdA) — modelado como relação N:N (`Cohort`/`StudentCohort`), catálogo de turmas gerenciado pelo admin. Ver [docs/entities-plan.md §5](entities-plan.md#5-turmas-cohort--studentcohort) para os campos.
- Filtro de turma na vitrine passa a ser "aluno participou da turma X" (não "é da turma X").

## 8. Contato com o aluno (mediado pelo PdA)

Recrutador **não** fala direto com o aluno pelo portal — a mensagem vai primeiro para a equipe do PdA, que decide como/quando repassar.

- Formulário público no perfil do aluno → `POST /api/contact-requests { studentId, recruiterName, recruiterEmail, company?, message }`.
- Fica registrado como `ContactRequest { id, studentId, recruiterName, recruiterEmail, company, message, status: pending|contacted, createdAt }`.
- Admin vê a lista de solicitações em `/admin` (`GET /api/contact-requests`) e entra em contato com o aluno por fora do sistema (ou, evolução futura, o backend poderia notificar por e-mail o time do PdA a cada nova solicitação).
- O e-mail do aluno **nunca é exposto publicamente** no perfil — isso resolve a preocupação de privacidade sem precisar de formulário direto aluno↔recrutador.

## 9. Perfil oculto

- Ocultar o perfil (`visible: false`) afeta **só a visibilidade pública na vitrine** — o aluno continua acessando `/minha-conta` e editando tudo normalmente enquanto oculto.

## 10. Publicação imediata

- Cadastro pelo admin, edições do aluno e mudanças de status aparecem **imediatamente** na vitrine — não há delay de revalidação (ISR) nem rebuild; a listagem e o perfil são renderizados dinamicamente a cada request (SSR), então o dado do banco reflete na hora.

## 11. Métricas e analytics (admin)

- Dashboard simples em `/admin` com contagens básicas: total de alunos, quantos com LinkedIn preenchido, quantos ocultos, quantas solicitações de contato pendentes.
- **Visualizações de perfil**: contabiliza acessos a `GET /api/profiles/:identifier` numa tabela `ProfileView { studentId, viewedAt, ipHash }` — dedupe simples por IP dentro de uma janela curta (ex.: 1 view por IP a cada poucas horas) pra não inflar trivialmente o contador com refreshes.
- Endpoint: `GET /api/admin/metrics` (contagens) e `GET /api/students/:id/views` (histórico/contagem por aluno).

## 12. Entidades citadas neste documento

Campos completos, cardinalidade e regras de cascade estão em **[docs/entities-plan.md](entities-plan.md)** (documento canônico do modelo de dados): `Cohort`/`StudentCohort`, `StatusChangeRequest`, `ContactRequest`, `ProfileView`, `RefreshToken`.

## 13. Endpoints novos introduzidos por este documento

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/auth/resend-first-access` | Aluno solicita reenvio do link de primeiro acesso | pública (por e-mail) |
| POST | `/api/auth/forgot-password` / `/api/auth/reset-password` | Recuperação de senha | pública / token |
| POST | `/api/auth/refresh` | Renova o access token usando o refresh token | refresh token |
| POST | `/api/students/:id/status-change-requests` | Aluno sugere mudança de status | aluno |
| POST | `/api/status-change-requests/:id/approve` \| `/reject` | Admin resolve a sugestão | admin |
| POST | `/api/students/:id/request-deletion` | Aluno solicita exclusão da própria conta | aluno |
| DELETE | `/api/students/:id` | Admin executa exclusão definitiva | admin |
| POST | `/api/contact-requests` | Recrutador envia contato sobre um aluno | pública |
| GET | `/api/contact-requests` | Admin lista solicitações de contato | admin |
| GET | `/api/admin/metrics` | Contagens gerais pro dashboard do admin | admin |
| GET | `/api/students/:id/views` | Contagem/histórico de visualizações de um perfil | admin |

Isso substitui/expande a tabela de endpoints mais simples que estava em `backend-plan.md §5` — os dois documentos devem ser lidos juntos.
