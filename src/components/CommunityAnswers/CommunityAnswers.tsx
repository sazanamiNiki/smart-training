import { useMemo, useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { getAnswerMap } from '../../problems/answers';
import AnswerItem from './AnswerItem';
import type { CommunityAnswersProps } from './types';

/**
 * Display community answers for a given question with a respondent selector.
 *
 * @param quId - The question ID to show answers for.
 */
export default function CommunityAnswers({ quId }: CommunityAnswersProps) {
  const answers = useMemo(() => getAnswerMap().get(quId) ?? [], [quId]);
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    setSelectedId(answers.length > 0 ? answers[0].answerId : '');
  }, [quId, answers]);

  const selectedAnswer = useMemo(
    () => answers.find((a) => a.answerId === selectedId) ?? null,
    [answers, selectedId]
  );

  function handleChange(event: SelectChangeEvent) {
    setSelectedId(event.target.value);
  }

  if (answers.length === 0) {
    return (
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          まだ回答がありません
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflow: 'hidden', p: 2, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
      <FormControl size="small" fullWidth>
        <InputLabel id="answerer-select-label">回答者</InputLabel>
        <Select
          labelId="answerer-select-label"
          value={selectedId}
          label="回答者"
          onChange={handleChange}
        >
          {answers.map((a) => (
            <MenuItem key={a.answerId} value={a.answerId}>
              {a.answerId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedAnswer && <AnswerItem answer={selectedAnswer} />}
    </Box>
  );
}
