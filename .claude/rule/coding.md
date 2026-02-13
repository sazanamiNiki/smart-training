# コーディング規約

## コメントポリシー

- コード内の解説コメントは禁止（フォーマット・静的解析はESLint/Prettierに委ねる）
- インラインコメント（`//`）・ブロックコメント（`/* */`）を解説目的で使わない

## JSDoc

Google JavaScript Style Guide の JSDoc 規約に準拠する。

- すべての公開関数・クラス・型にJSDocを付与する
- `@param`、`@returns`、`@throws` を明記する
- 型は TypeScript の型システムと重複するため `@param {type}` の型注釈は省略する
- 説明文は命令形で書く（例: `Returns the sum.` ではなく `Return the sum.`）
- 1行で収まる場合は1行形式を使用する

```ts
/** Return the sum of two numbers. */
function sum(a: number, b: number): number { ... }

/**
 * Fetch commit diff from GitHub.
 *
 * @param owner - Repository owner.
 * @param repo - Repository name.
 * @param base - Base commit SHA.
 * @param head - Head commit SHA.
 * @returns Diff string.
 * @throws {Error} If the API request fails.
 */
async function fetchDiff(...): Promise<string> { ... }
```
