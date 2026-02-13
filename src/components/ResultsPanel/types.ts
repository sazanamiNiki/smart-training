import type { Problem, TestResult } from '../../types';

export interface ResultsPanelProps {
  problem: Problem;
  results: TestResult[];
  running: boolean;
}
