import { handleMyPage } from './handlers/mypage.js';
import { handleRetryReview } from './handlers/retry-review.js';
import { handleReview } from './handlers/review.js';
import { handleSubmit } from './handlers/submit.js';
import { handleTestSubmit, handleTestSubmitDelete } from './handlers/test-submit.js';
import { CORS_HEADERS, PROXY_PATHS } from './lib/constants.js';

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response('OK', { status: 200 });
    }

    if (url.pathname === '/submit' && request.method === 'POST') {
      return handleSubmit(request, env, ctx);
    }

    if (url.pathname === '/mypage' && request.method === 'GET') {
      return handleMyPage(request, env);
    }

    if (url.pathname === '/review' && request.method === 'GET') {
      return handleReview(request, env);
    }

    if (url.pathname === '/retry-review' && request.method === 'POST') {
      return handleRetryReview(request, env, ctx);
    }

    if (url.pathname === '/test-submit' && request.method === 'POST') {
      return handleTestSubmit(request, env, ctx);
    }

    if (url.pathname === '/test-submit' && request.method === 'DELETE') {
      return handleTestSubmitDelete(request, env);
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
