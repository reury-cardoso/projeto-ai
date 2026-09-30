import type { StudentStatus } from '@/lib/mock-data';

// Dados de exemplo do painel admin — espelham ContactRequest, StatusChangeRequest,
// ProfileView e a exclusão em duas etapas de docs/flow-plan.md (§2, §3, §11).

export interface ContactRequestItem {
  id: string;
  studentId: string;
  name: string;
  email: string;
  company: string;
  message: string;
  when: string;
  handled: boolean;
}

export interface StatusChangeItem {
  id: string;
  studentId: string;
  requested: StudentStatus;
  when: string;
  state: 'pending' | 'approved' | 'rejected';
}

export interface DeletionItem {
  id: string;
  studentId: string;
  when: string;
}

export const CONTACT_REQUESTS: ContactRequestItem[] = [
  {
    id: 'c1',
    studentId: '2',
    name: 'Renata Alves',
    email: 'renata@nuvemtech.com',
    company: 'NuvemTech',
    message: 'Gostamos do trabalho do Caio com filas de mensageria. Temos uma vaga de backend, podemos conversar?',
    when: 'há 2h',
    handled: false,
  },
  {
    id: 'c2',
    studentId: '1',
    name: 'Felipe Moura',
    email: 'felipe@impactolab.org',
    company: 'Impacto Lab',
    message: 'Procuramos alguém full stack para um projeto social. O perfil da Ana chamou a atenção.',
    when: 'há 1 dia',
    handled: false,
  },
  {
    id: 'c3',
    studentId: '3',
    name: 'Camila Duarte',
    email: 'camila@pixelforge.dev',
    company: '',
    message: 'Vocês têm mais alunos com React e design system como a Larissa?',
    when: 'há 3 dias',
    handled: true,
  },
];

export const STATUS_CHANGE_REQUESTS: StatusChangeItem[] = [
  { id: 's1', studentId: '4', requested: 'employed', when: 'há 5h', state: 'pending' },
  { id: 's2', studentId: '1', requested: 'graduated', when: 'há 2 dias', state: 'pending' },
];

export const DELETION_REQUESTS: DeletionItem[] = [{ id: 'd1', studentId: '5', when: 'há 1 dia' }];

/** Visualizações de perfil por dia, últimos 30 dias (mais antigo → hoje). */
export const VIEWS_30D = [
  14, 18, 12, 22, 26, 9, 7, 19, 24, 28, 31, 25, 11, 8, 23, 29, 34, 30, 27, 13, 10, 26, 33, 38, 41, 35, 16, 12, 37, 44,
];

/** Visualizações acumuladas por aluno (30 dias). */
export const VIEWS_BY_STUDENT: Record<string, number> = { '1': 212, '2': 186, '3': 141, '4': 64, '5': 88, '6': 97 };

export const ACTIVITY_LOG = [
  { text: 'Renata Alves (NuvemTech) enviou uma mensagem sobre Caio Nascimento', time: 'há 2h' },
  { text: 'Marcos Ribeiro sugeriu mudar o status para Empregado', time: 'há 5h' },
  { text: 'Juliana Farias solicitou a exclusão da conta', time: 'há 1 dia' },
  { text: 'Ana Beatriz Souza atualizou os dados do LinkedIn', time: 'há 1 dia' },
  { text: 'Import de planilha: 12 alunos importados, 1 linha ignorada', time: 'há 3 dias' },
];
