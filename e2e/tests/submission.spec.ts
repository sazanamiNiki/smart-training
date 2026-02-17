import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppPage } from '../pages/AppPage';

const REPO_ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const ANSWER_PATH = path.join(
  REPO_ROOT,
  'static/questions/qu1/answers/bunchoNiki/execute.ts'
);

test.describe('提出機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
  });

  test('全テスト PASS 後に提出エリアが表示される', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    const answerCode = readFileSync(ANSWER_PATH, 'utf-8');
    await app.setEditorCode(answerCode);
    await app.runTests(90000);

    const passText = await app.passCount.textContent();
    const [passed, total] = (passText ?? '').split(' / ').map((s) => parseInt(s, 10));
    expect(passed).toBe(total);

    await expect(app.submissionArea).toBeVisible();

    await app.githubAuthButton.click();
    await expect(app.userCode).toBeVisible({ timeout: 15000 });
    const code = await app.userCode.textContent();
    expect(code).toBeTruthy();
  });

  test('全テスト PASS 後に GitHub 認証ボタンが表示される', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    const answerCode = readFileSync(ANSWER_PATH, 'utf-8');
    await app.setEditorCode(answerCode);
    await app.runTests(90000);

    await expect(app.githubAuthButton).toBeVisible();
  });

  test('テストが FAIL の間は提出エリアが表示されない', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    await app.setEditorCode(
      "export const main = (hand: string): string => '役なし';"
    );
    await app.runTests(90000);

    await expect(app.submissionArea).not.toBeVisible();
  });
});
