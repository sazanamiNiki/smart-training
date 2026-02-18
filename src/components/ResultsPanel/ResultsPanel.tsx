import Editor from '@monaco-editor/react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tab, Tabs, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

import { useEffect, useRef, useState } from 'react';

import CommunityAnswers from '../CommunityAnswers/CommunityAnswers';
import { MarkdownWrapper } from '../MarkdownWrapper/MarkdownWrapper';
import { Results } from '../Results/Results';
import styles from './ResultsPanel.module.css';
import type { ResultsPanelProps } from './types';

const DESCRIPTION_TAB = 0;
const RESULT_TAB = 1;
const COMMUNITY_TAB = 2;

export default function ResultsPanel({ problem, results, running, code }: ResultsPanelProps) {
  const [tab, setTab] = useState(DESCRIPTION_TAB);
  const [constantsOpen, setConstantsOpen] = useState(true);
  const prevProblemIdRef = useRef(problem.id);

  useEffect(() => {
    const changed = prevProblemIdRef.current !== problem.id;
    prevProblemIdRef.current = problem.id;
    if (changed) {
      setTab(DESCRIPTION_TAB);
      return;
    }
    if (running || results.length > 0) {
      setTab(RESULT_TAB);
    }
  }, [problem.id, running, results]);

  return (
    <div className={styles.root}>
      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} className={styles.tabs}>
        <Tab label="問題説明" data-testid="tab-description" />
        <Tab label="テスト結果" data-testid="tab-results" />
        <Tab label="みんなの回答" data-testid="tab-community" />
      </Tabs>

      {tab === DESCRIPTION_TAB && (
        <div className={styles.descriptionWrap}>
          <MarkdownWrapper>
            <ReactMarkdown>{problem.readme}</ReactMarkdown>
          </MarkdownWrapper>

          {problem.constants && (
            <div className={constantsOpen ? styles.constantsSectionOpen : styles.constantsSection}>
              <div onClick={() => setConstantsOpen(!constantsOpen)} className={styles.constantsToggle}>
                <Typography variant="caption" color="text.secondary">
                  定数
                </Typography>
                {constantsOpen ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
              </div>
              {constantsOpen && (
                <div className={styles.constantsEditor}>
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
                      padding: {
                        top: 8,
                        bottom: 8,
                      },
                      wordWrap: 'off',
                      fontSize: 13,
                      folding: false,
                      contextmenu: false,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === RESULT_TAB && <Results running={running} results={results} code={code} quId={problem.quId} />}

      {tab === COMMUNITY_TAB && <CommunityAnswers quId={problem.quId} />}
    </div>
  );
}
