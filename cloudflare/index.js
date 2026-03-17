import { handleMyPage } from './handlers/mypage.js';
import { handleReview } from './handlers/review.js';
import { handleSubmit } from './handlers/submit.js';
import { CORS_HEADERS, PROXY_PATHS } from './lib/constants.js';

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
