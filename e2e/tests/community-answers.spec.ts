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

test.describe('回答閲覧機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
  });

  test('「みんなの回答」タブに切り替えられる', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    await app.switchToCommunityTab();

    await expect(app.communityAnswers).toBeVisible();
  });

  test('回答者セレクトに bunchoNiki が表示される', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    await app.switchToCommunityTab();

    const answererCombobox = page.getByRole('combobox', { name: '回答者' });
    await expect(answererCombobox).toBeVisible();

    await answererCombobox.click();

    const option = page.getByRole('option', { name: 'bunchoNiki' });
    await expect(option).toBeVisible();

    await option.click();
  });

  test('bunchoNiki の回答コードが表示される', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    await app.switchToCommunityTab();

    const answererCombobox = page.getByRole('combobox', { name: '回答者' });
    await answererCombobox.click();
    await page.getByRole('option', { name: 'bunchoNiki' }).click();

    await expect(app.answerItem).toBeVisible();

    const actualCode = await app.getCommunityAnswerCode();
    expect(actualCode).not.toBeNull();

    const expectedCode = readFileSync(ANSWER_PATH, 'utf-8').trim();
    expect(actualCode?.trim()).toBe(expectedCode);
  });

  test('回答コードエディターが表示される', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    await app.switchToCommunityTab();

    await expect(app.answerItem).toBeVisible();

    await expect(
      page.locator('[data-testid="answer-item"] .monaco-editor')
    ).toBeVisible();
  });
});
