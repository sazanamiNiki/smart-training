import { authenticateUser } from '../lib/auth.js';
import { CORS_HEADERS, SECURITY_HEADERS } from '../lib/constants.js';

/**
 * Handle GET /mypage: return submission list and aggregate review for authenticated user.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @returns JSON Response with MyPageResponse shape.
 */
export async function handleMyPage(request, env) {
  const userData = await authenticateUser(request);
  if (!userData) {
    return new Response(JSON.stringify({ error: '認証トークンが無効です。' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const userId = userData.login;

  const [submissionsResult, aggregateResult] = await Promise.all([
    env.DB.prepare(
      'SELECT id, user_id, email, qu_id, r2_review_key, review_status, submitted_at, reviewed_at FROM submissions WHERE user_id = ? ORDER BY submitted_at DESC',
    )
      .bind(userId)
      .all(),
    env.DB.prepare('SELECT id, user_id, r2_review_key, created_at FROM aggregate_reviews WHERE user_id = ?').bind(userId).first(),
  ]);

  return new Response(
    JSON.stringify({
      submissions: submissionsResult.results,
      aggregateReview: aggregateResult ?? null,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...SECURITY_HEADERS },
    },
  );
}
