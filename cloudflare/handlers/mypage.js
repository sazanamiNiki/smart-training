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
  const userData = await authenticateUser(request, env);
  if (!userData) {
    console.warn('[mypage] authentication failed');
    return new Response(JSON.stringify({ error: '認証トークンが無効です。' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const userId = userData.login;
  console.info(`[mypage] fetching data for user=${userId}`);

  try {
    const [submissionsResult, aggregateResult] = await Promise.all([
      env.DB.prepare(
        'SELECT id, user_id, email, qu_id, r2_review_key, review_status, submitted_at, reviewed_at FROM submissions WHERE user_id = ? ORDER BY submitted_at DESC',
      )
        .bind(userId)
        .all(),
      env.DB.prepare(
        'SELECT id, user_id, r2_review_key, created_at, submission_ids FROM aggregate_reviews WHERE user_id = ? ORDER BY created_at DESC',
      )
        .bind(userId)
        .all(),
    ]);

    console.info(`[mypage] found ${submissionsResult.results.length} submissions for user=${userId}`);

    return new Response(
      JSON.stringify({
        submissions: submissionsResult.results,
        aggregateReviews: aggregateResult.results,
        aggregateReview: aggregateResult.results[0] ?? null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...SECURITY_HEADERS },
      },
    );
  } catch (e) {
    console.error(`[mypage] D1 query failed user=${userId}: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(JSON.stringify({ error: 'データの取得に失敗しました。しばらく経ってから再試行してください。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}
