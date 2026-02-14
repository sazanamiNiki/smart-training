/** Answer data loaded from static/questions/qu*/answers/*.ts files. */
export interface Answer {
  /** File name without extension. e.g. '032' */
  answerId: string;
  /** Raw text of the answer code. */
  code: string;
}

const answerModules = import.meta.glob(
  '/static/questions/qu*/answers/*.ts',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

/**
 * Build a map from quId to Answer[].
 *
 * @returns Map of quId -> Answer[].
 */
function buildAnswerMap(): Map<string, Answer[]> {
  const map = new Map<string, Answer[]>();

  for (const [path, code] of Object.entries(answerModules)) {
    const segments = path.split('/');
    const quId = segments[3];
    const answerId = segments[5].replace(/\.ts$/, '');

    const list = map.get(quId) ?? [];
    list.push({ answerId, code });
    map.set(quId, list);
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
