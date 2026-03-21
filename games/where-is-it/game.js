/* ===== Where Is It (どこでしょう？) ===== */
function median(arr) { if (!arr.length) return 0; const s = [...arr].sort((a,b) => a-b); const m = Math.floor(s.length/2); return s.length % 2 ? s[m] : (s[m-1]+s[m])/2; }
function stddev(arr) { if (arr.length < 2) return 0; const m = arr.reduce((a,b) => a+b, 0) / arr.length; return Math.sqrt(arr.reduce((s,v) => s + (v-m)**2, 0) / arr.length); }

// ========== Problem Data ==========
const PROBLEMS = [
  // --- Japan Easy (15) ---
  {d:'easy',cat:'geography',range:'japan',answer:'北海道',
    hints:['日本で一番北にある都道府県','冬はマイナス20度になることも','ラベンダー畑が有名','札幌雪まつりが開かれる','県庁所在地は札幌市'],
    trivia:['面積は日本一広い','じゃがいもの生産量日本一','世界自然遺産「知床」がある'],
    wrongs:['青森県','秋田県','岩手県']},
  {d:'easy',cat:'geography',range:'japan',answer:'東京都',
    hints:['日本の首都がある','人口が日本一多い','スカイツリーがある','渋谷のスクランブル交差点が有名','東京タワーがある'],
    trivia:['23の特別区がある','江戸時代は「江戸」と呼ばれた','2021年にオリンピックが開催された'],
    wrongs:['神奈川県','埼玉県','千葉県']},
  {d:'easy',cat:'geography',range:'japan',answer:'大阪府',
    hints:['「天下の台所」と呼ばれた','たこ焼きとお好み焼きの聖地','道頓堀のグリコの看板が有名','通天閣がある','USJがある'],
    trivia:['西日本最大の都市','2025年に万博が開催された','お笑い文化の中心地'],
    wrongs:['京都府','兵庫県','奈良県']},
  {d:'easy',cat:'geography',range:'japan',answer:'沖縄県',
    hints:['日本の最南端の県','美しいサンゴ礁の海','シーサーが守り神','ゴーヤチャンプルーが名物','首里城がある'],
    trivia:['かつては琉球王国だった','日本一の長寿県として知られた','米軍基地が多い'],
    wrongs:['鹿児島県','宮崎県','長崎県']},
  {d:'easy',cat:'culture',range:'japan',answer:'京都府',
    hints:['千年の都','金閣寺や銀閣寺がある','舞妓さんがいる花街','抹茶スイーツの聖地','清水寺がある'],
    trivia:['794年に平安京として都が置かれた','世界遺産が17件もある','任天堂の本社がある'],
    wrongs:['奈良県','滋賀県','大阪府']},
  {d:'easy',cat:'geography',range:'japan',answer:'広島県',
    hints:['世界遺産の島がある','平和記念公園がある','もみじまんじゅうが名物','牡蠣の生産量日本一','お好み焼きが有名'],
    trivia:['厳島神社の大鳥居は海の上に立つ','原爆ドームは負の世界遺産','プロ野球カープの本拠地'],
    wrongs:['岡山県','山口県','島根県']},
  {d:'easy',cat:'geography',range:'japan',answer:'福岡県',
    hints:['九州で一番人口が多い','とんこつラーメンの発祥地','屋台文化が有名','太宰府天満宮がある','博多祇園山笠が有名'],
    trivia:['アジアへの玄関口','明太子は韓国由来のものを改良した','「博多」と「福岡」は元々別の町'],
    wrongs:['佐賀県','長崎県','熊本県']},
  {d:'easy',cat:'culture',range:'japan',answer:'奈良県',
    hints:['大仏がある','鹿が街を歩いている','日本最古の木造建築がある','710年に都が置かれた','東大寺がある'],
    trivia:['鹿は天然記念物','法隆寺は世界最古の木造建築','せんとくんがマスコットキャラ'],
    wrongs:['京都府','三重県','和歌山県']},
  {d:'easy',cat:'geography',range:'japan',answer:'長崎県',
    hints:['出島があった貿易の窓口','カステラが名物','原爆が投下された都市がある','ハウステンボスがある','グラバー園がある'],
    trivia:['鎖国中も唯一の貿易港だった','隠れキリシタンの歴史がある','島の数が日本一多い'],
    wrongs:['佐賀県','熊本県','福岡県']},
  {d:'easy',cat:'geography',range:'japan',answer:'神奈川県',
    hints:['横浜中華街がある','鎌倉の大仏がある','箱根温泉が有名','人口は東京に次いで2位','湘南の海がある'],
    trivia:['横浜は日本初の鉄道の終着駅','鎌倉は源頼朝が幕府を開いた','カップヌードルミュージアムがある'],
    wrongs:['東京都','静岡県','千葉県']},
  {d:'easy',cat:'geography',range:'japan',answer:'愛知県',
    hints:['トヨタ自動車の本社がある','味噌カツ・味噌煮込みうどんが名物','金のしゃちほこがシンボル','名古屋城がある','手羽先が有名'],
    trivia:['織田信長・豊臣秀吉・徳川家康の出身地','工業出荷額が日本一','レゴランドがある'],
    wrongs:['三重県','岐阜県','静岡県']},
  {d:'easy',cat:'geography',range:'japan',answer:'兵庫県',
    hints:['神戸牛が有名','明石海峡大橋がある','甲子園球場がある','異人館街がある','姫路城がある'],
    trivia:['姫路城は「白鷺城」とも呼ばれる','日本海と瀬戸内海の両方に面する','淡路島は日本最古の島とされる'],
    wrongs:['大阪府','岡山県','京都府']},
  {d:'easy',cat:'geography',range:'japan',answer:'北海道',
    hints:['カニやウニなど海産物が豊富','冬にはスキーリゾートで賑わう','広大な農地で酪農が盛ん','夏でも涼しい気候','旭山動物園がある'],
    trivia:['日本の面積の約22%を占める','先住民族アイヌの文化が残る','梅雨がない'],
    wrongs:['青森県','新潟県','長野県']},
  {d:'easy',cat:'culture',range:'japan',answer:'石川県',
    hints:['加賀百万石の城下町','兼六園がある','金箔の生産量日本一','輪島塗が有名','近江町市場がある'],
    trivia:['兼六園は日本三名園の一つ','21世紀美術館がある','加賀友禅は伝統工芸'],
    wrongs:['富山県','福井県','新潟県']},
  {d:'easy',cat:'geography',range:'japan',answer:'宮城県',
    hints:['伊達政宗が開いた城下町','牛タンが名物','日本三景の一つがある','仙台七夕まつりが有名','ずんだ餅が名物'],
    trivia:['松島は日本三景の一つ','「杜の都」仙台と呼ばれる','楽天イーグルスの本拠地'],
    wrongs:['岩手県','福島県','山形県']},

  // --- Japan Normal (15) ---
  {d:'normal',cat:'geography',range:'japan',answer:'新潟県',
    hints:['コシヒカリの産地として有名','冬は豪雪地帯','日本海に面している','佐渡島がある','へぎそばが名物'],
    trivia:['米の生産量日本一','佐渡にはトキが生息する','長岡花火大会は日本三大花火の一つ'],
    wrongs:['富山県','秋田県','長野県']},
  {d:'normal',cat:'culture',range:'japan',answer:'長野県',
    hints:['日本アルプスがある','そばが名物','1998年に冬季オリンピック開催','善光寺がある','県の面積が全国4位'],
    trivia:['海のない内陸県','松本城は国宝','平均寿命が日本一を何度も記録'],
    wrongs:['山梨県','岐阜県','群馬県']},
  {d:'normal',cat:'geography',range:'japan',answer:'静岡県',
    hints:['日本一高い山がある','お茶の生産量日本一','うなぎの名産地','浜名湖がある','駿河湾に面している'],
    trivia:['富士山は山梨県との県境','さくらえびは世界で駿河湾でしか獲れない','プラモデルの出荷額日本一'],
    wrongs:['山梨県','愛知県','神奈川県']},
  {d:'normal',cat:'culture',range:'japan',answer:'熊本県',
    hints:['阿蘇山がある','馬刺しが名物','くまモンの故郷','加藤清正が城を築いた','辛子れんこんが名物'],
    trivia:['阿蘇カルデラは世界最大級','熊本城は「武者返し」の石垣が有名','水がきれいで「水の都」と呼ばれる'],
    wrongs:['大分県','鹿児島県','宮崎県']},
  {d:'normal',cat:'geography',range:'japan',answer:'鹿児島県',
    hints:['桜島がある','さつまいもの名産地','西郷隆盛の出身地','焼酎文化が根付いている','種子島・屋久島がある'],
    trivia:['屋久島は世界自然遺産','黒豚・黒牛が有名','宇宙ロケットの発射場がある'],
    wrongs:['宮崎県','熊本県','長崎県']},
  {d:'normal',cat:'geography',range:'japan',answer:'青森県',
    hints:['りんごの生産量日本一','ねぶた祭りが有名','本州の最北端','十和田湖がある','津軽海峡に面している'],
    trivia:['世界遺産の白神山地がある','青函トンネルで北海道と繋がる','太宰治の出身地'],
    wrongs:['秋田県','岩手県','北海道']},
  {d:'normal',cat:'culture',range:'japan',answer:'三重県',
    hints:['お伊勢参りで有名','赤福餅が名物','真珠の養殖で有名','伊勢海老の名産地','忍者の里がある'],
    trivia:['伊勢神宮は20年に一度建て替えられる','松阪牛は世界的ブランド','鈴鹿サーキットがある'],
    wrongs:['和歌山県','奈良県','滋賀県']},
  {d:'normal',cat:'geography',range:'japan',answer:'香川県',
    hints:['うどんの聖地','日本で一番面積が小さい','瀬戸内海に面している','金刀比羅宮がある','小豆島がある'],
    trivia:['うどんの消費量は全国トップ','瀬戸大橋で岡山県と繋がる','溜池の数が日本一多い'],
    wrongs:['愛媛県','徳島県','岡山県']},
  {d:'normal',cat:'geography',range:'japan',answer:'岩手県',
    hints:['面積が北海道に次いで2位','わんこそばが名物','中尊寺金色堂がある','宮沢賢治の故郷','盛岡冷麺が有名'],
    trivia:['平泉は世界文化遺産','南部鉄器は伝統工芸','リアス海岸が続く三陸海岸がある'],
    wrongs:['秋田県','青森県','宮城県']},
  {d:'normal',cat:'culture',range:'japan',answer:'群馬県',
    hints:['温泉の数が非常に多い','だるまの生産量日本一','こんにゃくの生産量日本一','草津温泉がある','上毛かるたで有名'],
    trivia:['草津温泉の湯もみは名物','富岡製糸場は世界遺産','焼きまんじゅうが名物'],
    wrongs:['栃木県','埼玉県','長野県']},
  {d:'normal',cat:'geography',range:'japan',answer:'富山県',
    hints:['立山連峰が美しい','ホタルイカが名物','薬売りの文化がある','黒部ダムがある','ます寿司が名物'],
    trivia:['黒部ダムは日本一の高さ','富山湾は天然の生簀と呼ばれる','ガラス工芸が盛ん'],
    wrongs:['石川県','新潟県','岐阜県']},
  {d:'normal',cat:'geography',range:'japan',answer:'山形県',
    hints:['さくらんぼの生産量日本一','蔵王の樹氷が有名','芋煮会の文化がある','将棋の駒の生産量日本一','月山がある'],
    trivia:['全市町村に温泉がある','ラ・フランスの生産量も日本一','山寺（立石寺）は松尾芭蕉が訪れた'],
    wrongs:['秋田県','宮城県','福島県']},
  {d:'normal',cat:'culture',range:'japan',answer:'高知県',
    hints:['坂本龍馬の出身地','カツオのたたきが名物','よさこい祭りが有名','四万十川がある','お酒好きが多いと言われる'],
    trivia:['日本一降水量が多い県の一つ','四万十川は日本最後の清流と呼ばれる','龍馬像は桂浜にある'],
    wrongs:['愛媛県','徳島県','香川県']},
  {d:'normal',cat:'geography',range:'japan',answer:'秋田県',
    hints:['なまはげが有名','きりたんぽ鍋が名物','日本海に面している','角館の武家屋敷が有名','あきたこまちの産地'],
    trivia:['美人が多いと言われる','男鹿半島にはなまはげの文化','横手のかまくらは冬の風物詩'],
    wrongs:['山形県','岩手県','青森県']},
  {d:'normal',cat:'geography',range:'japan',answer:'大分県',
    hints:['温泉の湧出量が日本一','別府の地獄めぐりが有名','かぼすの生産量日本一','とり天が名物','湯布院温泉がある'],
    trivia:['源泉数も日本一','関さばや関あじはブランド魚','地熱発電量が日本一'],
    wrongs:['熊本県','宮崎県','福岡県']},

  // --- Japan Hard (10) ---
  {d:'hard',cat:'history',range:'japan',answer:'島根県',
    hints:['出雲大社がある','神話の舞台となった場所','人口が少ない県の一つ','しじみの生産量日本一','「縁結び」で有名'],
    trivia:['宍道湖のしじみは日本一','出雲大社の注連縄は日本最大級','石見銀山は世界遺産'],
    wrongs:['鳥取県','岡山県','山口県']},
  {d:'hard',cat:'culture',range:'japan',answer:'佐賀県',
    hints:['有田焼の産地','吉野ヶ里遺跡がある','ムツゴロウが生息する干潟がある','バルーンフェスタが有名','嬉野温泉がある'],
    trivia:['有田焼は400年以上の歴史','虹の松原は日本三大松原の一つ','肥前名護屋城は秀吉が築いた'],
    wrongs:['長崎県','福岡県','熊本県']},
  {d:'hard',cat:'history',range:'japan',answer:'栃木県',
    hints:['日光東照宮がある','餃子の消費量で有名','いちごの生産量日本一','那須高原がある','「見ざる・言わざる・聞かざる」'],
    trivia:['東照宮は徳川家康を祀る','鬼怒川温泉がある','かんぴょうの生産量も日本一'],
    wrongs:['群馬県','茨城県','埼玉県']},
  {d:'hard',cat:'culture',range:'japan',answer:'徳島県',
    hints:['阿波踊りが有名','鳴門の渦潮が見られる','すだちの産地','藍染めの文化がある','四国の東側に位置する'],
    trivia:['阿波踊りの参加者は100万人超','大塚国際美術館がある','祖谷のかずら橋は秘境の名所'],
    wrongs:['香川県','愛媛県','高知県']},
  {d:'hard',cat:'geography',range:'japan',answer:'岐阜県',
    hints:['飛騨高山の古い町並みがある','白川郷の合掌造りが有名','鵜飼いの伝統がある','日本のほぼ中央に位置する','飛騨牛が名物'],
    trivia:['白川郷は世界遺産','織田信長が天下布武を唱えた地','モネの池がSNSで話題に'],
    wrongs:['長野県','富山県','愛知県']},
  {d:'hard',cat:'history',range:'japan',answer:'山口県',
    hints:['明治維新の志士を多く輩出','関門海峡がある','ふぐの取扱量日本一','錦帯橋がある','秋芳洞がある'],
    trivia:['総理大臣を最も多く輩出した県','吉田松陰の松下村塾がある','下関は巌流島の決闘の地'],
    wrongs:['広島県','島根県','福岡県']},
  {d:'hard',cat:'geography',range:'japan',answer:'愛媛県',
    hints:['みかんの生産量トップクラス','道後温泉がある','今治タオルが有名','しまなみ海道がある','松山城がある'],
    trivia:['道後温泉は日本最古の温泉','夏目漱石の「坊っちゃん」の舞台','ポンジュースの故郷'],
    wrongs:['高知県','香川県','徳島県']},
  {d:'hard',cat:'culture',range:'japan',answer:'福井県',
    hints:['恐竜の化石が多数発見された','越前がにが名物','永平寺がある','めがねフレームの生産量日本一','東尋坊がある'],
    trivia:['恐竜博物館は世界三大恐竜博物館の一つ','幸福度ランキングで常に上位','越前和紙は伝統工芸'],
    wrongs:['石川県','富山県','滋賀県']},
  {d:'hard',cat:'history',range:'japan',answer:'茨城県',
    hints:['納豆の生産が有名','偕楽園がある','筑波山がある','大洗の海が有名','水戸黄門の故郷'],
    trivia:['偕楽園は日本三名園の一つ','JAXA筑波宇宙センターがある','メロンの生産量日本一'],
    wrongs:['千葉県','栃木県','埼玉県']},
  {d:'hard',cat:'geography',range:'japan',answer:'宮崎県',
    hints:['マンゴーの名産地','高千穂峡がある','プロ野球のキャンプ地として有名','チキン南蛮の発祥地','日向灘に面している'],
    trivia:['天孫降臨の神話の舞台','日照時間が長い','完熟マンゴーは「太陽のタマゴ」ブランド'],
    wrongs:['鹿児島県','大分県','熊本県']},

  // --- World Easy (10) ---
  {d:'easy',cat:'geography',range:'world',answer:'アメリカ',
    hints:['世界最大の経済大国','自由の女神がある','ハリウッドがある','50の州で構成されている','グランドキャニオンがある'],
    trivia:['国土面積は世界3位','NASAがある','ハンバーガーの消費量が世界一'],
    wrongs:['カナダ','イギリス','オーストラリア']},
  {d:'easy',cat:'culture',range:'world',answer:'フランス',
    hints:['「芸術の都」と呼ばれる首都がある','エッフェル塔がある','ワインとチーズが有名','世界一の観光客数','ルーブル美術館がある'],
    trivia:['モナ・リザが展示されている','パンの文化が根付いている','自転車レース「ツール・ド・フランス」が有名'],
    wrongs:['イタリア','スペイン','ドイツ']},
  {d:'easy',cat:'history',range:'world',answer:'エジプト',
    hints:['ピラミッドがある','砂漠が国土の大部分','世界最長級の川が流れる','スフィンクスがある','古代文明の発祥地'],
    trivia:['ナイル川は約6650km','クレオパトラはギリシャ系','ツタンカーメンの黄金マスクは有名'],
    wrongs:['モロッコ','サウジアラビア','トルコ']},
  {d:'easy',cat:'geography',range:'world',answer:'オーストラリア',
    hints:['コアラとカンガルーがいる','世界最大のサンゴ礁がある','大陸全体が一つの国','シドニー・オペラハウスがある','南半球にある'],
    trivia:['グレートバリアリーフは宇宙からも見える','エアーズロック（ウルル）は聖地','世界一危険な生物が多い国と言われる'],
    wrongs:['ニュージーランド','南アフリカ','インドネシア']},
  {d:'easy',cat:'culture',range:'world',answer:'イタリア',
    hints:['ピザとパスタの本場','コロッセオがある','ブーツの形をした国','ルネサンス発祥の地','ベネチアは水の都'],
    trivia:['世界遺産の数が世界一多い','バチカン市国は国の中にある','サッカーが国民的スポーツ'],
    wrongs:['スペイン','フランス','ギリシャ']},
  {d:'easy',cat:'geography',range:'world',answer:'ブラジル',
    hints:['サンバとカーニバルの国','アマゾン川が流れる','サッカー王国','コーヒーの生産量世界一','キリスト像が山の上に立つ'],
    trivia:['アマゾンの熱帯雨林は地球の肺','公用語はポルトガル語','国土面積は世界5位'],
    wrongs:['アルゼンチン','コロンビア','メキシコ']},
  {d:'easy',cat:'culture',range:'world',answer:'インド',
    hints:['カレーの本場','タージ・マハルがある','人口が世界一多い','ガンジス川が聖なる川','IT大国として成長'],
    trivia:['ゼロを発明した国','映画産業「ボリウッド」がある','牛は神聖な動物とされる'],
    wrongs:['パキスタン','バングラデシュ','タイ']},
  {d:'easy',cat:'geography',range:'world',answer:'中国',
    hints:['万里の長城がある','パンダの故郷','世界で最も人口が多かった国','漢字が生まれた国','紫禁城がある'],
    trivia:['国土面積は世界3〜4位','世界最大の高速鉄道網がある','お茶の発祥地'],
    wrongs:['韓国','モンゴル','ベトナム']},
  {d:'easy',cat:'geography',range:'world',answer:'イギリス',
    hints:['ビッグベンがある','紅茶の文化が根付いている','女王（国王）がいる立憲君主制','サッカー発祥の地','霧の都ロンドンがある'],
    trivia:['正式名称は「グレートブリテン及び北アイルランド連合王国」','産業革命の発祥地','ビートルズの故郷'],
    wrongs:['フランス','ドイツ','アイルランド']},
  {d:'easy',cat:'geography',range:'world',answer:'メキシコ',
    hints:['タコスの本場','マヤ文明の遺跡がある','テキーラの産地','カラフルなガイコツ祭りがある','アメリカの南隣にある'],
    trivia:['チョコレートの起源はメキシコ','「死者の日」はユネスコ無形文化遺産','世界遺産の数が世界7位'],
    wrongs:['ブラジル','スペイン','コロンビア']},

  // --- World Normal (10) ---
  {d:'normal',cat:'geography',range:'world',answer:'ペルー',
    hints:['マチュピチュ遺跡がある','ナスカの地上絵がある','南米の太平洋側にある','アンデス山脈が走る','インカ帝国の中心地だった'],
    trivia:['マチュピチュは標高2430mにある','じゃがいもの原産地','アルパカの故郷'],
    wrongs:['ボリビア','チリ','コロンビア']},
  {d:'normal',cat:'culture',range:'world',answer:'ギリシャ',
    hints:['オリンピック発祥の地','パルテノン神殿がある','多くの島々からなる国','哲学が生まれた場所','地中海に面している'],
    trivia:['約6000の島がある','ギリシャ神話が世界中で親しまれている','ヨーグルトが国民食'],
    wrongs:['トルコ','イタリア','エジプト']},
  {d:'normal',cat:'geography',range:'world',answer:'ノルウェー',
    hints:['フィヨルドが有名','オーロラが見られる','サーモンの養殖で有名','北欧の国','冬が非常に長い'],
    trivia:['幸福度ランキング常連国','ムンクの「叫び」はこの国の画家の作品','石油産出国で裕福'],
    wrongs:['スウェーデン','フィンランド','デンマーク']},
  {d:'normal',cat:'culture',range:'world',answer:'モロッコ',
    hints:['サハラ砂漠の入口','カラフルな市場（スーク）がある','青い街シャウエンがある','アフリカ大陸の北西','タジン料理が名物'],
    trivia:['ヨーロッパまで最短14km','アルガンオイルの産地','映画のロケ地として人気'],
    wrongs:['エジプト','チュニジア','トルコ']},
  {d:'normal',cat:'geography',range:'world',answer:'ニュージーランド',
    hints:['羊の数が人より多い','映画「ロード・オブ・ザ・リング」のロケ地','ラグビーが国技','南半球の島国','マオリ文化がある'],
    trivia:['キウイフルーツの名前の由来になった鳥がいる','世界で最も早く日が昇る国の一つ','バンジージャンプ発祥の地'],
    wrongs:['オーストラリア','フィジー','南アフリカ']},
  {d:'normal',cat:'history',range:'world',answer:'トルコ',
    hints:['アジアとヨーロッパにまたがる国','ケバブが有名','カッパドキアの奇岩がある','かつてオスマン帝国だった','ブルーモスクがある'],
    trivia:['トルコアイスは伸びることで有名','チューリップの原産地','トロイの木馬の伝説の地'],
    wrongs:['ギリシャ','イラン','エジプト']},
  {d:'normal',cat:'geography',range:'world',answer:'カナダ',
    hints:['メープルシロップが有名','世界で2番目に広い国','ナイアガラの滝がある','国旗にカエデの葉がある','英語とフランス語が公用語'],
    trivia:['人口密度は世界で最も低い国の一つ','北極圏にも領土がある','アイスホッケーが国技'],
    wrongs:['アメリカ','イギリス','オーストラリア']},
  {d:'normal',cat:'culture',range:'world',answer:'韓国',
    hints:['キムチが国民食','K-POPの発信地','焼肉文化が根付いている','IT先進国','景福宮がある'],
    trivia:['ハングル文字は15世紀に作られた','チキンとビールの「チメク」文化','サムスンの本社がある'],
    wrongs:['中国','日本','台湾']},
  {d:'normal',cat:'geography',range:'world',answer:'スイス',
    hints:['アルプス山脈がある','チョコレートとチーズが有名','永世中立国','時計産業で有名','多言語国家（4つの公用語）'],
    trivia:['赤十字発祥の地','スイス銀行の秘密主義は有名','マッターホルンはトブラローネのロゴのモデル'],
    wrongs:['オーストリア','ドイツ','フランス']},
  {d:'normal',cat:'geography',range:'world',answer:'タイ',
    hints:['微笑みの国','トムヤムクンが有名','仏教寺院が多い','東南アジアに位置する','ムエタイの発祥地'],
    trivia:['一度も植民地になったことがない','王室が非常に尊敬されている','バンコクの正式名称は世界一長い'],
    wrongs:['ベトナム','カンボジア','インドネシア']},
];

