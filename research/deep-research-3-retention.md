# **脳トレ・エデュテックアプリにおけるユーザー定着の行動心理学およびゲームデザイン理論分析レポート**

## **1\. 導入：モバイルアプリ市場における継続率の重要性と課題**

近年のモバイルアプリケーション市場において、ユーザー獲得コスト（CAC）の継続的な上昇に伴い、いかにして獲得したユーザーを長期的に定着させるか（リテンション）が事業の成否を分ける最大の焦点となっている。デジタルプロダクトの成功は、単に多くのダウンロード数を獲得することではなく、ユーザーの日常的な習慣の中にプロダクトをいかに深く組み込むかに依存している。特に、脳トレアプリ（Lumosity、Peak、Elevateなど）や語学学習アプリ（Duolingoなど）に代表されるエデュテック（EdTech）領域は、特異な課題を抱えている。これらのアプリケーションは、ユーザー自身の「自己研鑽」や「認知機能の向上」といった極めて高い初期モチベーションに支えられてインストールされるものの、その行動を日常的な習慣として定着させるプロセスにおいて、強烈な認知的負荷（Cognitive Load）と直面するためである。

本レポートは、Lumosity、Duolingo、Peakといった市場を牽引する学習・脳トレ系アプリケーションの継続率データをベンチマークとして参照しつつ、それらのアプリがユーザーを惹きつけ続けるために実装しているアーキテクチャを、UX（ユーザーエクスペリエンス）研究、行動心理学、およびゲームデザイン理論の観点から包括的に解剖するものである。ユーザーの脳内で生じる認知バイアスや動機付けのメカニズムを紐解き、自己決定理論（SDT）やフロー理論といった学術的枠組みがいかにして具体的なUI/UXデザインに落とし込まれているかを明らかにする。最終的には、これらの分析から導き出されたインサイトを統合し、実際のプラットフォームに実装すべき継続設計の優先順位を「TOP10」として提示する。

## **2\. 脳トレ・学習アプリの継続率データと業界ベンチマーク**

モバイルアプリの継続率は、アプリがユーザーにとって真の価値（Product-Market Fit）を提供できているかを示す最も強力な指標である。業界全体のデータを俯瞰すると、ユーザーの離脱はインストール直後の数日間に集中的に発生するという「離脱の崖（Churn Cliff）」の現実が浮かび上がる。

### **2.1 業界横断的な継続率の現状とプラットフォーム間の差異**

モバイルアプリ市場全体を対象とした調査によると、全カテゴリーにおけるインストール翌日（Day 1）の平均継続率は約25.3%〜26%であり、インストール後24時間以内に約75%のユーザーが離脱していることが判明している 1。この数値はDay 7（7日後）には11%〜15%まで低下し、Day 30（30日後）にはわずか5.7%〜7%にまで落ち込む 1。つまり、平均的なアプリは最初の1ヶ月で94%近くのユーザーを失っていることになる 4。

プラットフォーム別に見ると、iOSユーザーの方がAndroidユーザーよりもやや定着率が高い傾向が確認されている。Adjust社のグローバルベンチマークによれば、iOSのDay 1継続率が約27%（Day 30で約8%）であるのに対し、AndroidはDay 1で約24%（Day 30で約6%）となっている 2。この差異は、デバイスのパフォーマンス、ユーザーの人口統計学的な属性、または通知許容度の違いに起因すると考えられている。

### **2.2 カテゴリー別の継続率：教育・脳トレ領域の厳しい現実**

カテゴリー別に見ると、この継続率には明確なグラデーションが存在する。ユーザーの資金が直接紐づいている金融（Fintech）アプリはDay 1で30.3%、Day 30でも約9%〜11.6%と比較的高い水準を維持し、ニュースアプリもDay 30で約11.3%の定着を示す 5。また、純粋なエンターテインメントであるモバイルゲームアプリは、Day 1継続率が28.7%〜33.2%と高い初期エンゲージメントを示すものの、Day 30には2.3%〜5.4%へと急降下し、ユーザーが「飽き」を感じやすい構造が浮き彫りとなっている 4。

一方で、教育（Education）や脳トレカテゴリーのアプリは、最も定着が困難な領域の一つである。教育アプリの業界平均はDay 1で14%〜15%、Day 30ではわずか2%〜3%という極めて低い水準に留まっている 7。これは、学習や認知トレーニングが本質的に精神的エネルギーを消費する「労力を伴うタスク」であり、エンターテインメントのように受動的に消費できるものではないためである。

| アプリカテゴリー | Day 1 平均継続率 | Day 7 平均継続率 | Day 30 平均継続率 | 継続の主要因・特徴 |
| :---- | :---- | :---- | :---- | :---- |
| **全カテゴリー平均** | 25.3% \- 26.0% | 11.0% \- 13.0% | 5.7% \- 7.0% | 初期体験の価値提供と習慣化の成否 |
| **金融 (Fintech)** | 30.3% | 約 15.0% | 9.0% \- 11.6% | 資産管理の必要性、サンクコスト、高い信頼性 |
| **ゲーム (Gaming)** | 28.7% \- 33.2% | 約 10.0% | 2.3% \- 5.4% | 初期ドーパミン報酬が高いが、長期的な飽きが早い |
| **教育・脳トレ (Education)** | 14.0% \- 15.0% | 約 5.0% \- 7.0% | 2.0% \- 3.0% | 認知的負荷が高く、自己規律が求められるため離脱が顕著 |

### **2.3 トッププレイヤー（Duolingo, Lumosity, Peak）の特異な指標**

このような「努力を要する（Cognitive Loadが高い）」カテゴリーに属しながら、ゲームデザインの力で業界平均を大きく覆しているのが、DuolingoやLumosity、Peakといったトッププレイヤーである。これらのアプリは、教育や脳トレという本質的に退屈になりがちな作業を、継続的なエンゲージメントのループへと変換することに成功している。

特に語学学習アプリのDuolingoは、ゲーミフィケーションを極限まで最適化することで、驚異的な継続率を叩き出している。同アプリのデータ分析によれば、無料ユーザーであってもDay 30において約28%のユーザーがアクティブな状態を維持している 9。これは教育アプリの業界平均（2〜3%）の10倍以上に相当する。さらに、Day 1に3つ以上のレッスンを完了したユーザーは、Day 30に定着する確率が50%高くなることが示されている 9。また、有料サブスクリプションである「Duolingo Plus」のユーザーは、無料ユーザーと比較して継続率が65%も高いことが報告されており、金銭的なコミットメントが定着をさらに後押ししていることがわかる 9。Duolingoは長年にわたるA/Bテストと指標改善（CURR: Current User Retention Rateの最適化）により、2020年半ばに47%あった月間離脱率（Churn Rate）を、2023年末には欧米の主要市場で28%にまで半減させることに成功している 10。

