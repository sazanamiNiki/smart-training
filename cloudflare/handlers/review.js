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
  const userData = await authenticateUser(request, env);
  if (!userData) {
    console.warn('[review] authentication failed');
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
    const idParam = url.searchParams.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;
    if (!id || isNaN(id)) {
      console.warn(`[review] invalid aggregate review id="${idParam}" user=${userId}`);
      return new Response(JSON.stringify({ error: 'id が不正です。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
    console.info(`[review] fetching aggregate review id=${id} for user=${userId}`);
    try {
      const aggRow = await env.DB.prepare(
        'SELECT r2_review_key FROM aggregate_reviews WHERE id = ? AND user_id = ?',
      )
        .bind(id, userId)
        .first();
      if (!aggRow) {
        console.info(`[review] aggregate review not found id=${id} user=${userId}`);
        return new Response('Not found', { status: 404, headers: CORS_HEADERS });
      }
      const obj = await env.REVIEW_STORAGE.get(aggRow.r2_review_key);
      if (obj === null) {
        console.error(`[review] R2 object missing key=${aggRow.r2_review_key} user=${userId}`);
        return new Response('Not found', { status: 404, headers: CORS_HEADERS });
      }
      const text = await obj.text();
      return new Response(text, {
        status: 200,
        headers: { 'Content-Type': 'text/markdown; charset=utf-8', ...CORS_HEADERS, ...SECURITY_HEADERS },
      });
    } catch (e) {
      console.error(`[review] R2 get failed for aggregate id=${id} user=${userId}: ${e instanceof Error ? e.message : String(e)}`);
      return new Response(JSON.stringify({ error: 'レビューの取得に失敗しました。' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  }

  if (!quId || typeof quId !== 'string' || !/^qu\d+$/.test(quId)) {
    console.warn(`[review] invalid quId="${quId}" user=${userId}`);
    return new Response(JSON.stringify({ error: 'quId の形式が不正です。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  console.info(`[review] fetching review for user=${userId} quId=${quId}`);
  try {
    const submission = await env.DB.prepare(
      "SELECT r2_review_key FROM submissions WHERE user_id = ? AND qu_id = ? AND review_status = 'completed'",
    )
      .bind(userId, quId)
      .first();

    if (!submission) {
      console.info(`[review] completed submission not found user=${userId} quId=${quId}`);
      return new Response('Not found', { status: 404, headers: CORS_HEADERS });
    }

    const obj = await env.REVIEW_STORAGE.get(submission.r2_review_key);
    if (obj === null) {
      console.error(`[review] R2 object missing for key=${submission.r2_review_key} user=${userId} quId=${quId}`);
      return new Response('Not found', { status: 404, headers: CORS_HEADERS });
    }
    const text = await obj.text();
    return new Response(text, {
      status: 200,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', ...CORS_HEADERS, ...SECURITY_HEADERS },
    });
  } catch (e) {
    console.error(`[review] D1/R2 failed user=${userId} quId=${quId}: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(JSON.stringify({ error: 'レビューの取得に失敗しました。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}
