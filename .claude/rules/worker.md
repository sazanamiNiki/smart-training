# Cloudflare Worker コーディング規約

## ランタイム制約

Cloudflare Workers は Node.js ではなく **V8 ベースの独自ランタイム** で動作する。Node.js の API は使用できない。

### 使用禁止

- `process.env` → 環境変数へのアクセスは **バインディング経由** のみ（`env.VARIABLE_NAME`）
- `fs`・`path` などの Node.js 組み込みモジュール
- `setTimeout`・`setInterval`（Worker の実行モデル上、動作しない）

## レスポンス

レスポンスは必ず `new Response()` で返す。

```ts
return new Response(JSON.stringify(data), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
});
```

エラー時はステータスコードを明示する。

```ts
try {
  // ...
} catch (e) {
  return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

## 非同期処理

非同期処理は必ず `await` する。Worker はリクエストごとに独立して実行されるため、未解決の Promise はリクエスト終了時に破棄される。

```ts
const result = await env.DB.prepare('SELECT * FROM submissions').all();
```

## D1（SQLite）

クエリは `env.DB.prepare().bind().run()` パターンを使う。

```ts
// SELECT
const { results } = await env.DB.prepare(
  'SELECT * FROM submissions WHERE user_id = ?'
).bind(userId).all();

// INSERT / UPDATE
await env.DB.prepare(
  'INSERT INTO submissions (user_id, qu_id) VALUES (?, ?)'
).bind(userId, quId).run();
```

## R2（オブジェクトストレージ）

put / get は `env.REVIEW_STORAGE` バインディング経由でアクセスする。

```ts
// 保存
await env.REVIEW_STORAGE.put(key, value);

// 取得
const obj = await env.REVIEW_STORAGE.get(key);
if (obj === null) {
  return new Response('Not Found', { status: 404 });
}
const text = await obj.text();
```

## 型定義

Worker のバインディング型は `cloudflare/types.ts` で定義する。

```ts
export interface Env {
  DB: D1Database;
  REVIEW_STORAGE: R2Bucket;
  ANTHROPIC_API_KEY: string;
  SLACK_BOT_TOKEN: string;
}
```

ハンドラの第2引数として受け取り、直接参照する。

```ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // env.DB, env.REVIEW_STORAGE, env.ANTHROPIC_API_KEY ...
  },
};
```
