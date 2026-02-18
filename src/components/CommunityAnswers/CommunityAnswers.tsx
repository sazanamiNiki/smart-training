import { useMemo, useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Answer, fetchAnswerMeta, fetchAnswerDetail } from '../../problems/answers';
import AnswerItem from './AnswerItem';
import type { CommunityAnswersProps } from './types';
import styles from './CommunityAnswers.module.css';

/**
 * Display community answers for a given question with a respondent selector.
 *
 * @param quId - The question ID to show answers for.
 */
export default function CommunityAnswers({ quId }: CommunityAnswersProps) {
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
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    setSelectedId(answers.length > 0 ? answers[0].answerId : '');
  }, [quId, answers]);

  const selectedAnswer = useMemo(
    () => answers.find((a: { answerId: string }) => a.answerId === selectedId) ?? null,
    [answers, selectedId]
  );

  function handleChange(event: SelectChangeEvent) {
    setSelectedId(event.target.value);
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
        <Select
          labelId="answerer-select-label"
          value={selectedId}
          label="回答者"
          onChange={handleChange}
        >
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
