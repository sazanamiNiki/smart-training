import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { getAnswerMap } from '../../problems/answers';
import AnswerItem from './AnswerItem';
import type { CommunityAnswersProps } from './types';

/**
 * Display the list of community answers for a given question.
 *
 * @param quId - The question ID to show answers for.
 */
export default function CommunityAnswers({ quId }: CommunityAnswersProps) {
  const answers = useMemo(() => getAnswerMap().get(quId) ?? [], [quId]);

  return (
    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
      {answers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          まだ回答がありません
        </Typography>
      ) : (
        answers.map((answer) => (
          <AnswerItem key={answer.answerId} answer={answer} />
        ))
      )}
    </Box>
  );
}
