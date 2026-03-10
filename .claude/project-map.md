# Project Map

## ディレクトリ構造

```
src/
├── App.tsx                    # ルートコンポーネント（テーマ・認証Provider・2カラムレイアウト）
├── main.tsx                   # エントリポイント（ReactDOM.createRoot）
├── theme.ts                   # MUIテーマ（dark/lightパレット・タイポグラフィ・spacing）
├── vite-env.d.ts
│
├── types/
│   └── index.ts               # 共通型定義
│                                - ProblemMeta, Problem, TestCase, TestResult
│                                - SessionState, RunMessage, ExecuteMessage
│                                - ConsoleEntry, ConsoleLogType
│                                - WorkerRequest, WorkerResponse
│
├── contexts/
│   └── GitHubAuthContext.tsx   # GitHub認証状態をアプリ全体に共有
│                                - GitHubAuthProvider（Context.Provider）
│                                - useGitHubAuth()（Consumer hook）
│
├── hooks/
│   ├── useGitHubSubmission.ts # GitHub Device Flow認証 + 解答提出ロジック
│   │                            - startAuth(): Device Flow開始→ポーリング→トークン保存
│   │                            - submit(): POST /submit で解答をコミット
│   │                            - authStatus: 'idle' | 'pending' | 'authenticated' | 'error'
│   └── usePersistedState.ts   # localStorage自動永続化フック
│                                - usePersistedState<T>(loadFn, saveFn): [T, (v: T) => void]
│                                - useState互換API + 変更時に自動saveを実行
│
├── services/
│   ├── esbuild.service.ts     # esbuild-wasm初期化（wasmURL, worker:false）
│   │                            - transformTS(): TS→JSトランスパイル
│   └── storage.service.ts     # localStorage CRUD（ジェネリックヘルパー）
│                                - saveItem<T> / loadItem<T>: JSON serialize/parse汎用
│                                - saveRawItem / loadRawItem: 文字列そのまま保存/取得
│                                - session（選択問題ID・コード履歴）
│                                - github_token / github_user
│                                - layout_flipped / editor_font_size / color_mode
│
├── workers/
│   ├── executor.worker.ts     # Web Worker: esbuildでコンパイル→実行
│   │                            - 'run': テストケース実行（Vitestモック環境）
│   │                            - 'execute': コード単体実行（console出力キャプチャ）
│   │                            - stripModuleSyntax / stripTestImports / buildUserCode
│   │                            - モック定義は mocks/ から import
│   └── mocks/
│       ├── vitest-mock.ts     # Vitest互換テストランタイムモック文字列
│       │                        - describe / it / it.each / expect の模擬実装
│       │                        - __deepEqual / __matchObject ヘルパー
│       │                        - toBe / toEqual / toMatchObject / toHaveLength / toBeGreaterThan / toThrow
│       └── console-mock.ts    # console.logキャプチャモック文字列
│                                - console.log / warn / error / info → __consoleLogs配列に蓄積
│
├── problems/
│   ├── index.ts               # 問題一覧（import.meta.glob で自動収集）
│   │                            - /static/questions/qu*/meta.ts
│   │                            - /static/questions/qu*/testCases.ts
│   │                            - /static/questions/qu*/execute.ts（?raw）
│   │                            - /static/questions/qu*/execute.test.ts（?raw）
│   │                            - /static/questions/qu*/README.md（?raw）
│   │                            - /static/questions/qu*/constants.ts（?raw）
│   └── answers.ts             # コミュニティ回答（遅延fetch+キャッシュ）
│                                - getBaseUrl(): BASE_URL正規化（/dev除去含む）
│                                - fetchAnswerMeta(): answers-index.json取得
│                                - fetchAnswerDetail(): 個別回答のcode+description取得
│
└── components/
    ├── INDEX.md               # コンポーネント目次
    │
    ├── Header/
    │   ├── HeaderBar.tsx      # ヘッダー
    │   │                        - アプリタイトル「Smart Training」
    │   │                        - 問題セレクタ（Select）
    │   │                        - GitHubユーザー名表示
    │   │                        - 3点メニュー（設定/問い合わせ/機能要望）
    │   ├── InquiryDialog.tsx  # 問い合わせ・機能要望ダイアログ
    │   │                        - GAS（Google Apps Script）エンドポイントへPOST送信
    │   │                        - mode: 'contact' | 'feature-request'
    │   └── SettingsDialog.tsx # 設定ダイアログ
    │                            - カラーモード（dark/light）
    │                            - レイアウト反転トグル
    │                            - エディタフォントサイズ選択
    │
    ├── Editor/
    │   ├── EditorPanel.tsx    # Monacoエディタパネル
    │   │                        - Monaco Editor（typescript, vs-dark/vs テーマ）
    │   │                        - Testボタン（テスト実行）
    │   │                        - Runボタン（コード実行）
    │   │                        - 問題タイトル・モード表示
    │   │                        - 定数のTypeScript型補完（addExtraLib）
    │   ├── ConsolePanel.tsx   # コンソール出力パネル
    │   │                        - log/warn/error/info の色分け表示
    │   │                        - Clearボタン
    │   ├── hooks/
    │   │   ├── useEditor.ts   # エディタ状態管理（Worker通信はuseWorkerに委譲）
    │   │   │                    - code / setCode（デバウンス付きlocalStorage保存）
    │   │   │                    - run(): テスト実行→useWorker→結果取得
    │   │   │                    - execute(): コード実行→useWorker→コンソールログ取得
    │   │   │                    - results / running / consoleLogs / executing
    │   │   └── useWorker.ts   # Web Worker通信管理フック
    │   │                        - Worker のライフサイクル管理（mount時生成・unmount時terminate）
    │   │                        - postMessage(request, onResponse): 1リクエスト=1レスポンスの通信
    │   └── types.ts           # EditorPanelProps
    │
    ├── Results/
    │   ├── Results.tsx        # テスト結果一覧
    │   │                        - PASS/FAIL表示（色分け・アコーディオン展開）
    │   │                        - Input/Expected/Actual/Error/Reason表示
    │   │                        - 全テストPASS時→SubmissionArea表示
    │   │                        - 回答済みユーザーには「回答済み」表示
    │   └── SubmissionArea.tsx # GitHub認証 + 解答提出エリア
    │                            - idle: 「GitHub で認証する」ボタン
    │                            - pending: Device Flow（user_code + verification_uri）
    │                            - authenticated: 解法説明入力 + 提出/スキップ
    │                            - error: エラー表示 + 再認証ボタン
    │                            - 提出成功: パス表示
    │
    ├── ResultsPanel/
    │   ├── ResultsPanel.tsx   # 3タブパネル
    │   │                        - Tab 0: 問題説明（ReactMarkdown + 定数エディタ）
    │   │                        - Tab 1: テスト結果（Resultsコンポーネント）
    │   │                        - Tab 2: みんなの回答（CommunityAnswers）
    │   │                        - テスト実行時に自動でTab 1へ切替
    │   └── types.ts           # ResultsPanelProps
    │
    ├── CommunityAnswers/
    │   ├── CommunityAnswers.tsx # コミュニティ回答一覧
    │   │                         - 回答者セレクタ（Select）
    │   │                         - fetchAnswerMeta/fetchAnswerDetailで回答取得
    │   ├── AnswerItem.tsx       # 1件の回答表示
    │   │                         - Monaco Editor（readOnly）でコード表示
    │   │                         - 解説トグル（ReactMarkdown）
    │   └── types.ts             # CommunityAnswersProps, AnswerItemProps
    │
    ├── MarkdownWrapper/
    │   └── MarkdownWrapper.tsx  # Markdownコンテンツのstyled Box Wrapper
    │                              - h1-h3, p, pre, code, table, blockquote, ul/ol
    │
    ├── MyPage/                  # マイページコンポーネント群
    │   └── （実装予定）           # 提出履歴・レビュー結果表示
    │
    ├── Common/                  # （予備・未使用）
    └── Review/                  # （予備・未使用）
```

