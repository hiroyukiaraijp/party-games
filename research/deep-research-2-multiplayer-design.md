# **デジタルおよびアナログ知育マルチプレイゲームの設計理論と成功要因の包括的分析**

現代の教育およびエンターテインメント領域において、マルチプレイ機能を備えたゲームは、単なる娯楽としての枠を超え、認知能力の開発や社会的スキルの向上、さらには特定の学術的知識の定着に寄与する強力なツールとして認識されている。教育的介入において、ゲームデザインの原則を応用することは、学習者の内発的動機付けを劇的に高め、エンゲージメントを持続させる上で極めて有効である1。本報告書では、デジタルおよびアナログの知育マルチプレイゲームにおける設計パターン、競争と協力がもたらす心理的・学習的影響、デバイス制約下（とりわけスマートフォン1台の環境）でのユーザーインターフェース（UI）およびユーザーエクスペリエンス（UX）アプローチ、そして大人数プレイ時のシステム的課題と解決策について、広範な研究データとプロダクト事例に基づく包括的な分析を提示する。

## **デジタルマルチプレイ知育ゲームの事例と設計パターン分析**

デジタル環境におけるマルチプレイ知育ゲームは、プレイヤー間の摩擦を最小限に抑えつつ、高度な社会的相互作用と認知処理を要求する設計が求められる。成功を収めているプロダクトは、単に教育コンテンツをデジタル化したものではなく、プレイヤー同士の対話、競争、あるいは協調をシステムレベルで自動発生させるアーキテクチャを備えている。以下の表は、主要な成功事例の基本構造と成功要因を整理したものである。

