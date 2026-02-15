/**
 * Answer data loaded from static/questions/qu{N}/answers/[githubId]/ directories.
 */
export interface Answer {
  /** GitHub user ID (directory name). e.g. 'octocat' */
  answerId: string;
  /** Raw text of the answer code. */
  code: string;
  /** Raw text of description.md, if present. */
  description?: string;
}

const codeModules = import.meta.glob(
  '/static/questions/qu*/answers/*/*.ts',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

const descModules = import.meta.glob(
  '/static/questions/qu*/answers/*/*.md',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

/**
 * Build a map from quId to Answer[].
 *
 * @returns Map of quId -> Answer[].
 */
function buildAnswerMap(): Map<string, Answer[]> {
  const map = new Map<string, Answer[]>();

  for (const [path, code] of Object.entries(codeModules)) {
    const segments = path.split('/');
    const quId = segments[3];
    const answerId = segments[5];

    const list = map.get(quId) ?? [];
    list.push({ answerId, code });
    map.set(quId, list);
  }

  for (const [path, description] of Object.entries(descModules)) {
    const segments = path.split('/');
    const quId = segments[3];
    const answerId = segments[5];

    const list = map.get(quId);
    if (list) {
      const answer = list.find((a) => a.answerId === answerId);
      if (answer) answer.description = description;
    }
  }

  for (const list of map.values()) {
    list.sort((a, b) => a.answerId.localeCompare(b.answerId));
  }

  return map;
}

const answerMap = buildAnswerMap();

/**
 * Return the map of quId to Answer[].
 *
 * @returns quId -> Answer[] map.
 */
export function getAnswerMap(): Map<string, Answer[]> {
  return answerMap;
}
