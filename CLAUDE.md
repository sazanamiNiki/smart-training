# TypeScript練習・AIレビュープラットフォーム - 開発状況

## プロジェクト概要

ユーザーがブラウザ上でTypeScriptのコーディング課題（新規実装・バグ修正）に取り組み、ユニットテストの合格後に成果をGitHubへコミットできる学習システム。
正怪物をコミット後にAIによる「前回との比較レビュー」を受け、アドバイスをもらえるシステム

## 技術スタック

- **Frontend**: React (Vite), TypeScript, Material UI (MUI)
- **Editor**: @monaco-editor/react
- **Engine**: esbuild-wasm (Web Worker内での実行・判定)
- **API**: @octokit/rest, @google/generative-ai (Gemini), @anthropic-ai/sdk (Claude 3.5 Sonnet)


2. **ディレクトリ構造作成**
   ```
   src/
   ├── components/
   │   ├── Editor/          # Monaco Editor、テスト実行UI
   │   ├── Review/          # レビュー結果表示
   │   └── Common/          # APIキー入力など共通コンポーネント
   ├── problems/
   │   └── list/            # 個別問題定義ファイル
   ├── workers/             # Web Worker（コード実行エンジン）
   ├── services/            # API・外部サービス連携
   └── types/               # TypeScript型定義
   public/                  # 静的ファイル
   ```

3. **依存関係インストール**
   - `npm install` 実行済み（312 packages installed）

### 🔄 次のステップ

1. **コーディング規約の定義を受け取る**
   - 命名規則
   - ファイル構成ルール
   - コメントポリシー
   - 型定義の方針
   - その他プロジェクト固有のルール

2. **規約に従って実装**
   - 型定義ファイル（src/types/）
   - 問題定義（src/problems/list/sum.ts など）
   - esbuildサービス（src/services/esbuild.service.ts）
   - Web Worker実行エンジン（src/workers/executor.worker.ts）
   - Monaco Editorコンポーネント
   - テストランナーコンポーネント
   - AIレビューサービス（Gemini, Claude）
   - GitHub API連携
   - メインアプリケーション（App.tsx, main.tsx）
   - index.html


### vite.config.ts
- BASE_PATH環境変数対応済み
- Worker形式: 'es'
- esbuild-wasmをoptimizeDepsから除外済み

### tsconfig.json
- target: ES2020
- strict: true
- jsx: react-jsx


## アクセシビリティ

- コントラスト比 WCAG AA 以上
- 文字サイズ 12px 未満禁止
- キーボード操作のみで完結可能にする
- フォーカスリングを消さない

---

## パフォーマンス指針

- 初期描画 < 2秒
- 不要な再レンダリング禁止
- 大量DOM生成禁止
- エディタ領域の再描画最小化

---

## デザインゴール

このアプリの理想像：

- VS Code / Codespaces のような開発体験
- 学習に集中できるノイズのないUI
- マウスよりキーボード中心
- 「軽い・速い・迷わない」

---



## 注意事項

- 実装コードは削除済み（ディレクトリ構造のみ保持）
- node_modules は保持（再インストール不要）
- 規約定義後に実装を開始する予定
- `main` への直接コミット禁止
- `develop` への直接コミット禁止（マージのみ）
- `develop` → `main` 以外の逆方向マージ禁止
- `--force` push 禁止

## 作業手順（標準）

```bash
git checkout develop
git checkout -b feature/<名称>
# 実装・コミット
git checkout develop
git merge --no-ff feature/<名称>
git branch -d feature/<名称>
```