import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import EditorPanel from './components/Editor/EditorPanel';
import { useEditor } from './components/Editor/hooks/useEditor';
import TestResultPanel from './components/TestRunner/TestResultPanel';
import arrayMax from './problems/list/arrayMax';
import sum from './problems/list/sum';
import type { Problem } from './types';

const PROBLEMS: Array<Problem> = [sum, arrayMax];

/**
 * Root application component.
 *
 * @returns Application element.
 */
export default function App() {
  const [selectedId, setSelectedId] = useState<string>(PROBLEMS[0].id);
  const problem = PROBLEMS.find((p) => p.id === selectedId) ?? PROBLEMS[0];
  const { code, setCode, isRunning, results, error, runTests } = useEditor(problem);

  const handleProblemChange = (e: SelectChangeEvent) => {
    setSelectedId(e.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'primary.main' }}>
          TypeScript Practice
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={selectedId}
            onChange={handleProblemChange}
            sx={{ fontSize: '14px' }}
          >
            {PROBLEMS.map((p) => (
              <MenuItem key={p.id} value={p.id} sx={{ fontSize: '14px' }}>
                {p.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box
          sx={{ width: '70%', borderRight: '1px solid', borderColor: 'divider' }}
        >
          <EditorPanel
            problem={problem}
            code={code}
            onCodeChange={setCode}
            onRun={runTests}
            isRunning={isRunning}
          />
        </Box>
        <Box sx={{ width: '30%' }}>
          <TestResultPanel results={results} isRunning={isRunning} error={error} />
        </Box>
      </Box>
    </Box>
  );
}
