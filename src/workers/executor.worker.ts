/// <reference lib="webworker" />

import type { WorkerMessage, WorkerResponse, TestResult } from '../types';

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { code, tests, functionName } = event.data;

  try {
    const fn = new Function(`${code}; return ${functionName};`)() as (
      ...args: unknown[]
    ) => unknown;

    const results: Array<TestResult> = tests.map((test) => {
      try {
        const actual = fn(...test.input);
        return {
          input: test.input,
          expected: test.expected,
          actual,
          passed: JSON.stringify(actual) === JSON.stringify(test.expected),
        };
      } catch (e) {
        return {
          input: test.input,
          expected: test.expected,
          actual: undefined,
          passed: false,
          error: e instanceof Error ? e.message : String(e),
        };
      }
    });

    const response: WorkerResponse = { ok: true, results };
    self.postMessage(response);
  } catch (e) {
    const response: WorkerResponse = {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
    self.postMessage(response);
  }
};
