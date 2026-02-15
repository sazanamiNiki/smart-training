import { useState, useCallback, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import {
  saveGitHubToken,
  loadGitHubToken,
  clearGitHubToken,
  saveGitHubUser,
  loadGitHubUser,
} from '../services/storage.service';

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string;
const GITHUB_OAUTH_BASE = import.meta.env.DEV
  ? '/github-oauth'
  : (import.meta.env.VITE_GITHUB_PROXY_URL as string);

type AuthStatus = 'idle' | 'pending' | 'authenticated' | 'error';

export interface DeviceFlowData {
  verificationUri: string;
  userCode: string;
}

export interface UseGitHubSubmissionReturn {
  authStatus: AuthStatus;
  deviceFlowData: DeviceFlowData | null;
  githubUser: string | null;
  submitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  startAuth: () => void;
  submit: (quId: string, code: string, description: string) => Promise<void>;
}

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

interface AccessTokenResponse {
  access_token?: string;
  error?: string;
}

/**
 * Poll GitHub OAuth access token endpoint until authorized or expired.
 *
 * @param deviceCode - Device code from the Device Flow initiation.
 * @param interval - Polling interval in seconds.
 * @param expiresIn - Expiry duration in seconds.
 * @returns Access token string.
 * @throws {Error} If polling times out, is denied, or encounters an unrecoverable error.
 */
async function pollForToken(
  deviceCode: string,
  interval: number,
  expiresIn: number
): Promise<string> {
  const deadline = Date.now() + expiresIn * 1000;
  let currentInterval = interval;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, currentInterval * 1000));

    const res = await fetch(`${GITHUB_OAUTH_BASE}/login/oauth/access_token`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }).toString(),
    });
    const data: AccessTokenResponse = await res.json();

    if (data.access_token) return data.access_token;
    if (data.error === 'slow_down') { currentInterval += 5; continue; }
    if (data.error === 'authorization_pending') continue;
    if (data.error === 'expired_token') throw new Error('認証がタイムアウトしました。');
    if (data.error === 'access_denied') throw new Error('認証がキャンセルされました。');
    throw new Error(`認証エラー: ${data.error}`);
  }

  throw new Error('認証がタイムアウトしました。');
}

/**
 * Provide GitHub Device Flow authentication and solution submission.
 *
 * @returns Authentication state, device flow data, and submit/startAuth handlers.
 */
export function useGitHubSubmission(): UseGitHubSubmissionReturn {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(() =>
    loadGitHubToken() ? 'authenticated' : 'idle'
  );
  const [deviceFlowData, setDeviceFlowData] = useState<DeviceFlowData | null>(null);
  const [githubUser, setGithubUser] = useState<string | null>(() => loadGitHubUser());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const token = loadGitHubToken();
    const user = loadGitHubUser();
    if (token && user) {
      setAuthStatus('authenticated');
      setGithubUser(user);
    }
  }, []);

  const startAuth = useCallback(async () => {
    setAuthStatus('pending');
    setSubmitError(null);
    try {
      const res = await fetch(`${GITHUB_OAUTH_BASE}/login/device/code`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: CLIENT_ID, scope: 'read:user,user:email' }).toString(),
      });
      const data: DeviceCodeResponse = await res.json();

      setDeviceFlowData({ verificationUri: data.verification_uri, userCode: data.user_code });

      const token = await pollForToken(data.device_code, data.interval, data.expires_in);

      const octokit = new Octokit({ auth: token });
      const { data: user } = await octokit.users.getAuthenticated();

      saveGitHubToken(token);
      saveGitHubUser(user.login);
      setGithubUser(user.login);
      setDeviceFlowData(null);
      setAuthStatus('authenticated');
    } catch (e) {
      clearGitHubToken();
      setAuthStatus('error');
      setSubmitError(e instanceof Error ? e.message : '認証に失敗しました。');
    }
  }, []);

  const submit = useCallback(async (quId: string, code: string, description: string) => {
    const token = loadGitHubToken();
    if (!token) { setSubmitError('認証が必要です。'); return; }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${GITHUB_OAUTH_BASE}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quId, code, description }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? '提出に失敗しました。');
      }
      setSubmitSuccess(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : '提出に失敗しました。');
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    authStatus,
    deviceFlowData,
    githubUser,
    submitting,
    submitError,
    submitSuccess,
    startAuth,
    submit,
  };
}
