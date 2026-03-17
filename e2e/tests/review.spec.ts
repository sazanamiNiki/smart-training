import { type APIRequestContext, expect, test } from '@playwright/test';

const TEST_API_BASE = '/test-api';
const AUTH_TOKEN = 'test-token-e2e';
const TEST_USER = 'test-user';
const ANSWER_URL = 'answers/qu1/bunchoNiki/execute.ts';

async function resetTestData(request: APIRequestContext) {
  await request.delete(`${TEST_API_BASE}/test-submit?userId=${TEST_USER}`);
}

test.describe('レビュー機能', () => {
  test.beforeEach(async ({ page, request }) => {
    await resetTestData(request);
    await page.addInitScript(
      ({ token, user }) => {
        localStorage.setItem('smart-training:github_token', token);
        localStorage.setItem('smart-training:github_user', user);
      },
      { token: AUTH_TOKEN, user: TEST_USER },
    );
  });

  test.afterEach(async ({ request }) => {
    await resetTestData(request);
  });

  test('提出後にレビューがマイページに表示される', async ({ page, request }) => {
    const answerResp = await request.get(ANSWER_URL);
    expect(answerResp.ok()).toBeTruthy();
    const code = await answerResp.text();

    const submitResp = await request.post(`${TEST_API_BASE}/test-submit`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      data: { quId: 'qu1', code },
    });
    expect(submitResp.ok()).toBeTruthy();

    await page.goto('/mypage');

    await expect(async () => {
      await page.reload();
      await expect(page.getByRole('button', { name: 'レビューを見る' })).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 30000, intervals: [2000] });

    await page.getByRole('button', { name: 'レビューを見る' }).click();

    await expect(page.getByText('コード品質')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('モックレビュー')).toBeVisible();
  });
});
