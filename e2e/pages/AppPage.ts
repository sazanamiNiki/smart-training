import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object Model for the Smart Training application.
 *
 * Provides reusable helpers for interacting with the main UI areas:
 * editor, console, test results, community answers, and submission.
 */
export class AppPage {
  readonly page: Page;

  /** Test execution button (runs test cases). */
  readonly testButton: Locator;
  /** Code execution button (runs code and captures console output). */
  readonly runButton: Locator;
  /** Console output area. */
  readonly consoleOutput: Locator;
  /** Clear console button. */
  readonly consoleClearButton: Locator;
  /** "問題説明" tab. */
  readonly tabDescription: Locator;
  /** "テスト結果" tab. */
  readonly tabResults: Locator;
  /** "みんなの回答" tab. */
  readonly tabCommunity: Locator;
  /** Results panel root element. */
  readonly resultsArea: Locator;
  /** Pass count label (e.g. "3 / 28 passed"). */
  readonly passCount: Locator;
  /** Submission area shown after all tests pass. */
  readonly submissionArea: Locator;
  /** GitHub authentication button in submission area. */
  readonly githubAuthButton: Locator;
  /** Device Flow user code displayed after GitHub auth starts. */
  readonly userCode: Locator;
  /** Community answers container. */
  readonly communityAnswers: Locator;
  /** Answer item container in community answers. */
  readonly answerItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.testButton = page.getByTestId('test-button');
    this.runButton = page.getByTestId('run-button');
    this.consoleOutput = page.getByTestId('console-output');
    this.consoleClearButton = page.getByTestId('console-clear');
    this.tabDescription = page.getByTestId('tab-description');
    this.tabResults = page.getByTestId('tab-results');
    this.tabCommunity = page.getByTestId('tab-community');
    this.resultsArea = page.getByTestId('results-area');
    this.passCount = page.getByTestId('pass-count');
    this.submissionArea = page.getByTestId('submission-area');
    this.githubAuthButton = page.getByTestId('github-auth-button');
    this.userCode = page.getByTestId('user-code');
    this.communityAnswers = page.getByTestId('community-answers');
    this.answerItem = page.getByTestId('answer-item');
  }

  /**
   * Navigate to the application and wait for the Monaco editor to load.
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForSelector('.monaco-editor', { timeout: 30000 });
  }

  /**
   * Set Monaco editor content via the Monaco API.
   *
   * @param code - TypeScript source code to place in the editor.
   */
  async setEditorCode(code: string) {
    await this.page.waitForFunction(() => (window as unknown as { monaco?: unknown }).monaco !== undefined, { timeout: 30000 });
    await this.page.evaluate((c: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      const editors: any[] = win.monaco?.editor?.getEditors?.() ?? [];
      const writableEditor = editors.find((e) => !e.getOption(win.monaco.editor.EditorOption.readOnly));
      writableEditor?.setValue(c);
    }, code);
  }

  /**
   * Click the Test button and wait for results to appear.
   *
   * @param timeout - Maximum wait time in milliseconds.
   */
  async runTests(timeout = 60000) {
    await this.testButton.click();
    await expect(this.passCount).toBeVisible({ timeout });
  }

  /**
   * Click the Run button to execute code and capture console output.
   */
  async executeCode() {
    await this.runButton.click();
  }

  /**
   * Switch to the "みんなの回答" (Community Answers) tab.
   */
  async switchToCommunityTab() {
    await this.tabCommunity.click();
  }

  /**
   * Switch to the "テスト結果" (Test Results) tab.
   */
  async switchToResultsTab() {
    await this.tabResults.click();
  }

  /**
   * Return a locator matching all visible test result rows.
   */
  testResultRows() {
    return this.page.locator('[data-testid^="test-result-row-"]');
  }

  /**
   * Read content from the read-only Monaco editor in the community answers panel.
   *
   * @returns The source code displayed in the community answer editor, or null if not found.
   */
  async getCommunityAnswerCode(): Promise<string | null> {
    return this.page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      const editors: any[] = win.monaco?.editor?.getEditors?.() ?? [];
      for (let i = editors.length - 1; i >= 0; i--) {
        if (editors[i].getOption(win.monaco.editor.EditorOption.readOnly)) {
          return editors[i].getValue() as string;
        }
      }
      return null;
    });
  }
}
