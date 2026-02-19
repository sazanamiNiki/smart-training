/**
 * Configure @monaco-editor/react to load monaco-editor from local node_modules
 * instead of CDN (cdn.jsdelivr.net).
 *
 * This is required because our CSP (Content-Security-Policy) in index.html
 * restricts script-src to 'self', blocking external CDN script loading.
 *
 * Reference: https://github.com/suren-atoyan/monaco-react#use-monaco-editor-as-an-npm-package
 */
import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'typescript' || label === 'javascript') {
      return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url), { type: 'module' });
    }
    return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' });
  },
};

loader.config({ monaco });

// Expose monaco on window for E2E tests (Playwright AppPage uses window.monaco)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).monaco = monaco;
