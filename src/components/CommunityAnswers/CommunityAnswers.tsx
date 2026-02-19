import { CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

import { useEffect, useMemo, useState } from 'react';

import { Answer, fetchAnswerDetail, fetchAnswerMeta } from '../../problems/answers';
import AnswerItem from './AnswerItem';
import styles from './CommunityAnswers.module.css';
import type { CommunityAnswersProps } from './types';

/**
 * Display community answers for a given question with a respondent selector.
 *
 * @param quId - The question ID to show answers for.
 */
export default function CommunityAnswers({ quId }: CommunityAnswersProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const metaList = await fetchAnswerMeta();
        const filtered = metaList.filter((m: { quId: string }) => m.quId === quId);
        const details = await Promise.all(filtered.map((m: { quId: string; answerId: string }) => fetchAnswerDetail(m.quId, m.answerId)));
        if (mounted) setAnswers(details);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [quId]);
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    setSelectedId(answers.length > 0 ? answers[0].answerId : '');
  }, [quId, answers]);

  const selectedAnswer = useMemo(() => answers.find((a: { answerId: string }) => a.answerId === selectedId) ?? null, [answers, selectedId]);

  function handleChange(event: SelectChangeEvent) {
    setSelectedId(event.target.value);
  }

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <CircularProgress size={24} />
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <Typography variant="body2" color="text.secondary">
          まだ回答がありません
        </Typography>
      </div>
    );
  }

  return (
    <div data-testid="community-answers" className={styles.root}>
      <FormControl size="small" fullWidth>
        <InputLabel id="answerer-select-label">回答者</InputLabel>
        <Select labelId="answerer-select-label" value={selectedId} label="回答者" onChange={handleChange}>
          {answers.map((a: { answerId: string }) => (
            <MenuItem key={a.answerId} value={a.answerId}>
              {a.answerId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedAnswer && <AnswerItem answer={selectedAnswer} />}
    </div>
  );
}
