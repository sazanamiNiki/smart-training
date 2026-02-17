import { useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Editor, { useMonaco } from '@monaco-editor/react';
import type { EditorPanelProps } from './types';
import { ConsolePanel } from './ConsolePanel';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {problem.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto' }}>
          [{problem.mode === 'create' ? '新規実装' : 'バグ修正'}]
        </Typography>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={run}
          disabled={running || executing}
          startIcon={<FactCheckIcon />}
          sx={{ color: '#fff' }}
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
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
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
      </Box>
      <ConsolePanel logs={consoleLogs} onClear={clearConsoleLogs} />
      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {problem.description}
        </Typography>
      </Box>
    </Box>
  );
}
