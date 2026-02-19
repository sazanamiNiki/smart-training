import { expect, test } from '@playwright/test';

import { AppPage } from '../pages/AppPage';

const ANSWER_URL = 'answers/qu1/bunchoNiki/execute.ts';
const TEST_CASES_URL = 'static/questions/qu1/testCases.ts';

/** Extract test case names from testCases.ts source text. */
function extractTestCaseNames(src: string): string[] {
  const names: string[] = [];
  const re = /name:\s*['"]([^'"\n]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    names.push(m[1]);
  }
  return names;
}

test.describe('テスト実行と結果確認', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
  });

  test('正解コードでテストを実行すると全件 PASS になる', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    const answerResp = await page.request.get(ANSWER_URL);
    expect(answerResp.ok()).toBeTruthy();
    const answerCode = await answerResp.text();
    await app.setEditorCode(answerCode);
    await app.runTests(90000);

    const passText = await app.passCount.textContent();
    expect(passText).toMatch(/^\d+ \/ \d+ passed$/);

    const [passed, total] = (passText ?? '').split(' / ').map((s) => parseInt(s, 10));
    expect(passed).toBe(total);
    expect(total).toBeGreaterThan(0);
  });

  test('テスト結果の行数が testCases.ts の件数と一致する', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    const answerResp = await page.request.get(ANSWER_URL);
    expect(answerResp.ok()).toBeTruthy();
    const answerCode = await answerResp.text();
    await app.setEditorCode(answerCode);
    await app.runTests(90000);

    const testCasesResp = await page.request.get(TEST_CASES_URL);
    expect(testCasesResp.ok()).toBeTruthy();
    const testCasesSrc = await testCasesResp.text();
    const names = extractTestCaseNames(testCasesSrc);

    const rows = await app.testResultRows().count();
    expect(rows).toBe(names.length);
  });

  test('画面上のテストケース名が testCases.ts の定義と一致する', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    const answerResp = await page.request.get(ANSWER_URL);
    expect(answerResp.ok()).toBeTruthy();
    const answerCode = await answerResp.text();
    await app.setEditorCode(answerCode);
    await app.runTests(90000);

    const testCasesResp = await page.request.get(TEST_CASES_URL);
    expect(testCasesResp.ok()).toBeTruthy();
    const testCasesSrc = await testCasesResp.text();
    const expectedNames = extractTestCaseNames(testCasesSrc);

    const uniqueNames = [...new Set(expectedNames)];
    for (const name of uniqueNames) {
      await expect(app.resultsArea).toContainText(name);
    }
  });

  test('不正解コードではテスト結果が表示され FAIL が含まれる', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    await app.setEditorCode("export const main = (hand: string): string => '役なし';");
    await app.runTests(90000);

    await expect(app.resultsArea).toContainText('FAIL');
  });
});
