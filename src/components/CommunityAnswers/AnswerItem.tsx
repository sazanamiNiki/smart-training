import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Box, Typography } from '@mui/material';
import type { AnswerItemProps } from './types';
import { Editor } from '@monaco-editor/react';

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
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 0.5,
          cursor: 'pointer',
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          解説
        </Typography>
        {open ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {open && (
          <Box
            sx={{
              flex: 3,
              overflow: 'auto',
              px: 2,
              py: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          />
        )}
        <Box sx={{ flex: 7, minHeight: 0 }}>
          <Editor
            height="100%"
            value={answer.code}
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
      </Box>
    </Box>
  );
}
