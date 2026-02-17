/**
 * Answer data loaded from static/questions/qu{N}/answers/[githubId]/ directories.
 */
export interface Answer {
  answerId: string;
  code: string;
  description?: string;
}



let answerMetaCache: Array<{ quId: string; answerId: string; hasDescription: boolean }> | null = null;
const answerDetailCache: Record<string, Answer> = {};

/**
 * answers/answers-index.jsonからメタ情報のみ取得
 */
export async function fetchAnswerMeta(): Promise<Array<{ quId: string; answerId: string; hasDescription: boolean }>> {
  if (answerMetaCache) return answerMetaCache;
  const res = await fetch('/answers/answers-index.json');
  if (!res.ok) throw new Error('answers-index.json fetch failed');
  answerMetaCache = await res.json();
  return answerMetaCache ?? [];
}

/**
 * 詳細データ（code, description）を個別fetch＋キャッシュ
 */
export async function fetchAnswerDetail(quId: string, answerId: string): Promise<Answer> {
  const key = `${quId}/${answerId}`;
  if (answerDetailCache[key]) return answerDetailCache[key];
  const codeUrl = `/answers/${quId}/${answerId}/execute.ts`;
  const descUrl = `/answers/${quId}/${answerId}/description.md`;
  const [codeRes, descRes] = await Promise.all([
    fetch(codeUrl),
    fetch(descUrl)
  ]);
  if (!codeRes.ok) throw new Error('code.ts fetch failed');
  const code = await codeRes.text();
  let description: string | undefined = undefined;
  if (descRes.ok) description = await descRes.text();
  const answer: Answer = { answerId, code, description };
  answerDetailCache[key] = answer;
  return answer;
}
