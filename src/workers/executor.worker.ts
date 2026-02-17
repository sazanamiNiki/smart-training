import { transformTS } from '../services/esbuild.service';
import type { WorkerRequest, WorkerResponse, TestResult } from '../types';

const VITEST_MOCK = `
var __testResults = [];
var __lastActual;

function describe(_name, fn) {
  fn();
}

var it = function(name, fn) {
  __lastActual = undefined;
  try {
    fn();
    __testResults.push({ name: name, input: [], expected: undefined, actual: __lastActual, passed: true });
  } catch (err) {
    __testResults.push({
      name: name, input: [], expected: undefined, actual: __lastActual,
      passed: false, reason: err instanceof Error ? err.message : String(err)
    });
  }
};

it.each = function(cases) {
  return function(nameTemplate, fn) {
    cases.forEach(function(caseData) {
      var name = nameTemplate.replace(/\\$(\\w+)/g, function(_, key) {
        return caseData[key] !== undefined ? String(caseData[key]) : '';
      });
      __lastActual = undefined;
      try {
        fn(caseData);
        __testResults.push({
          name: name,
          input: caseData.input || [],
          expected: caseData.expected,
          actual: __lastActual,
          passed: true
        });
      } catch (err) {
        __testResults.push({
          name: name,
          input: caseData.input || [],
          expected: caseData.expected,
          actual: __lastActual,
          passed: false,
          reason: err instanceof Error ? err.message : String(err)
        });
      }
    });
  };
};

function __deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function __matchObject(actual, expected) {
  if (expected === null || typeof expected !== 'object') return actual === expected;
  if (actual === null || typeof actual !== 'object') return false;
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || actual.length !== expected.length) return false;
    return expected.every(function(v, i) { return __matchObject(actual[i], v); });
  }
  return Object.keys(expected).every(function(key) {
    return __matchObject(actual[key], expected[key]);
  });
}

function expect(actual) {
  if (typeof actual !== 'function') {
    __lastActual = actual;
  }
  return {
    toBe: function(expected) {
      if (actual !== expected) throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
    },
    toEqual: function(expected) {
      if (!__deepEqual(actual, expected)) throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
    },
    toMatchObject: function(expected) {
      if (!__matchObject(actual, expected)) {
        var expKeys = Object.keys(expected);
        for (var i = 0; i < expKeys.length; i++) {
          var k = expKeys[i];
          if (!__matchObject(actual[k], expected[k])) {
            throw new Error('Property "' + k + '": expected ' + JSON.stringify(expected[k]) + ', got ' + JSON.stringify(actual[k]));
          }
        }
        throw new Error('Object mismatch');
      }
    },
    toHaveLength: function(n) {
      if (!actual || actual.length !== n) throw new Error('Expected length ' + n + ', got ' + (actual ? actual.length : 'undefined'));
    },
    toBeGreaterThan: function(n) {
      if (actual <= n) throw new Error('Expected ' + actual + ' to be greater than ' + n);
    },
    toThrow: function(msg) {
      var threw = false;
      var thrownMsg = '';
      try { actual(); } catch (err) {
        threw = true;
        thrownMsg = err instanceof Error ? err.message : String(err);
        __lastActual = thrownMsg;
      }
      if (!threw) throw new Error('Expected function to throw');
      if (msg !== undefined && !thrownMsg.includes(String(msg))) {
        throw new Error('Expected to throw "' + msg + '", got "' + thrownMsg + '"');
      }
    }
  };
}
`;

function stripModuleSyntax(code: string): string {
  return code
    .replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, '')
    .replace(/^export\s+(const|let|var|function\*?|class)\s+/gm, '$1 ')
    .replace(/^export\s+default\s+/gm, 'var __default = ')
    .trim();
}

function stripTestImports(code: string): string {
  return code
    .replace(/^import\s+.*from\s+['"]vitest['"].*$/gm, '')
    .replace(/^import\s+.*from\s+['"]\.\/execute['"].*$/gm, '')
    .replace(/^import\s+.*from\s+['"]\.\/testCases['"].*$/gm, '')
    .trim();
}

const CONSOLE_MOCK = `
var __consoleLogs = [];
function __serialize(a) {
  if (a === undefined) return 'undefined';
  if (a === null) return 'null';
  try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch (e) { return String(a); }
}
var console = {
  log:   function() { __consoleLogs.push({ type: 'log',   args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
  warn:  function() { __consoleLogs.push({ type: 'warn',  args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
  error: function() { __consoleLogs.push({ type: 'error', args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
  info:  function() { __consoleLogs.push({ type: 'info',  args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
};
`;

function buildUserCode(code: string, constants?: string) {
  const userJsCode = stripModuleSyntax(code);
  let constantsJsCode = '';
  if (constants) {
    constantsJsCode = stripModuleSyntax(constants);
  }
  return { userJsCode, constantsJsCode };
}

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

function executeCode({ code, constants }: { code: string; constants?: string }) {
  const { userJsCode, constantsJsCode } = buildUserCode(code, constants);
  const body = [
    CONSOLE_MOCK,
    constantsJsCode,
    userJsCode,
    'return __consoleLogs;',
  ].join('\n');
  return new Function(body)();
}

self.onmessage = async (event) => {
  try {
    const { type, code, constants } = event.data as WorkerRequest;
    if (type === 'execute') {
      const logs = executeCode({ code: await transformTS(code), constants: constants ? await transformTS(constants) : undefined });
      self.postMessage({ type: 'console-result', logs } as WorkerResponse);
      return;
    }

    if (type !== 'run') return;
    const { testCode, testCases } = event.data as WorkerRequest & { testCode: string; testCases: unknown[] };
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
