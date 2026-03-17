#!/usr/bin/env node

/**
 * Test review generation flow against a running wrangler dev server.
 *
 * Usage:
 *   1. cd cloudflare && wrangler dev  (terminal 1)
 *   2. npm run test:review             (terminal 2)
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'http://localhost:8787';
const AUTH_HEADER = { Authorization: 'Bearer test-token-e2e' };
const USER_ID = 'test-user';
const QU_ID = 'qu1';

async function main() {
  const codePath = resolve(__dirname, '..', 'public', 'answers', 'qu1', 'bunchoNiki', 'execute.ts');
  const code = readFileSync(codePath, 'utf-8');
  console.log(`[1/6] Loaded code from ${codePath} (${code.length} chars)`);

  console.log('[2/6] Resetting test data...');
  const delRes = await fetch(`${BASE}/test-submit?userId=${USER_ID}`, {
    method: 'DELETE',
    headers: AUTH_HEADER,
  });
  if (!delRes.ok) {
    const text = await delRes.text();
    console.error(`  DELETE failed: ${delRes.status} ${text}`);
  } else {
    console.log('  Done.');
  }

  console.log('[3/6] Submitting code...');
  const submitRes = await fetch(`${BASE}/test-submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
    body: JSON.stringify({ quId: QU_ID, code }),
  });
  if (!submitRes.ok) {
    console.error(`  Submit failed: ${submitRes.status} ${await submitRes.text()}`);
    process.exit(1);
  }
  const submitData = await submitRes.json();
  console.log(`  Submitted: submissionId=${submitData.submissionId}`);

  console.log('[4/6] Polling for review completion...');
  const maxAttempts = 30;
  for (let i = 1; i <= maxAttempts; i++) {
    const mypageRes = await fetch(`${BASE}/mypage`, { headers: AUTH_HEADER });
    if (!mypageRes.ok) {
      console.error(`  /mypage failed: ${mypageRes.status}`);
      process.exit(1);
    }
    const data = await mypageRes.json();
    const sub = data.submissions.find((s) => s.qu_id === QU_ID);
    if (sub && sub.review_status === 'completed') {
      console.log(`  Review completed after ${i} poll(s).`);
      break;
    }
    if (sub && sub.review_status === 'failed') {
      console.error('  Review failed!');
      process.exit(1);
    }
    if (i === maxAttempts) {
      console.error(`  Timed out after ${maxAttempts} attempts.`);
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log('[5/6] Fetching review content...');
  const reviewRes = await fetch(`${BASE}/review?quId=${QU_ID}`, { headers: AUTH_HEADER });
  if (!reviewRes.ok) {
    console.error(`  /review failed: ${reviewRes.status}`);
    process.exit(1);
  }
  const reviewText = await reviewRes.text();
  console.log('\n--- Review Result ---');
  console.log(reviewText);
  console.log('--- End ---\n');

  console.log('[6/6] Cleanup...');
  await fetch(`${BASE}/test-submit?userId=${USER_ID}`, {
    method: 'DELETE',
    headers: AUTH_HEADER,
  });
  console.log('  Done. All tests passed!');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
