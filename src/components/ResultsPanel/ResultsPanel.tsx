import { useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import type { ResultsPanelProps } from './types';
import { MarkdownWrapper } from '../MarkdownWrapper/MarkdownWrapper';
import { Results } from '../Results/Results';
import CommunityAnswers from '../CommunityAnswers/CommunityAnswers';

const DESCRIPTION_TAB = 0;
const RESULT_TAB = 1;
const COMMUNITY_TAB = 2;

export default function ResultsPanel({ problem, results, running }: ResultsPanelProps) {
  const [tab, setTab] = useState(DESCRIPTION_TAB);
  const [constantsOpen, setConstantsOpen] = useState(true);

  useEffect(() => {
    if (running || results.length > 0) {
      setTab(1);
    }
  }, [running, results]);

  useEffect(() => {
    setTab(DESCRIPTION_TAB);
  }, [problem]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0px 0px 32px 16px', marginRight: '4px' }}>
      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        sx={{ borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}
      >
        <Tab label="問題説明" />
        <Tab label="テスト結果" />
        <Tab label="みんなの回答" />
      </Tabs>

      {tab === DESCRIPTION_TAB && (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', margin: '4px' }}>
          <MarkdownWrapper>
            <ReactMarkdown>{problem.readme}</ReactMarkdown>
          </MarkdownWrapper>
          
          {problem.constants && (
            <Box
              sx={{
                ...(constantsOpen ? { flex: 1, minHeight: 0 } : { flexShrink: 0 }),
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                onClick={() => setConstantsOpen(!constantsOpen)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 0.5,
                  cursor: 'pointer',
                  flexShrink: 0,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  定数
                </Typography>
                {constantsOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16 }} />
                )}
              </Box>
              {constantsOpen && (
                <Box sx={{ flex: 1, minHeight: 0 }}>
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
                      wordWrap: 'off',
                      fontSize: 13,
                      folding: false,
                      contextmenu: false,
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}

      {tab === RESULT_TAB && (
        <Results running={running} results={results} />
      )}

      {tab === COMMUNITY_TAB && (
        <CommunityAnswers quId={problem.quId} />
      )}
    </Box>
  );
}
