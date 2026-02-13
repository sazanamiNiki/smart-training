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

## 機能要件（実装予定）

### A. エディタ & 実行環境
- Monaco Editorを使用し、TypeScriptの型補完を有効にする
- esbuild-wasm でユーザーコードをJSに変換し、Web Workerで実行
- 2秒のタイムアウトを設定
- テストケース（入力/期待値）に基づき、実行結果とエラー詳細をMUI Tableで表示

### B. 問題管理システム
- src/problems/list/ 内に個別のTypeScriptファイルとして問題を定義
- 新規作成モード: 関数シグネチャのみを提供
- バグ修正モード: 初期コードにバグを含ませ、ユーザーに修正させる

### C. ハイブリッドAIレビュー
- 簡易レビュー (Gemini 1.5 Flash): テスト実行ごとに「無料枠」で動作のアドバイス
- 成長評価レビュー (Claude 3.5 Sonnet): 提出時に実行。前回/今回のコードを比較し成長度を評価
- GitHubの compareCommits APIから取得した diff をAIに送信

### D. セキュリティ・認証
- トークン・APIキーの非保持: localStorage や Cookie に一切保存しない
- オンデマンド入力: コミット/レビュー実行時にのみMUIダイアログで入力を求める
- メモリ上からも即座に破棄

## 非機能要件

- GitLab Pages対応: vite.config.ts で base パスを設定可能
- 可読性: 生成されるコードにコメントは一切入れないこと

## 最初の実装タスク（規約定義後）

1. プロジェクトのボイラープレート作成（設定ファイルは完了済み）
2. esbuild-wasm を初期化し、Monaco Editorで書いた sum(a, b) 関数のテストが通る最小構成の実装
3. テスト合格後に、GitHub API経由で差分を取得するロジックのスタブ（枠組み）作成

## 作業再開時の手順

1. このファイル（DEVELOPMENT_STATUS.md）を確認
2. コーディング規約を提示
3. 規約に従った実装を開始
4. 最初のターゲット: sum(a, b) 関数のテストが通る最小実装

## 既存の設定ファイル内容

### package.json (抜粋)
```json
{
  "name": "smart-training",
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "@mui/material": "^5.15.7",
    "@octokit/rest": "^20.0.2",
    "@google/generative-ai": "^0.2.1",
    "@anthropic-ai/sdk": "^0.20.0",
    "esbuild-wasm": "^0.20.0",
    "react": "^18.2.0"
  }
}
```

### vite.config.ts
- BASE_PATH環境変数対応済み
- Worker形式: 'es'
- esbuild-wasmをoptimizeDepsから除外済み

### tsconfig.json
- target: ES2020
- strict: true
- jsx: react-jsx

# 🎨 デザイン規約（UI / UX ガイドライン）

## デザインコンセプト

本アプリは「学習 × コーディング × レビュー」を行う **開発者向けツール** である。  
装飾性よりも **視認性・集中力・情報密度・操作効率** を最優先とする。

方針：

- PC専用（モバイル対応しない）
- モダン・フラットデザイン
- IDEライクなUI
- エディタが主役、UIは脇役
- 見た目より操作スピードを重視

---

## レイアウト規約
┌─────────────────────────────┐
│ Header                      │
├───────────────┬─────────────┤
│ Editor (70%)  │ Result(30%) │
│               │             │
└───────────────┴─────────────┘

### ルール

- 横2カラム固定
- Editor: 70〜75%
- テスト/レビュー: 25〜30%
- 高さ: 100vh固定
- スクロールは各ペイン内部のみ
- モーダル多用禁止（右ペイン内で完結させる）

---

## カラー規約

### カラーパレット

| 用途 | 色 |
|-------|----------------|
| 背景 | #0f172a |
| Surface | #111827 |
| Border | #1f2937 |
| Primary | #3b82f6 |
| Success | #22c55e |
| Error | #ef4444 |
| Warning | #f59e0b |
| Text | #e5e7eb |
| SubText | #9ca3af |

### 原則

- グラデーション禁止
- 強い影禁止
- 色数は最大6色まで
- 色は「状態表現」のみ使用（意味のない装飾色禁止）

---

## タイポグラフィ規約

### サイズ

| 用途 | サイズ |
|-----------|-----------|
| 見出し | 18–20px |
| 本文 | 14px |
| 補助テキスト | 12px |
| コード | 13–14px monospace |

### フォント

通常：ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto


---

## スペーシング規約

- 8px グリッドのみ使用
- margin/padding は 8 の倍数のみ許可
- 不要な余白は禁止（情報密度重視）

---

## コンポーネント規約

### 共通

- border-radius: 8px
- box-shadow 原則禁止（使う場合 0 1px 2px のみ）
- アニメーション 150ms 以下
- 装飾目的の要素は禁止

---

### Button

- contained / outlined のみ使用
- ラベル必須（アイコンのみ禁止）
- 角丸ボタン禁止

---

### Table（テスト結果）

- 1行 = 1テストケース
- Success / Error のみ色付け
- zebra striping禁止
- monospaceフォント使用
- 列は最小限（Input / Expected / Actual / Result）

---

### Card

- 情報グループ単位のみ使用
- 影ではなく border で区切る
- カード乱立禁止

---

### Dialog

- APIキー入力など一時的操作のみ許可
- 常用UIにモーダルを使わない

---

## UX規約

### 優先順位

1. エディタ
2. テスト結果
3. レビュー
4. 設定

### 原則

- ワンクリック実行（Run / Submit）
- キーボードショートカット重視
- 不要な確認ダイアログ禁止
- Toastは3秒以内で自動消滅
- ユーザーの視線移動を最小化

---

## 禁止事項

❌ グラデーション  
❌ 強いシャドウ  
❌ 派手なアニメーション  
❌ カードの多用  
❌ モーダル連打  
❌ アイコンのみUI  
❌ 不要な装飾  
❌ モバイル前提レイアウト  

---

## MUI 実装ルール

- `theme.ts` で色・タイポ・spacingを一元管理
- sx の inline style 乱用禁止
- styled / theme override を使用
- spacing = 8px単位のみ
- Typography variant を統一（fontSize直書き禁止）

---

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
