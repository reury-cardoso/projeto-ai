import { useSyncExternalStore } from 'react';

// Sessão de demonstração (sem backend de auth): guarda quem "entrou" no localStorage
// só pra o menu do topo refletir o login. Trocar por sessão real (JWT/cookie) depois.

export type SessionRole = 'student' | 'admin';
export interface DemoSession {
  role: SessionRole;
  name: string;
  initials: string;
}

const KEY = 'pda-demo-session';
const EVENT = 'pda-session-change';

export function setDemoSession(session: DemoSession) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage indisponível: segue sem sessão persistida */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function clearDemoSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

function readRaw() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Sessão atual; `null` no servidor e antes da hidratação. */
export function useDemoSession(): DemoSession | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}
