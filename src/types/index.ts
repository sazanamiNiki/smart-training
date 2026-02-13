/** Mode of a problem. */
export type ProblemMode = 'implement' | 'bugfix';

/** Single test case definition. */
export interface TestCase {
  input: unknown[];
  expected: unknown;
}

/** Problem definition. */
export interface Problem {
  id: string;
  title: string;
  description: string;
  mode: ProblemMode;
  functionName: string;
  initialCode: string;
  tests: Array<TestCase>;
}

/** Result of a single test case execution. */
export interface TestResult {
  input: unknown[];
  expected: unknown;
  actual: unknown;
  passed: boolean;
  error?: string;
}

/** Message sent to executor worker. */
export interface WorkerMessage {
  code: string;
  tests: Array<TestCase>;
  functionName: string;
}

/** Response from executor worker. */
export type WorkerResponse =
  | { ok: true; results: Array<TestResult> }
  | { ok: false; error: string };
