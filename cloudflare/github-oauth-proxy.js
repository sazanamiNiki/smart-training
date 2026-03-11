const ALLOWED_ORIGIN = 'https://sazanaminiki.github.io';

const REVIEW_SYSTEM_PROMPT = `あなたはTypeScriptのコードレビュアーです。
提出されたコードを分析し、以下の観点でMarkdown形式のレビューを日本語で返してください。

## レビュー観点
1. **コード品質**: 可読性・保守性・命名規則
2. **改善点**: より良い実装方法・リファクタリングの提案
3. **良い点**: 適切な実装・工夫されている部分

## 出力形式
必ず以下のセクションを含むMarkdownで返してください：
- ## コード品質
- ## 改善点
- ## 良い点

簡潔に、開発者が学習できるフィードバックを提供してください。`;

const AGGREGATE_REVIEW_SYSTEM_PROMPT = `あなたはTypeScriptのコードレビュアーです。
複数の問題に対して提出されたコードをまとめて分析し、開発者全体のスキルと傾向を評価してください。

## レビュー観点
1. **全体的なコードスタイル**: 命名規則・可読性・一貫性
2. **強み**: 複数の提出を通じて見られる良いパターン・得意な実装
3. **改善が必要な点**: 繰り返し見られる課題・成長の余地
4. **学習アドバイス**: 今後の学習において優先すべき事項

## 出力形式
必ず以下のセクションを含むMarkdownで返してください：
- ## 全体的なコードスタイル
- ## 強み
- ## 改善が必要な点
- ## 学習アドバイス

開発者が自分のスキルを客観的に把握し、次のステップを明確にできるフィードバックを提供してください。`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

const PROXY_PATHS = ['/login/device/code', '/login/oauth/access_token'];

/**
 * Encode data to base64url format.
 *
 * @param data - String or ArrayBuffer to encode.
 * @returns Base64url-encoded string.
 */
