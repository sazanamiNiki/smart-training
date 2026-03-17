import { generateAggregateReview, generateReview } from './ai-review.js';

/**
 * Notify GAS Webhook that a review has been completed.
 *
 * @param env - Worker environment bindings.
 * @param email - User's email address.
 */
async function notifyGAS(env, email) {
  try {
    const url = `${env.GAS_WEBHOOK_URL}?path=review-done`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      console.error(`[gas-notify] failed: ${res.status} ${await res.text()}`);
    }
  } catch (err) {
    console.error(`[gas-notify] error: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Run aggregate review generation in the background after the 5th submission.
 *
 * @param env - Worker environment bindings.
 * @param userId - GitHub login.
 * @param email - User's email address.
 */
async function runAggregateReviewBackground(env, userId, email) {
  try {
    const existing = await env.DB.prepare('SELECT id FROM aggregate_reviews WHERE user_id = ?').bind(userId).first();
    if (existing) {
      return;
    }

    const submissions = await env.DB.prepare("SELECT qu_id, r2_code_key FROM submissions WHERE user_id = ? AND review_status = 'completed'").bind(userId).all();

    const codesWithQuId = (
      await Promise.all(
        submissions.results.map(async (row) => {
          const obj = await env.REVIEW_STORAGE.get(row.r2_code_key);
          if (obj === null) return null;
          const code = await obj.text();
          return { quId: row.qu_id, code };
        }),
      )
    ).filter((item) => item !== null);

    if (codesWithQuId.length === 0) {
      return;
    }

    const aggregateMarkdown = await generateAggregateReview(env, codesWithQuId);
    const r2ReviewKey = `aggregate-reviews/${userId}/review.md`;
    await env.REVIEW_STORAGE.put(r2ReviewKey, aggregateMarkdown);

    const createdAt = new Date().toISOString();
    await env.DB.prepare('INSERT INTO aggregate_reviews (user_id, r2_review_key, created_at) VALUES (?, ?, ?)').bind(userId, r2ReviewKey, createdAt).run();

    await notifyGAS(env, email);
  } catch (err) {
    console.error(`[aggregate-review] failed for ${userId}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Run review generation in the background: generate review, save to R2, update D1.
 * If this is the 5th completed review for the user, also trigger aggregate review generation.
 *
 * @param env - Worker environment bindings.
 * @param userId - GitHub login.
 * @param email - User's email address.
 * @param quId - Question ID.
 * @param code - Submitted code.
 * @param submissionId - D1 submission row ID.
 */
export async function runReviewBackground(env, userId, email, quId, code, submissionId) {
  const r2ReviewKey = `reviews/${userId}/${quId}/review.md`;
  try {
    const reviewMarkdown = await generateReview(env, code, quId);
    await env.REVIEW_STORAGE.put(r2ReviewKey, reviewMarkdown);
    const reviewedAt = new Date().toISOString();
    await env.DB.prepare("UPDATE submissions SET review_status = 'completed', r2_review_key = ?, reviewed_at = ? WHERE id = ?")
      .bind(r2ReviewKey, reviewedAt, submissionId)
      .run();

    await notifyGAS(env, email);

    const countResult = await env.DB.prepare("SELECT COUNT(*) as cnt FROM submissions WHERE user_id = ? AND review_status = 'completed'").bind(userId).first();
    if (countResult && countResult.cnt === 5) {
      await runAggregateReviewBackground(env, userId, email);
    }
  } catch (err) {
    console.error(`[review] background review failed for ${userId}/${quId}: ${err instanceof Error ? err.message : String(err)}`);
    await env.DB.prepare("UPDATE submissions SET review_status = 'failed' WHERE id = ?").bind(submissionId).run();
  }
}