一方、LumosityやPeak、Elevateといった脳トレアプリは、ゲームのエンターテインメント性と教育の自己研鑽性の境界に位置する。これらのアプリは、AI主導のパーソナライズ機能を搭載し、ユーザーの認知レベルに合わせて難易度を調整する。データ駆動型のパーソナライズプラットフォームであるElevateやPeakのようなアプリは、静的な難易度しか持たない従来の脳トレアプリと比較して、アクティブユーザー間の継続率が30%以上高いことが報告されている 11。

## **3\. 継続率を高めるゲーミフィケーション設計要素と行動心理学**

DuolingoやLumosity、Peakが高い継続率を維持している背景には、単なる「遊び要素」の追加にとどまらない、人間の認知バイアスや行動心理学に深く根ざしたシステム設計が存在する。ここでは、主要な設計要素がそれぞれどのような心理的トリガーを引いているのかを解剖する。

### **3.1 デイリーストリーク（連続記録）：損失回避とツァイガルニク効果**

ストリーク（連続記録）は、現代のコンシューマーアプリにおいて最も強力な継続メカニズムの一つである。Duolingoのデータでは、Day 1からストリークを維持したユーザー（Streak Starters）は、長期的なエンゲージメントにおいて35%の改善を示すことが分かっている 9。さらに、わずか7日間のストリークを達成したユーザーは、そうでないユーザーに比べてコースを完了する確率が3.6倍高くなり、翌日もアプリに戻ってくる確率が2.4倍高くなることが実証されている 12。

ストリークの強力な引力は、主に3つの心理学的原則によって説明される。

第一に\*\*「損失回避（Loss Aversion）」\*\*である。行動経済学におけるプロスペクト理論によれば、人間は同額の「利益」を得る喜びよりも、「損失」による精神的苦痛を約2倍強く感じるようにできている 14。ストリークが積み重なるほど、ユーザーは「これまで積み上げてきた数十日、数百日の記録（サンクコスト）」を失うことに対する強い恐怖を抱くようになる 16。この恐怖が、モチベーションが低い日であってもユーザーをアプリに向かわせる原動力となる。

第二に\*\*「ツァイガルニク効果（Zeigarnik Effect）」\*\*である。これは「完了した課題よりも、未完了の課題や中断された課題の方が記憶に残りやすい」という心理現象を指す 17。ストリークは、常にユーザーを「継続中（未完了）」の状態に置く。今日アプリを開かなければストリークが途切れてしまうという状態は、脳内に持続的な認知的緊張（Cognitive Tension）を生み出し、ユーザーをアプリへと呼び戻す無意識のトリガーとなる 12。

第三に\*\*「変動比率スケジュール（Variable Reinforcement Schedule）とドーパミン」\*\*である。ストリークは報酬そのものよりも、報酬を「期待」する過程でドーパミンを放出させる 12。Duolingoのデータによると、ストリークのモチベーション効果は現在の長さによって異なり、2日から3日に伸びる時は50%の成長を感じるのに対し、200日から201日への移行は0.5%の成長と認識される 12。このように、初期段階で強力なドーパミン報酬を与え、習慣を形成させる設計となっている。

しかし、ストリークには「Streak Creep（ストリークの呪縛）」という負の側面も存在する。連続記録を維持すること自体が目的化し、一度途切れた瞬間に強烈な自己嫌悪と燃え尽き（Burnout）を感じ、二度とアプリに戻らなくなるリスクである 20。このリスクを緩和するため、Duolingoは「ストリークフリーズ（Streak Freeze）」という救済措置を導入している。連続記録を保護するアイテムを装備可能にすることで、1日の失敗によるモチベーションの喪失を防ぎ、結果として相対的なDAU（Daily Active Users）を0.38%向上させるという絶妙なバランスを実現している 21。

### **3.2 リーダーボードとリーグ制：社会的比較と相対的コンピテンス**

スコアボードやリーダーボードは、人間の持つ競争心と「社会的比較（Social Comparison）」の欲求を刺激する。ゲーム化された学習環境において、リーダーボードはユーザーの目標設定を支援し、学習へのモチベーションを解放するゲームメカニクスとして機能する 22。

しかし、全ユーザーを対象とした単一の巨大なランキング（マクロ・リーダーボード）は、上位の極一部のユーザー以外にとっては「決して手の届かない目標」となり、かえって学習意欲を削ぐ（Demotivation）リスクを孕んでいる 22。ある研究では、無限のリーダーボードに対してネガティブな経験を報告したユーザーが約19.8%存在したことが示されている 24。

この問題を解決するため、成功しているアプリは「ミクロ・リーダーボード（階層別リーグ制）」を採用している 22。Duolingoでは、同じ週に同程度の活動量を示したユーザー数十人をグループ化し、その中での昇格・降格を争わせる 10。これにより、プレイヤーは「少し頑張れば勝てる（あるいは降格を免れる）」という現実的な目標を持つことができ、ドーパミンシステムが効率的に駆動される。XP（経験値）リーダーボードに積極的に参加するユーザーは、そうでないユーザーと比較して1週間に完了するレッスン数が40%も多いというデータが、この相対的な競争の威力を物語っている 25。

### **3.3 レベル、ランク、アチーブメント（バッジ）：可視化された進捗**

ポイント、レベル、バッジは、学習や認知トレーニングという本来「目に見えにくい進捗」を定量化し、可視化する装置である。あるタスクを完了した際にバッジを付与されると、脳内では報酬予測誤差に基づくドーパミンが放出される 19。バッジシステムを導入したコースでは、ユーザーのコース完了率が30%向上したという研究結果も存在する 25。

重要なのは、これらが単なるデジタルな勲章ではなく、「マイルストーンを区切る役割」を果たしている点である。長期的な目標（例：英語をマスターする、認知機能を若返らせる）は遠すぎて挫折しやすいが、アチーブメントは目標を細分化し、短期的な「小さな成功体験（Small Wins）」を連続して提供することで、自己効力感（Self-Efficacy）を高め続ける機能を持っている 26。

| ゲーミフィケーション要素 | 主な行動心理学的トリガー | 定着への効果と具体的な指標 | リスクと対策 |
| :---- | :---- | :---- | :---- |
| **デイリーストリーク** | 損失回避、ツァイガルニク効果 | 7日達成でコース完了率3.6倍向上 | 記録途絶時の燃え尽きリスク。ストリークフリーズ等の救済措置で緩和。 |
| **リーグ制・リーダーボード** | 社会的比較、競争心 | XPリーダーボード参加でレッスン完了数40%増加 | 上位層との絶望的格差による意欲低下。同レベル帯のミクロ・リーグ制で対応。 |
| **アチーブメント（バッジ）** | 自己効力感、スモールウィン | バッジ導入によりコース完了率が30%向上 | 報酬の形骸化。実績を社会的評価やアンロック要素に結びつける。 |

