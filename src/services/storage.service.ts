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

const LAYOUT_FLIP_KEY = 'smart-training:layout_flipped';
const EDITOR_FONT_SIZE_KEY = 'smart-training:editor_font_size';
const DEFAULT_EDITOR_FONT_SIZE = 14;
const COLOR_MODE_KEY = 'smart-training:color_mode';

/** Save layout flip preference to localStorage. */
export function saveLayoutFlipped(flipped: boolean): void {
  try {
    localStorage.setItem(LAYOUT_FLIP_KEY, JSON.stringify(flipped));
  } catch {
    // noop
  }
}

/** Save editor font size preference to localStorage. */
export function saveEditorFontSize(size: number): void {
  try {
    localStorage.setItem(EDITOR_FONT_SIZE_KEY, JSON.stringify(size));
  } catch {
    // noop
  }
}

/** Load editor font size preference from localStorage. */
export function loadEditorFontSize(): number {
  try {
    const raw = localStorage.getItem(EDITOR_FONT_SIZE_KEY);
    if (!raw) return DEFAULT_EDITOR_FONT_SIZE;
    return JSON.parse(raw) as number;
  } catch {
    return DEFAULT_EDITOR_FONT_SIZE;
  }
}

/** Load layout flip preference from localStorage. */
export function loadLayoutFlipped(): boolean {
  try {
    const raw = localStorage.getItem(LAYOUT_FLIP_KEY);
    if (!raw) return false;
    return JSON.parse(raw) as boolean;
  } catch {
    return false;
  }
}

/** Save color mode preference to localStorage. */
export function saveColorMode(mode: 'dark' | 'light'): void {
  try {
    localStorage.setItem(COLOR_MODE_KEY, mode);
  } catch {
    // noop
  }
}

/** Load color mode preference from localStorage. */
export function loadColorMode(): 'dark' | 'light' {
  try {
    const raw = localStorage.getItem(COLOR_MODE_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
    return 'dark';
  } catch {
    return 'dark';
  }
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
