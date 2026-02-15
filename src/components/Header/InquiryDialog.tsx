import { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useGitHubAuth } from '../../contexts/GitHubAuthContext';

const INQUIRY_URL =
  'https://script.google.com/macros/s/AKfycbxhWtyDaC3Gxw8ebudMaPTa52MbMCEzqGqhlWlIYDF8Q2hWfvhD-goQptfnz5ZBbW5l/exec?path=contract';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Render inquiry dialog with message input and POST submission.
 *
 * @param open - Whether the dialog is visible.
 * @param onClose - Callback to close the dialog.
 */
export default function InquiryDialog({ open, onClose }: Props) {
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

      const res = await fetch(INQUIRY_URL, {
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
      <DialogTitle>お問い合わせ</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
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
              onChange={(e) => setMessage(e.target.value)}
              disabled={sending}
              fullWidth
            />
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={handleClose} disabled={sending}>
          {sent ? '閉じる' : 'キャンセル'}
        </Button>
        {!sent && (
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={sending || !message.trim()}
            startIcon={sending ? <CircularProgress size={14} color="inherit" /> : undefined}
          >
            送信
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
