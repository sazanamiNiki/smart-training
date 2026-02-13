import {
  Alert,
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

/**
 * Display test execution results in a table.
 *
 * @param props - Test result panel props.
 * @returns Test result panel element.
 */
export default function TestResultPanel({ results, isRunning, error }: TestResultPanelProps) {
  const allPassed = results !== null && results.every((r) => r.passed);
  const failCount = results ? results.filter((r) => !r.passed).length : 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6">Test Results</Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {isRunning && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {error && !isRunning && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        {results && !isRunning && (
          <>
            <Alert
              severity={allPassed ? 'success' : 'error'}
              sx={{ mb: 2, borderRadius: 1 }}
            >
              {allPassed
                ? `All ${results.length} tests passed`
                : `${failCount} / ${results.length} tests failed`}
            </Alert>

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
                      <TableCell>
                        {result.error ?? JSON.stringify(result.actual)}
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: result.passed ? 'success.main' : 'error.main',
                            fontWeight: 600,
                            fontSize: '13px',
                          }}
                        >
                          {result.passed ? 'PASS' : 'FAIL'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {!results && !isRunning && !error && (
          <Typography
            color="text.secondary"
            sx={{ textAlign: 'center', pt: 4, fontSize: '14px' }}
          >
            Run tests to see results
          </Typography>
        )}
      </Box>
    </Box>
  );
}
