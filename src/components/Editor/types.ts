import type { ConsoleEntry, Problem } from '../../types';

export interface EditorPanelProps {
  problem: Problem;
  code: string;
  onCodeChange: (code: string) => void;
  editorFontSize: number;
  run: () => void;
  running: boolean;
  execute: () => void;
  executing: boolean;
  consoleLogs: ConsoleEntry[];
  clearConsoleLogs: () => void;
}
