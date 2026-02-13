import { useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  Box,
  CircularProgress,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import type { ResultsPanelProps } from './types';

export default function ResultsPanel({ problem, results, running }: ResultsPanelProps) {
  const [tab, setTab] = useState(0);
  const [constantsOpen, setConstantsOpen] = useState(true);

  useEffect(() => {
    if (running || results.length > 0) {
      setTab(1);
    }
  }, [running, results]);

  useEffect(() => {
    setTab(0);
  }, [problem]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        sx={{ borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}
      >
        <Tab label="問題説明" />
        <Tab label="テスト結果" />
      </Tabs>

      {tab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              px: 2,
              py: 1,
              '& h2': { fontSize: '1rem', fontWeight: 600, mt: 1, mb: 0.5 },
              '& h3': { fontSize: '0.875rem', fontWeight: 600, mt: 1, mb: 0.5 },
              '& p': { fontSize: '0.8125rem', lineHeight: 1.6, mb: 1 },
              '& ul, & ol': { fontSize: '0.8125rem', pl: 2, mb: 1 },
              '& li': { mb: 0.25 },
              '& pre': {
                bgcolor: '#0f172a',
                p: 1,
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.8125rem',
                mb: 1,
              },
              '& code': { fontFamily: 'monospace', fontSize: '0.8125rem' },
              '& table': { borderCollapse: 'collapse', mb: 1, width: '100%' },
              '& th, & td': {
                border: '1px solid',
                borderColor: 'divider',
                px: 1,
                py: 0.5,
                fontSize: '0.8125rem',
              },
            }}
          >
            <ReactMarkdown>{problem.readme}</ReactMarkdown>
          </Box>
          {problem.constants && (
            <Box
              sx={{
                ...(constantsOpen ? { flex: 1, minHeight: 0 } : { flexShrink: 0 }),
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                onClick={() => setConstantsOpen(!constantsOpen)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 0.5,
                  cursor: 'pointer',
                  flexShrink: 0,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  定数
                </Typography>
                {constantsOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16 }} />
                )}
              </Box>
              {constantsOpen && (
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <Editor
                    height="100%"
                    value={problem.constants}
                    language="typescript"
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      scrollbar: { vertical: 'auto', horizontal: 'auto' },
                      wordWrap: 'off',
                      fontSize: 13,
                      folding: false,
                      contextmenu: false,
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {running ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : results.length === 0 ? (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Run を実行してテスト結果を表示
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2">
                  {results.filter((r) => r.passed).length} / {results.length} passed
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Input</TableCell>
                      <TableCell>Expected</TableCell>
                      <TableCell>Actual</TableCell>
                      <TableCell>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result, i) => (
                      <TableRow key={i}>
                        <TableCell>{JSON.stringify(result.input)}</TableCell>
                        <TableCell>{JSON.stringify(result.expected)}</TableCell>
                        <TableCell>{result.error ?? JSON.stringify(result.actual)}</TableCell>
                        <TableCell sx={{ color: result.passed ? 'success.main' : 'error.main' }}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
