export interface Problem {
  id: string;
  title: string;
  mode: 'create' | 'fix';
  description: string;
  functionName: string;
  initialCode: string;
  testCases: TestCase[];
}

export interface TestCase {
  input: unknown[];
  expected: unknown;
}

export interface TestResult {
  input: unknown[];
  expected: unknown;
  actual: unknown;
  passed: boolean;
  error?: string;
}

export interface SessionState {
  selectedProblemId: string;
  codes: Record<string, string>;
}

export interface RunMessage {
  type: 'run';
  code: string;
  testCases: TestCase[];
  functionName: string;
}

export interface ResultMessage {
  type: 'result';
  results: TestResult[];
}

export interface ErrorMessage {
  type: 'error';
  message: string;
}

export type WorkerRequest = RunMessage;
export type WorkerResponse = ResultMessage | ErrorMessage;
