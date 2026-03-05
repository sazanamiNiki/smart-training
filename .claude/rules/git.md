# Git フロー規約

## ブランチ構成

| ブランチ | 役割 |
|---------|------|
| `main` | リリース済み・安定版のみ |
| `develop` | 統合ブランチ（次リリースの集約先） |
| `feature/*` | 機能開発・バグ修正の作業ブランチ |

## 基本フロー

```
feature/* → develop → main
```

1. `develop` から `feature/*` ブランチを切る
2. `feature/*` で実装・コミット
3. `feature/*` → `develop` にマージ
4. リリース時のみ `develop` → `main` にマージ

## ブランチ命名規則

| 種別 | 形式 | 例 |
|------|------|----|
| 機能追加 | `feature/<名称>` | `feature/github-commit` |
| バグ修正 | `fix/<名称>` | `fix/esbuild-init` |
| リファクタ | `refactor/<名称>` | `refactor/editor-hook` |

## コミットメッセージ規約

- 1行目：変更内容を英語の命令形で簡潔に（50文字以内）
- 必要に応じて空行後に詳細を記述

```
Add GitHub commit feature

Implement Octokit REST integration for committing
user solutions to the configured repository.
```

## 新機能・修正作業の原則

- **新機能の実装・バグ修正・リファクタリングを開始する際は、必ず `develop` から新規ブランチを作成すること**
- 既存ブランチへの便乗実装は禁止（1ブランチ = 1タスク）

