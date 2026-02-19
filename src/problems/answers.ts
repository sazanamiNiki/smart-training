/**
 * Answer data loaded from static/questions/qu{N}/answers/[githubId]/ directories.
 */
export interface Answer {
  answerId: string;
  code: string;
  description?: string;
}

let answerMetaPromise: Promise<Array<{ quId: string; answerId: string; hasDescription: boolean }>> | null = null;
const answerDetailCache: Record<string, Promise<Answer>> = {};

/**
 * Resolve the base URL for fetching answer assets.
 *
 * In dev mode Vite may append `/dev` to BASE_URL – strip it so answer
 * asset paths resolve correctly against the static file server root.
 */
function getBaseUrl(): string {
  const raw = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
  return raw.endsWith('/dev') ? raw.slice(0, -4) : raw;
}

const baseUrl = getBaseUrl();

/**
 * answers/answers-index.jsonからメタ情報のみ取得
 */
export async function fetchAnswerMeta(): Promise<Array<{ quId: string; answerId: string; hasDescription: boolean }>> {
  if (!answerMetaPromise) {
    answerMetaPromise = (async () => {
      const res = await fetch(`${baseUrl}/answers/answers-index.json`);
      if (!res.ok) throw new Error('answers-index.json fetch failed');
      return (await res.json()) ?? [];
    })();
  }
  return answerMetaPromise;
}

/**
 * 詳細データ（code, description）を個別fetch＋キャッシュ
 */
export async function fetchAnswerDetail(quId: string, answerId: string): Promise<Answer> {
  const key = `${quId}/${answerId}`;
  if (!answerDetailCache[key]) {
    answerDetailCache[key] = (async () => {
      const codeUrl = `${baseUrl}/answers/${quId}/${answerId}/execute.ts`;
      const descUrl = `${baseUrl}/answers/${quId}/${answerId}/description.md`;
      const [codeRes, descRes] = await Promise.all([fetch(codeUrl), fetch(descUrl)]);
      if (!codeRes.ok) throw new Error('code.ts fetch failed');
      const code = await codeRes.text();
      let description: string | undefined = undefined;
      if (descRes.ok) description = await descRes.text();
      return { answerId, code, description };
    })();
  }
  return answerDetailCache[key];
}
