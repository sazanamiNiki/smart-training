import { transformTS } from '../services/esbuild.service';
import type { WorkerRequest, WorkerResponse, TestResult } from '../types';

function stripModuleSyntax(code: string): string {
  return code
    .replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, '')
    .replace(/^export\s+(const|let|var|function\*?|class)\s+/gm, '$1 ')
    .replace(/^export\s+default\s+/gm, 'var __default = ')
    .trim();
}

self.onmessage = async (event) => {
  const { type, code, testCases, functionName, constants } = event.data as WorkerRequest;
  if (type !== 'run') return;

  let userJsCode: string;
  try {
    userJsCode = stripModuleSyntax(await transformTS(code));
  } catch (err) {
    const response: WorkerResponse = {
      type: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(response);
    return;
  }

  const results: TestResult[] = [];
  for (const { input, expected } of testCases) {
    try {
      const body = constants
        ? `${constants}\nreturn (function(){\n${userJsCode}\nreturn ${functionName};\n})()`
        : `${userJsCode}\nreturn ${functionName};`;
      const fn = new Function(body)() as (...args: unknown[]) => unknown;
      const actual = await Promise.race([
        Promise.resolve().then(() => fn(...input)),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout: 2000ms')), 2000)
        ),
      ]);
      results.push({
        input,
        expected,
        actual,
        passed: JSON.stringify(actual) === JSON.stringify(expected),
      });
    } catch (err) {
      results.push({
        input,
        expected,
        actual: undefined,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const response: WorkerResponse = { type: 'result', results };
  self.postMessage(response);
};