## **4\. 内発的動機付け vs 外発的動機付け：自己決定理論（SDT）の応用**

ゲーミフィケーションにおけるバッジやポイント、ランキングは「外発的動機付け（Extrinsic Motivation）」に分類される。これらは初期の習慣形成には極めて有効であるが、報酬そのものが目的化してしまうと、いずれ報酬に飽きた時点でユーザーは離脱する。長期的な定着（数ヶ月〜数年）を実現するには、ユーザー自身の内部から湧き上がる「内発的動機付け（Intrinsic Motivation）」へと昇華させる必要がある。

これを体系的に説明するのが、心理学者のEdward DeciとRichard Ryanによって提唱された「自己決定理論（Self-Determination Theory: SDT）」である 27。SDTによれば、人間の最適なモチベーションとウェルビーイングは、以下の3つの基本的心理欲求（Basic Psychological Needs）が満たされたときに発露する 28。脳トレや学習アプリのUI/UXは、これら3要素をいかにデザインに組み込むかが鍵となる。

### **4.1 自律性（Autonomy）：自己選択とコントロールの感覚**

自律性とは、自分の行動を自分自身で選択し、コントロールしているという感覚である 29。アルゴリズムが一方的に課題を押し付けるのではなく、ユーザーに「選ばせる」余白を残すことが重要である 28。

**【実装ケース：NeuroNationの実験】** ドイツ発の脳トレアプリ「NeuroNation」は、SDTに基づくUX改善のA/Bテストを実施した。同アプリは当初、バックエンドのデータに基づき自動的にパーソナライズされた難易度を提供していた。しかし実験では、特定のエクササイズで上位の成績を収めたユーザーに対し、次回のセッションで自ら「難易度を上げる（Challenge Mode）」か「下げる」かを選択できるオプション（自律性の付与）を導入した 30。アルゴリズムによる強制ではなく、ユーザー自身に体験を決定させるこの小さなUIの変更は、エクストリンシックな報酬からイントリンシックな満足への移行を促した。結果として、特に18〜30歳の若年層においてコンバージョン率（有料購読率）を30%引き上げ、30歳以上のユーザーでも14%のコンバージョン向上という劇的な結果をもたらし、結果的に同アプリの主要なUSP（Unique Selling Proposition）として定着した 30。

### **4.2 有能感（Competence）：成長の実感とフィードバック**

有能感とは、自分がそのタスクにおいて効果的に機能しており、能力が向上していると感じること、すなわち環境に対する習熟度（Mastery）の感覚である 29。エデュテックアプリは、ユーザーが「自分は賢くなっている」「能力が伸びている」と実感できる明確なフィードバックループを構築しなければならない。

**【実装ケース：Lumosityの「Insights」機能】** Lumosityは、単なるスコア表示を超えて「Insights（洞察）」という機能を導入した。これは、8500万人のユーザーによる40億回以上のプレイデータという膨大なデータベースを活用し、個人のゲームプレイの傾向、月間の伸び幅、スピードと正確性のトレードオフなどを分析し、ユーザーに対して「知的コーチング」を提供するものである 31。8回のプレイで「ゲームごとの強み」が解放され、25回で「月間の変動」が見えるようになるというように、プレイ回数に応じて新たな分析がアンロックされる設計を採用している 31。これにより、単なる数値の羅列ではなく、自身の成長（有能感）を実感するためのパーソナライズされた意味のある文脈が提供され、継続率を支えている。

### **4.3 関係性（Relatedness）：他者との意味のある繋がり**

関係性とは、他者と結びつき、コミュニティに属し、ケアしケアされているという感覚である 29。一人で黙々と取り組む脳トレや言語学習は孤独な作業になりがちだが、ソーシャル機能を通じて「見られている」「応援されている」「共に目標に向かっている」と感じることで、この欲求が満たされる（具体的な実装については、第7章のマルチプレイの項目にて後述する）。

## **5\. フロー理論とDDA（動的難易度調整）のアルゴリズム実装パターン**

ゲームデザインにおいて、ユーザーの没入感を最大化する状態を、心理学者ミハイ・チクセントミハイは「フロー（Flow）」と定義した。フロー状態は、プレイヤーの「スキル（能力）」とタスクの「挑戦レベル（難易度）」が完全に釣り合った狭い領域（Flow Channel）においてのみ発生する 32。タスクが簡単すぎれば「退屈（Boredom）」を生み、難しすぎれば「不安やフラストレーション（Anxiety）」を引き起こす 32。

ユーザーのスキルが向上していくにつれて、固定された難易度では必ず退屈が生じる。脳トレアプリや学習アプリにおいてこのフロー状態を維持し続け、フラストレーションと退屈の間を縫うように体験をナビゲートする核心技術が「動的難易度調整（DDA: Dynamic Difficulty Adjustment）」である 33。

### **5.1 DDAの実装パラダイム**

ゲームや学習システムにおけるDDAには、大きく分けて3つのアプローチが存在する 32。

1. **パフォーマンスベース（Performance-based DDA）：** 最も一般的で広く実装されているアプローチである。ユーザーの正答率、反応速度、タスク完了までの時間、勝率などの行動指標をリアルタイムに監視し、ゲーム内のパラメータ（例：敵の速度、問題の表示時間、メモリの容量）を調整する 32。  
2. **感情・生体ベース（Emotion-based DDA）：** 最新の研究で注目されているアプローチ。パフォーマンスベースのDDAは行動の「結果」には反応できるが、プレイヤーが内面で「どのように感じているか」を反映していないという課題がある。そこで、プレイヤーの心拍数や脳波（EEG）、皮膚電気活動（EDA）などの生理学的データを取得し、イライラしているか、退屈しているかという感情の覚醒度（Arousal）や価数（Valence）を推論して難易度を変化させる 32。VR環境やリハビリテーション目的のシリアスゲームで導入が進んでいる。  
3. **ハイブリッド型（Hybrid DDA）：** 行動データと生理学的データの両方を組み合わせて調整を行う。研究によれば、感情ベースの指標に高い重みを置くことで、パフォーマンスのみに依存するよりも個人のスキルレベルに最適に適合し、エンゲージメントを向上させる可能性が示唆されている 37。

### **5.2 脳トレ・学習アプリにおけるアルゴリズムの実装パターン**

