import type { Problem } from '../../types';

/** Props for EditorPanel. */
export interface EditorPanelProps {
  problem: Problem;
  code: string;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  isRunning: boolean;
}
