import { transformTS } from '../services/esbuild.service';
import type { TestResult, WorkerRequest, WorkerResponse } from '../types';
import { CONSOLE_MOCK } from './mocks/console-mock';
import { VITEST_MOCK } from './mocks/vitest-mock';

// ---------------------------------------------------------------------------
// Code transformation helpers
// ---------------------------------------------------------------------------

/** Strip ES module syntax so code can run inside `new Function()`. */
function stripModuleSyntax(code: string): string {
  return code
    .replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, '')
    .replace(/^export\s+(const|let|var|function\*?|class)\s+/gm, '$1 ')
    .replace(/^export\s+default\s+/gm, 'var __default = ')
    .trim();
}

/** Strip vitest / local imports that are replaced by mocks at runtime. */
function stripTestImports(code: string): string {
  return code
    .replace(/^import\s+.*from\s+['"]vitest['"].*$/gm, '')
    .replace(/^import\s+.*from\s+['"]\.\/execute['"].*$/gm, '')
    .replace(/^import\s+.*from\s+['"]\.\/testCases['"].*$/gm, '')
    .trim();
}

/** Prepare user / constants code by stripping module syntax. */
function buildUserCode(code: string, constants?: string) {
  const userJsCode = stripModuleSyntax(code);
  const constantsJsCode = constants ? stripModuleSyntax(constants) : '';
  return { userJsCode, constantsJsCode };
}

// ---------------------------------------------------------------------------
// Execution strategies
// ---------------------------------------------------------------------------

/** Run test cases against user code and return results + console logs. */
function runTest({ code, constants, testCode, testCases }: { code: string; constants?: string; testCode: string; testCases: unknown[] }) {
  const { userJsCode, constantsJsCode } = buildUserCode(code, constants);
  const testCodeBody = stripTestImports(testCode);
  const body = [
    CONSOLE_MOCK,
    VITEST_MOCK,
    constantsJsCode,
    userJsCode,
    `var testCases = ${JSON.stringify(testCases)};`,
    testCodeBody,
    'return { results: __testResults, logs: typeof __consoleLogs !== "undefined" ? __consoleLogs : [] };',
  ].join('\n');
  return new Function(body)();
}

/** Execute user code (console output only, no tests). */
function executeCode({ code, constants }: { code: string; constants?: string }) {
  const { userJsCode, constantsJsCode } = buildUserCode(code, constants);
  const body = [CONSOLE_MOCK, constantsJsCode, userJsCode, 'return __consoleLogs;'].join('\n');
  return new Function(body)();
}

// ---------------------------------------------------------------------------
// Worker message handler
// ---------------------------------------------------------------------------

self.onmessage = async (event) => {
  try {
    const { type, code, constants } = event.data as WorkerRequest;

    if (type === 'execute') {
      const logs = executeCode({
        code: await transformTS(code),
        constants: constants ? await transformTS(constants) : undefined,
      });
      self.postMessage({ type: 'console-result', logs } as WorkerResponse);
      return;
    }

    if (type !== 'run') return;

    const { testCode, testCases } = event.data as WorkerRequest & {
      testCode: string;
      testCases: unknown[];
    };
    const resultObj = runTest({
      code: await transformTS(code),
      constants: constants ? await transformTS(constants) : undefined,
      testCode: await transformTS(testCode),
      testCases,
    });
    const results: TestResult[] = resultObj.results.map((r: any) => ({
      name: r.name,
      input: r.input ?? [],
      expected: r.expected,
      actual: r.actual,
      passed: r.passed,
      reason: r.reason,
    }));
    self.postMessage({ type: 'result', results, logs: resultObj.logs } as WorkerResponse);
  } catch (err) {
    self.postMessage({
      type: 'error',
      message: err instanceof Error ? err.message : String(err),
    } as WorkerResponse);
  }
};
