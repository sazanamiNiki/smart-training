# smart-training

ブラウザ上でTypeScriptのコーディング課題に取り組み、ユニットテストの合格後にAIレビューを受けられる学習プラットフォーム。

## セットアップ

```sh
npm install
npm run dev
```

## 問題の追加手順

`static/questions/qu{n}/` ディレクトリを作るだけで問題が自動認識される。

### ディレクトリ構成

```
static/questions/
└── qu{n}/
    ├── meta.ts           # メタ情報（id, title, mode, description, functionName）
    ├── testCases.ts      # テストケース（ブラウザUI・Vitest共用）
    ├── execute.ts        # ユーザーが実装するスケルトン関数
    ├── execute.test.ts   # Vitestテストスイート
    ├── constants.ts      # 定数定義（省略可）
    ├── README.md         # 課題説明
    └── answers/          # 解答保存ディレクトリ（空でOK）
```

### 各ファイルの書き方

#### `meta.ts`

```typescript
import type { ProblemMeta } from '../../../src/types';

export const meta: ProblemMeta = {
  id: 'myProblem',
  title: '問題タイトル',
  mode: 'create',
  description: '関数 `main` を実装してください。',
  functionName: 'main',
};
```

`mode` は `'create'`（新規実装）または `'fix'`（バグ修正）を指定する。

#### `testCases.ts`

```typescript
export const testCases = [
  { input: ['input1'] as unknown[], expected: 'expected1' as unknown },
  { input: ['input2'] as unknown[], expected: 'expected2' as unknown },
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
  it.each(testCases)('input: $input → $expected', ({ input, expected }) => {
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

1. `static/questions/qu{n}/` ディレクトリを作成する
2. 上記の各ファイルを配置する
3. アプリを再起動すると問題が自動認識される

## テストの実行

```sh
npm test
```

`static/questions/qu*/execute.test.ts` がすべて対象になる。

## ビルド

```sh
npm run build
```

## 提出フロー

全テストケース通過後に提出エリアが表示される。以下の順で処理が進む。

### 1. GitHub Device Flow 認証（フロントエンド）

1. 「GitHub で認証して提出する」をクリック
2. フロントエンドが `POST /login/device/code` をプロキシ経由で GitHub に送信
3. 返却された `user_code` と `verification_uri` を画面に表示
4. ユーザーが `verification_uri`（`github.com/login/device`）を開き `user_code` を入力
5. フロントエンドが `POST /login/oauth/access_token` をポーリングして User Access Token（`ghu_` プレフィックス）を取得
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
├── PUT /repos/.../contents/static/{quId}/{login}/execute.ts   （コード）
└── PUT /repos/.../contents/static/{quId}/{login}/description.md（説明）
```

### 4. 完了

- Worker が `{ success: true }` を返却
- 画面に `static/{quId}/{githubUser}/` のパスを表示
- リポジトリの `GITHUB_TARGET_BRANCH` ブランチに2ファイルがコミットされる
