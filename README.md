# smart-training

ブラウザ上でTypeScriptのコーディング課題に取り組み、ユニットテストの合格後にGitHubへ回答を共有できる学習プラットフォーム。

## 主な機能

- **問題表示**: `static/questions/qu{n}/` に配置された課題を自動認識し、ブラウザ上にMarkdownで表示
- **コード実装**: Monaco Editorによるブラウザ内TypeScript編集
- **コード実行**: Runボタンでコードを実行し、console出力をConsoleパネルに表示
- **テスト実行**: Testボタンで定義済みテストケースを実行し、結果を一覧表示
- **回答提出**: 全テストPASS後にGitHub Device Flow認証を経て回答をリポジトリにコミット
- **回答閲覧**: 他のユーザーの提出済み回答コードと解説をブラウザ上で確認
- **設定**: カラーモード（dark/light）、エディタフォントサイズ、レイアウト反転

## セットアップ

```sh
npm install
npm run dev
```

開発サーバーが `http://localhost:5173` で起動します。

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 型チェック + Vite本番ビルド |
| `npm run preview` | ビルド結果プレビュー |
| `npm run test:e2e` | Playwright E2Eテスト |
| `npm run test:e2e:headed` | E2Eテスト（ブラウザ表示付き） |
| `npm run lint` | ESLint |

## 技術スタック

- **Frontend**: React 18 + Vite 5 + TypeScript 5.3
- **UI**: Material UI (MUI) 5
- **Editor**: @monaco-editor/react（Monaco Editor）
- **実行エンジン**: esbuild-wasm（Web Worker内でTS→JSトランスパイル＋実行）
- **認証**: GitHub Device Flow（@octokit/rest）
- **バックエンド**: Cloudflare Worker（OAuth プロキシ + 提出処理）
- **Markdown**: react-markdown
- **テスト**: Vitest（問題検証） / Playwright（E2E）
- **デプロイ**: GitHub Pages（GitHub Actions）

## 問題の追加手順

`static/questions/qu{n}/` ディレクトリを作るだけで問題が自動認識される。

### ディレクトリ構成

```
static/questions/
└── qu{n}/
    ├── meta.ts           # メタ情報（id, quId, title, mode, description, functionName）
    ├── testCases.ts      # テストケース（ブラウザUI・Vitest共用）
    ├── execute.ts        # ユーザーが実装するスケルトン関数
    ├── execute.test.ts   # Vitestテスト（CI検証用）
    ├── constants.ts      # 定数定義（省略可）
    └── README.md         # 課題説明
```

### 各ファイルの書き方

#### `meta.ts`

```typescript
import type { ProblemMeta } from '../../../src/types';

export const meta: ProblemMeta = {
  id: 'myProblem',
  quId: '1',
  title: '問題タイトル',
  // 'create'（新規実装）| 'fix'（バグ修正）
  mode: 'create',
  description: '関数 `main` を実装してください。',
  functionName: 'main',
};
```

#### `testCases.ts`

```typescript
export const testCases = [
  { input: ['input1'] as unknown[], expected: 'expected1' as unknown, name: 'テスト名' },
];
```

#### `execute.ts`

```typescript
export const main = (arg: string): string => {
  return arg;
};
```

#### `execute.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('qu{n}', () => {
  it.each(testCases)('$name', ({ input, expected }) => {
    expect((main as unknown as (...args: unknown[]) => unknown)(...input)).toEqual(expected);
  });
});
```

#### `constants.ts`（省略可）

```typescript
export const SOME_LABEL = '値';
```

ブラウザUI側では `export` が自動的に除去されてユーザーコードに挿入される。

### 追加の流れ

1. `static/questions/qu{n}/` ディレクトリを作成
2. 上記の各ファイルを配置
3. アプリを再起動すると問題が自動認識される
4. `static/questions/` 配下のみを変更したPRを `main` に出すと自動検証+マージされる

## 提出フロー

全テストケース通過後に提出エリアが表示される。以下の順で処理が進む。

### 1. GitHub Device Flow 認証（フロントエンド）

1. 「GitHub で認証する」をクリック
2. フロントエンドが `POST /login/device/code` をプロキシ経由で GitHub に送信
3. 返却された `user_code` と `verification_uri` を画面に表示
4. ユーザーが `verification_uri`（`github.com/login/device`）を開き `user_code` を入力
5. フロントエンドが `POST /login/oauth/access_token` をポーリングして User Access Token を取得
6. Octokit で `GET /user` を呼び出してユーザー名を取得
7. Token とユーザー名を `localStorage` に保存し、認証済み状態へ遷移

### 2. 解法説明の入力と提出

1. 認証済み状態で解法説明（Markdown）を入力し「提出する」をクリック
2. フロントエンドが Cloudflare Worker に `POST /submit` を送信
   - ヘッダー: `Authorization: Bearer <user_token>`
   - ボディ: `{ quId, code, description }`

### 3. Worker によるバックエンド処理

```
POST /submit (Cloudflare Worker)
│
├── Authorization ヘッダーから User Access Token を取得
├── GET /user          → GitHub ユーザー名 (login) を取得・認証確認
├── GET /user/emails   → verified メールアドレスを取得
├── ALLOWED_EMAIL_DOMAIN との一致検証（不一致 → 403）
│
├── GitHub App JWT 生成（PKCS#8 秘密鍵 + Web Crypto RS256）
├── POST /app/installations/{id}/access_tokens → Installation Token 取得
│
└── Git Data API で answers/{quId}/{login}/ に2ファイルをコミット
    ├── execute.ts      （ユーザーのコード）
    └── description.md  （解法説明）
```

### 4. 完了

- Worker が `{ success: true }` を返却
- 画面に `static/{quId}/{githubUser}/` のパスを表示
- リポジトリの `GITHUB_TARGET_BRANCH` ブランチに2ファイルがコミットされる

## デプロイ

| ブランチ | デプロイ先 |
|---------|-----------|
| `main` | GitHub Pages ルート (`/{repo}/`) |
| `develop` | GitHub Pages `/dev/` |
| `add-answers` | `answers/` ディレクトリのみ（回答データ） |

## ビルド

```sh
npm run build
```