実際のモバイルアプリ（LumosityやElevateなど）では、主にパフォーマンスベースのアルゴリズムが採用されており、代表的な実装モデルとして以下の3つが挙げられる。

* **Eloレーティングシステム：** 元々はチェスのプレイヤーの強さを評価するために考案されたアルゴリズムだが、適応型学習システムにも応用されている。「プレイヤー（ユーザー）」と「対戦相手（出題される問題）」の試合と見立て、ユーザーが正解すればユーザーのレートが上がり、問題のレート（難易度評価）が下がる。これにより、ユーザーの現在のレートと等しい難易度の問題を動的に抽出し続けることが可能になる 41。事前の大規模な問題キャリブレーションを必要とせず、オンラインで即座に機能する点が優れているため、教育システムでの採用が増加している 43。  
* **項目応答理論（IRT: Item Response Theory）：** ユーザーの能力値と項目の困難度をロジスティック回帰モデルを用いて推定する統計的手法である 44。精緻な難易度設定が可能だが、事前に大量のサンプルデータを用いたモデルのキャリブレーションが必要となるため、コールドスタートの問題があり、ローンチ直後のアプリには導入ハードルが高い 44。また、学習プロセス中に能力が変化し続けるという前提のモデル化には課題が残る 45。  
* **階段法（Staircase Method / N-down 1-up）：** 認知科学の実験やLumosityのような脳トレアプリで多用される手法である。例えば「3-down/1-up」方式では、ユーザーが3回連続で正解した場合に難易度を1段階上げ（アイテムを増やす、表示時間を短くするなど）、1回でも間違えれば難易度を1段階下げる 46。この手順を繰り返すことで、ユーザーの正答率が統計的に約79.4%に収束するポイント（簡単すぎず、難しすぎない適度な困難さ）を自動的に特定し、フロー状態を維持する 46。

Elevateなどのアプリは、これらの適応的プログレッション（Adaptive Progression）システムを組み込み、個人のスキル向上に合わせて常に「挑戦的」な環境を提供し続けている 47。これらのDDA技術は、ユーザーに「常に自分の限界を少しだけ超える挑戦」を提供し、有能感とエンゲージメントを極大化する上で不可欠なインフラとなっている。

## **6\. ユーザー離脱（チャーン）の要因分析：なぜ彼らはやめるのか**

どれほど巧妙なゲーミフィケーションやDDAを実装しても、離脱（Churn）は避けられない。ある縦断的なスコピングレビュー（18の研究、52万人以上の参加者を対象）によると、身体活動、食事、メンタルヘルスなどのヘルスケアやライフスタイル管理アプリをダウンロードしたユーザーの70%が、最初の100日以内に使用を完全に放棄している 48。このレビューでは、離脱の理由が大きく6つのカテゴリー（技術的問題、プライバシーの懸念、貧弱なUX、コンテンツの不足、時間・金銭的コスト、ユーザーのニーズの変化）に分類されている 48。離脱の兆候を行動データから早期に検知し、適切な介入（インターベンション）を行うためには、彼らがアプリを去る根本的な理由を深掘りする必要がある。

### **6.1 期待値とのギャップと「効果への疑念」**

脳トレアプリからの離脱において特筆すべきなのは、ユーザーの「効果が感じられない（Lack of perceived efficacy）」という疑念である 48。脳トレのユーザーは、記憶力の向上や仕事の生産性アップなど、実生活へのポジティブな波及効果（Transfer Effect）に対して極めて高い初期期待を抱いてアプリをダウンロードする 49。

しかし、科学的コミュニティにおける脳トレの有効性には長らく議論がある。特定のタスク（ゲーム）の成績が向上しても、それが一般的な認知能力や流動性知能（Fluid Intelligence）の向上に直結するかどうかは、多くのメタアナリシスで疑問視されている 50。実際に2016年には、Lumosityが「認知機能の低下やアルツハイマー病を防ぐ」といった誇大広告を行っていたとして、米国連邦取引委員会（FTC）から200万ドルの制裁金を科された事件もあった 52。

こうした背景もあり、ユーザーはゲームのスコアが上がっても、「単にそのゲームが上手くなっただけで、実生活の認知機能が向上しているわけではないのではないか」という疑念を抱きやすい 54。この「現実世界での有効性の欠如」や「証拠の不透明さ」は、知的なユーザー層がアプリをアンインストールする最大のトリガーとなる。前述のLumosityの「Insights」機能のように、科学的な根拠や客観的な成長データを提供し続け、実生活とのリンクを明示することが、この種の離脱を防ぐ防波堤となる。

### **6.2 認知的過負荷と学習の壁**

学習アプリや脳トレ特有の離脱要因として、「認知的過負荷（Cognitive Overload）」がある。言語学習や新しい認知スキルの習得には多大な精神的エネルギーを要する。ユーザーは当初モチベーションが高いものの、直面する「知識の壁（Wall of Knowledge）」の大きさに圧倒され、フラストレーションを感じて早期に離脱する（Early-stage churn）ことが多い 10。特に、UIが複雑で操作を覚えるのに時間がかかる、または一度に大量の情報を提示されると、認知資源が枯渇してアプリを開くこと自体が苦痛になる 56。

### **6.3 やらされ感の増長（Streak Creep）と退屈**

逆説的だが、継続を促すためのゲーミフィケーション自体が離脱の原因になることもある。これは「Streak Creep（ストリークの呪縛）」と呼ばれる現象である 20。ユーザーが本来の学習目的（新しい言語を学ぶ、脳を鍛える）を見失い、ただ「連続記録を維持すること」や「リーグで降格しないこと」自体が目的化してしまうと、内発的な喜びは消失し、強迫観念（Compulsion）と義務感のみが残る 18。この状態に陥ったユーザーは、何かの拍子にストリークが途切れた瞬間、張り詰めていた糸が切れたように「燃え尽き（Burnout）」を感じ、二度とアプリに戻ってこなくなる 20。 また、DDAが適切に機能せず、単調な作業の繰り返しに陥った場合の「退屈（Boredom / Lack of interest）」も、全離脱理由の31.6%を占める主要な要因である 58。

## **7\. マルチプレイ特有の継続設計：社会的アカウンタビリティとピアサポート**

一人で黙々と画面に向かうシングルプレイの脳トレや学習は、強い意志力（Willpower）を消費する。これに対し、他者の存在をシステムに組み込むことで、この意志力の消費を肩代わりさせるメカニズムが「社会的アカウンタビリティ（Social Accountability）」である。

### **7.1 競争と協調のバランス**

リーダーボードを通じた「競争（Competition）」はエンゲージメントを高める強力なツールであるが、万能ではない。常に競争状態に置かれることは、スキルの低いユーザーにとって大きな精神的負担となる 59。ここで重要になるのが、「協調（Cooperation）」のメカニズムである。

