import type { SessionState } from '../types';

const SESSION_KEY = 'smart-training:session';

export function loadSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}

export function saveSession(state: SessionState): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    // noop
  }
}

export function saveProblemCode(problemId: string, code: string): void {
  const session = loadSession() ?? { selectedProblemId: problemId, codes: {} };
  session.codes[problemId] = code;
  saveSession(session);
}

export function loadProblemCode(problemId: string): string | null {
  return loadSession()?.codes[problemId] ?? null;
}

export function saveSelectedProblemId(id: string): void {
  const session = loadSession() ?? { selectedProblemId: id, codes: {} };
  session.selectedProblemId = id;
  saveSession(session);
}

export function loadSelectedProblemId(): string | null {
  return loadSession()?.selectedProblemId ?? null;
}
