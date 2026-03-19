import { useCallback, useEffect, useRef, useState } from 'react';

import { loadGitHubToken } from '../services/storage.service';
import type { AggregateReview, MyPageResponse, Submission } from '../types';

const MYPAGE_BASE = import.meta.env.DEV ? '/mypage-api' : (import.meta.env.VITE_GITHUB_PROXY_URL as string);
const POLL_INTERVAL_MS = 10_000;

export interface UseMyPageReturn {
  submissions: Submission[];
  aggregateReview: AggregateReview | null;
  loading: boolean;
  error: string | null;
  fetchReview: (quId: string) => Promise<string>;
  fetchAggregateReview: () => Promise<string>;
  refresh: () => Promise<void>;
}

/**
 * Fetch mypage data and poll while any submission is pending.
 *
 * @returns Submissions list, aggregate review, loading/error state, and review fetch helpers.
 */
export function useMyPage(): UseMyPageReturn {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [aggregateReview, setAggregateReview] = useState<AggregateReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      setAggregateReview(data.aggregateReview);
      setError(null);

      const hasPending = data.submissions.some((s) => s.review_status === 'pending');
      if (hasPending) {
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

  const fetchAggregateReview = useCallback(async (): Promise<string> => {
    const token = loadGitHubToken();
    if (!token) throw new Error('認証が必要です。');

    const res = await fetch(`${MYPAGE_BASE}/review?type=aggregate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? '集計レビューの取得に失敗しました。');
    }
    return res.text();
  }, []);

  return { submissions, aggregateReview, loading, error, fetchReview, fetchAggregateReview, refresh };
}