## 外部ファイル

```
static/questions/              # 問題定義（qu1〜qu9）
├── qu{n}/
│   ├── meta.ts                # ProblemMeta（id, quId, title, mode, description, functionName）
│   ├── testCases.ts           # TestCase[]（input, expected, name）
│   ├── execute.ts             # スケルトン関数（ユーザーが実装するベース）
│   ├── execute.test.ts        # Vitestテスト（CI検証用）
│   ├── constants.ts           # 定数（省略可、export除去してユーザーコードに挿入）
│   └── README.md              # 課題説明（Markdownで表示）

public/answers/                # コミュニティ回答（GitHub Pagesで静的配信、add-answersブランチでデプロイ）
├── answers-index.json         # メタ一覧 [{ quId, answerId, hasDescription }]
└── qu{n}/{userId}/
    ├── execute.ts             # 提出されたコード
    └── description.md         # 解法説明

cloudflare/
├── github-oauth-proxy.js      # Cloudflare Worker
│                                - PROXY: /login/device/code, /login/oauth/access_token
│                                - POST /submit: メール検証→GitHub App JWT→コミット→D1レコード作成→AIレビュー生成
│                                - GET /mypage: 提出一覧 + 集計レビュー取得
│                                - GET /review: 指定提出のレビュー本文取得（R2から）
├── types.ts                   # Worker共通型定義
│                                - Env: D1Database, R2Bucket, ANTHROPIC_API_KEY, SLACK_BOT_TOKEN
│                                - Submission: D1 submissionsテーブルレコード型
│                                - AggregateReview: D1 aggregate_reviewsテーブルレコード型
│                                - MyPageResponse: GET /mypage レスポンス型
├── migrations/                # D1マイグレーションファイル（wrangler d1 migrations apply で実行）
│   └── *.sql                  # submissionsテーブル・aggregate_reviewsテーブル定義
├── .dev.vars                  # ローカル開発用シークレット（gitignore対象）
├── .dev.vars.example          # ローカルシークレット雛形（ANTHROPIC_API_KEY, SLACK_BOT_TOKEN等）
└── wrangler.toml              # Worker設定（バインディング・D1・R2設定）
```

