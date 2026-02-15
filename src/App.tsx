import { useState } from 'react';
import { Box, Button, FormControl, MenuItem, Select, Typography } from '@mui/material';
import problems from './problems';
import { useEditor } from './components/Editor/hooks/useEditor';
import EditorPanel from './components/Editor/EditorPanel';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';
import { loadSelectedProblemId, saveSelectedProblemId } from './services/storage.service';
import { validateAllProblems } from './utils/problemValidator';

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

  const handleValidate = () => {
    const validationResults = validateAllProblems(problems);
    const report = validationResults
      .map((r) =>
        r.valid
          ? `[OK] ${r.id}`
          : `[FAIL] ${r.id}\n${r.errors.map((e) => `  - ${e}`).join('\n')}`
      )
      .join('\n');
    console.log('=== Problem Validation ===\n' + report);
    alert('=== Problem Validation ===\n' + report);
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
                {p.quId} - {p.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {import.meta.env.DEV && (
          <Button variant="outlined" size="small" onClick={handleValidate}>
            Validate
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box
          sx={{
            width: '60%',
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
        <Box sx={{ width: '40%', height: '100%', overflow: 'hidden' }}>
          <ResultsPanel problem={problem} results={results} running={running} code={code} />
        </Box>
      </Box>
    </Box>
  );
}
