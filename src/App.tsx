import { useMemo, useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
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
  loadColorMode,
  saveColorMode,
} from './services/storage.service';
import { GitHubAuthProvider } from './contexts/GitHubAuthContext';
import { createAppTheme } from './theme';

type AppContentProps = {
  colorMode: 'dark' | 'light';
  onColorModeChange: (mode: 'dark' | 'light') => void;
};

function AppContent({ colorMode, onColorModeChange }: AppContentProps) {
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

  const handleColorModeChange = (mode: 'dark' | 'light') => {
    onColorModeChange(mode);
    saveColorMode(mode);
  };

  const problem = problems.find((p) => p.id === selectedId) ?? problems[0];
  const { code, setCode, results, running, run, consoleLogs, executing, execute, clearConsoleLogs } = useEditor(problem);

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
      <HeaderBar
        problems={problems}
        selectedId={selectedId}
        onProblemChange={handleProblemChange}
        layoutFlipped={layoutFlipped}
        onLayoutFlip={handleLayoutFlip}
        editorFontSize={editorFontSize}
        onEditorFontSizeChange={handleEditorFontSizeChange}
        colorMode={colorMode}
        onColorModeChange={handleColorModeChange}
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
            editorFontSize={editorFontSize}
            run={run}
            running={running}
            execute={execute}
            executing={executing}
            consoleLogs={consoleLogs}
            clearConsoleLogs={clearConsoleLogs}
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
  const [colorMode, setColorMode] = useState<'dark' | 'light'>(() => loadColorMode());
  const theme = useMemo(() => createAppTheme(colorMode), [colorMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GitHubAuthProvider>
        <AppContent colorMode={colorMode} onColorModeChange={setColorMode} />
      </GitHubAuthProvider>
    </ThemeProvider>
  );
}
