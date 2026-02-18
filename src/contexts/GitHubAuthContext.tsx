import { type ReactNode, createContext, useContext } from 'react';

import { type UseGitHubSubmissionReturn, useGitHubSubmission } from '../hooks/useGitHubSubmission';

const GitHubAuthContext = createContext<UseGitHubSubmissionReturn | null>(null);

/**
 * Provide GitHub authentication and submission state to the component tree.
 *
 * @param children - Child components.
 */
export function GitHubAuthProvider({ children }: { children: ReactNode }) {
  const auth = useGitHubSubmission();
  return <GitHubAuthContext.Provider value={auth}>{children}</GitHubAuthContext.Provider>;
}

/**
 * Return GitHub authentication context value.
 *
 * @throws {Error} If used outside of GitHubAuthProvider.
 */
export function useGitHubAuth(): UseGitHubSubmissionReturn {
  const ctx = useContext(GitHubAuthContext);
  if (!ctx) throw new Error('useGitHubAuth must be used within GitHubAuthProvider');
  return ctx;
}
