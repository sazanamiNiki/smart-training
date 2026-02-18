import { CircularProgress, Typography, List } from '@mui/material';
import { TestResult } from '../../types';
import SubmissionArea from './SubmissionArea';
import TestResultRow from './TestResultRow';
import { useGitHubAuth } from '../../contexts/GitHubAuthContext';
import { Answer, fetchAnswerMeta, fetchAnswerDetail } from '../../problems/answers';
import styles from './Results.module.css';

import { useState, useEffect, useMemo } from 'react';

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

  return (
    <div data-testid="results-area" className={styles.root}>
      {running ? (
        <div className={styles.loadingWrap}>
          <CircularProgress size={24} />
        </div>
      ) : results.length === 0 ? (
        <div className={styles.emptyWrap}>
          <Typography variant="body2" color="text.secondary">
            Test を実行してテスト結果を表示
          </Typography>
        </div>
      ) : (
        <>
          <div className={styles.summaryBar}>
            <Typography variant="body2" data-testid="pass-count">
              {results.filter((r) => r.passed).length} / {results.length} passed
            </Typography>
          </div>
          <div className={styles.listWrap}>
            <List disablePadding>
              {results.map((result, i) => (
                <TestResultRow
                  key={i}
                  result={result}
                  index={i}
                  open={openIndexes.includes(i)}
                  onToggle={handleToggle}
                />
              ))}
            </List>
          </div>
          {allPassed && (
            isAlreadySubmitted ? (
              <div className={styles.submittedSection}>
                <Typography variant="body2" color="success.main">
                  回答済み
                </Typography>
              </div>
            ) : (
              <SubmissionArea quId={quId} code={code} />
            )
          )}
        </>
      )}
    </div>
  );
};
