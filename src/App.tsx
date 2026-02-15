import { useState } from 'react';
import { Box } from '@mui/material';
import problems from './problems';
import { useEditor } from './components/Editor/hooks/useEditor';
import EditorPanel from './components/Editor/EditorPanel';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';
import HeaderBar from './components/Header/HeaderBar';
import {
  loadSelectedProblemId,
  saveSelectedProblemId,
  loadLayoutFlipped,
  saveLayoutFlipped,
  loadEditorFontSize,
  saveEditorFontSize,
} from './services/storage.service';
import { validateAllProblems } from './utils/problemValidator';
import { GitHubAuthProvider } from './contexts/GitHubAuthContext';

function AppContent() {
  const [selectedId, setSelectedId] = useState<string>(
    () => loadSelectedProblemId() ?? problems[0].id
  );
  const [layoutFlipped, setLayoutFlipped] = useState<boolean>(() => loadLayoutFlipped());

  const handleLayoutFlip = (flipped: boolean) => {
    setLayoutFlipped(flipped);
    saveLayoutFlipped(flipped);
  };

  const [editorFontSize, setEditorFontSize] = useState<number>(() => loadEditorFontSize());

  const handleEditorFontSizeChange = (size: number) => {
    setEditorFontSize(size);
    saveEditorFontSize(size);
  };

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
      <HeaderBar
        problems={problems}
        selectedId={selectedId}
        onProblemChange={handleProblemChange}
        onValidate={handleValidate}
        isDev={import.meta.env.DEV}
        layoutFlipped={layoutFlipped}
        onLayoutFlip={handleLayoutFlip}
        editorFontSize={editorFontSize}
        onEditorFontSizeChange={handleEditorFontSizeChange}
      />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: layoutFlipped ? 'row-reverse' : 'row' }}>
        <Box
          sx={{
            width: '60%',
            height: '100%',
            borderRight: layoutFlipped ? undefined : '1px solid',
            borderLeft: layoutFlipped ? '1px solid' : undefined,
            borderColor: 'divider',
          }}
        >
          <EditorPanel
            problem={problem}
            code={code}
            onCodeChange={setCode}
            onRun={run}
            running={running}
            editorFontSize={editorFontSize}
          />
        </Box>
        <Box sx={{ width: '40%', height: '100%', overflow: 'hidden' }}>
          <ResultsPanel problem={problem} results={results} running={running} code={code} />
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <GitHubAuthProvider>
      <AppContent />
    </GitHubAuthProvider>
  );
}
