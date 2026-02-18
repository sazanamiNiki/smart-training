import { useMemo, useState } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import './theme.css';
import styles from './App.module.css';
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
import { createAppTheme, applyCssVariables } from './theme';

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
    <div className={styles.root}>
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
      <div className={layoutFlipped ? styles.panelsFlipped : styles.panels}>
        <div className={layoutFlipped ? styles.editorPaneFlipped : styles.editorPane}>
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
        </div>
        <div className={styles.resultsPane}>
          <ResultsPanel problem={problem} results={results} running={running} code={code} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [colorMode, setColorMode] = useState<'dark' | 'light'>(() => loadColorMode());
  const theme = useMemo(() => {
    applyCssVariables(colorMode);
    return createAppTheme(colorMode);
  }, [colorMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GitHubAuthProvider>
        <AppContent colorMode={colorMode} onColorModeChange={setColorMode} />
      </GitHubAuthProvider>
    </ThemeProvider>
  );
}
