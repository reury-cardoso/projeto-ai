// Dados de exemplo — o formato aqui espelha o que docs/entities-plan.md define
// pro backend (Student, LinkedinProfile, GithubProfileCache, StudentLanguage),
// pra troca por dados reais exigir o mínimo de rework possível.

export type StudentStatus = 'in_training' | 'graduated' | 'employed';

export const STATUS_LABEL: Record<StudentStatus, string> = {
  in_training: 'Em formação',
  graduated: 'Formado',
  employed: 'Empregado',
};

export const STATUS_COLOR: Record<StudentStatus, string> = {
  in_training: 'var(--color-azul-ceu)',
  graduated: 'var(--color-amarelo)',
  employed: 'var(--color-orquidea)',
};

export interface LanguageShare {
  name: string;
  pct: number;
  color: string;
}

/** Tecnologia que o próprio aluno adiciona (não vem do GitHub, então não entra nos dados de linguagens). */
export interface CustomStack {
  name: string;
  color: string;
}

/** Cores da marca sorteadas para as tecnologias adicionadas pelo aluno. */
export const STACK_COLORS = [
  'var(--color-amarelo)',
  'var(--color-azul-ceu)',
  'var(--color-orquidea)',
  'var(--color-roxo-medio)',
  'var(--color-amarelo-claro)',
];

export interface FeaturedRepo {
  name: string;
  description: string;
  url: string;
}

export interface Student {
  id: string;
  slug: string;
  name: string;
  initials: string;
  cohort: string;
  status: StudentStatus;
  visible: boolean;
  avatarBg: string;
  /** Caminho em /public (ex.: /alunos/ana-beatriz-souza.jpg). Sem foto, usa as iniciais. */
  photo?: string;
  github: {
    username: string;
    bio: string;
    publicRepos: number;
    followers: number;
    profileUrl: string;
    languages: LanguageShare[];
    featuredRepos: FeaturedRepo[];
    activity: number[];
  };
  linkedin: {
    headline: string;
    currentPosition: string;
    education: string;
    profileUrl: string;
  } | null;
  /** Texto "sobre" escrito pelo próprio aluno (não vem do GitHub). */
  bio?: string;
  /** Tecnologias extras informadas pelo aluno, além das linguagens detectadas no GitHub. */
  customStacks?: CustomStack[];
}

const HEAT_PATTERN = [
  0.15, 0.85, 0.35, 0.15, 0.6, 0.9, 0.25, 0.15, 0.4, 0.7, 0.15, 0.5, 0.85, 0.2, 0.6, 0.15, 0.9, 0.4,
  0.15, 0.7, 0.3, 0.85, 0.15, 0.5, 0.2, 0.9, 0.4, 0.15, 0.15, 0.4, 0.7, 0.2, 0.85, 0.15, 0.55, 0.9,
  0.3, 0.15, 0.6, 0.4, 0.15, 0.75, 0.85, 0.2, 0.15, 0.5, 0.9, 0.35, 0.15, 0.65, 0.2, 0.85, 0.4, 0.15,
  0.55, 0.9, 0.2, 0.6, 0.15, 0.85, 0.4, 0.15, 0.7, 0.3, 0.9, 0.15, 0.5, 0.2, 0.8, 0.15,
];

