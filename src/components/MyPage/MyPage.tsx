import { Button, CircularProgress, Typography } from '@mui/material';

import { useState } from 'react';

import { useGitHubAuth } from '../../contexts/GitHubAuthContext';
import { useMyPage } from '../../hooks/useMyPage';
import AggregateReviewPanel from './AggregateReviewPanel';
import styles from './MyPage.module.css';
import ReviewDetail from './ReviewDetail';
import SubmissionList from './SubmissionList';

type PageView = 'list' | 'review';

/**
 * Render the mypage with submission history, review polling, and review display.
 * Shows authentication prompt for unauthenticated users.
 */
export default function MyPage() {
  const { authStatus, deviceFlowData, submitError, startAuth } = useGitHubAuth();
  const [view, setView] = useState<PageView>('list');
  const [selectedQuId, setSelectedQuId] = useState<string | null>(null);

  const handleSelectReview = (quId: string) => {
    setSelectedQuId(quId);
    setView('review');
  };

  const handleBack = () => {
    setView('list');
    setSelectedQuId(null);
  };

  if (authStatus === 'idle') {
    return (
      <div className={styles.centered}>
        <Typography variant="body1" gutterBottom>
          GitHubで認証してマイページを利用する
        </Typography>
        <Button variant="contained" onClick={startAuth}>
          GitHubで認証する
        </Button>
      </div>
    );
  }

  if (authStatus === 'pending') {
    return (
      <div className={styles.centered}>
        {deviceFlowData ? (
          <div className={styles.deviceFlow}>
            <Typography variant="body2" color="text.secondary">
              以下のコードをGitHubで入力してください
            </Typography>
            <Typography className={styles.authCode}>{deviceFlowData.userCode}</Typography>
            <Button variant="outlined" size="small" href={deviceFlowData.verificationUri} target="_blank" rel="noopener noreferrer">
              GitHubで確認する
            </Button>
            <div className={styles.pendingRow}>
              <CircularProgress size={14} />
              <Typography variant="body2" color="text.secondary">
                認証待機中…
              </Typography>
            </div>
          </div>
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }

  if (authStatus === 'error') {
    return (
      <div className={styles.centered}>
        <Typography variant="body2" color="error" gutterBottom>
          {submitError ?? '認証に失敗しました。'}
        </Typography>
        <Button variant="outlined" size="small" onClick={startAuth}>
          再認証する
        </Button>
      </div>
    );
  }

  return <AuthenticatedMyPage view={view} selectedQuId={selectedQuId} onSelectReview={handleSelectReview} onBack={handleBack} />;
}

type AuthenticatedMyPageProps = {
  view: PageView;
  selectedQuId: string | null;
  onSelectReview: (quId: string) => void;
  onBack: () => void;
};

function AuthenticatedMyPage({ view, selectedQuId, onSelectReview, onBack }: AuthenticatedMyPageProps) {
  const { submissions, aggregateReview, loading, error, fetchReview, fetchAggregateReview, retryReview } = useMyPage();

  if (loading) {
    return (
      <div className={styles.centered}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centered}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  if (view === 'review' && selectedQuId) {
    return (
      <div className={styles.root}>
        <ReviewDetail quId={selectedQuId} onBack={onBack} fetchReview={fetchReview} />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Typography variant="h6" className={styles.heading}>
          マイページ
        </Typography>
        {aggregateReview && (
          <div className={styles.aggregateSection}>
            <AggregateReviewPanel fetchAggregateReview={fetchAggregateReview} />
          </div>
        )}
        <Typography variant="body2" color="text.secondary" className={styles.sectionLabel}>
          提出履歴
        </Typography>
        <SubmissionList submissions={submissions} onSelectReview={onSelectReview} onRetry={retryReview} />
      </div>
    </div>
  );
}
