import { runAggregateReviewBackground } from '../lib/background-review.js';
import { authenticateUser } from '../lib/auth.js';
import { CORS_HEADERS, SECURITY_HEADERS } from '../lib/constants.js';

/**
 * Handle POST /aggregate-review: manually trigger aggregate review generation for the authenticated user.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @param ctx - Cloudflare Worker execution context.
 * @returns JSON Response.
 */
export async function handleAggregateReview(request, env, ctx) {
  const userData = await authenticateUser(request, env);
  if (!userData) {
    console.warn('[aggregate-review] authentication failed');
    return new Response(JSON.stringify({ error: '認証トークンが無効です。' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const userId = userData.login;

  try {
    const submission = await env.DB.prepare(
      'SELECT email FROM submissions WHERE user_id = ? LIMIT 1',
    )
      .bind(userId)
      .first();

    if (!submission) {
      console.info(`[aggregate-review] no submissions found user=${userId}`);
      return new Response(JSON.stringify({ error: '提出が見つかりません。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const countResult = await env.DB.prepare(
      "SELECT COUNT(*) as cnt FROM submissions WHERE user_id = ? AND review_status = 'completed'",
    )
      .bind(userId)
      .first();

    if ((countResult?.cnt ?? 0) < 5) {
      console.info(`[aggregate-review] not enough completed submissions user=${userId} count=${countResult?.cnt ?? 0}`);
      return new Response(JSON.stringify({ error: '5件以上の完了済み提出が必要です。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    ctx.waitUntil(runAggregateReviewBackground(env, userId, submission.email));
    console.info(`[aggregate-review] background task queued for user=${userId}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 202,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...SECURITY_HEADERS },
    });
  } catch (e) {
    console.error(`[aggregate-review] failed user=${userId}: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(JSON.stringify({ error: '集計レビューの申請に失敗しました。しばらく経ってから再試行してください。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}