function b64url(data) {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new TextEncoder().encode(typeof data === 'string' ? data : '');
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Generate a GitHub App JWT using Web Crypto (RS256).
 *
 * @param appId - GitHub App ID.
 * @param privateKeyPem - PKCS#8 PEM-encoded private key.
 * @returns Signed JWT string.
 * @throws {Error} If the key is invalid or signing fails.
 */
async function generateAppJWT(appId, privateKeyPem) {
  const pem = privateKeyPem
    .replace(/-----[^-]+-----/g, '')
    .replace(/\\r\\n|\\r|\\n/g, '')
    .replace(/[^A-Za-z0-9+/]/g, '');
  if (pem.length % 4 === 1) {
    throw new Error(`Invalid PEM base64 length: ${pem.length}`);
  }
  const padded = pem + '='.repeat((4 - (pem.length % 4)) % 4);
  const der = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);

  const now = Math.floor(Date.now() / 1000);
  const h = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const p = b64url(JSON.stringify({ iat: now - 60, exp: now + 600, iss: parseInt(appId, 10) }));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${h}.${p}`));
  return `${h}.${p}.${b64url(sig)}`;
}

/**
 * Commit multiple files in a single commit via GitHub Git Data API.
 *
 * @param installationToken - GitHub App installation access token.
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param branch - Target branch name.
 * @param files - Array of { path, content } to commit.
 * @param message - Commit message.
 * @throws {Error} If any API request fails.
 */
async function commitFiles(installationToken, owner, repo, branch, files, message) {
  const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    Authorization: `Bearer ${installationToken}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'smart-training-worker',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const refRes = await fetch(`${apiBase}/git/refs/heads/${branch}`, { headers });
  if (!refRes.ok) throw new Error(`Failed to get ref: ${refRes.status}`);
  const {
    object: { sha: headSha },
  } = await refRes.json();

  const commitRes = await fetch(`${apiBase}/git/commits/${headSha}`, { headers });
  if (!commitRes.ok) throw new Error(`Failed to get commit: ${commitRes.status}`);
  const {
    tree: { sha: treeSha },
  } = await commitRes.json();

  const treeItems = await Promise.all(
    files.map(async ({ path, content }) => {
      const blobRes = await fetch(`${apiBase}/git/blobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content, encoding: 'utf-8' }),
      });
      if (!blobRes.ok) throw new Error(`Failed to create blob for ${path}: ${blobRes.status}`);
      const { sha } = await blobRes.json();
      return { path, mode: '100644', type: 'blob', sha };
    }),
  );

  const newTreeRes = await fetch(`${apiBase}/git/trees`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ base_tree: treeSha, tree: treeItems }),
  });
  if (!newTreeRes.ok) throw new Error(`Failed to create tree: ${newTreeRes.status}`);
  const { sha: newTreeSha } = await newTreeRes.json();

  const newCommitRes = await fetch(`${apiBase}/git/commits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, tree: newTreeSha, parents: [headSha] }),
  });
  if (!newCommitRes.ok) throw new Error(`Failed to create commit: ${newCommitRes.status}`);
  const { sha: newCommitSha } = await newCommitRes.json();

  const updateRefRes = await fetch(`${apiBase}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ sha: newCommitSha }),
  });
  if (!updateRefRes.ok) throw new Error(`Failed to update ref: ${updateRefRes.status}`);
}

/**
 * Call Gemini API to generate a code review.
 *
 * @param env - Worker environment bindings.
 * @param code - Submitted code.
 * @param quId - Question ID.
 * @returns Review markdown string.
 * @throws {Error} If the API request fails.
 */
async function callGeminiAPI(env, code, quId) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: REVIEW_SYSTEM_PROMPT }],
      },
      contents: [
        {
          parts: [
            {
              text: `問題ID: ${quId}\n\n提出コード:\n\`\`\`typescript\n${code}\n\`\`\``,
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * Call Claude Opus API to generate a code review.
 *
 * @param env - Worker environment bindings.
 * @param code - Submitted code.
 * @param quId - Question ID.
 * @returns Review markdown string.
 * @throws {Error} If the API request fails.
 */
async function callClaudeAPI(env, code, quId) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      system: REVIEW_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `問題ID: ${quId}\n\n提出コード:\n\`\`\`typescript\n${code}\n\`\`\``,
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

/**
 * Generate a code review based on the current environment.
 *
 * @param env - Worker environment bindings.
 * @param code - Submitted code.
 * @param quId - Question ID.
 * @returns Review markdown string.
 * @throws {Error} If the API request fails.
 */
async function generateReview(env, code, quId) {
  if (env.ENVIRONMENT === 'production') {
    return callClaudeAPI(env, code, quId);
  }
  return callGeminiAPI(env, code, quId);
}

/**
 * Call Gemini API to generate an aggregate code review.
 *
 * @param env - Worker environment bindings.
 * @param codesWithQuId - Array of { quId, code } for all submissions.
 * @returns Aggregate review markdown string.
 * @throws {Error} If the API request fails.
 */
async function callGeminiAggregateAPI(env, codesWithQuId) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const codeSection = codesWithQuId.map(({ quId, code }) => `### 問題ID: ${quId}\n\`\`\`typescript\n${code}\n\`\`\``).join('\n\n');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: AGGREGATE_REVIEW_SYSTEM_PROMPT }],
      },
      contents: [
        {
          parts: [
            {
              text: `以下は同一ユーザーが複数の問題に提出したコードです。全体を通して評価してください。\n\n${codeSection}`,
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * Call Claude Opus API to generate an aggregate code review.
 *
 * @param env - Worker environment bindings.
 * @param codesWithQuId - Array of { quId, code } for all submissions.
 * @returns Aggregate review markdown string.
 * @throws {Error} If the API request fails.
 */
async function callClaudeAggregateAPI(env, codesWithQuId) {
  const codeSection = codesWithQuId.map(({ quId, code }) => `### 問題ID: ${quId}\n\`\`\`typescript\n${code}\n\`\`\``).join('\n\n');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: AGGREGATE_REVIEW_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `以下は同一ユーザーが複数の問題に提出したコードです。全体を通して評価してください。\n\n${codeSection}`,
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

/**
 * Generate an aggregate review from all user submissions.
 *
 * @param env - Worker environment bindings.
 * @param codesWithQuId - Array of { quId, code } for all submissions.
 * @returns Aggregate review markdown string.
 * @throws {Error} If the API request fails.
 */
async function generateAggregateReview(env, codesWithQuId) {
  if (env.ENVIRONMENT === 'production') {
    return callClaudeAggregateAPI(env, codesWithQuId);
  }
  return callGeminiAggregateAPI(env, codesWithQuId);
}

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
async function runReviewBackground(env, userId, email, quId, code, submissionId) {
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

/**
 * Authenticate a request using the Authorization header and return GitHub user data.
 *
 * @param request - Incoming Request.
 * @returns GitHub user object with `login` and `id`, or null if authentication fails.
 */
async function authenticateUser(request) {
  const authHeader = request.headers.get('Authorization') ?? '';
  const userToken = authHeader.replace(/^Bearer\s+/, '');
  if (!userToken) return null;

  const ghHeaders = {
    Authorization: `Bearer ${userToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'smart-training-worker',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const userRes = await fetch('https://api.github.com/user', { headers: ghHeaders });
  if (!userRes.ok) return null;

  return userRes.json();
}

/**
 * Handle GET /mypage: return submission list and aggregate review for authenticated user.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @returns JSON Response with MyPageResponse shape.
 */
async function handleMyPage(request, env) {
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

/**
 * Handle GET /review: return review markdown for a specific submission.
 * Use query param `type=aggregate` to retrieve the aggregate review.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @returns Markdown text Response.
 */
async function handleReview(request, env) {
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

/**
 * Handle POST /submit: verify email domain, then commit files via GitHub App.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @param ctx - Cloudflare Worker execution context.
 * @returns JSON Response.
 */
async function handleSubmit(request, env, ctx) {
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

  // Validate quId format to prevent path traversal
  if (!quId || typeof quId !== 'string' || !/^qu\d+$/.test(quId)) {
    return new Response(JSON.stringify({ error: 'quId の形式が不正です。' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  // Validate code and description
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

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/submit' && request.method === 'POST') {
      return handleSubmit(request, env, ctx);
    }

    if (url.pathname === '/mypage' && request.method === 'GET') {
      return handleMyPage(request, env);
    }

    if (url.pathname === '/review' && request.method === 'GET') {
      return handleReview(request, env);
    }

    if (!PROXY_PATHS.includes(url.pathname)) {
      return new Response('Not Found', { status: 404 });
    }

    const target = new URL(url.pathname + url.search, 'https://github.com');
    const proxied = await fetch(
      new Request(target, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      }),
    );

    const response = new Response(proxied.body, {
      status: proxied.status,
      headers: proxied.headers,
    });

    Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  },
};
