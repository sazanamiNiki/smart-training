# Smart Training - 開発ガイド

## プロジェクト概要

ブラウザ上でTypeScriptのコーディング課題（新規実装・バグ修正）に取り組み、ユニットテストの合格後に成果をGitHubへコミット・共有できる学習プラットフォーム。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| Frontend | React 18 + Vite 5 + TypeScript 5.3 |
| UI | Material UI (MUI) 5 |
| Editor | @monaco-editor/react 4.6 |
| 実行エンジン | esbuild-wasm 0.20（Web Worker内） |
| Markdown | react-markdown 10 |
| 認証 | GitHub Device Flow（@octokit/rest） |
| バックエンド | Cloudflare Worker（提出用プロキシ） |
| テスト（問題検証） | Vitest 2 |
| E2E テスト | Playwright 1.58 |
| デプロイ | GitHub Pages（GitHub Actions） |

## ディレクトリ構造

```
smart-training/
├── src/
│   ├── App.tsx                    # ルートコンポーネント
│   ├── main.tsx                   # エントリポイント
│   ├── theme.ts                   # MUIテーマ（dark/light）
│   ├── types/index.ts             # 共通型定義
│   ├── contexts/
│   │   └── GitHubAuthContext.tsx   # GitHub認証コンテキスト
│   ├── hooks/
│   │   └── useGitHubSubmission.ts # Device Flow認証 + 提出ロジック
│   ├── services/
│   │   ├── esbuild.service.ts     # esbuild-wasm初期化・TSトランスパイル
│   │   └── storage.service.ts     # localStorage CRUD
│   ├── workers/
│   │   └── executor.worker.ts     # Web Worker: コンパイル→実行→結果返却
│   ├── problems/
│   │   ├── index.ts               # import.meta.glob で問題を自動収集
│   │   └── answers.ts             # コミュニティ回答のfetch+キャッシュ
│   └── components/
│       ├── INDEX.md               # コンポーネント目次
│       ├── Header/                # ヘッダー・問題選択・設定・問い合わせ
│       ├── Editor/                # Monacoエディタ・コンソール・useEditor
│       ├── Results/               # テスト結果一覧・提出エリア
│       ├── ResultsPanel/          # 3タブパネル（問題説明/結果/回答）
│       ├── CommunityAnswers/      # みんなの回答表示
│       ├── MarkdownWrapper/       # Markdownスタイルラッパー
│       ├── Common/                # （予備）
│       └── Review/                # （予備）
├── static/questions/              # 問題定義（qu1〜qu9）
│   └── qu{n}/
│       ├── meta.ts                # メタ情報
│       ├── testCases.ts           # テストケース
│       ├── execute.ts             # スケルトン関数
│       ├── execute.test.ts        # Vitestテスト
│       ├── constants.ts           # 定数（省略可）
│       └── README.md              # 課題説明
├── public/answers/                # コミュニティ回答（静的配信）
│   ├── answers-index.json
│   └── qu{n}/{userId}/
│       ├── execute.ts
│       └── description.md
├── cloudflare/
│   ├── github-oauth-proxy.js      # Cloudflare Worker（OAuth + 提出）
│   └── wrangler.toml
├── e2e/
│   ├── pages/AppPage.ts           # Page Object Model
│   └── tests/                     # E2Eテスト4ファイル
├── .github/workflows/
│   ├── deploy.yml                 # GitHub Pagesデプロイ
│   ├── e2e-pr.yml                 # PRマージ前E2Eテスト
│   └── validate-problem.yml       # 問題追加PR自動検証+マージ
└── .claude/
    ├── project-map.md
    ├── rules/                     # coding / component / design / git
    └── settings.local.json
```

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（localhost:5173） |
| `npm run build` | TypeScript型チェック + Vite本番ビルド |
| `npm run preview` | ビルド結果プレビュー |
| `npm test` | Vitest（問題テストケース実行） |
| `npm run test:e2e` | Playwright E2Eテスト |
| `npm run lint` | ESLint（--max-warnings 0） |

## 環境変数（.env）

| 変数 | 用途 |
|------|------|
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `VITE_GITHUB_PROXY_URL` | Cloudflare Worker URL（本番用） |
| `VITE_INQUIRY_URL` | 問い合わせ送信先URL |
| `BASE_PATH` | デプロイ先のベースパス |

## 設定ファイル

### vite.config.ts
- BASE_PATH環境変数対応
- Worker形式: `'es'`
- esbuild-wasmをoptimizeDepsから除外
- 開発時：GitHub OAuth + submit エンドポイントをプロキシ

### tsconfig.json
- target: ES2020 / strict: true / jsx: react-jsx
- `static/questions/**/*` はexclude（Vitestが直接実行）

### vitest.config.ts
- テスト対象: `static/questions/qu*/execute.test.ts`

### playwright.config.ts
- テストディレクトリ: `e2e/tests/`
- ブラウザ: Chromium
- 開発サーバー自動起動

## Git フロー

```
feature/* → develop → main
```

- `main` / `develop` への直接コミット禁止
- `--force` push 禁止
- 1ブランチ = 1タスク

## デプロイ

- `main` → GitHub Pages ルート (`/{repo}/`)
- `develop` → GitHub Pages `/dev/` サブパス
- `add-answers` → `answers/` ディレクトリのみデプロイ（回答データ用）

## 規約

コーディング・コンポーネント・デザイン・Gitの規約は `.claude/rules/` 配下を参照。