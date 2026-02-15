import type { Problem } from '../../types';

export interface EditorPanelProps {
  problem: Problem;
  code: string;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  running: boolean;
  editorFontSize: number;
}