## コンポーネント階層

```
App
├── ThemeProvider（createAppTheme: dark/light）
├── GitHubAuthProvider
└── AppContent
    ├── HeaderBar
    │   ├── InquiryDialog
    │   └── SettingsDialog
    ├── EditorPanel
    │   ├── Monaco Editor
    │   ├── ConsolePanel
    │   └── useEditor（hook: Worker通信・状態管理）
    └── ResultsPanel（3タブ）
        ├── Tab 0: 問題説明（ReactMarkdown + Constants Editor）
        ├── Tab 1: Results
        │   └── SubmissionArea（全テストPASS時のみ）
        └── Tab 2: CommunityAnswers
            └── AnswerItem（Monaco Editor readOnly + 解説）
```

## 主要な状態管理

| 状態 | 管理場所 | 永続化 |
|------|---------|--------|
| 選択中問題ID | `App.tsx` useState | localStorage (`session`) |
| エディタコード | `useEditor` hook | localStorage (`session`, 300msデバウンス) |
| テスト実行結果 | `useEditor` hook | なし |
| コンソールログ | `useEditor` hook | なし |
| GitHub認証状態・ユーザー | `GitHubAuthContext` | localStorage (`github_token`, `github_user`) |
| カラーモード | `App.tsx` useState | localStorage (`color_mode`) |
| レイアウト反転 | `AppContent` usePersistedState | localStorage (`layout_flipped`) |
| エディタフォントサイズ | `AppContent` usePersistedState | localStorage (`editor_font_size`) |

## 環境変数（.env）

| 変数 | 用途 |
|------|------|
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `VITE_GITHUB_PROXY_URL` | GitHub OAuth プロキシURL（本番用） |
| `VITE_INQUIRY_URL` | 問い合わせ送信先URL |
| `BASE_PATH` | デプロイ先のベースパス |

## localStorage キー

| キー | 内容 |
|------|------|
| `smart-training:session` | 選択問題ID・問題別コード履歴 |
| `smart-training:github_token` | GitHub OAuth token |
| `smart-training:github_user` | GitHubユーザー名 |
| `smart-training:layout_flipped` | レイアウト反転設定 |
| `smart-training:editor_font_size` | エディタフォントサイズ |
| `smart-training:color_mode` | カラーモード（dark/light） |

## GitHub認証フロー

1. SubmissionAreaの「GitHub で認証する」ボタン → `startAuth()`
2. Device Flow: `POST /login/device/code` → QRコード・user_code表示
3. ポーリング: `POST /login/oauth/access_token`（interval + slow_down対応）
4. Octokit で `users.getAuthenticated()` → `githubUser` 取得
5. localStorage に token と user を保存
6. `GitHubAuthContext` 経由でアプリ全体に反映

## CI/CD

| ワークフロー | トリガー | 内容 |
|-------------|---------|------|
| `deploy.yml` | push to main/develop/add-answers | Viteビルド→GitHub Pages or answers配信 |
| `e2e-pr.yml` | PR to main | Playwright E2Eテスト実行 |
| `validate-problem.yml` | PR to main (static/questions変更時) | 必須ファイル検証→型チェック→自動マージ |

## E2Eテスト構成

| ファイル | テスト内容 |
|---------|-----------|
| `editor-execution.spec.ts` | Runボタン実行・コンソール出力・Clear |
| `test-execution.spec.ts` | テスト実行・全PASS確認・テストケース数一致・FAIL表示 |
| `submission.spec.ts` | 提出エリア表示・GitHub認証ボタン・回答済み判定 |
| `community-answers.spec.ts` | タブ切替・回答者セレクト・コード表示 |
