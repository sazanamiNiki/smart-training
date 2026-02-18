import { useEffect, useRef } from 'react';
import { Button, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Editor, { useMonaco } from '@monaco-editor/react';
import type { EditorPanelProps } from './types';
import { ConsolePanel } from './ConsolePanel';
import styles from './EditorPanel.module.css';

export default function EditorPanel({
  problem,
  code,
  onCodeChange,
  editorFontSize,
  run,
  running,
  execute,
  executing,
  consoleLogs,
  clearConsoleLogs,
}: EditorPanelProps) {
  const monaco = useMonaco();
  const libRef = useRef<{ dispose(): void } | null>(null);

  useEffect(() => {
    if (!monaco) return;
    libRef.current?.dispose();
    libRef.current = null;
    if (problem.constants) {
      const ambientDecls = problem.constants.replace(
        /^const\s+(\w+)\s*=\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*;?/gm,
        'declare const $1: $2;'
      );
      libRef.current = monaco.typescript.typescriptDefaults.addExtraLib(
        ambientDecls,
        'ts:problem-constants.d.ts'
      );
    }
    return () => {
      libRef.current?.dispose();
    };
  }, [monaco, problem.constants]);

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div>
          <Typography variant="body1" className={styles.title}>
            {problem.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" className={styles.mode}>
            [{problem.mode === 'create' ? '新規実装' : 'バグ修正'}]
          </Typography>
        </div>
        <div className={styles.buttonBox}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={run}
            disabled={running || executing}
            startIcon={<FactCheckIcon />}
            className={styles.testBtn}
            data-testid="test-button"
            >
            Test
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={execute}
            disabled={executing || running}
            startIcon={<PlayArrowIcon />}
            data-testid="run-button"
            >
            Run
          </Button>
        </div>
      </div>
      <div className={styles.editorWrap}>
        <Editor
          height="100%"
          language="typescript"
          theme="vs-dark"
          value={code}
          onChange={(value) => onCodeChange(value ?? '')}
          options={{
            fontSize: editorFontSize,
            padding: {
              top: 8,
              bottom: 8
            },
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            automaticLayout: true,
          }}
        />
      </div>
      <ConsolePanel logs={consoleLogs} onClear={clearConsoleLogs} />
      <div className={styles.footer}>
        <Typography variant="body2" color="text.secondary">
          {problem.description}
        </Typography>
      </div>
    </div>
  );
}
