import { runReviewBackground } from '../lib/background-review.js';
import { authenticateUser } from '../lib/auth.js';
import { CORS_HEADERS, SECURITY_HEADERS } from '../lib/constants.js';

/**
 * Handle POST /retry-review: re-trigger review generation for a failed submission.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @param ctx - Cloudflare Worker execution context.
 * @returns JSON Response.
 */
export async function handleRetryReview(request, env, ctx) {
  const userData = await authenticateUser(request, env);
  if (!userData) {
    console.warn('[retry-review] authentication failed');
    return new Response(JSON.stringify({ error: '認証トークンが無効です。' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const userId = userData.login;

  let body;
  try {
    body = await request.json();
  } catch {
    console.warn(`[retry-review] invalid request body user=${userId}`);
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const { quId } = body;
  if (!quId || typeof quId !== 'string' || !/^qu\d+$/.test(quId)) {
    console.warn(`[retry-review] invalid quId="${quId}" user=${userId}`);
    return new Response(JSON.stringify({ error: 'quId の形式が不正です。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  try {
    const submission = await env.DB.prepare(
      "SELECT id, email, r2_code_key FROM submissions WHERE user_id = ? AND qu_id = ? AND review_status = 'failed'",
    )
      .bind(userId, quId)
      .first();

    if (!submission) {
      console.info(`[retry-review] no failed submission found user=${userId} quId=${quId}`);
      return new Response(JSON.stringify({ error: '再申請できる提出が見つかりません。' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // Atomically transition failed → pending. If another request already did this,
    // meta.changes will be 0 and we return 409 to prevent duplicate review runs.
    const updateResult = await env.DB.prepare(
      "UPDATE submissions SET review_status = 'pending', reviewed_at = NULL WHERE id = ? AND review_status = 'failed'",
    )
      .bind(submission.id)
      .run();

    if (updateResult.meta.changes === 0) {
      console.warn(`[retry-review] already retrying submissionId=${submission.id} user=${userId} quId=${quId}`);
      return new Response(JSON.stringify({ error: '既に再申請中です。' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
    console.info(`[retry-review] reset to pending submissionId=${submission.id} user=${userId} quId=${quId}`);

    const codeObj = await env.REVIEW_STORAGE.get(submission.r2_code_key);
    if (codeObj === null) {
      console.error(`[retry-review] R2 code not found key=${submission.r2_code_key} user=${userId} quId=${quId}`);
      // Revert status to failed since we can't proceed
      await env.DB.prepare("UPDATE submissions SET review_status = 'failed' WHERE id = ?").bind(submission.id).run();
      return new Response(JSON.stringify({ error: 'コードが見つかりません。' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
    const code = await codeObj.text();

    ctx.waitUntil(runReviewBackground(env, userId, submission.email, quId, code, submission.id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...SECURITY_HEADERS },
    });
  } catch (e) {
    console.error(`[retry-review] failed user=${userId} quId=${quId}: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(JSON.stringify({ error: '再申請に失敗しました。しばらく経ってから再試行してください。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}
