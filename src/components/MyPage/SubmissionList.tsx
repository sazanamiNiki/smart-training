import { Button, CircularProgress, Typography } from '@mui/material';

import { useState } from 'react';

import type { Submission } from '../../types';
import styles from './SubmissionList.module.css';

type Props = {
  submissions: Submission[];
  onSelectReview: (quId: string) => void;
  onRetry: (quId: string) => Promise<void>;
};

/**
 * Render a table of submission history with review status indicators.
 *
 * @param submissions - List of user submissions.
 * @param onSelectReview - Callback when the user clicks "レビューを見る" for a completed submission.
 * @param onRetry - Callback when the user requests re-review for a failed submission.
 */
export default function SubmissionList({ submissions, onSelectReview, onRetry }: Props) {
  const [retrying, setRetrying] = useState<string | null>(null);

  const handleRetry = async (quId: string) => {
    setRetrying(quId);
    try {
      await onRetry(quId);
    } finally {
      setRetrying(null);
    }
  };

  if (submissions.length === 0) {
    return (
      <div className={styles.empty}>
        <Typography variant="body2" color="text.secondary">
          まだ提出はありません。
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>問題</th>
            <th className={styles.th}>提出日時</th>
            <th className={styles.th}>レビューステータス</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id} className={styles.tr}>
              <td className={styles.td}>{s.qu_id}</td>
              <td className={styles.td}>{new Date(s.submitted_at).toLocaleString('ja-JP')}</td>
              <td className={styles.td}>
                {s.review_status === 'pending' && (
                  <span className={styles.pendingCell}>
                    <CircularProgress size={12} />
                    <Typography variant="body2" color="text.secondary">
                      レビュー中
                    </Typography>
                  </span>
                )}
                {s.review_status === 'completed' && (
                  <Button size="small" variant="outlined" onClick={() => onSelectReview(s.qu_id)}>
                    レビューを見る
                  </Button>
                )}
                {s.review_status === 'failed' && (
                  <span className={styles.failedCell}>
                    <Typography variant="body2" color="error">
                      エラー
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      disabled={retrying === s.qu_id}
                      startIcon={retrying === s.qu_id ? <CircularProgress size={12} color="inherit" /> : undefined}
                      onClick={() => handleRetry(s.qu_id)}
                    >
                      再申請する
                    </Button>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
