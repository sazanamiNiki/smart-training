/**
 * Authenticate a request using the Authorization header and return GitHub user data.
 * In non-production environments, accept `test-token-e2e` for test bypass.
 *
 * @param request - Incoming Request.
 * @param env - Worker environment bindings.
 * @returns GitHub user object with `login` and `id`, or null if authentication fails.
 */
export async function authenticateUser(request, env) {
  const authHeader = request.headers.get('Authorization') ?? '';
  const userToken = authHeader.replace(/^Bearer\s+/, '');
  if (!userToken) {
    console.warn('[auth] missing authorization token');
    return null;
  }

  if (env.ENVIRONMENT !== 'production' && userToken === 'test-token-e2e') {
    console.info('[auth] test token accepted (non-production)');
    return { login: 'test-user', id: 0 };
  }

  const ghHeaders = {
    Authorization: `Bearer ${userToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'smart-training-worker',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const userRes = await fetch('https://api.github.com/user', { headers: ghHeaders });
  if (!userRes.ok) {
    console.warn(`[auth] GitHub /user returned ${userRes.status}`);
    return null;
  }

  const userData = await userRes.json();
  console.info(`[auth] authenticated user=${userData.login}`);
  return userData;
}
