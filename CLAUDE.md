# Party Games - プロジェクトルール

## エージェント駆動開発

新しいゲームを作るときは、`agents/` 配下の7つのスペシャリストエージェントに議論させて設計・実装する。

### エージェント一覧
| Agent | ファイル | 役割 |
|-------|--------|------|
| 認知科学アドバイザー | `agents/cognitive-scientist.md` | 科学的エビデンスに基づく助言 |
| マルチプレイデザイナー | `agents/multiplayer-designer.md` | スマホ1台マルチプレイの設計 |
| リテンション設計者 | `agents/retention-specialist.md` | 継続率・ゲーミフィケーション |
| プロファイリング設計者 | `agents/profiling-architect.md` | 認知特性の測定・可視化 |
| ゲームメカニクスデザイナー | `agents/game-mechanics-designer.md` | ルール・メカニクスの設計 |
| ゲームUXスペシャリスト | `agents/game-ux-specialist.md` | 体験設計・フロー |
| ゲームUIデザイナー | `agents/game-ui-designer.md` | ビジュアルデザイン・レイアウト |

### ワークフロー
1. **企画フェーズ**: メカニクスデザイナー → 認知科学者 → マルチプレイデザイナーの順で議論
2. **設計フェーズ**: UXスペシャリスト → UIデザイナーが画面構成・ビジュアルを決定
3. **レビュー**: プロファイリング設計者がログ収集ポイントを助言、リテンション設計者が「もう1回遊びたくなるか」を評価
4. **実装**: 上記の設計に基づいてコーディング

## 技術スタック
- HTML/CSS/JS のみ（静的サイト、ビルド不要）
- 外部API最小限（Wikipedia等の無料API）
- localStorage で状態永続化
- GitHub Pages でデプロイ（hiroyukiaraijp/party-games）

## 全ゲーム共通ベース
- プレイヤー名登録 → 正解/スコアカウント → スコアボード
- ログの編集・削除が可能
- 1画面完結（スクロール最小限）
- モバイルファースト

## リサーチ資料
- `tasks/context-synthesis.md` — 統合コンテクスト
- `tasks/cognitive-training-research.md` — 認知科学エビデンス
- `tasks/research-multiplayer-educational-games.md` — マルチプレイ設計
- `tasks/gamification-retention-research.md` — 継続率設計
- `tasks/cognitive-profiling-research.md` — 認知プロファイリング
- `research/game-mechanics-research.md` — ゲームメカニクス案24種
