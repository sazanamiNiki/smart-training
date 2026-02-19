import { Editor } from '@monaco-editor/react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

import { useState } from 'react';

import { MarkdownWrapper } from '../MarkdownWrapper/MarkdownWrapper';
import styles from './AnswerItem.module.css';
import type { AnswerItemProps } from './types';

/**
 * Render a single community answer entry.
 *
 * @param answer - The answer to display.
 */
export default function AnswerItem({ answer }: AnswerItemProps) {
  const [open, setOpen] = useState(false);
  const hasDescription = Boolean(answer.description);

  return (
    <div data-testid="answer-item" className={styles.root}>
      {hasDescription && (
        <div onClick={() => setOpen(!open)} className={styles.descriptionToggle}>
          <Typography variant="caption" color="text.secondary">
            解説
          </Typography>
          {open ? <ExpandLessIcon className={styles.expandIcon} /> : <ExpandMoreIcon className={styles.expandIcon} />}
        </div>
      )}

      <div className={styles.content}>
        {hasDescription && open && (
          <MarkdownWrapper height={'30%'}>
            <ReactMarkdown data-testid="tabDescription">{answer.description ?? ''}</ReactMarkdown>
          </MarkdownWrapper>
        )}
        <div className={styles.editorWrap}>
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
              padding: {
                top: 8,
                bottom: 8,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
