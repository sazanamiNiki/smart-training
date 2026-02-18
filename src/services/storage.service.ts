import type { SessionState } from '../types';

// ---------------------------------------------------------------------------
// Generic localStorage helpers
// ---------------------------------------------------------------------------

/** JSON-serialize and save a value to localStorage. Silently ignores errors. */
function saveItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // noop – quota exceeded or private browsing
  }
}

/** Load and JSON-parse a value from localStorage. Returns `fallback` on miss or error. */
function loadItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Save a raw string value (no JSON wrapping). */
function saveRawItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // noop
  }
}

/** Load a raw string value. Returns `null` on miss. */
function loadRawItem(key: string): string | null {
  return localStorage.getItem(key);
}

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

const SESSION_KEY = 'smart-training:session';
const LAYOUT_FLIP_KEY = 'smart-training:layout_flipped';
const EDITOR_FONT_SIZE_KEY = 'smart-training:editor_font_size';
const COLOR_MODE_KEY = 'smart-training:color_mode';
const GITHUB_TOKEN_KEY = 'smart-training:github_token';
const GITHUB_USER_KEY = 'smart-training:github_user';

const DEFAULT_EDITOR_FONT_SIZE = 14;

// ---------------------------------------------------------------------------
// Session (problem selection + per-problem code)
// ---------------------------------------------------------------------------

/** Load the full session object. */
export function loadSession(): SessionState | null {
  return loadItem<SessionState | null>(SESSION_KEY, null);
}

/** Save the full session object. */
export function saveSession(state: SessionState): void {
  saveItem(SESSION_KEY, state);
}

/** Persist user code for a specific problem. */
export function saveProblemCode(problemId: string, code: string): void {
  const session = loadSession() ?? { selectedProblemId: problemId, codes: {} };
  session.codes[problemId] = code;
  saveSession(session);
}

/** Load saved code for a specific problem. */
export function loadProblemCode(problemId: string): string | null {
  return loadSession()?.codes[problemId] ?? null;
}

/** Persist the currently selected problem ID. */
export function saveSelectedProblemId(id: string): void {
  const session = loadSession() ?? { selectedProblemId: id, codes: {} };
  session.selectedProblemId = id;
  saveSession(session);
}

/** Load the last selected problem ID. */
export function loadSelectedProblemId(): string | null {
  return loadSession()?.selectedProblemId ?? null;
}

// ---------------------------------------------------------------------------
// UI preferences
// ---------------------------------------------------------------------------

/** Save layout flip preference. */
export function saveLayoutFlipped(flipped: boolean): void {
  saveItem(LAYOUT_FLIP_KEY, flipped);
}

/** Load layout flip preference. */
export function loadLayoutFlipped(): boolean {
  return loadItem(LAYOUT_FLIP_KEY, false);
}

/** Save editor font size preference. */
export function saveEditorFontSize(size: number): void {
  saveItem(EDITOR_FONT_SIZE_KEY, size);
}

/** Load editor font size preference. */
export function loadEditorFontSize(): number {
  return loadItem(EDITOR_FONT_SIZE_KEY, DEFAULT_EDITOR_FONT_SIZE);
}

/** Save color mode preference (`'dark'` | `'light'`). */
export function saveColorMode(mode: 'dark' | 'light'): void {
  saveRawItem(COLOR_MODE_KEY, mode);
}

/** Load color mode preference. Defaults to `'dark'`. */
export function loadColorMode(): 'dark' | 'light' {
  const raw = loadRawItem(COLOR_MODE_KEY);
  return raw === 'light' || raw === 'dark' ? raw : 'dark';
}

// ---------------------------------------------------------------------------
// GitHub authentication
// ---------------------------------------------------------------------------

/** Save GitHub OAuth access token. */
export function saveGitHubToken(token: string): void {
  saveRawItem(GITHUB_TOKEN_KEY, token.trim());
}

/** Load cached GitHub OAuth access token. */
export function loadGitHubToken(): string | null {
  return loadRawItem(GITHUB_TOKEN_KEY);
}

/** Remove cached GitHub credentials (token + username). */
export function clearGitHubToken(): void {
  localStorage.removeItem(GITHUB_TOKEN_KEY);
  localStorage.removeItem(GITHUB_USER_KEY);
}

/** Save authenticated GitHub username. */
export function saveGitHubUser(user: string): void {
  saveRawItem(GITHUB_USER_KEY, user);
}

/** Load cached GitHub username. */
export function loadGitHubUser(): string | null {
  return loadRawItem(GITHUB_USER_KEY);
}
