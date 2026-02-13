---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "App.tsx"
---

# TypeScript コーディング規約

## 命名規則

- **コンポーネント**: PascalCase（例: `SlideShowPlayer.tsx`）
- **フック**: camelCase + `use` プレフィックス（例: `useGoogleAuth.ts`）
- **サービス**: camelCase（例: `googlePhotosApi.ts`）
- **型定義**: PascalCase + `.types.ts`（例: `Album.types.ts`）

## コメント規約

- 各行にコメントを入れない（JSDoc のみ使用）
- hooks, utils の関数には必ず JSDoc を記載
- 関数の説明は「〜〜を行う」で統一

```typescript
/**
 * Google認証のトークンを取得を行う
 * @param code - 認証コード
 * @returns アクセストークン
 */
export const getAccessToken = async (code: string): Promise<string> => {
  // ...
};
```

## 型定義

- 配列の型定義は `Array<T>` を使用（`T[]` は使わない）
- props は常に型定義する
- 型定義ファイルは `*.types.ts` で統一

```typescript
// Good
const items: Array<string> = [];
type Props = {
  items: Array<Item>;
};

// Bad
const items: string[] = [];
```

## コンポーネント

- 関数コンポーネントのみを使用
- `StyleSheet.create` でスタイル定義
- props に値を渡す場合は必ず `{}` を使用

```typescript
// Good
<Component visible={true} count={0} />

// Bad
<Component visible count={0} />
```

## 制御構文

- 条件分岐（if/else）やループでは必ず波括弧を書く

```typescript
// Good
if (condition) {
  doSomething();
}

// Bad
if (condition) doSomething();
```

## クォーテーション

- シングルクォートで統一

```typescript
// Good
const message = 'Hello';

// Bad
const message = "Hello";
```

## インポート順序

1. React / React Native
2. Expo ライブラリ
3. サードパーティライブラリ
4. ローカルモジュール（絶対パス）
5. 相対パス