// ========== Game State ==========
const STORAGE_KEY = 'whereisit_state';
const PARTICLE_EMOJIS = ['🎉','✨','⭐','🌟','💫','🌍'];
const QUESTIONS_PER_SET = 10;
const HINT_POINTS = [10, 8, 6, 4, 2];

let players = [], scores = {}, logs = [], round = 0;
let rangeFilter = 'mix', categoryFilter = 'all';
let usedProblems = [];

// Round state
let currentProblems = [];
let questionIndex = 0;
let setCorrect = 0;
let setTotal = 0;
let currentHintIndex = 0;
let currentProblem = null;
let puzzleStartAt = 0;
let solveTimes = [];
let answerOrder = [];
let answerIndex = 0;
let playerAnswers = {};

const $ = id => document.getElementById(id);
const $setupPhase = $('setupPhase'), $hintPhase = $('hintPhase');
const $answerPhase = $('answerPhase'), $resultPhase = $('resultPhase');
const $scoreboard = $('scoreboard'), $scoreRows = $('scoreRows');
const $answerLog = $('answerLog'), $logEntries = $('logEntries');
const $playerList = $('playerList');

function showToast(m, d = 2000) { const e = $('toast'); e.textContent = m; e.classList.add('show'); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove('show'), d); }
function emitParticles(x, y) { const c = $('particles'); for (let i = 0; i < 8; i++) { const p = document.createElement('span'); p.className = 'particle'; p.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)]; const a = (Math.PI * 2 * i) / 8 + (Math.random() - .5) * .5, d = 60 + Math.random() * 80; p.style.left = x + 'px'; p.style.top = y + 'px'; p.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(.3)`, opacity: 0 }], { duration: 800, easing: 'ease-out', fill: 'forwards' }); c.appendChild(p); setTimeout(() => p.remove(), 900); } }
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

let audioCtx = null;
function playBeep(freq, dur) { try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.frequency.value = freq; o.type = 'sine'; g.gain.value = 0.2; o.start(); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur / 1000); o.stop(audioCtx.currentTime + dur / 1000 + 0.05); } catch (e) { } }

function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, logs, round, rangeFilter, categoryFilter, usedProblems })); } catch (e) { } }
function loadState() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) { const s = JSON.parse(r); if (s.players) players = s.players; if (s.scores) scores = s.scores; if (s.logs) logs = s.logs; if (s.round) round = s.round; if (s.rangeFilter) rangeFilter = s.rangeFilter; if (s.categoryFilter) categoryFilter = s.categoryFilter; if (s.usedProblems) usedProblems = s.usedProblems; }
    if (players.length === 0) { const sh = localStorage.getItem('partygames_players'); if (sh) { const sp = JSON.parse(sh); if (Array.isArray(sp) && sp.length > 0) { players = sp; for (const p of players) scores[p] = scores[p] || 0; } } }
  } catch (e) { }
}
function saveSharedPlayers() { try { localStorage.setItem('partygames_players', JSON.stringify(players)); } catch (e) { } }

function renderPlayers() { renderSessionPlayerBar('playerList', players, scores, function () { renderScoreboard(); }); }
function selectOption(type, btn) {
  btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  if (type === 'range') rangeFilter = btn.dataset.value;
  if (type === 'category') categoryFilter = btn.dataset.value;
}

function showPhase(id) { [$setupPhase, $hintPhase, $answerPhase, $resultPhase].forEach(e => e.style.display = 'none'); $(id).style.display = ''; }

// ========== Game Flow ==========

function startGame() {
  syncActivePlayers(players, scores);
  if (getActivePlayers(players).length < 1) { showToast('プレイヤーを1人以上登録してください'); return; }
  round++;
  setCorrect = 0; setTotal = 0;
  solveTimes = [];

  // Build problem pool
  let pool = PROBLEMS.filter(p => {
    if (rangeFilter !== 'mix' && p.range !== rangeFilter) return false;
    if (categoryFilter !== 'all' && p.cat !== categoryFilter) return false;
    return true;
  });
  pool = pool.filter(p => !usedProblems.includes(p.answer + p.hints[0]));
  if (pool.length < QUESTIONS_PER_SET) {
    usedProblems = [];
    pool = PROBLEMS.filter(p => {
      if (rangeFilter !== 'mix' && p.range !== rangeFilter) return false;
      if (categoryFilter !== 'all' && p.cat !== categoryFilter) return false;
      return true;
    });
  }

  // Shuffle and pick
  const shuffled = pool.sort(() => Math.random() - .5);
  currentProblems = shuffled.slice(0, Math.min(QUESTIONS_PER_SET, shuffled.length));
  for (const p of currentProblems) usedProblems.push(p.answer + p.hints[0]);
  questionIndex = 0;

  showPhase('hintPhase');
  showQuestion();
  renderScoreboard(); renderLog(); saveState();
}

function showQuestion() {
  if (questionIndex >= currentProblems.length) { endSet(); return; }
  currentProblem = currentProblems[questionIndex];
  currentHintIndex = 0;
  playerAnswers = {};
  puzzleStartAt = Date.now();

  $('questionNum').textContent = `${questionIndex + 1} / ${currentProblems.length}`;
  const catLabel = { geography: '地理', history: '歴史', culture: '文化' }[currentProblem.cat] || '';
  const rangeLabel = currentProblem.range === 'japan' ? '日本' : '世界';
  $('hintMeta').textContent = `${rangeLabel} / ${catLabel}`;

  renderHints();
  renderProgress();
  updatePointsBadge();
  $('moreHintBtn').disabled = false;
  $('actionRow').style.display = '';
  showPhase('hintPhase');
}

function renderHints() {
  const area = $('hintArea');
  area.innerHTML = '';
  for (let i = 0; i <= currentHintIndex; i++) {
    const card = document.createElement('div');
    card.className = 'hint-card';
    card.style.animationDelay = (i === currentHintIndex ? '0s' : '0s');
    card.innerHTML = `<span class="hint-num">${i + 1}</span><span>${esc(currentProblem.hints[i])}</span>`;
    area.appendChild(card);
  }
}

function updatePointsBadge() {
  const pts = HINT_POINTS[currentHintIndex] || 2;
  $('pointsBadge').textContent = `今答えると ${pts}pt`;
}

function revealNextHint() {
  if (currentHintIndex >= currentProblem.hints.length - 1) {
    $('moreHintBtn').disabled = true;
    return;
  }
  currentHintIndex++;
  renderHints();
  updatePointsBadge();
  if (currentHintIndex >= currentProblem.hints.length - 1) {
    $('moreHintBtn').disabled = true;
  }
}

function renderProgress() {
  const bar = $('progressBar');
  bar.innerHTML = currentProblems.map((_, i) => {
    let cls = '';
    if (i < questionIndex) cls = currentProblems[i]._result === 'correct' ? 'correct' : 'wrong';
    else if (i === questionIndex) cls = 'current';
    return `<div class="progress-dot ${cls}"></div>`;
  }).join('');
}

// ========== Answer Phase ==========

function goToAnswer() {
  const activePlayers = getActivePlayers(players);
  answerOrder = [...activePlayers].sort(() => Math.random() - .5);
  answerIndex = 0;
  playerAnswers = {};

  if (answerOrder.length <= 1) {
    // Single player: go directly to answer
    showAnswerScreen(answerOrder[0]);
  } else {
    // Multiplayer: use blind screen
    showNextPlayerBlind();
  }
}

function showNextPlayerBlind() {
  const p = answerOrder[answerIndex];
  showBlindScreen('スマホを渡してください', p + ' の番', function () {
    showAnswerScreen(p);
  });
}

function showAnswerScreen(playerName) {
  showPhase('answerPhase');
  $('answerQuestionNum').textContent = `${questionIndex + 1} / ${currentProblems.length}`;
  $('answerPlayerName').textContent = playerName ? `${playerName} の番` : '';

  // Show hints collected so far
  const hintArea = $('answerHintArea');
  hintArea.innerHTML = '';
  for (let i = 0; i <= currentHintIndex; i++) {
    const card = document.createElement('div');
    card.className = 'hint-card';
    card.style.animation = 'none';
    card.innerHTML = `<span class="hint-num">${i + 1}</span><span>${esc(currentProblem.hints[i])}</span>`;
    hintArea.appendChild(card);
  }

  // Build 4 shuffled choices
  const choices = [currentProblem.answer, ...currentProblem.wrongs].sort(() => Math.random() - .5);
  const grid = $('choiceGrid');
  grid.innerHTML = choices.map(c =>
    `<button class="choice-btn" onclick="selectChoice(this,'${esc(c)}')">${esc(c)}</button>`
  ).join('');

  $('answerFeedback').style.display = 'none';
  $('triviaBox').style.display = 'none';
  $('nextBtn').style.display = 'none';
}

function selectChoice(btn, chosen) {
  // Prevent double-tap
  const buttons = $('choiceGrid').querySelectorAll('.choice-btn');
  if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;

  const solveTime = Date.now() - puzzleStartAt;
  solveTimes.push(solveTime);

  const isCorrect = chosen === currentProblem.answer;
  const currentPlayer = answerOrder[answerIndex];

  // Disable all buttons
  buttons.forEach(b => {
    b.disabled = true;
    if (b.textContent === currentProblem.answer) b.classList.add('correct');
  });
  if (!isCorrect) btn.classList.add('wrong');

  // Score
  const pts = isCorrect ? (HINT_POINTS[currentHintIndex] || 2) : 0;
  if (currentPlayer) {
    playerAnswers[currentPlayer] = { chosen, correct: isCorrect, pts };
    scores[currentPlayer] = (scores[currentPlayer] || 0) + pts;
  }

  // Feedback
  const fb = $('answerFeedback');
  fb.style.display = '';
  if (isCorrect) {
    fb.style.color = '#10b981';
    fb.textContent = `正解！ +${pts}pt`;
    playBeep(1000, 100);
  } else {
    fb.style.color = '#ef4444';
    fb.textContent = `不正解... 答えは「${currentProblem.answer}」`;
    playBeep(300, 200);
  }

  renderScoreboard();

  // Check if more players need to answer
  if (answerIndex < answerOrder.length - 1) {
    $('nextBtn').style.display = '';
    $('nextBtn').textContent = '次の人へ';
  } else {
    // Last player (or single player): show trivia, then next question
    showTrivia();
    $('nextBtn').style.display = '';
    $('nextBtn').textContent = '次の問題へ';
  }
}

function showTrivia() {
  const box = $('triviaBox');
  const content = $('triviaContent');
  content.innerHTML = currentProblem.trivia.map(t =>
    `<div class="trivia-item">${esc(t)}</div>`
  ).join('');
  box.style.display = '';
}

function nextStep() {
  answerIndex++;
  if (answerIndex < answerOrder.length) {
    // Next player
    showNextPlayerBlind();
  } else {
    // All players answered - record result and move to next question
    const anyCorrect = Object.values(playerAnswers).some(a => a.correct);
    currentProblem._result = anyCorrect ? 'correct' : 'wrong';
    if (anyCorrect) setCorrect++;
    setTotal++;

    questionIndex++;
    showQuestion();
    saveState();
  }
}

// ========== End Set ==========

function endSet() {
  showPhase('resultPhase');
  const pct = setTotal > 0 ? Math.round(setCorrect / setTotal * 100) : 0;
  $('resultIcon').textContent = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '🌍';
  $('resultTitle').textContent = `${setCorrect} / ${setTotal} 問正解！（${pct}%）`;

  let details = '';
  currentProblems.forEach(q => {
    const icon = q._result === 'correct' ? '⭕' : '❌';
    details += `${icon} ${esc(q.answer)}<br>`;
  });
  details += renderGameRecommendation('where-is-it');
  $('resultDetails').innerHTML = details;

  if (pct >= 80) {
    const rect = $('resultTitle').getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  logs.unshift({ timestamp: new Date().toISOString(), round, correct: setCorrect, total: setTotal, pct, solveTime: median(solveTimes), hintsUsed: currentHintIndex + 1 });
  savePlayLog('where-is-it', setCorrect, setTotal, {
    playMode: players.length <= 1 ? 'solo' : 'passplay',
    cognitive: { medianRT: median(solveTimes), rtSD: stddev(solveTimes), difficulty: getDDALevel('where-is-it') || 1 }
  });
  renderScoreboard(); renderLog(); saveState();
}

function nextRound() { showPhase('setupPhase'); }

// ========== Scoreboard / Log ==========

function renderScoreboard() {
  if (players.length === 0) { $scoreboard.style.display = 'none'; return; }
  $scoreboard.style.display = '';
  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  $scoreRows.innerHTML = sorted.map((p, i) => {
    const medal = i === 0 && scores[p] > 0 ? '👑' : '';
    return `<span class="score-item"><span class="name">${medal}${esc(p)}</span><span class="pts">${scores[p] || 0}</span></span>`;
  }).join('');
}

function renderLog() {
  if (logs.length === 0) { $answerLog.style.display = 'none'; return; }
  $answerLog.style.display = '';
  $logEntries.innerHTML = logs.slice(0, 8).map(l =>
    `<div class="log-entry"><span>R${l.round}</span><span>${l.correct}/${l.total} (${l.pct}%)</span></div>`
  ).join('');
}

function clearAllLogs() {
  showToast('リセットしました');
  logs = []; round = 0; usedProblems = [];
  for (const p of players) scores[p] = 0;
  renderScoreboard(); renderLog(); saveState();
}

// ========== Init ==========
(function init() {
  loadState();
  initSessionPlayers(players, scores);
  renderPlayers(); renderScoreboard(); renderLog();
  // Restore filter UI
  document.querySelectorAll('#rangePills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === rangeFilter));
  document.querySelectorAll('#categoryPills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === categoryFilter));
})();
