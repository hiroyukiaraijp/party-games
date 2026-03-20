# HANDOVER — asobi.dev (Party Games)

## 現在の状態
- **13ゲーム** が公開済み、全て動作確認済み
- **Firebase Firestore** 統合済み（プロジェクト: asobi-dev）
- **セキュリティルール** 設定済み（users: read/write, playlogs: create/read only）
- **Firestoreインデックス** 作成済み（userId + createdAt 複合）
- **GitHub Pages** でデプロイ済み: https://hiroyukiaraijp.github.io/party-games/

## アーキテクチャ
```
index.html     — SEO LP（asobi.dev名義）
start.html     — ログイン → メンバー登録 → ゲームへ
games.html     — ゲーム一覧（アプリアイコングリッド）
profile.html   — マイページ（レーダーチャート、戦績、名前変更）
js/
  firebase-config.js  — Firebase設定
  profile.js          — ユーザー管理、プレイログ、プロファイル計算（Firestore版）
  shared.js           — ブラインドスクリーン、DDA、ベストスコア、FTUE、セッション管理
  auto-ruby.js        — 自動ふりがな（トグル式）
games/
  13ゲームディレクトリ（各: index.html, style.css, game.js）
agents/  — 8エージェント
skills/  — 15スキル
research/ — 7本のDeep Research + パズル設計ガイド
```

## 直近の未完了タスク（優先度順）

### 1. 各ゲーム内プレイヤー管理UIの統一改修（高優先度）
**現状の問題**: 各ゲームに「名前だけ入力してプレイヤー追加」するフォームが残っている。Firebaseログインとぶつかる。

**あるべき姿**:
- ゲーム開始時、start.htmlで登録したセッションメンバーがプレイヤー一覧に自動セット
- 今回不参加の人は「×」で一時的に除外できる
- 新しく追加する場合は名前+生年月日を入力→Firestore登録/ログイン
- 既存の addPlayer() / removePlayer() を全13ゲームで書き換え

**実装方針**: shared.jsに共通のプレイヤー管理コンポーネントを作り、各ゲームの init() で呼ぶ。HTMLのプレイヤーバー部分も共通テンプレート化。

### 2. ラバーバンディング（中優先度）
カタカナーシ、ワードスロット、連想ブリッジ等のスコア蓄積型ゲームで、スコア差が開くと消化試合化する。最終ラウンドポイント倍率等。

### 3. ナゾトキ問題拡充（中優先度）
現在45問+脱出6セット。パズルクリエイターエージェント（agents/puzzle-creator.md）+ Deep Research（research/deep-research-6-puzzle-design.md, research/puzzle-design-guide.md）を使って100問以上に。

### 4. 残りゲームへのDDA実装（低優先度）
逆引き辞書クイズ、ナゾトキ等にElo式DDA。shared.jsのgetDDALevel/updateDDALevelは準備済み。

## Firebase情報
- プロジェクトID: `asobi-dev`
- Firestoreコレクション: `users`, `playlogs`
- セキュリティルール: users(read/write:true), playlogs(create/read:true, update/delete:false)
- GitHubアカウント: `hiroyukiaraijp`（push前に `gh auth switch --user hiroyukiaraijp` 必要。pinky-curationsに切り替わることがある）

## ユーザーフロー（設計済み、実装途中）
1. start.html: 自分の名前+生年月日でログイン（Firestore照合）
2. start.html: 今日のメンバーを追加（各人も名前+生年月日）
3. games.html: ゲーム選択。メンバーが自動セット
4. 各ゲーム: セッションメンバーがプレイヤー。不参加者は除外可。新規追加は名前+生年月日
5. profile.html: マイページ（レーダーチャート、戦績ログ、名前変更、アドバイス）
