import { Box, CircularProgress, Typography, List, ListItemButton, Collapse, Divider } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { TestResult } from "../../types";
import SubmissionArea from './SubmissionArea';
import { useGitHubAuth } from '../../contexts/GitHubAuthContext';
import { Answer, fetchAnswerMeta, fetchAnswerDetail } from '../../problems/answers';

import { useState, useEffect, useMemo } from "react";

type Props = {
  running: boolean;
  results: TestResult[];
  code: string;
  quId: string;
};

export const Results = ({ running, results, code, quId }: Props) => {
  const allPassed = results.length > 0 && results.every((r) => r.passed);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const { githubUser } = useGitHubAuth();
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const metaList = await fetchAnswerMeta();
      const filtered = metaList.filter((m: { quId: string }) => m.quId === quId);
      const details = await Promise.all(
        filtered.map((m: { quId: string; answerId: string }) => fetchAnswerDetail(m.quId, m.answerId))
      );
      if (mounted) setAnswers(details);
    })();
    return () => { mounted = false; };
  }, [quId]);

  const isAlreadySubmitted = useMemo(() => {
    if (!githubUser) return false;
    return answers.some((a: { answerId: string }) => a.answerId === githubUser);
  }, [answers, githubUser]);

  useEffect(() => {
    setOpenIndexes([]);
  }, [quId]);

  const handleToggle = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const stringifyWrapper = (obj: Object) => {
    return JSON.stringify(obj, (_, value) => {
      return value === undefined ? 'undefined' : value;
    });
  };
  

  return (
    <Box data-testid="results-area" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {running ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : results.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Test を実行してテスト結果を表示
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
            <Typography variant="body2" data-testid="pass-count">
              {results.filter((r) => r.passed).length} / {results.length} passed
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <List disablePadding>
              {results.map((result, i) => {
                const open = openIndexes.includes(i);
                return (
                  <Box key={i}>
                    <ListItemButton onClick={() => handleToggle(i)} sx={{ py: 1, gap: 1.5 }} data-testid={`test-result-row-${i}`}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          flexShrink: 0,
                          color: result.passed ? 'success.main' : 'error.main',
                        }}
                      >
                        {result.passed ? 'PASS' : 'FAIL'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'text.secondary',
                        }}
                      >
                        #{i + 1} {result.name}
                      </Typography>
                      {open ? <ExpandLess sx={{ fontSize: 16, flexShrink: 0 }} /> : <ExpandMore sx={{ fontSize: 16, flexShrink: 0 }} />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          pl: 3,
                          pr: 2,
                          py: 1.5,
                          borderLeft: '2px solid',
                          borderColor: result.passed ? 'success.main' : 'error.main',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', lineHeight: 2 }}>
                          <Box component="span" sx={{ color: 'text.primary', mr: 1 }}>Input:</Box>
                          <Box component="span" sx={{ color: 'text.secondary' }}>{stringifyWrapper(result.input)}</Box>
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', lineHeight: 2 }}>
                          <Box component="span" sx={{ color: 'text.primary', mr: 1 }}>Expected:</Box>
                          <Box component="span" sx={{ color: 'text.secondary' }}>{stringifyWrapper(result.expected as Object)}</Box>
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', lineHeight: 2 }}>
                          <Box component="span" sx={{ color: 'text.primary', mr: 1 }}>Actual:</Box>
                          <Box component="span" sx={{ color: 'text.secondary' }}>{stringifyWrapper(result.actual as Object)}</Box>
                        </Typography>
                        {result.error && (
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'error.main', mt: 0.5 }}>
                            Error: {result.error}
                          </Typography>
                        )}
                        {!result.error && result.reason && (
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'warning.main', mt: 0.5 }}>
                            Reason: {result.reason}
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                    <Divider />
                  </Box>
                );
              })}
            </List>
          </Box>
          {allPassed && (
            isAlreadySubmitted ? (
              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="success.main">
                  回答済み
                </Typography>
              </Box>
            ) : (
              <SubmissionArea quId={quId} code={code} />
            )
          )}
        </>
      )}
    </Box>
  );
};
