import { transformTS } from '../services/esbuild.service';
import type { WorkerRequest, WorkerResponse, TestResult } from '../types';

self.onmessage = async (event) => {
  const { type, code, testCases, functionName } = event.data as WorkerRequest;
  if (type !== 'run') return;

  let jsCode: string;
  try {
    jsCode = await transformTS(code);
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
      const fn = new Function(`${jsCode}\nreturn ${functionName};`)() as (
        ...args: unknown[]
      ) => unknown;
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
