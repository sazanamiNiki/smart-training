import { runReviewBackground } from '../lib/background-review.js';
import { CORS_HEADERS, SECURITY_HEADERS } from '../lib/constants.js';
import { commitFiles, generateAppJWT } from '../lib/github.js';

/**
 * Handle POST /submit: verify email domain, then commit files via GitHub App.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @param ctx - Cloudflare Worker execution context.
 * @returns JSON Response.
 */
export async function handleSubmit(request, env, ctx) {
  const authHeader = request.headers.get('Authorization') ?? '';
  const userToken = authHeader.replace(/^Bearer\s+/, '');
  if (!userToken) {
    return new Response(JSON.stringify({ error: '認証トークンが必要です。' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const ghHeaders = {
    Authorization: `Bearer ${userToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'smart-training-worker',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const [userRes, emailsRes] = await Promise.all([
    fetch('https://api.github.com/user', { headers: ghHeaders }),
    fetch('https://api.github.com/user/emails', { headers: ghHeaders }),
  ]);

  if (!userRes.ok) {
    console.error(`[submit] GET /user failed: ${userRes.status} ${await userRes.text()}`);
    return new Response(JSON.stringify({ error: '認証トークンが無効です。' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const userData = await userRes.json();
  const login = userData.login;

  if (!emailsRes.ok) {
    console.error(`[submit] GET /user/emails failed: ${emailsRes.status} ${await emailsRes.text()}`);
    return new Response(JSON.stringify({ error: 'メールアドレスの取得に失敗しました。' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const emails = await emailsRes.json();
  const allowedDomain = env.ALLOWED_EMAIL_DOMAIN;
  const allowedEmailEntry = emails.find((e) => e.verified && e.email.endsWith(allowedDomain));
  const hasAllowedEmail = !!allowedEmailEntry;

  if (!hasAllowedEmail) {
    console.error(`[submit] email domain not allowed for ${login}`);
    return new Response(JSON.stringify({ error: 'Email domain not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  // --- Input validation ---
  const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
  const MAX_BODY_SIZE = 100 * 1024; // 100KB
  if (contentLength > MAX_BODY_SIZE) {
    return new Response(JSON.stringify({ error: 'リクエストサイズが上限を超えています。' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
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
  const { quId, code, description } = body;

  if (!quId || typeof quId !== 'string' || !/^qu\d+$/.test(quId)) {
    return new Response(JSON.stringify({ error: 'quId の形式が不正です。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  if (!code || typeof code !== 'string' || code.length > MAX_BODY_SIZE) {
    return new Response(JSON.stringify({ error: 'code が不正です。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
  if (typeof description !== 'string' || description.length > MAX_BODY_SIZE) {
    return new Response(JSON.stringify({ error: 'description が不正です。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  let appJwt;
  try {
    appJwt = await generateAppJWT(env.GITHUB_APP_ID, env.GITHUB_APP_PRIVATE_KEY);
  } catch (e) {
    console.error(`[submit] generateAppJWT failed: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(JSON.stringify({ error: 'JWT生成に失敗しました。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const tokenRes = await fetch(`https://api.github.com/app/installations/${env.GITHUB_APP_INSTALLATION_ID}/access_tokens`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${appJwt}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'smart-training-worker',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!tokenRes.ok) {
    console.error(`[submit] installation token failed: ${tokenRes.status} ${await tokenRes.text()}`);
    return new Response(JSON.stringify({ error: 'Installation token の取得に失敗しました。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const { token: installationToken } = await tokenRes.json();
  const basePath = `answers/${quId}/${login}`;
  const commitMessage = `Add solution for ${quId} by ${login}`;
  const branch = env.GITHUB_TARGET_BRANCH;

  try {
    await commitFiles(
      installationToken,
      env.GITHUB_OWNER,
      env.GITHUB_REPO,
      branch,
      [
        { path: `${basePath}/execute.ts`, content: code },
        { path: `${basePath}/description.md`, content: description },
      ],
      commitMessage,
    );
  } catch (e) {
    console.error(`[submit] commitFile failed: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(JSON.stringify({ error: 'コミットに失敗しました。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const existingSubmission = await env.DB.prepare("SELECT id FROM submissions WHERE user_id = ? AND qu_id = ? AND review_status != 'failed'")
    .bind(login, quId)
    .first();

  if (existingSubmission) {
    return new Response(JSON.stringify({ error: '既に提出済みです。' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const r2CodeKey = `submissions/${login}/${quId}/code.ts`;
  await env.REVIEW_STORAGE.put(r2CodeKey, code);

  const submittedAt = new Date().toISOString();
  const insertResult = await env.DB.prepare(
    "INSERT INTO submissions (user_id, email, qu_id, r2_code_key, review_status, submitted_at) VALUES (?, ?, ?, ?, 'pending', ?)",
  )
    .bind(login, allowedEmailEntry.email, quId, r2CodeKey, submittedAt)
    .run();
  const submissionId = insertResult.meta.last_row_id;

  ctx.waitUntil(runReviewBackground(env, login, allowedEmailEntry.email, quId, code, submissionId));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...SECURITY_HEADERS },
  });
}
