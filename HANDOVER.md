# HANDOVER
生成日時: 2026-03-21

## 今回やったこと
- **ゲーム0→17個を実装**: ワードスロット、カタカナーシ、ワードウルフ、マスターゲーム、数字deコトバ、連想ブリッジ、カラーパニック、フラッシュメモリー、リズムリレー、逆引き辞書クイズ(1050問)、ナゾトキ、空気読みスケール、頭文字バトル、ナンバーオークション、ラボパニック、漢字バラバラ(80問)、どこでしょう？(60問)
- **Firebase Firestore統合**: ユーザー管理(名前+生年月日)、プレイログ蓄積、クロスデバイス同期
- **認知プロファイルシステム**: 8軸レーダーチャート、脳タイプ診断、マイページ(profile.html)
- **セッションフロー**: start.html(ログイン→メンバー登録)→games.html→各ゲーム→profile.html
- **8エージェント+15スキル**: Deep Research 7本(1,790行)から構築
- **横断改修**: DDA、ブラインドスクリーン、色覚アクセシビリティ、脱落撤廃、プレイヤー除外UI統一
- **SEO LP**: index.html(asobi.dev名義)、JSON-LD構造化データ、FAQスキーマ

## 決定事項
- サイト名: **asobi.dev** (旧Party Games)
- ユーザー認証: **名前+生年月日**でFirestore照合(正式な認証なし)
- スコアリング共通ルール: **絶対値最近接、同点は全員に得点、全員同点はドロー**
- プレイヤー管理: セッションメンバー方式(start.htmlで登録→全ゲーム共有、ゲーム内で除外/追加可)
- ふりがな: 自動ルビ(js/auto-ruby.js)をトグル式で。手動rubyは全削除済み
- 数字deコトバ: 個人スコアリング(両隣正解=3pt/片方=1pt/なし=0pt)
- リズムリレー: 脱落廃止(-2ptペナルティで継続)

## 捨てた選択肢と理由
- **手動ruby**: 1000問以上のデータに手動rubyは非現実的→自動ルビ関数に変更
- **日本地図タップ(どこでしょう？)**: スマホで県をタップは難しい→4択方式に
- **オーバービッド(ナンバーオークション)**: ルールが複雑→絶対値最近接のシンプルルールに
- **Supabase/Cloudflare Workers**: Firebase Firestoreの方が静的サイトとの相性が良い
- **全員同点数(数字deコトバ)**: 不正解でも点が入るのはおかしい→個人の隣接ペア正解率で差をつける

## ハマりどころ
- **プレイヤー除外バグ**: `renderSessionPlayerBar`が呼ばれるたびにexcludedセットが再生成されていた。`_excludedPlayers`をグローバル化で解決。何度も報告されたが根本原因の特定に時間がかかった
- **ブラインドスクリーンのコールバック**: 無名関数を`onReady.name`で参照していたため実行されなかった。グローバル変数保存方式に変更
- **Firestoreインデックス**: userId+createdAtの複合インデックスが必要。エラーURLからコンソールで作成
- **GitHubアカウント切り替え**: `pinky-curations`に切り替わることがある。push前に必ず`gh auth switch --user hiroyukiaraijp`

## 学び
- 謎解き問題はデザインガイド(研究ベース)をコンテキストにしないと質が出ない
- 13ゲーム×同じ修正は共通JSコンポーネント化してから一括適用が効率的
- プレイヤー管理のようなゲーム横断機能は最初から共通設計すべきだった(後付けで全ゲーム改修が大変)

## 次にやること
- [ ] **P1**: プレイヤー除外が本当に全ゲームで動作するか実機テスト(過去に何度もバグ報告あり)
- [ ] **P1**: Firestoreにプレイデータが正しく保存されているか確認(マイページでの表示テスト)
- [ ] **P2**: ナゾトキの問題数拡充(現45問→100問以上。パズルクリエイターエージェント使用)
- [ ] **P2**: 残りゲームへのDDA実装(逆引き辞書、ナゾトキ等)
- [ ] **P2**: ラバーバンディング(カタカナーシ等のスコア蓄積型ゲーム)
- [ ] **P3**: Deep Research #6(謎解き設計)をパズルクリエイターに適用して高品質問題生成
- [ ] **P3**: FAQのFirestoreデータ保存に関する記述更新(現在「ローカルストレージに保存」と書いてある)
- [ ] **P3**: 認知プロファイルの設計思想検討(ユーザーが言及した未着手タスク)

## 関連ファイル
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/index.html` — SEO LP
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/start.html` — ログイン+メンバー登録
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/games.html` — ゲーム一覧
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/profile.html` — マイページ
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/js/firebase-config.js` — Firebase設定(asobi-dev)
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/js/profile.js` — Firestoreユーザー管理+プレイログ+プロファイル計算
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/js/shared.js` — 共通コンポーネント(ブラインドスクリーン,DDA,プレイヤーUI,ベストスコア,FTUE)
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/js/auto-ruby.js` — 自動ふりがな
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/games/` — 17ゲームディレクトリ
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/agents/` — 8エージェント
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/skills/` — 15スキル
- `/Users/hiroyukiarai/Library/CloudStorage/Dropbox/アプリ/remotely-save/Product Dev/Web Apps/party-games/research/` — 7本Deep Research + パズル設計ガイド
- **Firebase**: プロジェクトID `asobi-dev`、コレクション `users` `playlogs`
- **GitHub**: `hiroyukiaraijp/party-games`、GitHub Pages デプロイ
