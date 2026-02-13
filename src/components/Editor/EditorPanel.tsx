import MonacoEditor from '@monaco-editor/react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import type { EditorPanelProps } from './types';

/**
 * Display Monaco Editor with problem description and run button.
 *
 * @param props - Editor panel props.
 * @returns Editor panel element.
 */
export default function EditorPanel({
  problem,
  code,
  onCodeChange,
  onRun,
  isRunning,
}: EditorPanelProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6">{problem.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {problem.description}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <MonacoEditor
          height="100%"
          language="typescript"
          value={code}
          onChange={(val) => onCodeChange(val ?? '')}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 2,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            bracketPairColorization: { enabled: true },
          }}
        />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button variant="contained" onClick={onRun} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Tests'}
        </Button>
        {isRunning && <CircularProgress size={20} />}
      </Box>
    </Box>
  );
}
