/**
 * Authenticate a request using the Authorization header and return GitHub user data.
 *
 * @param request - Incoming Request.
 * @returns GitHub user object with `login` and `id`, or null if authentication fails.
 */
export async function authenticateUser(request) {
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
