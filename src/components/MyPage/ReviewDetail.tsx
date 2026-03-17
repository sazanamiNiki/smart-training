import { Button, CircularProgress, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

import { useEffect, useState } from 'react';

import { MarkdownWrapper } from '../MarkdownWrapper/MarkdownWrapper';
import styles from './ReviewDetail.module.css';

type Props = {
  quId: string;
  onBack: () => void;
  fetchReview: (quId: string) => Promise<string>;
};

/**
 * Display individual review Markdown for a selected submission.
 *
 * @param quId - Problem identifier for the review to display.
 * @param onBack - Callback to return to the submission list.
 * @param fetchReview - Async function to fetch the review Markdown text.
 */
export default function ReviewDetail({ quId, onBack, fetchReview }: Props) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchReview(quId)
      .then((text) => setMarkdown(text))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'レビューの取得に失敗しました。'))
      .finally(() => setLoading(false));
  }, [quId, fetchReview]);

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Button size="small" variant="outlined" onClick={onBack}>
          戻る
        </Button>
        <Typography variant="body2" color="text.secondary">
          {quId} のレビュー
        </Typography>
      </div>
      {loading && (
        <div className={styles.center}>
          <CircularProgress size={24} />
        </div>
      )}
      {error && (
        <Typography variant="body2" color="error" className={styles.center}>
          {error}
        </Typography>
      )}
      {!loading && !error && markdown !== null && (
        <MarkdownWrapper height="auto">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </MarkdownWrapper>
      )}
    </div>
  );
}
