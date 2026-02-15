
const ALLOWED_ORIGIN = 'https://sazanamiNiki.github.io';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
};

const PROXY_PATHS = [
  '/login/device/code',
  '/login/oauth/access_token',
];

/**
 * Encode data to base64url format.
 *
 * @param data - String or ArrayBuffer to encode.
 * @returns Base64url-encoded string.
 */
function b64url(data) {
  const bytes = data instanceof ArrayBuffer
    ? new Uint8Array(data)
    : new TextEncoder().encode(typeof data === 'string' ? data : '');
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
  const padded = pem + '='.repeat((4 - pem.length % 4) % 4);
  const der = Uint8Array.from(atob(padded), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8', der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const now = Math.floor(Date.now() / 1000);
  const h = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const p = b64url(JSON.stringify({ iat: now - 60, exp: now + 600, iss: String(appId) }));
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', key,
    new TextEncoder().encode(`${h}.${p}`)
  );
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
  const { object: { sha: headSha } } = await refRes.json();

  const commitRes = await fetch(`${apiBase}/git/commits/${headSha}`, { headers });
  if (!commitRes.ok) throw new Error(`Failed to get commit: ${commitRes.status}`);
  const { tree: { sha: treeSha } } = await commitRes.json();

  const treeItems = await Promise.all(files.map(async ({ path, content }) => {
    const blobRes = await fetch(`${apiBase}/git/blobs`, {
      method: 'POST', headers,
      body: JSON.stringify({ content, encoding: 'utf-8' }),
    });
    if (!blobRes.ok) throw new Error(`Failed to create blob for ${path}: ${blobRes.status}`);
    const { sha } = await blobRes.json();
    return { path, mode: '100644', type: 'blob', sha };
  }));

  const newTreeRes = await fetch(`${apiBase}/git/trees`, {
    method: 'POST', headers,
    body: JSON.stringify({ base_tree: treeSha, tree: treeItems }),
  });
  if (!newTreeRes.ok) throw new Error(`Failed to create tree: ${newTreeRes.status}`);
  const { sha: newTreeSha } = await newTreeRes.json();

  const newCommitRes = await fetch(`${apiBase}/git/commits`, {
    method: 'POST', headers,
    body: JSON.stringify({ message, tree: newTreeSha, parents: [headSha] }),
  });
  if (!newCommitRes.ok) throw new Error(`Failed to create commit: ${newCommitRes.status}`);
  const { sha: newCommitSha } = await newCommitRes.json();

  const updateRefRes = await fetch(`${apiBase}/git/refs/heads/${branch}`, {
    method: 'PATCH', headers,
    body: JSON.stringify({ sha: newCommitSha }),
  });
  if (!updateRefRes.ok) throw new Error(`Failed to update ref: ${updateRefRes.status}`);
}

/**
 * Handle POST /submit: verify email domain, then commit files via GitHub App.
 *
 * @param request - Incoming Request.
 * @param env - Cloudflare Worker environment bindings.
 * @returns JSON Response.
 */
async function handleSubmit(request, env) {
  const authHeader = request.headers.get('Authorization') ?? '';
  const userToken = authHeader.replace(/^Bearer\s+/, '');
  if (!userToken) {
    return new Response(JSON.stringify({ error: '認証トークンが必要です。' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
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
      status: 401, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const userData = await userRes.json();
  const login = userData.login;

  if (!emailsRes.ok) {
    console.error(`[submit] GET /user/emails failed: ${emailsRes.status} ${await emailsRes.text()}`);
    return new Response(JSON.stringify({ error: 'メールアドレスの取得に失敗しました。' }), {
      status: 403, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const emails = await emailsRes.json();
  const allowedDomain = env.ALLOWED_EMAIL_DOMAIN;
  const hasAllowedEmail = emails.some(e => e.verified && e.email.endsWith(allowedDomain));

  if (!hasAllowedEmail) {
    console.error(`[submit] email domain not allowed for ${login}`);
    return new Response(JSON.stringify({ error: 'Email domain not allowed' }), {
      status: 403, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
  const { quId, code, description } = body;

  let appJwt;
  try {
    appJwt = await generateAppJWT(env.GITHUB_APP_ID, env.GITHUB_APP_PRIVATE_KEY);
  } catch (e) {
    console.error(`[submit] generateAppJWT failed: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(JSON.stringify({ error: 'JWT生成に失敗しました。' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const tokenRes = await fetch(
    `https://api.github.com/app/installations/${env.GITHUB_APP_INSTALLATION_ID}/access_tokens`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${appJwt}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'smart-training-worker',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );

  if (!tokenRes.ok) {
    console.error(`[submit] installation token failed: ${tokenRes.status} ${await tokenRes.text()}`);
    return new Response(JSON.stringify({ error: 'Installation token の取得に失敗しました。' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const { token: installationToken } = await tokenRes.json();
  const basePath = `static/questions/${quId}/answers/${login}`;
  const commitMessage = `Add solution for ${quId} by ${login}`;
  const branch = env.GITHUB_TARGET_BRANCH;

  try {
    await commitFiles(
      installationToken, env.GITHUB_OWNER, env.GITHUB_REPO, branch,
      [
        { path: `${basePath}/execute.ts`, content: code },
        { path: `${basePath}/description.md`, content: description },
      ],
      commitMessage
    );
  } catch (e) {
    console.error(`[submit] commitFile failed: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(JSON.stringify({ error: 'コミットに失敗しました。' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/submit' && request.method === 'POST') {
      return handleSubmit(request, env);
    }

    if (!PROXY_PATHS.includes(url.pathname)) {
      return new Response('Not Found', { status: 404 });
    }

    const target = new URL(url.pathname + url.search, 'https://github.com');
    const proxied = await fetch(new Request(target, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    }));

    const response = new Response(proxied.body, {
      status: proxied.status,
      headers: proxied.headers,
    });

    Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  },
};
