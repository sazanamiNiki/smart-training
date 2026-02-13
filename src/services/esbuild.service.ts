import * as esbuild from 'esbuild-wasm/esm/browser.js';
import wasmURL from 'esbuild-wasm/esbuild.wasm?url';

let initialized = false;
let initPromise: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
  if (initialized) return Promise.resolve();
  if (!initPromise) {
    initPromise = esbuild
      .initialize({ wasmURL, worker: false })
      .then(() => {
        initialized = true;
      });
  }
  return initPromise;
}

export async function transformTS(code: string): Promise<string> {
  await ensureInitialized();
  const result = await esbuild.transform(code, {
    loader: 'ts',
    target: 'es2020',
  });
  return result.code;
}
