import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { TestResultPanelProps } from './types';

export default function TestResultPanel({ results, running }: TestResultPanelProps) {
  if (running) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Run を実行してテスト結果を表示
        </Typography>
      </Box>
    );
  }

  const passCount = results.filter((r) => r.passed).length;

  return (
    <Box>
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2">
          {passCount} / {results.length} passed
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
    </Box>
  );
}
