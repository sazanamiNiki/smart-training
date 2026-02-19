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
        '/github-oauth/submit': {
          target: workerUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/github-oauth/, ''),
        },
        '/github-oauth': {
          target: 'https://github.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/github-oauth/, ''),
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
