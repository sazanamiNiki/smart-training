import type { TestResult } from '../../types';

/** Props for TestResultPanel. */
export interface TestResultPanelProps {
  results: Array<TestResult> | null;
  isRunning: boolean;
  error: string | null;
}
