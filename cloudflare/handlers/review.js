import { authenticateUser } from '../lib/auth.js';
import { CORS_HEADERS, SECURITY_HEADERS } from '../lib/constants.js';

/**
 * Handle GET /review: return review markdown for a specific submission.
 * Use query param `type=aggregate` to retrieve the aggregate review.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @returns Markdown text Response.
 */
export async function handleReview(request, env) {
  const userData = await authenticateUser(request);
  if (!userData) {
    return new Response(JSON.stringify({ error: '認証トークンが無効です。' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const userId = userData.login;
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const quId = url.searchParams.get('quId');

  if (type === 'aggregate') {
    const r2Key = `aggregate-reviews/${userId}/review.md`;
    const obj = await env.REVIEW_STORAGE.get(r2Key);
    if (obj === null) {
      return new Response('Not found', { status: 404, headers: CORS_HEADERS });
    }
    const text = await obj.text();
    return new Response(text, {
      status: 200,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', ...CORS_HEADERS, ...SECURITY_HEADERS },
    });
  }

  if (!quId || typeof quId !== 'string' || !/^qu\d+$/.test(quId)) {
    return new Response(JSON.stringify({ error: 'quId の形式が不正です。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const submission = await env.DB.prepare("SELECT r2_review_key FROM submissions WHERE user_id = ? AND qu_id = ? AND review_status = 'completed'")
    .bind(userId, quId)
    .first();

  if (!submission) {
    return new Response('Not found', { status: 404, headers: CORS_HEADERS });
  }

  const obj = await env.REVIEW_STORAGE.get(submission.r2_review_key);
  if (obj === null) {
    return new Response('Not found', { status: 404, headers: CORS_HEADERS });
  }
  const text = await obj.text();
  return new Response(text, {
    status: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', ...CORS_HEADERS, ...SECURITY_HEADERS },
  });
}
