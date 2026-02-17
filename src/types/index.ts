export interface ProblemMeta {
  id: string;
  quId: string;
  title: string;
  mode: 'create' | 'fix';
  description: string;
  functionName: string;
}

export interface Problem extends ProblemMeta {
  readme: string;
  initialCode: string;
  testCode: string;
  testCases: TestCase[];
  constants?: string;
}

export interface TestCase {
  input: unknown[];
  expected: unknown;
  name: string;
  [key: string]: unknown;
}

export interface TestResult {
  name: string;
  input: unknown[];
  expected: unknown;
  actual: unknown;
  passed: boolean;
  error?: string;
  reason?: string;
}

export interface SessionState {
  selectedProblemId: string;
  codes: Record<string, string>;
}

export interface RunMessage {
  type: 'run';
  code: string;
  testCode: string;
  testCases: TestCase[];
  functionName: string;
  constants?: string;
}

export interface ResultMessage {
  type: 'result';
  results: TestResult[];
}

export interface ErrorMessage {
  type: 'error';
  message: string;
}

export type ConsoleLogType = 'log' | 'warn' | 'error' | 'info';

export interface ConsoleEntry {
  type: ConsoleLogType;
  args: string;
}

export interface ExecuteMessage {
  type: 'execute';
  code: string;
  constants?: string;
}

export interface ConsoleResultMessage {
  type: 'console-result';
  logs: ConsoleEntry[];
}

export type WorkerRequest = RunMessage | ExecuteMessage;
export type WorkerResponse = ResultMessage | ErrorMessage | ConsoleResultMessage;
