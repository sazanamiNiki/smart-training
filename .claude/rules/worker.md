# Cloudflare Worker コーディング規約

## ランタイム制約

Cloudflare Workers は Node.js ではなく V8 ベースの独自ランタイムで動作する。フロントエンドや Node.js の感覚でコードを書くと実行時エラーが発生する。

### 環境変数

- ❌ `process.env.VARIABLE_NAME` は使えない
- ✅ バインディング経由で `env.VARIABLE_NAME` を使う

```ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const token = env.ANTHROPIC_API_KEY;
  },
};
```

### Node.js 組み込みモジュール

- ❌ `fs`・`path`・`os`・`crypto`（Node.js版）等は使えない
- ✅ Web標準API（`crypto.subtle`、`URL`、`Headers` 等）を使う

### タイマー

- ❌ `setTimeout`・`setInterval` は Worker の実行モデル上、期待通りに動作しない
- ✅ 非同期処理は `async/await` で直接記述する

---

## レスポンス

- レスポンスは必ず `new Response()` で返す
- ステータスコードと `Content-Type` ヘッダーを明示する

```ts
return new Response(JSON.stringify(data), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});
```

---

## 非同期処理

- 非同期処理は必ず `await` する
- Worker はリクエストごとに独立して実行されるため、未 await の Promise は完了が保証されない
- バックグラウンド処理には `ctx.waitUntil()` を使う

```ts
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    ctx.waitUntil(someBackgroundTask(env));
    return new Response("OK");
  },
};
```

---

## D1（SQLite）

- クエリは `env.DB.prepare().bind().run()` パターンを使う
- SELECT は `.all()` または `.first()` を使う

```ts
const result = await env.DB.prepare(
  "SELECT * FROM submissions WHERE user_id = ?"
).bind(userId).all();

const row = await env.DB.prepare(
  "SELECT * FROM submissions WHERE id = ?"
).bind(id).first();

await env.DB.prepare(
  "INSERT INTO submissions (user_id, qu_id) VALUES (?, ?)"
).bind(userId, quId).run();
```

---

## R2（オブジェクトストレージ）

- put: `env.REVIEW_STORAGE.put(key, value)`
- get: `env.REVIEW_STORAGE.get(key)`
- get の結果は null チェックしてから `.text()` / `.json()` / `.arrayBuffer()` で取得する

```ts
await env.REVIEW_STORAGE.put(`reviews/${userId}/review.md`, markdownText);

const obj = await env.REVIEW_STORAGE.get(`reviews/${userId}/review.md`);
if (obj === null) {
  return new Response("Not found", { status: 404 });
}
const text = await obj.text();
```

---

## エラーハンドリング

- catch 節では必ずステータスコードを明示した `Response` を返す
- エラー内容を外部に漏らさない（本番では汎用メッセージを返す）

```ts
try {
  const data = await processRequest(request, env);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
} catch (err) {
  console.error(err);
  return new Response("Internal Server Error", { status: 500 });
}
```

---

## 型定義

Worker のバインディング型は `cloudflare/types.ts` で一元管理する。

```ts
export interface Env {
  DB: D1Database;
  REVIEW_STORAGE: R2Bucket;
  ANTHROPIC_API_KEY: string;
  SLACK_BOT_TOKEN: string;
}
```
