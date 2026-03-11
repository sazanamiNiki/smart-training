import { CircularProgress, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

import { useEffect, useState } from 'react';

import { MarkdownWrapper } from '../MarkdownWrapper/MarkdownWrapper';
import styles from './AggregateReviewPanel.module.css';

type Props = {
  fetchAggregateReview: () => Promise<string>;
};

/**
 * Display aggregate review Markdown in a card panel above the submission list.
 *
 * @param fetchAggregateReview - Async function to fetch the aggregate review Markdown text.
 */
export default function AggregateReviewPanel({ fetchAggregateReview }: Props) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAggregateReview()
      .then((text) => setMarkdown(text))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : '集計レビューの取得に失敗しました。'))
      .finally(() => setLoading(false));
  }, [fetchAggregateReview]);

  return (
    <div className={styles.card}>
      <Typography variant="body2" className={styles.label}>
        集計レビュー
      </Typography>
      {loading && (
        <div className={styles.center}>
          <CircularProgress size={20} />
        </div>
      )}
      {error && (
        <Typography variant="body2" color="error">
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
