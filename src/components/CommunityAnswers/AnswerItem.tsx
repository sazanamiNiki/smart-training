import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Box, Collapse, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { AnswerItemProps } from './types';

const CodeBlock = styled('pre')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  overflow: 'auto',
  fontSize: 13,
  lineHeight: 1.5,
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  backgroundColor: theme.palette.mode === 'dark' ? '#161b22' : '#f6f8fa',
  borderRadius: 4,
  border: `1px solid ${theme.palette.divider}`,
}));

/**
 * Render a single community answer entry.
 *
 * @param answer - The answer to display.
 */
export default function AnswerItem({ answer }: AnswerItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          回答者: {answer.answerId}
        </Typography>
      </Box>

      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 0.5,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          解説
        </Typography>
        {open ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
      </Box>

      <Collapse in={open}>
        <Box sx={{ px: 2, py: 1 }} />
      </Collapse>

      <Box sx={{ p: 2 }}>
        <CodeBlock>{answer.code}</CodeBlock>
      </Box>
    </Box>
  );
}
