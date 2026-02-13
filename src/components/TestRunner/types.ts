import type { TestResult } from '../../types';

export interface TestResultPanelProps {
  results: TestResult[];
  running: boolean;
}
