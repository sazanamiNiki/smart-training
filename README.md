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
