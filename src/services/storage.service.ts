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

const GITHUB_TOKEN_KEY = 'smart-training:github_token';
const GITHUB_USER_KEY = 'smart-training:github_user';

/** Save GitHub OAuth access token to localStorage. */
export function saveGitHubToken(token: string): void {
  try {
    localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
  } catch {
    // noop
  }
}

/** Load cached GitHub OAuth access token. */
export function loadGitHubToken(): string | null {
  return localStorage.getItem(GITHUB_TOKEN_KEY);
}

/** Remove cached GitHub OAuth access token. */
export function clearGitHubToken(): void {
  localStorage.removeItem(GITHUB_TOKEN_KEY);
  localStorage.removeItem(GITHUB_USER_KEY);
}

/** Save authenticated GitHub username to localStorage. */
export function saveGitHubUser(user: string): void {
  try {
    localStorage.setItem(GITHUB_USER_KEY, user);
  } catch {
    // noop
  }
}

/** Load cached GitHub username. */
export function loadGitHubUser(): string | null {
  return localStorage.getItem(GITHUB_USER_KEY);
}
