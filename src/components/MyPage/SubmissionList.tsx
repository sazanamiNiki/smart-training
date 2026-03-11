import { Button, CircularProgress, Typography } from '@mui/material';

import type { Submission } from '../../types';
import styles from './SubmissionList.module.css';

type Props = {
  submissions: Submission[];
  onSelectReview: (quId: string) => void;
};

/**
 * Render a table of submission history with review status indicators.
 *
 * @param submissions - List of user submissions.
 * @param onSelectReview - Callback when the user clicks "レビューを見る" for a completed submission.
 */
export default function SubmissionList({ submissions, onSelectReview }: Props) {
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
                  <Typography variant="body2" color="error">
                    エラー
                  </Typography>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
