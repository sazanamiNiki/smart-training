import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

import { useState } from 'react';

import { useGitHubAuth } from '../../contexts/GitHubAuthContext';
import styles from './InquiryDialog.module.css';

const GAS_BASE_URL = 'https://script.google.com/macros/s/AKfycbxhWtyDaC3Gxw8ebudMaPTa52MbMCEzqGqhlWlIYDF8Q2hWfvhD-goQptfnz5ZBbW5l/exec';
const MAX_MESSAGE_LENGTH = 2000;

type Props = {
  open: boolean;
  onClose: () => void;
  mode: 'contact' | 'feature-request';
};

/**
 * Render inquiry or feature-request dialog with message input and POST submission.
 *
 * @param open - Whether the dialog is visible.
 * @param onClose - Callback to close the dialog.
 * @param mode - Dialog mode: 'contact' for inquiry, 'feature-request' for feature requests.
 */
export default function InquiryDialog({ open, onClose, mode }: Props) {
  const { githubUser } = useGitHubAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleClose = () => {
    setMessage('');
    setError(null);
    setSent(false);
    onClose();
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError(null);
    try {
      const body: Record<string, string> = { message: message.trim() };
      if (githubUser) body.userId = githubUser;

      const path = mode === 'contact' ? 'contract' : 'feature-request';
      const res = await fetch(`${GAS_BASE_URL}?path=${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`送信に失敗しました (${res.status})`);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '送信に失敗しました。');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'contact' ? 'お問い合わせ' : '機能追加要望'}</DialogTitle>
      <DialogContent className={styles.content}>
        {sent ? (
          <Typography variant="body1" color="success.main">
            送信しました。ありがとうございます。
          </Typography>
        ) : (
          <>
            {githubUser && (
              <Typography variant="body2" color="text.secondary">
                送信者: {githubUser}
              </Typography>
            )}
            <TextField
              label="メッセージ"
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
              disabled={sending}
              fullWidth
              helperText={`${message.length} / ${MAX_MESSAGE_LENGTH}`}
              error={message.length >= MAX_MESSAGE_LENGTH}
              inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
            />
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button variant="outlined" onClick={handleClose} disabled={sending}>
          {sent ? '閉じる' : 'キャンセル'}
        </Button>
        {!sent && (
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={sending || !message.trim() || message.length > MAX_MESSAGE_LENGTH}
            startIcon={sending ? <CircularProgress size={14} color="inherit" /> : undefined}
          >
            送信
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
