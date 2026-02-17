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
const TEST_CASES_PATH = path.join(REPO_ROOT, 'static/questions/qu1/testCases.ts');

/** Extract test case names from testCases.ts source text. */
function extractTestCaseNames(src: string): string[] {
  const names: string[] = [];
  const re = /name:\s*'([^']+)'/g;
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

    const answerCode = readFileSync(ANSWER_PATH, 'utf-8');
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

    const answerCode = readFileSync(ANSWER_PATH, 'utf-8');
    await app.setEditorCode(answerCode);
    await app.runTests(90000);

    const testCasesSrc = readFileSync(TEST_CASES_PATH, 'utf-8');
    const names = extractTestCaseNames(testCasesSrc);

    const rows = await app.testResultRows().count();
    expect(rows).toBe(names.length);
  });

  test('画面上のテストケース名が testCases.ts の定義と一致する', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    const answerCode = readFileSync(ANSWER_PATH, 'utf-8');
    await app.setEditorCode(answerCode);
    await app.runTests(90000);

    const testCasesSrc = readFileSync(TEST_CASES_PATH, 'utf-8');
    const expectedNames = extractTestCaseNames(testCasesSrc);

    const uniqueNames = [...new Set(expectedNames)];
    for (const name of uniqueNames) {
      await expect(app.resultsArea).toContainText(name);
    }
  });

  test('不正解コードではテスト結果が表示され FAIL が含まれる', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    await app.setEditorCode(
      "export const main = (hand: string): string => '役なし';"
    );
    await app.runTests(90000);

    await expect(app.resultsArea).toContainText('FAIL');
  });
});
