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
export async function generateAppJWT(appId, privateKeyPem) {
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
export async function commitFiles(installationToken, owner, repo, branch, files, message) {
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
