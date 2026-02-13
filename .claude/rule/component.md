# コンポーネント設計規約

## ファイル構成

- 1ファイル1コンポーネント（複数export禁止）
- コンポーネントと同階層に `hooks/`・`types.ts` を置く（外に漏らさない）

## 分割基準

- 100行超で分割を検討
- propsが5つ超 → 子コンポーネントへの切り出しを検討

## export規約

- コンポーネントは `export default`
- 型・hookは `named export`

## 禁止事項

- ロジックをJSX内に直書き（関数に切り出す）
- 親から3階層以上propsを渡す（Context or 設計見直し）

## コンポーネント目次

- `src/components/INDEX.md` をコンポーネントの目次ファイルとして管理する
- コンポーネントを新規作成・削除した際は必ず `INDEX.md` を更新する
- 記載形式は以下に従う

```md
# Component Index

## Editor
- `Editor/EditorPanel` - Monacoエディタ本体と実行ボタンを管理するパネル

## Review
- `Review/ReviewPanel` - AIレビュー結果を表示するパネル

## Common
- `Common/ApiKeyDialog` - APIキー入力ダイアログ
```
