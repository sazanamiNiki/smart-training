import { expect, test } from '@playwright/test';

import { AppPage } from '../pages/AppPage';

test.describe('エディター実行機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
  });

  test('コードを実行してコンソールにログが出力される', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    await app.setEditorCode(["console.log('Hello E2E');", 'console.log(42);', 'export const main = (hand: string): string => hand;'].join('\n'));

    await app.executeCode();

    await expect(app.consoleOutput).not.toContainText('No output', { timeout: 60000 });
    await expect(app.consoleOutput).toContainText('Hello E2E');
    await expect(app.consoleOutput).toContainText('42');
  });

  test('コンソールパネルがデフォルトで表示されている', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    await expect(app.consoleOutput).toBeVisible();
  });

  test('Clearボタンでコンソールログが消去される', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    await app.setEditorCode("console.log('to be cleared');");
    await app.executeCode();
    await expect(app.consoleOutput).not.toContainText('No output', { timeout: 60000 });

    await app.consoleClearButton.click();
    await expect(app.consoleOutput).toContainText('No output');
  });
});
