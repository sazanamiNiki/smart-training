import { useCallback, useEffect, useRef, useState } from 'react';

import { loadGitHubToken } from '../services/storage.service';
import type { AggregateReview, MyPageResponse, Submission } from '../types';

const MYPAGE_BASE = import.meta.env.DEV ? '/mypage-api' : (import.meta.env.VITE_GITHUB_PROXY_URL as string);
const POLL_INTERVAL_MS = 10_000;

export interface UseMyPageReturn {
  submissions: Submission[];
  aggregateReviews: AggregateReview[];
  loading: boolean;
  error: string | null;
  fetchReview: (quId: string) => Promise<string>;
  fetchAggregateReviewById: (id: number) => Promise<string>;
  refresh: () => Promise<void>;
  retryReview: (quId: string) => Promise<void>;
  requestAggregateReview: () => Promise<void>;
}

/**
 * Fetch mypage data and poll while any submission is pending or aggregate review is awaited.
 *
 * @returns Submissions list, aggregate reviews, loading/error state, and review fetch helpers.
 */
export function useMyPage(): UseMyPageReturn {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [aggregateReviews, setAggregateReviews] = useState<AggregateReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAggregateReviewRef = useRef(false);
  const aggregateReviewsCountRef = useRef(0);

  const clearPollTimer = () => {
    if (pollTimerRef.current !== null) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const fetchMyPage = useCallback(async (): Promise<MyPageResponse | null> => {
    const token = loadGitHubToken();
    if (!token) return null;

    const res = await fetch(`${MYPAGE_BASE}/mypage`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? 'マイページの取得に失敗しました。');
    }
    return res.json() as Promise<MyPageResponse>;
  }, []);

  const loadData = useCallback(async () => {
    clearPollTimer();
    try {
      const data = await fetchMyPage();
      if (!data) return;
      setSubmissions(data.submissions);

      const newReviews = data.aggregateReviews ?? [];
      if (pendingAggregateReviewRef.current && newReviews.length > aggregateReviewsCountRef.current) {
        pendingAggregateReviewRef.current = false;
      }
      aggregateReviewsCountRef.current = newReviews.length;
      setAggregateReviews(newReviews);

      setError(null);

      const hasPending = data.submissions.some((s) => s.review_status === 'pending');
      if (hasPending || pendingAggregateReviewRef.current) {
        pollTimerRef.current = setTimeout(() => {
          void loadData();
        }, POLL_INTERVAL_MS);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'マイページの取得に失敗しました。');
    }
  }, [fetchMyPage]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadData();
    setLoading(false);
  }, [loadData]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      await loadData();
      if (!cancelled) setLoading(false);
    };

    void init();

    return () => {
      cancelled = true;
      clearPollTimer();
    };
  }, [loadData]);

  const fetchReview = useCallback(async (quId: string): Promise<string> => {
    const token = loadGitHubToken();
    if (!token) throw new Error('認証が必要です。');

    const res = await fetch(`${MYPAGE_BASE}/review?quId=${encodeURIComponent(quId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? 'レビューの取得に失敗しました。');
    }
    return res.text();
  }, []);

  const fetchAggregateReviewById = useCallback(async (id: number): Promise<string> => {
    const token = loadGitHubToken();
    if (!token) throw new Error('認証が必要です。');

    const res = await fetch(`${MYPAGE_BASE}/review?type=aggregate&id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? '集計レビューの取得に失敗しました。');
    }
    return res.text();
  }, []);

  const retryReview = useCallback(
    async (quId: string): Promise<void> => {
      const token = loadGitHubToken();
      if (!token) throw new Error('認証が必要です。');

      const res = await fetch(`${MYPAGE_BASE}/retry-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? '再申請に失敗しました。');
      }
      await loadData();
    },
    [loadData],
  );

  const requestAggregateReview = useCallback(async (): Promise<void> => {
    const token = loadGitHubToken();
    if (!token) throw new Error('認証が必要です。');

    const res = await fetch(`${MYPAGE_BASE}/aggregate-review`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? '集計レビューの申請に失敗しました。');
    }
    pendingAggregateReviewRef.current = true;
    await loadData();
  }, [loadData]);

  return {
    submissions,
    aggregateReviews,
    loading,
    error,
    fetchReview,
    fetchAggregateReviewById,
    refresh,
    retryReview,
    requestAggregateReview,
  };
}
