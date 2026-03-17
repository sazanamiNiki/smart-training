import { runReviewBackground } from '../lib/background-review.js';
import { CORS_HEADERS, SECURITY_HEADERS } from '../lib/constants.js';

/**
 * Handle POST /test-submit: insert submission and trigger review without GitHub auth/commit.
 * Only available in non-production environments.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @param ctx - Cloudflare Worker execution context.
 * @returns JSON Response.
 */
export async function handleTestSubmit(request, env, ctx) {
  if (env.ENVIRONMENT === 'production') {
    return new Response('Not Found', { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const { quId, code, userId = 'test-user', email = 'test@example.com' } = body;

  if (!quId || typeof quId !== 'string' || !/^qu\d+$/.test(quId)) {
    return new Response(JSON.stringify({ error: 'quId の形式が不正です。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  if (!code || typeof code !== 'string') {
    return new Response(JSON.stringify({ error: 'code が不正です。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const existingSubmission = await env.DB.prepare("SELECT id FROM submissions WHERE user_id = ? AND qu_id = ? AND review_status != 'failed'")
    .bind(userId, quId)
    .first();

  if (existingSubmission) {
    return new Response(JSON.stringify({ error: '既に提出済みです。' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const r2CodeKey = `submissions/${userId}/${quId}/code.ts`;
  await env.REVIEW_STORAGE.put(r2CodeKey, code);

  const submittedAt = new Date().toISOString();
  const insertResult = await env.DB.prepare(
    "INSERT INTO submissions (user_id, email, qu_id, r2_code_key, review_status, submitted_at) VALUES (?, ?, ?, ?, 'pending', ?)",
  )
    .bind(userId, email, quId, r2CodeKey, submittedAt)
    .run();
  const submissionId = insertResult.meta.last_row_id;

  ctx.waitUntil(runReviewBackground(env, userId, email, quId, code, submissionId));

  return new Response(JSON.stringify({ success: true, submissionId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...SECURITY_HEADERS },
  });
}

/**
 * Handle DELETE /test-submit: delete all test data for a given user.
 * Only available in non-production environments.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @returns JSON Response.
 */
export async function handleTestSubmitDelete(request, env) {
  if (env.ENVIRONMENT === 'production') {
    return new Response('Not Found', { status: 404 });
  }

  const url = new URL(request.url);
  const userId = url.searchParams.get('userId') || 'test-user';

  const submissions = await env.DB.prepare('SELECT r2_code_key, r2_review_key FROM submissions WHERE user_id = ?').bind(userId).all();

  const r2Deletions = [];
  for (const row of submissions.results) {
    if (row.r2_code_key) r2Deletions.push(env.REVIEW_STORAGE.delete(row.r2_code_key));
    if (row.r2_review_key) r2Deletions.push(env.REVIEW_STORAGE.delete(row.r2_review_key));
  }

  const aggregateReviews = await env.DB.prepare('SELECT r2_review_key FROM aggregate_reviews WHERE user_id = ?').bind(userId).all();
  for (const row of aggregateReviews.results) {
    if (row.r2_review_key) r2Deletions.push(env.REVIEW_STORAGE.delete(row.r2_review_key));
  }

  await Promise.all(r2Deletions);

  await env.DB.prepare('DELETE FROM submissions WHERE user_id = ?').bind(userId).run();
  await env.DB.prepare('DELETE FROM aggregate_reviews WHERE user_id = ?').bind(userId).run();

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}
