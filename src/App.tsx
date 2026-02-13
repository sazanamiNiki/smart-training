import { useState } from 'react';
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import problems from './problems';
import { useEditor } from './components/Editor/hooks/useEditor';
import EditorPanel from './components/Editor/EditorPanel';
import TestResultPanel from './components/TestRunner/TestResultPanel';
import { loadSelectedProblemId, saveSelectedProblemId } from './services/storage.service';

export default function App() {
  const [selectedId, setSelectedId] = useState<string>(
    () => loadSelectedProblemId() ?? problems[0].id
  );

  const problem = problems.find((p) => p.id === selectedId) ?? problems[0];
  const { code, setCode, results, running, run } = useEditor(problem);

  const handleProblemChange = (id: string) => {
    setSelectedId(id);
    saveSelectedProblemId(id);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 1,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Typography variant="h2">Smart Training</Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={selectedId}
            onChange={(e) => handleProblemChange(e.target.value)}
          >
            {problems.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box
          sx={{
            width: '70%',
            height: '100%',
            borderRight: '1px solid',
            borderColor: 'divider',
          }}
        >
          <EditorPanel
            problem={problem}
            code={code}
            onCodeChange={setCode}
            onRun={run}
            running={running}
          />
        </Box>
        <Box sx={{ width: '30%', height: '100%', overflow: 'auto' }}>
          <TestResultPanel results={results} running={running} />
        </Box>
      </Box>
    </Box>
  );
}