| ゲーム名 | プレイ人数 | 知育要素 | 成功要因 | 参考URL |
| :---- | :---- | :---- | :---- | :---- |
| **Jackbox Games** | 1〜8人 (＋観客機能) | 語彙力、ユーモアの構築、社会的推論、創造的表現 | 専用アプリを不要とし、ブラウザ経由で個人のスマートフォンをコントローラー化する「低摩擦（Low Friction）」設計。勝敗よりも「グループ全体の笑い」を主目的とし、参加障壁と心理的プレッシャーを極限まで下げた点4。パブサブ（Pub/Sub）通信を利用したリアルタイム同期がこれを支える6。 | [https://www.jackboxgames.com/jackbox-for-students](https://www.jackboxgames.com/jackbox-for-students) 4 |
| **QuizUp** | 2人 (1対1対戦) | 広範な一般常識、特定分野の専門知識、記憶の即時引き出し | シングルプレイを排除し、常に実在の人間と対戦させるソーシャルエンゲージメントの強制。500以上の極めて細分化されたトピックを用意し、ソーシャルグラフを利用した適切な対戦相手のマッチング機能が長期的なリテンションを生んだ7。 | [https://quizup.app/](https://quizup.app/) 8 |
| **Kahoot\!** | 2人〜数百人以上 | 学習内容の定着、速読力、パターン認識、競争的学習 | 教室やオンライン会議における「司会者（ホスト）と参加者」モデルの完全なデジタル化。即時フィードバックとランキングによるゲーミフィケーションを提供し、エビデンスに基づく学習プラットフォームとして学生の成績とエンゲージメントを向上させる構造2。 | [https://kahoot.com/library/](https://kahoot.com/library/) 2 |
| **Among Us** | 4〜15人 | 批判的思考、論理的推論、ディベート能力、非言語的意図の解読 | 非対称な情報（誰が裏切り者か）を利用し、タスク処理フェーズと議論フェーズを明確に分離した設計。プレイヤー間に生じる「疑心暗鬼」と「協調」のジレンマが、高度な対話と論理的 설得を強制する強力な社会的相互作用システム4。 | [https://www.jackboxgames.com/jackbox-for-students](https://www.jackboxgames.com/jackbox-for-students) 4 |
| **Gartic Phone** | 4〜30人 | 視覚的表現力、抽象概念の具象化、文脈の推論力 | 伝統的な「伝言ゲーム」に「描画」と「言語」の相互変換プロセスを組み込んだ点。情報の変換時に生じる「意図的な誤解」や「表現の限界」がユーモアを生み、非競争的でありながら極めて高いソーシャルエンゲージメントを達成している10。 | [https://www.youtube.com/watch?v=HKabRVEjxQE](https://www.youtube.com/watch?v=HKabRVEjxQE) 10 |
| **BrainWars** | 2人 | 計算力、記憶力、判断力、観察力、正確性、処理速度 | 言語や特定分野の知識に依存しない「非言語的」な脳トレミニゲームをリアルタイム対戦形式に落とし込んだ点。1ラウンド20秒という極めて短いループと、適応的なマッチングにより、言語の壁を越えたグローバルな競争環境を構築した11。 | [https://apps.apple.com/us/app/brain-wars/id845044428](https://apps.apple.com/us/app/brain-wars/id845044428) 11 |

上記の事例分析から導き出される重要な洞察は、デジタル知育マルチプレイの成功が、コンテンツの教育的純度ではなく「アーキテクチャによる社会的摩擦の排除と対話の促進」に依存しているという点である。Jackbox GamesやKahoot\!は、中央のメインスクリーン（ホスト）と個人の手元デバイス（クライアント）を分離するクライアント・コントローラーモデルを採用することで、ネットワーク設定の煩雑さを排除している4。さらに、BrainWarsは認知的な基礎能力（計算や記憶）にフォーカスし、1ラウンド20秒という短時間のマイクロインタラクションを繰り返すことで、敗北時のフラストレーションを最小化し、「もう一回」というリプレイ性を高めている12。

## **アナログ（ボードゲーム/カードゲーム）の知育系事例と認知能力への刺激**

デジタルデバイスが介在しないアナログなボードゲームやカードゲームは、物理的な制約や対面での即時的な反応が要求されることから、特定の認知能力を極めて強く刺激する設計となっている。ルールの処理から得点計算に至るまでをシステムではなくプレイヤー自身の脳内で行う必要があるため、メタ認知やワーキングメモリの訓練として優れた効果を発揮する。以下の表に主要な事例と刺激される認知能力を整理する。

| ゲーム名 | プレイ人数 | 知育要素 | 成功要因（刺激される認知能力） | 参考URL |
| :---- | :---- | :---- | :---- | :---- |
| **ワードバスケット** | 2〜8人 | 語彙力、音韻処理能力、ワーキングメモリ、瞬発力 | ターン制を排除し、場にあるカードの文字から始まり手札の文字で終わる単語を瞬時に思考する「早い者勝ち」のリアルタイムメカニクス。脳の言語野における検索処理（レキシカルアクセス）と、運動野への出力（発声と投擲）を極度の時間的プレッシャー下で同時実行させる処理速度の訓練に特化している15。 | [https://www.gentosha-edu.co.jp/smp/book/b441220.html](https://www.gentosha-edu.co.jp/smp/book/b441220.html) 15 |
| **ナンジャモンジャ** | 2〜6人 | エピソード記憶、ネーミング（名付け）能力、パターン認識 | 未知のキャラクターに対して任意の名前を与え、再登場時にその名前を最速で叫ぶメカニクス。プレイヤー自身の「意味記憶」と新たに生成された「エピソード記憶」を即座に結びつける海馬の機能を強く刺激する。他者が付けた突飛な名前を記憶・想起する傾聴力も養われる。 | (一般事例に基づく分析) |
| **ドブル** | 2〜8人 | 視覚的注意力、形態認識、周辺視野の活用、処理速度 | どの2枚のカードを選んでも必ず1つだけ共通するシンボルが存在するという数学的構造に基づく。色やサイズが異なるシンボル群から瞬時に同一形状を見つけ出す必要があり、視覚的スキャニング能力と直感的なパターン認識（System 1思考）が極限まで試される。 | (一般事例に基づく分析) |
| **コードネーム** | 2〜8人 (チーム戦) | 意味ネットワークの構築、抽象的思考、他者視点の獲得（心の理論） | スパイマスター（出題者）は盤面上の複数単語を1つのヒント単語で結びつける。これは脳内の「意味ネットワーク（Semantic Network）」を広範に探索する作業である。同時に「味方はこのヒントをどう解釈するか」というメタ認知能力（Theory of Mind）が強く求められる高度な知的協調設計。 | (一般事例に基づく分析) |
| **ディクシット** | 3〜8人 | 想像力、メタファーの理解、共感力、曖昧さの許容 | 抽象的なイラストに対し「全員には伝わらないが、誰か1人には伝わる」絶妙なヒントを出すメカニクス。論理的・収束的思考とは対極の「発散的思考」を要求し、プレイヤー間の共通の記憶や文脈を読み取る高度な共感力と社会的推論を刺激する。 | (一般事例に基づく分析) |

アナログゲームの優れた点は、ゲームのメカニクスが直接的にプレイヤーの認知機能に負荷をかける構造になっている点である。例えば、ワードバスケットやドブルのようなリアルタイムゲームは、時間を極端に制約することで大脳皮質における高度な論理的思考（System 2）を阻害し、即時的・直感的な情報処理（System 1）を強制する。これにより、純粋な処理速度や視覚的スキャニング能力が研ぎ澄まされる。一方で、コードネームやディクシットのようなゲームは、対面している他者の知識レベルや思考の癖を推論する「心の理論（Theory of Mind）」をフルに活用させるため、他者への共感やコミュニケーション能力の向上に直結する。

## **競争型 vs 協力型：モチベーションと学習効果への影響の研究**

マルチプレイ環境において、「競争（Competition）」と「協力（Cooperation）」のダイナミクスは、プレイヤーの心理的安全性、モチベーションの質、および最終的な学習成果に対して全く異なるアプローチと結果をもたらす。教育現場における数十年にわたる研究は、人間の社会性を基盤とした相互作用が学習に与える影響の大きさを浮き彫りにしている1。社会相互依存理論（Social Interdependence Theory）によれば、共通の目標を持つ協力的な環境では、他者の行動が自己の利益に直結するため、極めてポジティブな相互依存関係が生まれる16。

### **モチベーションと継続率における協力型の圧倒的優位性**

複数の実証研究が、協力的なプレイスタイルが競争的または単独のプレイスタイルに比べて、内発的モチベーション、自己効力感、楽しさを有意に高め、プレイの継続を促進することを示している18。特筆すべき統計データとして、エクササイズゲーム（Exergaming）を用いた比較研究において、個人プレイグループの離脱率（ドロップアウト率）が64%に達したのに対し、ソーシャルプレイ（協力・交流を含む）グループの離脱率はわずか15%にとどまったことが報告されている18。 協力型ゲームは「グループ全体で勝利または敗北する」という構造を取ることができる。これにより、個人が敗北を単独で背負うことによるエゴへの脅威（自尊心の低下）が分散・軽減され、結果として継続的な参加と学習の持続が促進される19。対照的に、競争型環境は短期的な生理的覚醒を引き起こし、エネルギー消費や一時的な努力の量を増大させるが、同時にストレスレベルの上昇や自律神経の緊張を持続させるリスクを伴い、長期的には心理的疲労を引き起こす可能性がある18。

### **学習効果への影響と認知プロセスの差異**

学習成果という観点でのメタアナリシス（例えば、数学教育における協力と競争の比較など）では、双方のアプローチが共に学習にポジティブな影響を与え、個人学習よりも短時間で同等の効果をもたらすことが確認されている1。語彙学習プラットフォームを用いた実験でも、個人競争とグループ間競争の双方でモチベーションの向上が見られ、最終的な学習効果に決定的な統計的差異は見られなかった22。 しかし、その認知プロセスには明確な違いが存在する。研究によれば、競争的な状況は「統計的学習（パターンの暗記や即時的な反応処理）」のプロセスを強力に加速させる一方で、一般的な概念理解の深化には必ずしも寄与しない傾向がある21。また、競争モードでは他者の行動が自己の進捗や勝敗に直結するため、自分のターン以外でも高い注意力が維持されるという利点がある24。一方で、協力モードでは、自分のターン以外で「他者任せ」になり、注意力が散漫になるフリーライダー（タダ乗り）現象のリスクが観察されている24。

### **向社会的行動（Pro-social Behavior）の育成**

感情的・社会的スキルの発達、特に「共有」や「助け合い」といった向社会的行動の育成という観点では、協力型ゲームが圧倒的な優位性を持つ。幼児を対象とした実験において、協力的な環境で15分間ゲームをプレイしたグループは、競争的な環境と比較して、その後の日常的な共有行動（Sharing behavior）が有意に増加した17。特に、協力ゲームをプレイする者は「他者もポジティブな行動を返してくれるだろう」という互恵的な期待に影響されるため、共感力やチームワークの醸成において最適解となる16。興味深いことに、この研究では競争的環境下における性差も確認されており、男児は設定の影響を受けにくかったのに対し、女児は競争環境下でも共有態度を維持・増加させる傾向が見られた17。

総括すると、教育的マルチプレイゲームを設計する際、反復による暗記や短期的な集中力（例：計算ドリル、英単語のフラッシュカード）を引き出すには**競争型**が適している。一方で、複雑な問題解決、長期的なエンゲージメントの維持、チームビルディング、多様性への寛容さを育むには**協力型**メカニクスを中心に据えるべきである20。

## **スマートフォン1台でのマルチプレイ設計：5つのアプローチの分析**

教育現場や日常のカジュアルな環境において、参加者全員が端末や強固なネットワーク環境を所有しているとは限らない。単一のスマートフォンを用いたローカルマルチプレイの設計は、ハードウェアの制約（小さな画面サイズ、入力インターフェースの限界）を逆手に取り、対面での社会的相互作用を最大化する独創的なアプローチが求められる。この制約下での設計は、大きく5つのパターンに分類され、それぞれに明確な長所と短所が存在する26。

| 設計パターン | メカニクス概要 | 長所（UX/学習への寄与） | 短所（設計上の課題） | 実装事例 |
| :---- | :---- | :---- | :---- | :---- |
| 1\. 画面共有 (Screen Sharing) | 端末をテーブル中央に置き、全員が同時に画面を見ながら進行する。 | デバイスをアナログのボードゲームのように機能させるため、視線が中央に集約され、プレイヤー間の直接的な対話が促進される。ルールの複雑な計算をUI側で吸収できる。 | 画面サイズによる視認性の限界。複数のプレイヤーが同時に画面に触れると、マルチタッチの競合や誤操作による混乱が発生しやすい。 | OLO（ドブル的なタップゲーム）、King of Opera。 |
| 2\. 回し読み (Pass and Play) | 1人のプレイヤーがターンを終えた後、次のプレイヤーに物理的に端末を渡す26。 | 各プレイヤーが画面を独占できるため、深い思考が必要な戦略や複雑な情報の読み込みに最適。情報の非対称性（自分だけが見る情報）を容易に構築できる27。 | 自分のターン以外のプレイヤーがデバイスから完全に切り離されるため、待ち時間（ダウンタイム）中のエンゲージメントが極端に低下し、学習の連続性が途切れる。 | デジタル版ボードゲーム（Ticket to Ride等）、Carcassonne。 |
| 3\. 司会者型 (Moderator/Host) | 1人がデバイスを持ちゲームマスターとして進行し、他者は物理空間で対話や議論を行う6。 | 参加者の大半は画面を見る必要がなく、完全なフェイストゥフェイスの対話が実現する。デバイスを持たない低年齢層や高齢者でも容易に参加可能。 | 司会者の認知的負担が大きく、司会者自身が「プレイヤー」としてゲームのコアな駆け引きや学習に参加しにくい構造的欠陥がある。 | 人狼ゲームのアシストアプリ、Keep Talking and Nobody Explodes（非対称協力）。 |
| 4\. 同時秘密入力 (Simultaneous Secret Input) | 各プレイヤーが他者に見られないよう、秘密裏に入力を行う。 | 情報の非対称性を生み出し、心理戦、ブラフ、社会的推論など高度なメタ認知のメカニクスを単一デバイス上で機能させることができる。 | 1台の端末で行う場合、手で画面を隠すアクションが必要となりテンポが悪化する。「覗き見」によるゲーム崩壊のリスクが常に伴う。 | デジタル版Cluedo。※Jackbox Gamesはこの課題をPub/Subアーキテクチャによる複数端末連動で解決している6。 |
| 5\. タイマー協力型 (Timer-based Cooperation) | リアルタイムの制限時間を設け、1台のデバイスを全員で操作するか瞬時に受け渡す。 | 極度の時間的プレッシャーがパニックを引き起こし、深い思考よりも直感的処理（System 1）や声掛けを強制する。エンゲージメントと盛り上がりが極めて高い。 | 焦りによるデバイスの落下や破損リスク。運動神経や反射神経に強く依存するため、プレイヤー間の能力差によるフラストレーションが生じやすい。 | Spaceteam（複数台推奨だが概念として）、5秒ルール系のワードゲームアプリ。 |

これら5つのパターンは排他的なものではなく、組み合わせて使用されることも多い。例えば、「司会者型」と「回し読み」を組み合わせることで、情報伝達のボトルネックを意図的に作り出し、それを解決するためのコミュニケーション自体をゲーム性（知育要素）へと昇華させることが可能である。スマートフォン1台という制約は、画面への没入を防ぎ、物理空間における対人コミュニケーションに意識を向けさせるための強力な触媒として機能する。

## **大人数対応の設計：8〜15人で遊ぶ場合の設計上の課題と解決策**

4人程度までの少人数向けゲーム設計理論を、8〜15人という大規模なグループにそのままスケールアップ適用することは事実上不可能である。スケールアップに伴い、システムの複雑性は指数関数的に増大し、ネットワーク同期の負荷（Pub/Subアーキテクチャにおけるメッセージングの増大など6）、そして何よりも「プレイヤー体験の著しい劣化」という甚大な課題が発生する31。

### **課題1: 致命的なダウンタイム（待ち時間）による離脱**

ターン制のゲームを大人数でプレイする場合、ダウンタイムはエンゲージメントの最大の敵となる32。例えば、1ターンの処理に1分かかるゲームを15人で行う場合、自分の次のターンが回ってくるまでに14分待つことになる。この長大なダウンタイムは、プレイヤーの認知的な離脱を引き起こし、ゲーム体験の崩壊を招く。 **解決策:**

* **同時並行処理（Simultaneous Turns）:** 全員が同時にアクションを決定・実行するシステムを導入する。例えば、ボードゲーム『7 Ages』での一斉アクション宣言や33、Jackbox Gamesのクイズにおける全プレイヤーの同時回答システムがこれに該当する。  
* **リアクション・メカニクス:** 他者のターン中にも自分に影響が及ぶ、あるいは介入できる「割り込み要素」や「防衛フェーズ」を設計し、常にゲーム状態を注視させる33。  
* **役割の細分化とサブチーム化:** 15人を3〜4人の小チームに分割し、チーム単位で意思決定を行わせる。これにより、ゲームのターン進行が遅くとも、チーム内での対話や戦略立案が絶えず継続する。

### **課題2: コミュニケーションの混沌と発言権の偏り**

15人が自由に発言できる非構造化された環境では、少数の声の大きいプレイヤー（アルファ・ゲーマー）が場を支配し、他のプレイヤーが傍観者（フリーライダー）に陥りやすい。

**解決策:**

* **情報の非対称性と責任の分散:** 各プレイヤーに固有の秘密情報、役割、または特殊能力を与え、「その人が発言し、行動しなければ全体が進行しない」状況をシステム的に強制する。パーティゲームにおいて、コミュニケーションは推奨されるものではなく、システムによって「強制」されるべきである9。  
* **コミュニケーションパスの意図的な制限:** 隣り合うプレイヤーとしか会話できない、あるいは『Gartic Phone』のように「絵と文字の交互の伝言」にするなど、情報伝達のチャネルを意図的に制限し、情報の劣化や誤解自体をゲームメカニクスとして利用する10。

### **課題3: 実力差による「負け確」状態とモチベーションの喪失**

ゲームが進行するにつれ、スコアや陣地によって勝敗の行方が確定してしまうと、劣勢のプレイヤーは参加意欲を喪失する。大人数になるほどプレイヤー間の実力差は広がりやすく、この問題は顕著になる34。 **解決策:**

* **自己調整システム（Self-Balancing / Rubber-banding）:** 『マリオカート』のアイテムシステムや、非対称対戦ゲーム『Crawl』のように、負けているプレイヤーに強力な能力を与え、トッププレイヤーの独走をシステム側が阻むハンディキャップシステムを組み込む35。  
* **プレイヤー排除（Player Elimination）の完全撤廃:** 途中でゲームオーバーになり脱落する仕組みを排除し、最後まで全員が盤面に影響を与えられる、あるいは結果を見届けられる設計にする32。  
* **ユーモアと定性的評価へのシフト:** 単純な数値的勝敗よりも、「いかに面白い回答をしたか」「いかに独創的な絵を描いたか」という定性的な評価や、他プレイヤーからの投票システム（Jackboxの『Fibbage』や『Quiplash』など）を主軸に置く。競争の性質を「スキル」から「ユーモアの共有」へとシフトさせることで、敗北のフラストレーションを無効化する36。

## **スマホ1台×知育×マルチプレイで実現すべき設計原則 TOP10**

これまでのデジタルおよびアナログゲームのメカニクス分析、競争と協力に関する教育心理学的研究、およびハードウェア制約下のインターフェース設計の知見を総合し、「スマートフォン1台を用いた知育マルチプレイゲーム」を開発するための核となる設計原則TOP10を以下に提唱する。

### **1\. ターン制の排除と同時実行（Simultaneous Action）の導入**

ダウンタイムはマルチプレイにおける最大の障壁である。デバイスを回し読みする「Pass and Play」形式を採用する場合でも、デバイスを持っていないプレイヤーが手元の紙や頭の中で同時に思考・計算を進められる「並行処理フェーズ」をゲームループ内に組み込み、認知的なアイドリング時間を排除すること。

### **2\. 「正解」よりも「プロセスとユーモア」の報酬化**

知識の有無による絶対的な優劣の固定化を防ぐため、論理的な正解だけでなく、発想の飛躍やユーモアを評価するメタメカニクスを取り入れる。参加者同士の投票によってポイントが決まるシステムは、知識格差を埋め、多様な発散的思考を促す5。

### **3\. 極端な時間制約（Timer）による直感的思考（System 1）の強制**

思考時間を意図的に枯渇させることで、大脳皮質による深い論理的思考（System 2）を阻害し、直感的な反応と処理速度を強制する。これにより、プレイヤー間の事前知識の差が「パニック」によって平準化され、即時的な熱狂とコミュニケーションが誘発される。

### **4\. 情報の意図的な隠匿と非対称性の活用**

画面が1つしかない制約を逆手に取る。「司会者だけが答えを知っている」「画面を見た人が、見えない人に口頭で状況を伝える」といった情報の非対称性を設計の核に据えることで、プレイヤー間に不可避な物理的対話と論理的推論を強制する9。

### **5\. 「共同敗北」を許容する協力設計の優先**

長期間の反復学習や、初対面の集団における心理的安全性の確保が主目的であれば、競争型よりも協力型を採用すべきである。チーム全体で目標を達成するか、あるいは全員で連帯して失敗する構造は、個人のエゴへの脅威を分散させ、離脱率を劇的に低下させる（15%対64%）18。

### **6\. 観客（オーディエンス）のシステム化と巻き込み**

大人数プレイにおいて、全員がデバイスに触れる機会を均等に設けることは困難である。「操作を実行するプレイヤー」と「助言や野次を飛ばす観客」の役割を流動的に切り替え、さらには観客のリアクションや声がゲームの難易度や結果に影響を与える（評価・投票など）仕組みを構築し、傍観者を排除する。

### **7\. ルールのミニマリズムとUIによる「見えざる手」**

知育要素を詰め込みすぎず、プレイヤーが記憶すべきルールは極限まで削る。複雑なポイント計算、状態管理、ターン処理などのバックエンド作業はすべてスマートフォンのプログラム（見えざる手）に委ね、プレイヤーを認知的過負荷から解放して「対人相互作用」のみに集中させる32。

### **8\. ダイナミックな自己調整（Rubber-banding）による緊張感の維持**

ゲーム後半におけるスコア差による「消化試合」を防ぐため、劣勢のプレイヤーに対するシステム的支援（強力なヒントの提示、得点倍率の変動、逆転要素の付与）をアルゴリズムによって自動的に行い、最後まで全員のモチベーションとエンゲージメントを保つ35。

### **9\. 物理空間の「共有ボード」としてのデバイス活用**

スマートフォンを単なる個人用の「画面」としてではなく、テーブルの中央に置かれた「トーテム」や「共通の操作盤」として物理的に配置する。視界を空間の中央に集約させることで、アナログボードゲームが本質的に持つ「対面での非言語コミュニケーション（視線や表情の読み合い）」の利点をデジタル体験に統合する。

### **10\. 「語り草（Storytelling）」を生むリフレクションフェーズの設計**

ゲーム終了直後に、ただスコアを表示するのではなく、プレイ中のお互いの行動、致命的なミス、あるいは奇跡的なファインプレーを振り返るフェーズ（ギャラリー機能や結果のシェア画面）を必ず設ける。ゲームの勝敗以上に、この「体験の共有と笑いの反芻」こそが、参加者間の社会的絆（ソーシャルボンド）を強固にし、強力なリプレイ動機を形成する6。

#### **引用文献**

1. Cooperative vs Competitive Education | Teaching By Science \- Pedagogy Non Grata, 3月 20, 2026にアクセス、 [https://www.teachingbyscience.com/cooperative-vs-competitive-education](https://www.teachingbyscience.com/cooperative-vs-competitive-education)  
2. Kahoot\! templates, guides and other resources, 3月 20, 2026にアクセス、 [https://kahoot.com/library/](https://kahoot.com/library/)  
3. 3 game design principles to boost learner engagement \- Business Simulations, 3月 20, 2026にアクセス、 [https://businesssimulations.com/insights/articles/how-to-make-learners-care-lessons-from-game-design/](https://businesssimulations.com/insights/articles/how-to-make-learners-care-lessons-from-game-design/)  
4. For Students \- Jackbox Games, 3月 20, 2026にアクセス、 [https://www.jackboxgames.com/jackbox-for-students](https://www.jackboxgames.com/jackbox-for-students)  
5. These Design Principles Made Jackbox a Party Game Phenomenon | Built In Chicago, 3月 20, 2026にアクセス、 [https://www.builtinchicago.org/articles/jackbox-games-design-party-pack](https://www.builtinchicago.org/articles/jackbox-games-design-party-pack)  
6. Build an online multiplayer game using peer-to-peer and realtime messaging | by Jo Franchetti | Medium, 3月 20, 2026にアクセス、 [https://medium.com/@jofranchetti/coping-with-quarantine-by-coding-597372a17746](https://medium.com/@jofranchetti/coping-with-quarantine-by-coding-597372a17746)  
7. Developing a QuizUp like Online Trivia Game, 3月 20, 2026にアクセス、 [https://www.gamedeveloper.com/programming/developing-a-quizup-like-online-trivia-game](https://www.gamedeveloper.com/programming/developing-a-quizup-like-online-trivia-game)  
8. QuizUp: Home, 3月 20, 2026にアクセス、 [https://quizup.app/](https://quizup.app/)  
9. Game Design Breakdown: Party Games : r/gamedesign \- Reddit, 3月 20, 2026にアクセス、 [https://www.reddit.com/r/gamedesign/comments/qosh8g/game\_design\_breakdown\_party\_games/](https://www.reddit.com/r/gamedesign/comments/qosh8g/game_design_breakdown_party_games/)  
10. JACKBOX...ON A FRIDAY\!? (The Jackbox Party Pack) | Gartic Phone After\! \- YouTube, 3月 20, 2026にアクセス、 [https://www.youtube.com/watch?v=HKabRVEjxQE](https://www.youtube.com/watch?v=HKabRVEjxQE)  
11. Brain Wars \- App Store \- Apple, 3月 20, 2026にアクセス、 [https://apps.apple.com/us/app/brain-wars/id845044428](https://apps.apple.com/us/app/brain-wars/id845044428)  
12. Game Review: Brain Wars \- The Decaturian, 3月 20, 2026にアクセス、 [https://decaturian.com/features/2014/11/05/game-review-brain-wars/](https://decaturian.com/features/2014/11/05/game-review-brain-wars/)  
13. BrainWars: The Competitive Brain Training App Now Available for Android\! | by IGNITION Staff \- Medium, 3月 20, 2026にアクセス、 [https://medium.com/ignition-int/brainwars-the-competitive-brain-training-app-now-available-for-android-3d5f88743bd9](https://medium.com/ignition-int/brainwars-the-competitive-brain-training-app-now-available-for-android-3d5f88743bd9)  
14. Remote Controls: Creating reliable shared-screen games with multiple input devices, 3月 20, 2026にアクセス、 [https://www.youtube.com/watch?v=pvsSzqT7gG8](https://www.youtube.com/watch?v=pvsSzqT7gG8)  
15. ワードバスケット ジュニア \- 幻冬舎edu, 3月 20, 2026にアクセス、 [https://www.gentosha-edu.co.jp/smp/book/b441220.html](https://www.gentosha-edu.co.jp/smp/book/b441220.html)  
16. Differential effects of exposure to cooperative versus competitive games on sharing behavior in young children \- Frontiers, 3月 20, 2026にアクセス、 [https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2025.1545932/pdf](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2025.1545932/pdf)  
17. Differential effects of exposure to cooperative versus competitive games on sharing behavior in young children \- Frontiers, 3月 20, 2026にアクセス、 [https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2025.1545932/full](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2025.1545932/full)  
18. Better Together: Outcomes of Cooperation Versus Competition in Social Exergaming \- PMC, 3月 20, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC4532894/](https://pmc.ncbi.nlm.nih.gov/articles/PMC4532894/)  
19. The behavioral effects of cooperative and competitive board games in preschoolers \- PMC, 3月 20, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC8248432/](https://pmc.ncbi.nlm.nih.gov/articles/PMC8248432/)  
20. Cooperation and competition have same benefits but different costs \- PMC \- NIH, 3月 20, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC11263633/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11263633/)  
21. The Effects of Cooperative and Competitive Situations on Statistical Learning \- PMC, 3月 20, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC9405654/](https://pmc.ncbi.nlm.nih.gov/articles/PMC9405654/)  
22. Impact Study of the Learning Effects and Motivation of Competitive Modes in Gamified Learning \- MDPI, 3月 20, 2026にアクセス、 [https://www.mdpi.com/2071-1050/14/11/6626](https://www.mdpi.com/2071-1050/14/11/6626)  
23. Game-Based Learning Effectiveness and Motivation Study between Competitive and Cooperative Modes | Request PDF \- ResearchGate, 3月 20, 2026にアクセス、 [https://www.researchgate.net/publication/318980472\_Game-Based\_Learning\_Effectiveness\_and\_Motivation\_Study\_between\_Competitive\_and\_Cooperative\_Modes](https://www.researchgate.net/publication/318980472_Game-Based_Learning_Effectiveness_and_Motivation_Study_between_Competitive_and_Cooperative_Modes)  
24. Game-Based Learning Effectiveness and Motivation Study between Competitive and Cooperative Modes \- NEWTON, 3月 20, 2026にアクセス、 [http://www.newtonproject.eu/wp-content/uploads/2019/09/Game-based-learning-effectiveness.pdf](http://www.newtonproject.eu/wp-content/uploads/2019/09/Game-based-learning-effectiveness.pdf)  
25. 3月 20, 2026にアクセス、 [https://multijournals.org/index.php/excellencia-imje/article/download/1757/1693/3354\#:\~:text=While%20competitive%20games%20emphasize%20individual,collaboration%20and%20collective%20problem%2Dsolving.](https://multijournals.org/index.php/excellencia-imje/article/download/1757/1693/3354#:~:text=While%20competitive%20games%20emphasize%20individual,collaboration%20and%20collective%20problem%2Dsolving.)  
26. 3月 20, 2026にアクセス、 [https://www.frontiersin.org/api/v4/articles/765881/file/Table\_2.XLSX/765881\_supplementary-materials\_tables\_2\_xlsx/1](https://www.frontiersin.org/api/v4/articles/765881/file/Table_2.XLSX/765881_supplementary-materials_tables_2_xlsx/1)  
27. Favorite iOS tabletop games? : r/digitaltabletop \- Reddit, 3月 20, 2026にアクセス、 [https://www.reddit.com/r/digitaltabletop/comments/r52h8i/favorite\_ios\_tabletop\_games/](https://www.reddit.com/r/digitaltabletop/comments/r52h8i/favorite_ios_tabletop_games/)  
28. MicroPlay: A Networking Framework for Local Multiplayer Games, 3月 20, 2026にアクセス、 [http://conferences.sigcomm.org/sigcomm/2012/paper/mobigames/p13.pdf](http://conferences.sigcomm.org/sigcomm/2012/paper/mobigames/p13.pdf)  
29. I'm looking for a game to play with a friend. : r/jeuxvideo \- Reddit, 3月 20, 2026にアクセス、 [https://www.reddit.com/r/jeuxvideo/comments/1mfb4j4/je\_cherche\_un\_jeu\_pour\_jouer\_avec\_un\_amis/?tl=en](https://www.reddit.com/r/jeuxvideo/comments/1mfb4j4/je_cherche_un_jeu_pour_jouer_avec_un_amis/?tl=en)  
30. \[Humble\] Asmodee Digital Play with Friends bundle: Small World 2, Carcassonne etc. (€1, BTA, €11 tiers) : r/GameDeals \- Reddit, 3月 20, 2026にアクセス、 [https://www.reddit.com/r/GameDeals/comments/gfbso6/humble\_asmodee\_digital\_play\_with\_friends\_bundle/](https://www.reddit.com/r/GameDeals/comments/gfbso6/humble_asmodee_digital_play_with_friends_bundle/)  
31. Designing for Multiplayer. Achieving the right balance is no easy… | by Josh Bycer \- Medium, 3月 20, 2026にアクセス、 [https://medium.com/super-jump/designing-for-multiplayer-4f37f6905140](https://medium.com/super-jump/designing-for-multiplayer-4f37f6905140)  
32. How to reduce downtime in your game \- The Board Game Design Course, 3月 20, 2026にアクセス、 [https://boardgamedesigncourse.com/how-to-reduce-downtime-in-your-game/](https://boardgamedesigncourse.com/how-to-reduce-downtime-in-your-game/)  
33. How can I mitigate some of the downtime between player's turns? \- Board & Card Games Stack Exchange, 3月 20, 2026にアクセス、 [https://boardgames.stackexchange.com/questions/6716/how-can-i-mitigate-some-of-the-downtime-between-players-turns](https://boardgames.stackexchange.com/questions/6716/how-can-i-mitigate-some-of-the-downtime-between-players-turns)  
34. Designing long-term engagement: A case study on short-session strategy gameplay \- Reddit, 3月 20, 2026にアクセス、 [https://www.reddit.com/r/gamedesign/comments/1kaskkt/designing\_longterm\_engagement\_a\_case\_study\_on/](https://www.reddit.com/r/gamedesign/comments/1kaskkt/designing_longterm_engagement_a_case_study_on/)  
35. Any literature you would recommend on how to balance multiplayer games? \- Reddit, 3月 20, 2026にアクセス、 [https://www.reddit.com/r/gamedesign/comments/1jo82ct/any\_literature\_you\_would\_recommend\_on\_how\_to/](https://www.reddit.com/r/gamedesign/comments/1jo82ct/any_literature_you_would_recommend_on_how_to/)  
36. Game Design Breakdown: Party Games | by Alexia Mandeville \- Medium, 3月 20, 2026にアクセス、 [https://alexiamandeville.medium.com/game-design-breakdown-party-games-5c2bd301cb96](https://alexiamandeville.medium.com/game-design-breakdown-party-games-5c2bd301cb96)