心理学および教育学の研究では、単なる競争よりも、共通の目標に向かって協力する環境（Cooperative Learning）の方が、エンゲージメントを最大20%、知識の定着率を15%向上させることが示されている 60。協調的プレイでは、他者のために貢献しなければならないというポジティブな義務感が生じ、モチベーションを高める一方で離脱率を劇的に低下させる 61。

### **7.2 Duolingoの「Friends Quest（フレンドクエスト）」の解剖**

協調的マルチプレイ設計の最高峰と言えるのが、Duolingoが実装した「Friends Quest」機能である。この機能は、単なる友人間でのスコアの競い合いではなく、極めて巧妙な心理的エンジニアリングの上に成り立っている 62。

1. **ランダムなペアリングと共有目標：** 毎週、システムがユーザーのフレンドの中からランダムに一人を選び、ペアを組ませる。そして「二人で合計50回のパーフェクトレッスンを達成する」といった共同目標（クエスト）が与えられる 63。これにより、ユーザーは「自分のために学ぶ」だけでなく、「パートナーを失望させないために学ぶ」という強い社会的義務感（Social Obligation）を背負うことになる 62。  
2. **ナッジ（Nudge）とピアサポート：** パートナーの進捗はリアルタイムで可視化され、パートナーがアクションを起こさない場合、もう一人のユーザーはアプリ内から「リマインダー（Nudge）」や「XPブーストのギフト」を送ることができる 64。企業からの機械的なプッシュ通知は無視されやすいが、友人から直接送られてくる通知は無視することが心理的に難しく、休眠状態のユーザーをアクティブ状態に強力に引き戻す効果がある。  
3. **非対称な貢献の許容：** クエストの目標は二人の「合計値」で計算されるため、スキルの高いユーザーが多めに貢献し、スキルの低いユーザーをカバーすることが可能である。これにより、能力差があっても共に成功体験（Shared Wins）を味わうことができ、SDTにおける「関係性（Relatedness）」と「有能感（Competence）」の欲求が同時に満たされる 61。

実際に、アプリ内でフレンドをフォローしているユーザーは、そうでないユーザーと比較してコースを修了する確率が5.6倍高いという驚異的なデータが、社会的繋がりの威力を証明している 63。また、高齢者向けのシリアスゲームにおける研究でも、単なる競争よりも協調モードの方がプレイヤー間の言語的コミュニケーションを活性化し、長期的な心理的ウェルビーイングに寄与することが確認されている 65。

## **8\. 結論：我々のサイトに組み込むべき継続設計 TOP10**

本調査に基づくUX研究、行動心理学、ゲームデザイン理論の知見を統合し、脳トレ・学習プラットフォームの継続率（Day 30以降の長期定着）を最大化するために実装すべき設計要素を、優先度順に提示する。

| 優先度 | 実装すべき設計要素 | 解決する課題・心理的トリガー | 期待される効果・理論的背景 |
| :---- | :---- | :---- | :---- |
| **1** | **動的難易度調整（DDA）の基盤実装** （Eloレーティングまたは階段法） | 退屈と不安の解消 （フロー理論） | ユーザーのスキルに応じた最適な挑戦をリアルタイムに提供し、認知的過負荷や「飽き」による早期離脱を根本から防ぐ。事前のキャリブレーションが不要なEloレーティングが実装上優位である。 |
| **2** | **救済措置付きストリークシステム** （ストリークフリーズ機能） | 損失回避とツァイガルニク効果 （燃え尽き症候群の防止） | 連続記録による強力な毎日の起動動機を作る一方、1日の失敗による絶望的な離脱（Streak Creep）をアイテムで保護する。 |
| **3** | **協調型マルチプレイ目標** （フレンドクエスト機能） | 社会的アカウンタビリティと関係性 （SDT：自己決定理論） | 企業からの通知ではなく、ピア（友人）からの社会的義務感とナッジを利用して、アプリ起動の動機を外部委託する。 |
| **4** | **マイクロ・リーダーボード** （活動量ベースの階層別リーグ制） | 社会的比較と相対的有能感 | 全体ランキングによる絶望感を排除し、常に「少し頑張れば昇格できる」30人程度の閉じたグループで現実的な競争を促し、ドーパミン報酬を最適化する。 |
| **5** | **学習効果と成長の視覚化ダッシュボード** （Insights機能） | 実生活での効果への疑念解消 （SDTの有能感） | プレイデータに基づく科学的な分析レポート（強み、成長度）を提供し、脳トレに対する「本当に意味があるのか」という疑心（中期以降の主要な離脱理由）を払拭する。 |
| **6** | **難易度の自己選択オプション** （チャレンジモードの導入） | 自律性の担保 （SDTの自律性） | アルゴリズムによる強制だけでなく、優秀な成績を収めた際に「あえて難しいレベルに挑むか」をユーザー自身に選択させ、有料購読へのコンバージョンを高める。 |
| **7** | **マイクロ・マイルストーンとバッジ** | スモールウィンとドーパミン放出 | 遠すぎる最終目標を細分化し、短いセッションごとに達成感（バッジや視覚的演出）を与え、次の行動へのモチベーションを補給する。 |
| **8** | **ストリークに対する「賭け」機能** （Streak Wager） | コミットメントと一貫性の原理 | 「次の7日間連続でプレイする」ことにゲーム内通貨を賭けさせることで、自らへの宣言による強力なロックイン効果を生み、短期的な継続率を向上させる。 |
| **9** | **非対称な協力ロールの実装** | スキル格差の吸収と共有体験 | マルチプレイにおいて、スキルの高いユーザーが初心者をカバーできる仕組みを作り、脱落者をコミュニティ全体で引き上げ、エンゲージメントを強化する。 |
| **10** | **透明性のあるフィードバックループ** | 認知資源の節約（摩擦の排除） | 正誤やレベルアップの判定を、直感的なUIとサウンドで即座に返し、システムの使い方を学習する際の認知的負荷を最小化し、初期の離脱（Day 1ドロップ）を防ぐ。 |

本質的な長期継続（Retention）とは、単にプッシュ通知でユーザーを呼び戻すことではない。システム側がユーザーの能力を正確に測り（DDA）、その成長を科学的に証明し（Insights）、社会的繋がりの中で称賛される環境（Friends Quest）を構築することである。これらの要素が組み合わさることで初めて、ユーザーの動機付けは「バッジが欲しい」という外発的なものから、「自己が成長し、他者と繋がるのが純粋に楽しい」という内発的なものへと変容し、強固な習慣形成が実現されるのである。

#### **引用文献**