export function activityStrip(offset: number, length = 70): number[] {
  return Array.from({ length }, (_, i) => HEAT_PATTERN[(i + offset) % HEAT_PATTERN.length]);
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

export const STUDENTS: Student[] = [
  {
    id: '1',
    slug: 'ana-beatriz-souza',
    name: 'Ana Beatriz Souza',
    initials: initials('Ana Beatriz Souza'),
    cohort: '2025.2',
    status: 'in_training',
    visible: true,
    avatarBg: 'var(--color-amarelo)',
    github: {
      username: 'anabsouza',
      bio: 'Desenvolvedora Full Stack em formação, focada em produtos de impacto social.',
      publicRepos: 22,
      followers: 38,
      profileUrl: 'https://github.com/anabsouza',
      languages: [
        { name: 'JavaScript', pct: 42, color: 'var(--color-amarelo)' },
        { name: 'Python', pct: 28, color: 'var(--color-azul-ceu)' },
        { name: 'TypeScript', pct: 18, color: 'var(--color-orquidea)' },
        { name: 'CSS', pct: 12, color: 'var(--color-roxo-medio)' },
      ],
      featuredRepos: [
        { name: 'agenda-comunitaria', description: 'Sistema de agendamento comunitário', url: '#' },
        { name: 'pda-perfis', description: 'Vitrine de perfis dos alunos da PdA', url: '#' },
      ],
      activity: activityStrip(0),
    },
    linkedin: {
      headline: 'Desenvolvedora Full Stack em formação',
      currentPosition: 'Estagiária — Instituto Cactus',
      education: 'Programadores do Amanhã — Turma 2025.2',
      profileUrl: '#',
    },
    bio: 'Desenvolvedora Full Stack em formação, focada em produtos de impacto social.',
    customStacks: [
      { name: 'Figma', color: 'var(--color-orquidea)' },
      { name: 'Docker', color: 'var(--color-azul-ceu)' },
    ],
  },
  {
    id: '2',
    slug: 'caio-nascimento',
    name: 'Caio Nascimento',
    initials: initials('Caio Nascimento'),
    cohort: '2025.1',
    status: 'graduated',
    visible: true,
    avatarBg: 'var(--color-azul-ceu)',
    github: {
      username: 'caionasc',
      bio: 'Backend, bancos de dados e automação.',
      publicRepos: 31,
      followers: 52,
      profileUrl: 'https://github.com/caionasc',
      languages: [
        { name: 'Node.js', pct: 46, color: 'var(--color-azul-ceu)' },
        { name: 'Go', pct: 24, color: 'var(--color-orquidea)' },
        { name: 'SQL', pct: 30, color: 'var(--color-roxo-medio)' },
      ],
      featuredRepos: [
        { name: 'fila-mensageria', description: 'Fila de mensageria com Node + Redis', url: '#' },
      ],
      activity: activityStrip(11),
    },
    linkedin: {
      headline: 'Desenvolvedor Backend',
      currentPosition: 'Sem vínculo atual',
      education: 'Programadores do Amanhã — Turma 2025.1',
      profileUrl: '#',
    },
  },
  {
    id: '3',
    slug: 'larissa-andrade',
    name: 'Larissa Andrade',
    initials: initials('Larissa Andrade'),
    cohort: '2024.2',
    status: 'employed',
    visible: true,
    avatarBg: 'var(--color-orquidea)',
    github: {
      username: 'landrade',
      bio: 'Front-end e design systems.',
      publicRepos: 27,
      followers: 61,
      profileUrl: 'https://github.com/landrade',
      languages: [
        { name: 'React', pct: 50, color: 'var(--color-amarelo)' },
        { name: 'CSS', pct: 30, color: 'var(--color-roxo-medio)' },
        { name: 'TypeScript', pct: 20, color: 'var(--color-orquidea)' },
      ],
      featuredRepos: [{ name: 'ds-pda', description: 'Design system em React + Tailwind', url: '#' }],
      activity: activityStrip(23),
    },
    linkedin: {
      headline: 'Desenvolvedora Front-end',
      currentPosition: 'Front-end Developer — Nimbus Tech',
      education: 'Programadores do Amanhã — Turma 2024.2',
      profileUrl: '#',
    },
  },
  {
    id: '4',
    slug: 'marcos-ribeiro',
    name: 'Marcos Ribeiro',
    initials: initials('Marcos Ribeiro'),
    cohort: '2025.2',
    status: 'in_training',
    visible: true,
    avatarBg: 'var(--color-roxo-medio)',
    github: {
      username: 'mribeiro',
      bio: 'Explorando Python e ciência de dados.',
      publicRepos: 14,
      followers: 19,
      profileUrl: 'https://github.com/mribeiro',
      languages: [
        { name: 'Python', pct: 55, color: 'var(--color-azul-ceu)' },
        { name: 'JavaScript', pct: 25, color: 'var(--color-amarelo)' },
        { name: 'HTML', pct: 20, color: 'var(--color-roxo-medio)' },
      ],
      featuredRepos: [{ name: 'analise-doacoes', description: 'Análise de dados de doações', url: '#' }],
      activity: activityStrip(34),
    },
    linkedin: null,
  },
  {
    id: '5',
    slug: 'juliana-farias',
    photo: '/alunos/juliana-farias.jpg',
    name: 'Juliana Farias',
    initials: initials('Juliana Farias'),
    cohort: '2025.1',
    status: 'graduated',
    visible: true,
    avatarBg: 'var(--color-amarelo)',
    github: {
      username: 'jfarias',
      bio: 'Mobile e Flutter.',
      publicRepos: 19,
      followers: 33,
      profileUrl: 'https://github.com/jfarias',
      languages: [
        { name: 'Dart', pct: 48, color: 'var(--color-azul-ceu)' },
        { name: 'JavaScript', pct: 22, color: 'var(--color-amarelo)' },
        { name: 'CSS', pct: 30, color: 'var(--color-roxo-medio)' },
      ],
      featuredRepos: [{ name: 'app-transporte', description: 'App de transporte coletivo', url: '#' }],
      activity: activityStrip(45),
    },
    linkedin: {
      headline: 'Desenvolvedora Mobile',
      currentPosition: 'Sem vínculo atual',
      education: 'Programadores do Amanhã — Turma 2025.1',
      profileUrl: '#',
    },
  },
  {
    id: '6',
    slug: 'pedro-lima',
    name: 'Pedro Lima',
    initials: initials('Pedro Lima'),
    cohort: '2024.2',
    status: 'employed',
    visible: true,
    avatarBg: 'var(--color-azul-ceu)',
    github: {
      username: 'plima',
      bio: 'DevOps e infraestrutura.',
      publicRepos: 24,
      followers: 44,
      profileUrl: 'https://github.com/plima',
      languages: [
        { name: 'Shell', pct: 34, color: 'var(--color-roxo-medio)' },
        { name: 'Python', pct: 36, color: 'var(--color-azul-ceu)' },
        { name: 'YAML', pct: 30, color: 'var(--color-orquidea)' },
      ],
      featuredRepos: [{ name: 'infra-ci', description: 'Pipelines de CI/CD reutilizáveis', url: '#' }],
      activity: activityStrip(56),
    },
    linkedin: {
      headline: 'Analista de Infraestrutura',
      currentPosition: 'DevOps — Cloudwise',
      education: 'Programadores do Amanhã — Turma 2024.2',
      profileUrl: '#',
    },
  },
];

export function getStudentBySlug(slug: string): Student | undefined {
  return STUDENTS.find((s) => s.slug === slug);
}

export const COHORTS = Array.from(new Set(STUDENTS.map((s) => s.cohort))).sort();

export const PLATFORM_STATS = {
  totalStudents: 128,
  activeCohorts: 6,
  mappedLanguages: 14,
  pool: [
    { name: 'Em formação', pct: 45, color: 'var(--color-azul-ceu)' },
    { name: 'Formados', pct: 30, color: 'var(--color-amarelo)' },
    { name: 'Empregados', pct: 25, color: 'var(--color-orquidea)' },
  ],
  feed: [
    { initials: 'CN', bg: 'var(--color-azul-ceu)', text: 'Caio publicou um repositório', time: '2h' },
    { initials: 'LA', bg: 'var(--color-orquidea)', text: 'Larissa atualizou o LinkedIn', time: '5h' },
    { initials: 'AB', bg: 'var(--color-amarelo)', text: 'Ana entrou na turma 2025.2', time: '1d' },
  ],
};

export interface ProjectLink {
  label: string;
  url: string;
}

/** Post do feed "Projetos": o aluno conecta um repositório do GitHub e personaliza a apresentação. */
export interface Project {
  id: string;
  repoName: string;
  repoUrl: string;
  title: string;
  description: string;
  links: ProjectLink[];
  /** URL ou data URL da imagem de demonstração; opcional. */
  image?: string;
  createdAt: string;
}

const PROJECTS_BY_STUDENT: Record<string, Project[]> = {
  '1': [
    {
      id: 'p1',
      repoName: 'agenda-comunitaria',
      repoUrl: '#',
      title: 'Agenda Comunitária',
      description:
        'Sistema de agendamento para espaços comunitários, com calendário compartilhado e confirmação por e-mail. Usado por três associações de bairro.',
      links: [
        { label: 'Ver online', url: '#' },
        { label: 'Vídeo de demonstração', url: '#' },
      ],
      createdAt: '2026-08-12',
    },
    {
      id: 'p2',
      repoName: 'pda-perfis',
      repoUrl: '#',
      title: 'Vitrine de talentos do PdA',
      description: 'Portal com os perfis dos alunos do PdA, integrando GitHub e LinkedIn.',
      links: [{ label: 'Ver online', url: '#' }],
      createdAt: '2026-06-03',
    },
  ],
  '5': [
    {
      id: 'p4',
      repoName: 'app-transporte',
      repoUrl: '#',
      title: 'App de transporte coletivo',
      description: 'Aplicativo em Flutter com horários e rotas de ônibus em tempo real para moradores da periferia.',
      links: [
        { label: 'Baixar o app', url: '#' },
        { label: 'Vídeo de demonstração', url: '#' },
      ],
      createdAt: '2026-07-02',
    },
  ],
  '2': [
    {
      id: 'p3',
      repoName: 'fila-mensageria',
      repoUrl: '#',
      title: 'Fila de mensageria',
      description: 'Fila de mensagens com Node.js e Redis, com reprocessamento automático de falhas e painel de monitoramento.',
      links: [{ label: 'Documentação', url: '#' }],
      createdAt: '2026-07-20',
    },
  ],
};

export function getProjects(studentId: string): Project[] {
  return [...(PROJECTS_BY_STUDENT[studentId] ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Credenciais de demonstração do protótipo (sem backend de auth): entram como o primeiro aluno. */
export const DEMO_STUDENT_LOGIN = { email: 'ana@pda.demo', password: 'demo1234' };

/** Credencial de demonstração do admin (protótipo, sem backend de auth): entra em /admin. */
export const DEMO_ADMIN_LOGIN = { email: 'admin@pda.demo', password: 'admin1234' };
