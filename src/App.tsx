import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { useMemo, useState } from 'react';

import styles from './App.module.css';
import EditorPanel from './components/Editor/EditorPanel';
import { useEditor } from './components/Editor/hooks/useEditor';
import HeaderBar from './components/Header/HeaderBar';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';
import { GitHubAuthProvider } from './contexts/GitHubAuthContext';
import { usePersistedState } from './hooks/usePersistedState';
import problems from './problems';
import {
  loadColorMode,
  loadEditorFontSize,
  loadLayoutFlipped,
  loadSelectedProblemId,
  saveColorMode,
  saveEditorFontSize,
  saveLayoutFlipped,
  saveSelectedProblemId,
} from './services/storage.service';
import { applyCssVariables, createAppTheme } from './theme';
import './theme.css';

type AppContentProps = {
  colorMode: 'dark' | 'light';
  onColorModeChange: (mode: 'dark' | 'light') => void;
};

function AppContent({ colorMode, onColorModeChange }: AppContentProps) {
  const [selectedId, setSelectedId] = useState<string>(() => loadSelectedProblemId() ?? problems[0].id);
  const [layoutFlipped, setLayoutFlipped] = usePersistedState(loadLayoutFlipped, saveLayoutFlipped);
  const [editorFontSize, setEditorFontSize] = usePersistedState(loadEditorFontSize, saveEditorFontSize);

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
        onLayoutFlip={setLayoutFlipped}
        editorFontSize={editorFontSize}
        onEditorFontSizeChange={setEditorFontSize}
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
