import { CircularProgress, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

import { useEffect, useState } from 'react';

import type { AggregateReview } from '../../types';
import { MarkdownWrapper } from '../MarkdownWrapper/MarkdownWrapper';
import styles from './AggregateReviewPanel.module.css';

type Props = {
  aggregateReviews: AggregateReview[];
  fetchAggregateReviewById: (id: number) => Promise<string>;
};

/**
 * Display aggregate reviews as an accordion list.
 * The latest review is expanded and auto-fetched on mount.
 * Older reviews are collapsed and fetched on demand.
 *
 * @param aggregateReviews - List of aggregate reviews ordered by newest first.
 * @param fetchAggregateReviewById - Async function to fetch review Markdown by ID.
 */
export default function AggregateReviewPanel({ aggregateReviews, fetchAggregateReviewById }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(aggregateReviews[0]?.id ?? null);
  const [markdownCache, setMarkdownCache] = useState<Map<number, string>>(new Map());
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [errorId, setErrorId] = useState<number | null>(null);

  useEffect(() => {
    const latestId = aggregateReviews[0]?.id;
    if (!latestId) return;
    if (markdownCache.has(latestId)) return;
    setExpandedId(latestId);
    setLoadingId(latestId);
    fetchAggregateReviewById(latestId)
      .then((text) => {
        setMarkdownCache((prev) => new Map(prev).set(latestId, text));
      })
      .catch(() => {
        setErrorId(latestId);
      })
      .finally(() => {
        setLoadingId(null);
      });
  }, [aggregateReviews, fetchAggregateReviewById, markdownCache]);

  const handleToggle = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (markdownCache.has(id)) return;
    setLoadingId(id);
    setErrorId(null);
    try {
      const text = await fetchAggregateReviewById(id);
      setMarkdownCache((prev) => new Map(prev).set(id, text));
    } catch {
      setErrorId(id);
    } finally {
      setLoadingId(null);
    }
  };

  const totalCount = aggregateReviews.length;

  return (
    <div className={styles.panel}>
      {aggregateReviews.map((review, index) => {
        const number = totalCount - index;
        const isLatest = index === 0;
        const isExpanded = expandedId === review.id;
        const markdown = markdownCache.get(review.id);
        const isLoading = loadingId === review.id;
        const hasError = errorId === review.id;
        const date = new Date(review.created_at).toLocaleString('ja-JP');

        return (
          <div key={review.id} className={styles.reviewItem}>
            <button type="button" className={styles.reviewHeader} onClick={() => void handleToggle(review.id)} aria-expanded={isExpanded}>
              <span className={styles.reviewTitle}>
                集計レビュー #{number}
                <span className={styles.reviewDate}>{date}</span>
              </span>
              {isLatest && <span className={styles.latestBadge}>最新</span>}
              <span className={styles.chevron}>{isExpanded ? '▲' : '▼'}</span>
            </button>
            {isExpanded && (
              <div className={styles.reviewBody}>
                {isLoading && (
                  <div className={styles.center}>
                    <CircularProgress size={20} />
                  </div>
                )}
                {hasError && (
                  <Typography variant="body2" color="error">
                    集計レビューの取得に失敗しました。
                  </Typography>
                )}
                {!isLoading && !hasError && markdown !== undefined && (
                  <MarkdownWrapper height="auto">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                  </MarkdownWrapper>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
