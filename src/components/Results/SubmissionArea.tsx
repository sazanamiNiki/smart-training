import { useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useGitHubAuth } from '../../contexts/GitHubAuthContext';

type Props = {
  quId: string;
  code: string;
};

/** Render GitHub auth UI while device flow is pending. */
const PendingView = ({
  userCode,
  verificationUri,
}: {
  userCode: string;
  verificationUri: string;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Typography variant="body2" color="text.secondary">
      以下のコードを GitHub で入力してください
    </Typography>
    <Typography
      sx={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, letterSpacing: 4 }}
    >
      {userCode}
    </Typography>
    <Button
      variant="outlined"
      size="small"
      href={verificationUri}
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub で確認する
    </Button>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={14} />
      <Typography variant="body2" color="text.secondary">
        認証待機中…
      </Typography>
    </Box>
  </Box>
);

/** Render solution description input and submit/skip buttons. */
const AuthenticatedView = ({
  quId,
  code,
  githubUser,
  submitting,
  submitError,
  onSubmit,
}: {
  quId: string;
  code: string;
  githubUser: string;
  submitting: boolean;
  submitError: string | null;
  onSubmit: (quId: string, code: string, description: string) => Promise<void>;
}) => {
  const [description, setDescription] = useState('');
  const [skipped, setSkipped] = useState(false);

  if (skipped) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {githubUser} として提出します
      </Typography>
      <TextField
        label="この解法の説明を書いて提出しましょう（任意）"
        multiline
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={submitting}
        inputProps={{ style: { fontFamily: 'monospace', fontSize: 13 } }}
      />
      {submitError && (
        <Typography variant="body2" color="error">
          {submitError}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="success"
          disabled={submitting}
          onClick={() => onSubmit(quId, code, description)}
          startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : undefined}
        >
          提出する
        </Button>
        <Button variant="outlined" disabled={submitting} onClick={() => setSkipped(true)}>
          スキップ
        </Button>
      </Box>
    </Box>
  );
};

/**
 * Render GitHub authentication and solution submission area shown after all tests pass.
 *
 * @param quId - Problem identifier used for the commit path.
 * @param code - Current editor code to commit.
 */
const SubmissionArea = ({ quId, code }: Props) => {
  const {
    authStatus,
    deviceFlowData,
    githubUser,
    submitting,
    submitError,
    submitSuccess,
    startAuth,
    submit,
  } = useGitHubAuth();

  if (submitSuccess) {
    return (
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="success.main">
          提出しました！ static/{quId}/{githubUser}/
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
      {authStatus === 'idle' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography fontWeight="700">
            {'GitHub で認証して自分の回答を共有しよう'}
          </Typography>
          <Button
            variant="contained"
            size="small"
            color='inherit'
            onClick={startAuth}
            startIcon={<img src="/assets/img/GitHub_Invertocat_White.svg" alt="GitHub-icon" style={{ height: 16 }} />}
          >
            GitHub で認証する
          </Button>
        </Box>
      )}

      {authStatus === 'pending' && deviceFlowData && (
        <PendingView
          userCode={deviceFlowData.userCode}
          verificationUri={deviceFlowData.verificationUri}
        />
      )}

      {authStatus === 'error' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="error">
            {submitError}
          </Typography>
          <Button variant="outlined" size="small" onClick={startAuth}>
            再認証する
          </Button>
        </Box>
      )}

      {authStatus === 'authenticated' && githubUser && (
        <AuthenticatedView
          quId={quId}
          code={code}
          githubUser={githubUser}
          submitting={submitting}
          submitError={submitError}
          onSubmit={submit}
        />
      )}
    </Box>
  );
};

export default SubmissionArea;
