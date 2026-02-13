import { initialize, transform as esbuildTransform } from 'esbuild-wasm/esm/browser.js';
import esbuildWasmURL from 'esbuild-wasm/esbuild.wasm?url';

let initialized = false;
let initializing: Promise<void> | null = null;

/** Initialize esbuild-wasm. Call before any transform. */
export function initEsbuild(): Promise<void> {
  if (initialized) return Promise.resolve();
  if (initializing) return initializing;

  initializing = initialize({ wasmURL: esbuildWasmURL, worker: false }).then(() => {
    initialized = true;
  });

  return initializing;
}

/**
 * Transform TypeScript source to JavaScript.
 *
 * @param code - TypeScript source code.
 * @returns Transformed JavaScript code.
 * @throws {Error} If the transformation fails.
 */
export async function transformTS(code: string): Promise<string> {
  const result = await esbuildTransform(code, {
    loader: 'ts',
    target: 'es2020',
  });
  return result.code;
}