1. Mobile App Retention \- Business of Apps, 3月 20, 2026にアクセス、 [https://www.businessofapps.com/guide/mobile-app-retention/](https://www.businessofapps.com/guide/mobile-app-retention/)  
2. The app user retention handbook for marketers \- Adjust, 3月 20, 2026にアクセス、 [https://www.adjust.com/resources/guides/user-retention/](https://www.adjust.com/resources/guides/user-retention/)  
3. What Is a Good App Retention Rate? Benchmarks by Category | Lovable, 3月 20, 2026にアクセス、 [https://lovable.dev/guides/what-is-a-good-retention-rate-for-an-app](https://lovable.dev/guides/what-is-a-good-retention-rate-for-an-app)  
4. Retention Rates for Mobile Apps by Industry | Plotline, 3月 20, 2026にアクセス、 [https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry/](https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry/)  
5. Mobile App Retention Strategies: Increase Engagement and Retention \- WebEngage, 3月 20, 2026にアクセス、 [https://webengage.com/blog/mobile-app-retention-strategies/](https://webengage.com/blog/mobile-app-retention-strategies/)  
6. Why 50% of Users Uninstall Apps Within 30 Days Guide to Early Engagement \- Medium, 3月 20, 2026にアクセス、 [https://medium.com/write-a-catalyst/why-50-of-users-uninstall-apps-within-30-days-guide-to-early-engagement-adbb769ff1c6](https://medium.com/write-a-catalyst/why-50-of-users-uninstall-apps-within-30-days-guide-to-early-engagement-adbb769ff1c6)  
7. Mobile App Retention Benchmarks by Industry 2026 \- Growth-onomics, 3月 20, 2026にアクセス、 [https://growth-onomics.com/mobile-app-retention-benchmarks-by-industry-2026/](https://growth-onomics.com/mobile-app-retention-benchmarks-by-industry-2026/)  
8. Mobile app retention benchmarks for creators: course & coaching apps \- Passion.io, 3月 20, 2026にアクセス、 [https://passion.io/blog/mobile-app-retention-benchmarks-for-creators-course-coaching-apps](https://passion.io/blog/mobile-app-retention-benchmarks-for-creators-course-coaching-apps)  
9. Boosting User Retention: Data-Driven Insights for Duolingo \- NextLeap, 3月 20, 2026にアクセス、 [https://assets.nextleap.app/submissions/DATAANALYSISOFDUALINGO-cfa09e78-96db-4653-9cc7-59f9659c88f4.pdf](https://assets.nextleap.app/submissions/DATAANALYSISOFDUALINGO-cfa09e78-96db-4653-9cc7-59f9659c88f4.pdf)  
10. How Duolingo uses gamification to improve user retention (+ 5 winning tactics) \- StriveCloud, 3月 20, 2026にアクセス、 [https://strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo](https://strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)  
11. Brain Training Apps Market Share & Size 2026-2033 \- Coherent Market Insights, 3月 20, 2026にアクセス、 [https://www.coherentmarketinsights.com/market-insight/brain-training-apps-market-4458](https://www.coherentmarketinsights.com/market-insight/brain-training-apps-market-4458)  
12. The Psychology of Hot Streak Game Design: How to Keep Players Coming Back Every Day Without Shame \- UX Magazine, 3月 20, 2026にアクセス、 [https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame](https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame)  
13. 3月 20, 2026にアクセス、 [https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame\#:\~:text=The%20numbers%20tell%20a%20compelling,to%20return%20the%20next%20day.](https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame#:~:text=The%20numbers%20tell%20a%20compelling,to%20return%20the%20next%20day.)  
14. Loss aversion \- BehavioralEconomics.com | The BE Hub, 3月 20, 2026にアクセス、 [https://www.behavioraleconomics.com/resources/mini-encyclopedia-of-be/loss-aversion/](https://www.behavioraleconomics.com/resources/mini-encyclopedia-of-be/loss-aversion/)  
15. Loss Aversion and Psychological Retention: A Behavioral Study of Subscription Models in Digital Platforms \- ResearchGate, 3月 20, 2026にアクセス、 [https://www.researchgate.net/publication/396655500\_Loss\_Aversion\_and\_Psychological\_Retention\_A\_Behavioral\_Study\_of\_Subscription\_Models\_in\_Digital\_Platforms](https://www.researchgate.net/publication/396655500_Loss_Aversion_and_Psychological_Retention_A_Behavioral_Study_of_Subscription_Models_in_Digital_Platforms)  
16. The Psychology of Streaks: How Sylvi Weaponized Duolingo's Best Feature Against Them, 3月 20, 2026にアクセス、 [https://trophy.so/blog/the-psychology-of-streaks-how-sylvi-weaponized-duolingos-best-feature-against-them](https://trophy.so/blog/the-psychology-of-streaks-how-sylvi-weaponized-duolingos-best-feature-against-them)  
17. The Hidden Psychology Behind Successful Mobile Apps \- DEV Community, 3月 20, 2026にアクセス、 [https://dev.to/irina\_nava\_/the-hidden-psychology-behind-successful-mobile-apps-2j5j](https://dev.to/irina_nava_/the-hidden-psychology-behind-successful-mobile-apps-2j5j)  
18. Designing A Streak System: The UX And Psychology Of Streaks \- Smashing Magazine, 3月 20, 2026にアクセス、 [https://www.smashingmagazine.com/2026/02/designing-streak-system-ux-psychology/](https://www.smashingmagazine.com/2026/02/designing-streak-system-ux-psychology/)  
19. Designing for User Retention: The Psychology Behind Streaks | by Precious Anizoba | Bootcamp | Medium, 3月 20, 2026にアクセス、 [https://medium.com/design-bootcamp/designing-for-user-retention-the-psychology-behind-streaks-cf0fd84b8ff9](https://medium.com/design-bootcamp/designing-for-user-retention-the-psychology-behind-streaks-cf0fd84b8ff9)  
20. Streak Creep: The perils of too much gamification \- The Decision Lab, 3月 20, 2026にアクセス、 [https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification)  
21. The habit-building research behind your Duolingo streak, 3月 20, 2026にアクセス、 [https://blog.duolingo.com/how-duolingo-streak-builds-habit/](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)  
22. Leaderboard Design Principles to Enhance Learning and Motivation in a Gamified Educational Environment: Development Study \- PMC, 3月 20, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC8097522/](https://pmc.ncbi.nlm.nih.gov/articles/PMC8097522/)  
23. From Boring to Fun: Leveraging Gamification in UX Design \- Code Theorem, 3月 20, 2026にアクセス、 [https://codetheorem.co/blogs/gamification-in-design/](https://codetheorem.co/blogs/gamification-in-design/)  
24. Exploring the Impact of Player Traits on the Leaderboard Experience in a Digital Maths Game, 3月 20, 2026にアクセス、 [https://journal.seriousgamessociety.org/\~serious/index.php/IJSG/article/download/794/569/5354](https://journal.seriousgamessociety.org/~serious/index.php/IJSG/article/download/794/569/5354)  
25. Duolingo's Gamification Secrets: How Streaks & XP Boost Engagement by 60%, 3月 20, 2026にアクセス、 [https://www.orizon.co/blog/duolingos-gamification-secrets](https://www.orizon.co/blog/duolingos-gamification-secrets)  
26. Gamification in UX Design: The Secret Weapon \- Smith Hanley, 3月 20, 2026にアクセス、 [https://www.smithhanley.com/2025/11/06/gamification-in-ux-design/](https://www.smithhanley.com/2025/11/06/gamification-in-ux-design/)  
27. Autonomy, Relatedness, and Competence in UX Design \- NN/G, 3月 20, 2026にアクセス、 [https://www.nngroup.com/articles/autonomy-relatedness-competence/](https://www.nngroup.com/articles/autonomy-relatedness-competence/)  
28. Self-determination theory: A quarter century of human motivation research, 3月 20, 2026にアクセス、 [https://www.apa.org/research-practice/conduct-research/self-determination-theory.html](https://www.apa.org/research-practice/conduct-research/self-determination-theory.html)  
29. Self Determination Theory and How It Explains Motivation \- Positive Psychology, 3月 20, 2026にアクセス、 [https://positivepsychology.com/self-determination-theory/](https://positivepsychology.com/self-determination-theory/)  
30. Using self-detemination theory | NeuroNation \- Ben Davies-Romano, 3月 20, 2026にアクセス、 [https://www.bendaviesromano.com/using-self-detemination-theory-neuronation](https://www.bendaviesromano.com/using-self-detemination-theory-neuronation)  
31. Lumosity Goes Beyond Brain Training to Launch Cognitive Insights ..., 3月 20, 2026にアクセス、 [https://medium.com/@lumosity/lumosity-goes-beyond-brain-training-to-launch-cognitive-insights-24afe664f268](https://medium.com/@lumosity/lumosity-goes-beyond-brain-training-to-launch-cognitive-insights-24afe664f268)  
32. Dynamic Difficulty Adjustment in Games: Concepts, Techniques, and Applications, 3月 20, 2026にアクセス、 [https://www.intechopen.com/chapters/1228576](https://www.intechopen.com/chapters/1228576)  
33. Dynamic Difficulty Adjustment in Games Based on Cognitive Workload \- kth .diva, 3月 20, 2026にアクセス、 [https://kth.diva-portal.org/smash/get/diva2:1354414/FULLTEXT01.pdf](https://kth.diva-portal.org/smash/get/diva2:1354414/FULLTEXT01.pdf)  
34. The Impact of Dynamic Difficulty Adjustment on Player Experience in Video Games, 3月 20, 2026にアクセス、 [https://digitalcommons.morris.umn.edu/cgi/viewcontent.cgi?article=1105\&context=horizons](https://digitalcommons.morris.umn.edu/cgi/viewcontent.cgi?article=1105&context=horizons)  
35. The Impact of Dynamic Difficulty Adjustment on Player Experience in Video Games, 3月 20, 2026にアクセス、 [https://digitalcommons.morris.umn.edu/horizons/vol9/iss1/7/](https://digitalcommons.morris.umn.edu/horizons/vol9/iss1/7/)  
36. Dynamic Difficulty Adjustment and Behavioral Control in Games | Bootcamp \- Medium, 3月 20, 2026にアクセス、 [https://medium.com/design-bootcamp/product-design-and-psychology-the-use-of-dynamic-difficulty-adjustment-in-video-game-design-7a1e2d919b96](https://medium.com/design-bootcamp/product-design-and-psychology-the-use-of-dynamic-difficulty-adjustment-in-video-game-design-7a1e2d919b96)  
37. Exploring Dynamic Difficulty Adjustment Methods for Video Games \- MDPI, 3月 20, 2026にアクセス、 [https://www.mdpi.com/2813-2084/3/2/12](https://www.mdpi.com/2813-2084/3/2/12)  
38. Dynamic Difficulty Adjustment in Games: Concepts, Techniques, and Applications, 3月 20, 2026にアクセス、 [https://www.researchgate.net/publication/399775612\_Dynamic\_Difficulty\_Adjustment\_in\_Games\_Concepts\_Techniques\_and\_Applications](https://www.researchgate.net/publication/399775612_Dynamic_Difficulty_Adjustment_in_Games_Concepts_Techniques_and_Applications)  
39. (PDF) Dynamic Difficulty Adjustment in Digital Games: Comparative Study Between Two Algorithms Using Electrodermal Activity Data \- ResearchGate, 3月 20, 2026にアクセス、 [https://www.researchgate.net/publication/361337080\_Dynamic\_Difficulty\_Adjustment\_in\_Digital\_Games\_Comparative\_Study\_Between\_Two\_Algorithms\_Using\_Electrodermal\_Activity\_Data](https://www.researchgate.net/publication/361337080_Dynamic_Difficulty_Adjustment_in_Digital_Games_Comparative_Study_Between_Two_Algorithms_Using_Electrodermal_Activity_Data)  
40. Dynamic Difficulty Adjustment With Brain Waves as a Tool for Optimizing Engagement \- arXiv.org, 3月 20, 2026にアクセス、 [https://arxiv.org/pdf/2504.13965](https://arxiv.org/pdf/2504.13965)  
41. A Multidimensional IRT Approach for Dynamically Monitoring Ability Growth in Computerized Practice Environments \- Frontiers, 3月 20, 2026にアクセス、 [https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.00620/full](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.00620/full)  
42. Applications of the Elo Rating System in Adaptive Educational Systems \- FI MUNI, 3月 20, 2026にアクセス、 [https://www.fi.muni.cz/\~xpelanek/publications/CAE-elo.pdf](https://www.fi.muni.cz/~xpelanek/publications/CAE-elo.pdf)  
43. (PDF) ON THE USE OF ELO RATING FOR ADAPTIVE ASSESSMENT \- ResearchGate, 3月 20, 2026にアクセス、 [https://www.researchgate.net/publication/301635151\_ON\_THE\_USE\_OF\_ELO\_RATING\_FOR\_ADAPTIVE\_ASSESSMENT](https://www.researchgate.net/publication/301635151_ON_THE_USE_OF_ELO_RATING_FOR_ADAPTIVE_ASSESSMENT)  
44. A Multivariate Elo-based Learner Model for Adaptive Educational Systems \- Monash University, 3月 20, 2026にアクセス、 [https://research.monash.edu/files/312364623/312060396\_oa.pdf](https://research.monash.edu/files/312364623/312060396_oa.pdf)  
45. Estimating abilities with an Elo-informed growth model \- arXiv, 3月 20, 2026にアクセス、 [https://arxiv.org/html/2411.07028v1](https://arxiv.org/html/2411.07028v1)  
46. Cognitive training with adaptive algorithm improves cognitive ability in older people with MCI, 3月 20, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC11698878/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11698878/)  
47. ‎Elevate \- Brain Training Games App \- App Store, 3月 20, 2026にアクセス、 [https://apps.apple.com/us/app/elevate-brain-training-games/id875063456](https://apps.apple.com/us/app/elevate-brain-training-games/id875063456)  
48. When and Why Adults Abandon Lifestyle Behavior and Mental Health Mobile Apps: Scoping Review \- PMC, 3月 20, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC11694054/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11694054/)  
49. Consumers reveal barriers to brain-training app-iness | ScienceDaily, 3月 20, 2026にアクセス、 [https://www.sciencedaily.com/releases/2016/04/160427103630.htm](https://www.sciencedaily.com/releases/2016/04/160427103630.htm)  
50. Do tools like luminosity.com, dual-n-back, and Brain Age have a significant impact on cognitive ability? \- Reddit, 3月 20, 2026にアクセス、 [https://www.reddit.com/r/askscience/comments/1cm3q4/do\_tools\_like\_luminositycom\_dualnback\_and\_brain/](https://www.reddit.com/r/askscience/comments/1cm3q4/do_tools_like_luminositycom_dualnback_and_brain/)  
51. Brain-training Apps Won't Make You Smarter \- Psychology Today, 3月 20, 2026にアクセス、 [https://www.psychologytoday.com/us/blog/brain-babble/201401/brain-training-apps-wont-make-you-smarter](https://www.psychologytoday.com/us/blog/brain-babble/201401/brain-training-apps-wont-make-you-smarter)  
52. Large Study Shows Brain-Training Apps Don't Improve Everyday Cognitive Ability, 3月 20, 2026にアクセス、 [https://www.mentalfloss.com/science/large-study-shows-brain-training-apps-dont-improve-everyday-cognitive-ability](https://www.mentalfloss.com/science/large-study-shows-brain-training-apps-dont-improve-everyday-cognitive-ability)  
53. 'Brain games': Helpful tool or false promise? \- American Psychological Association, 3月 20, 2026にアクセス、 [https://www.apa.org/monitor/2016/09/jn](https://www.apa.org/monitor/2016/09/jn)  
54. Do 'brain training' apps work? Northeastern scientists will test unique interventions for adolescents with ADHD, 3月 20, 2026にアクセス、 [https://news.northeastern.edu/2023/11/02/does-brain-training-work/](https://news.northeastern.edu/2023/11/02/does-brain-training-work/)  
55. Behavioral Churn Analysis: Understanding Why Users Leave \- Hyperengage, 3月 20, 2026にアクセス、 [https://hyperengage.io/customer-success/behavioral-churn-analysis-understanding-why-users-leave/](https://hyperengage.io/customer-success/behavioral-churn-analysis-understanding-why-users-leave/)  
56. The Cognitive and Motivational Benefits of Gamification in English Language Learning: A Systematic Review \- The Open Psychology Journal, 3月 20, 2026にアクセス、 [https://openpsychologyjournal.com/VOLUME/18/ELOCATOR/e18743501359379/FULLTEXT/](https://openpsychologyjournal.com/VOLUME/18/ELOCATOR/e18743501359379/FULLTEXT/)  
57. How streaks motivate us | UDaily \- University of Delaware, 3月 20, 2026にアクセス、 [https://www.udel.edu/udaily/2024/march/power-of-streaks-motivation-jackie-silverman/](https://www.udel.edu/udaily/2024/march/power-of-streaks-motivation-jackie-silverman/)  
58. User Engagement and Abandonment of mHealth: A Cross-Sectional Survey \- PMC, 3月 20, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC8872344/](https://pmc.ncbi.nlm.nih.gov/articles/PMC8872344/)  
59. Full article: Impact of Competition-Based Learning on Student Engagement and Performance \- Taylor & Francis, 3月 20, 2026にアクセス、 [https://www.tandfonline.com/doi/full/10.1080/15578771.2025.2512348](https://www.tandfonline.com/doi/full/10.1080/15578771.2025.2512348)  
60. The Role of Game Mechanics in Enhancing Learning Outcomes in Educational Settings., 3月 20, 2026にアクセス、 [https://blogs.psico-smart.com/blog-the-role-of-game-mechanics-in-enhancing-learning-outcomes-in-educational-settings-165051](https://blogs.psico-smart.com/blog-the-role-of-game-mechanics-in-enhancing-learning-outcomes-in-educational-settings-165051)  
61. Shared Success: Exploring the Role of Cooperative Play in Digital Immersion and Retention, 3月 20, 2026にアクセス、 [https://www.researchgate.net/publication/391564056\_Shared\_Success\_Exploring\_the\_Role\_of\_Cooperative\_Play\_in\_Digital\_Immersion\_and\_Retention](https://www.researchgate.net/publication/391564056_Shared_Success_Exploring_the_Role_of_Cooperative_Play_in_Digital_Immersion_and_Retention)  
62. How Duolingo's Gamification Actually Manipulates Dopamine Receptors \- Medium, 3月 20, 2026にアクセス、 [https://medium.com/@sohail\_saifii/how-duolingos-gamification-actually-manipulates-dopamine-receptors-d36ece32d79c](https://medium.com/@sohail_saifii/how-duolingos-gamification-actually-manipulates-dopamine-receptors-d36ece32d79c)  
63. Introducing Friends Quests, a fun way to team up and learn\! \- Duolingo Blog, 3月 20, 2026にアクセス、 [https://blog.duolingo.com/friends-quests/](https://blog.duolingo.com/friends-quests/)  
64. Keeping the Streak Alive: Motivation and Language Learning in Duolingo \- OuluREPO, 3月 20, 2026にアクセス、 [https://oulurepo.oulu.fi/bitstream/10024/54117/1/nbnfioulu-202502121605.pdf](https://oulurepo.oulu.fi/bitstream/10024/54117/1/nbnfioulu-202502121605.pdf)  
65. Effects of Game Mode in Multiplayer Video Games on Intergenerational Social Interaction: Randomized Field Study \- PMC, 3月 20, 2026にアクセス、 [https://pmc.ncbi.nlm.nih.gov/articles/PMC8892273/](https://pmc.ncbi.nlm.nih.gov/articles/PMC8892273/)