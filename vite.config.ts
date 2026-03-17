import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const workerUrl = (env.VITE_GITHUB_PROXY_URL || 'http://localhost:8787').replace(/\/$/, '');

  return {
    plugins: [react()],
    base: env.BASE_PATH || process.env.BASE_PATH || '/',
    server: {
      proxy: {
        '/submit-api': {
          target: workerUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/submit-api/, ''),
        },
        '/mypage-api': {
          target: workerUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mypage-api/, ''),
        },
        '/test-api': {
          target: workerUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/test-api/, ''),
        },
        '/oauth-proxy': {
          target: 'https://github.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/oauth-proxy/, ''),
        },
      },
    },
    worker: {
      format: 'es',
    },
    optimizeDeps: {
      exclude: ['esbuild-wasm'],
    },
  };
});
