/* ===== Kanji Puzzle (漢字バラバラ) ===== */
function median(arr) { if (!arr.length) return 0; const s = [...arr].sort((a,b) => a-b); const m = Math.floor(s.length/2); return s.length % 2 ? s[m] : (s[m-1]+s[m])/2; }
function stddev(arr) { if (arr.length < 2) return 0; const m = arr.reduce((a,b) => a+b, 0) / arr.length; return Math.sqrt(arr.reduce((s,v) => s + (v-m)**2, 0) / arr.length); }

// --- Problem Data ---
// d: difficulty, cat: category, answer: correct answer, reading: hiragana reading
// parts: scattered pieces, hints: [hint1, hint2], explain: explanation
const PROBLEMS = [
  // ===== easy / single (20) =====
  {d:'easy',cat:'single',answer:'林',reading:'はやし',parts:['木','木'],hints:['「もり」ではない方','木が2つ並ぶ漢字'],explain:'木＋木＝林（はやし）'},
  {d:'easy',cat:'single',answer:'森',reading:'もり',parts:['木','木','木'],hints:['木が3つ集まる','自然がいっぱいの場所'],explain:'木＋木＋木＝森（もり）'},
  {d:'easy',cat:'single',answer:'明',reading:'あかるい',parts:['日','月'],hints:['太陽と月が合わさる','「あかるい」と読む'],explain:'日＋月＝明（あかるい）'},
  {d:'easy',cat:'single',answer:'休',reading:'やすむ',parts:['亻','木'],hints:['人が木のそばにいる','「やすむ」と読む'],explain:'亻＋木＝休（やすむ）'},
  {d:'easy',cat:'single',answer:'炎',reading:'ほのお',parts:['火','火'],hints:['火が2つ重なる','燃えさかるもの'],explain:'火＋火＝炎（ほのお）'},
  {d:'easy',cat:'single',answer:'岩',reading:'いわ',parts:['山','石'],hints:['山と石でできている','大きくて硬いもの'],explain:'山＋石＝岩（いわ）'},
  {d:'easy',cat:'single',answer:'男',reading:'おとこ',parts:['田','力'],hints:['田んぼと力','性別を表す漢字'],explain:'田＋力＝男（おとこ）'},
  {d:'easy',cat:'single',answer:'花',reading:'はな',parts:['艹','化'],hints:['草かんむりがある','きれいに咲くもの'],explain:'艹＋化＝花（はな）'},
  {d:'easy',cat:'single',answer:'鳴',reading:'なく',parts:['口','鳥'],hints:['口と鳥','動物が声を出すこと'],explain:'口＋鳥＝鳴（なく）'},
  {d:'easy',cat:'single',answer:'好',reading:'すき',parts:['女','子'],hints:['女と子が合わさる','「すき」と読む'],explain:'女＋子＝好（すき）'},
  {d:'easy',cat:'single',answer:'畑',reading:'はたけ',parts:['火','田'],hints:['火と田んぼ','野菜を育てる場所'],explain:'火＋田＝畑（はたけ）'},
  {d:'easy',cat:'single',answer:'晶',reading:'しょう',parts:['日','日','日'],hints:['日が3つ集まる','キラキラ輝く'],explain:'日＋日＋日＝晶（しょう）水晶の晶'},
  {d:'easy',cat:'single',answer:'旦',reading:'たん',parts:['日','一'],hints:['日の下に一本線','元旦の「旦」'],explain:'日＋一＝旦（たん）'},
  {d:'easy',cat:'single',answer:'吠',reading:'ほえる',parts:['口','犬'],hints:['口と犬','犬が大きな声を出す'],explain:'口＋犬＝吠（ほえる）'},
  {d:'easy',cat:'single',answer:'杉',reading:'すぎ',parts:['木','彡'],hints:['木と三本の線','日本に多い針葉樹'],explain:'木＋彡＝杉（すぎ）'},
  {d:'easy',cat:'single',answer:'尖',reading:'とがる',parts:['小','大'],hints:['小さいものの上に大きいもの','先が鋭いこと'],explain:'小＋大＝尖（とがる）'},
  {d:'easy',cat:'single',answer:'品',reading:'しな',parts:['口','口','口'],hints:['口が3つ並ぶ','商品の「品」'],explain:'口＋口＋口＝品（しな）'},
  {d:'easy',cat:'single',answer:'思',reading:'おもう',parts:['田','心'],hints:['田と心','考えること、感じること'],explain:'田＋心＝思（おもう）'},
  {d:'easy',cat:'single',answer:'空',reading:'そら',parts:['穴','工'],hints:['穴かんむりと工','見上げると広がるもの'],explain:'穴＋工＝空（そら）'},
  {d:'easy',cat:'single',answer:'体',reading:'からだ',parts:['亻','本'],hints:['にんべんと本','人間の「からだ」'],explain:'亻＋本＝体（からだ）'},

  // ===== easy / jukugo (10) — パーツ分解版 =====
  {d:'easy',cat:'jukugo',answer:'花火',reading:'はなび',parts:['艹','化','火'],hints:['夏の夜空に咲く','草かんむり＋化＝？'],explain:'艹＋化＝花、＋火→花火（はなび）'},
  {d:'easy',cat:'jukugo',answer:'明日',reading:'あした',parts:['日','月','日'],hints:['次の日のこと','日＋月で1文字、残りの日で2文字目'],explain:'日＋月＝明、＋日→明日（あした）'},
  {d:'easy',cat:'jukugo',answer:'休日',reading:'きゅうじつ',parts:['亻','木','日'],hints:['仕事をしない日','人偏＋木で1文字目'],explain:'亻＋木＝休、＋日→休日（きゅうじつ）'},
  {d:'easy',cat:'jukugo',answer:'岩山',reading:'いわやま',parts:['山','石','山'],hints:['ゴツゴツした山','山＋石で1文字目、もう1つの山で2文字目'],explain:'山＋石＝岩、＋山→岩山（いわやま）'},
  {d:'easy',cat:'jukugo',answer:'男子',reading:'だんし',parts:['田','力','子'],hints:['少年のこと','田＋力で1文字目'],explain:'田＋力＝男、＋子→男子（だんし）'},
  {d:'easy',cat:'jukugo',answer:'空気',reading:'くうき',parts:['穴','工','気'],hints:['目に見えないもの','穴＋工で1文字目'],explain:'穴＋工＝空、＋気→空気（くうき）'},
  {d:'easy',cat:'jukugo',answer:'体力',reading:'たいりょく',parts:['亻','本','力'],hints:['元気に動ける力','人偏＋本で1文字目'],explain:'亻＋本＝体、＋力→体力（たいりょく）'},
  {d:'easy',cat:'jukugo',answer:'森林',reading:'しんりん',parts:['木','木','木','木','木'],hints:['木がたくさん生えた場所','木が5つ！3つと2つに分けて'],explain:'木×3＝森、木×2＝林→森林（しんりん）'},
  {d:'easy',cat:'jukugo',answer:'思考',reading:'しこう',parts:['田','心','老','丂'],hints:['頭を使って考えること','田＋心で1文字目'],explain:'田＋心＝思、老＋丂＝考→思考（しこう）'},
  {d:'easy',cat:'jukugo',answer:'炎天',reading:'えんてん',parts:['火','火','天'],hints:['真夏の暑い空','火＋火で1文字目'],explain:'火＋火＝炎、＋天→炎天（えんてん）'},

  // ===== normal / single (15) =====
  {d:'normal',cat:'single',answer:'語',reading:'ご',parts:['言','五','口'],hints:['言葉に関係する漢字','「かたる」「ご」と読む'],explain:'言＋五＋口＝語（ご）'},
  {d:'normal',cat:'single',answer:'清',reading:'きよい',parts:['氵','青'],hints:['さんずいと色の名前','きれいで澄んでいること'],explain:'氵＋青＝清（きよい）'},
  {d:'normal',cat:'single',answer:'想',reading:'そう',parts:['相','心'],hints:['相と心で構成','思い描くこと'],explain:'相＋心＝想（そう）'},
  {d:'normal',cat:'single',answer:'銅',reading:'どう',parts:['金','同'],hints:['金へんの漢字','オリンピックのメダルの色'],explain:'金＋同＝銅（どう）'},
  {d:'normal',cat:'single',answer:'話',reading:'はなし',parts:['言','舌'],hints:['言と舌','人と会話すること'],explain:'言＋舌＝話（はなし）'},
  {d:'normal',cat:'single',answer:'湖',reading:'みずうみ',parts:['氵','胡'],hints:['さんずいがつく','大きな水たまり'],explain:'氵＋胡＝湖（みずうみ）'},
  {d:'normal',cat:'single',answer:'頭',reading:'あたま',parts:['豆','頁'],hints:['豆と頁（ページ）','体の一番上にあるもの'],explain:'豆＋頁＝頭（あたま）'},
  {d:'normal',cat:'single',answer:'雪',reading:'ゆき',parts:['雨','ヨ'],hints:['雨かんむりがある','冬に空から降る白いもの'],explain:'雨＋ヨ＝雪（ゆき）'},
  {d:'normal',cat:'single',answer:'歌',reading:'うた',parts:['可','可','欠'],hints:['「可」が2つと「欠」','声を出して歌うこと'],explain:'可＋欠＋可＝歌（うた）'},
  {d:'normal',cat:'single',answer:'算',reading:'さん',parts:['竹','目','廾'],hints:['竹かんむりがつく','計算の「算」'],explain:'竹＋目＋廾＝算（さん）'},
  {d:'normal',cat:'single',answer:'親',reading:'おや',parts:['立','木','見'],hints:['立って木の上から見る','家族の中で上の世代'],explain:'立＋木＋見＝親（おや）'},
  {d:'normal',cat:'single',answer:'教',reading:'おしえる',parts:['孝','攵'],hints:['孝と攵（ぼくづくり）','先生がすること'],explain:'孝＋攵＝教（おしえる）'},
  {d:'normal',cat:'single',answer:'悲',reading:'かなしい',parts:['非','心'],hints:['非と心','涙が出るような気持ち'],explain:'非＋心＝悲（かなしい）'},
  {d:'normal',cat:'single',answer:'鉄',reading:'てつ',parts:['金','失'],hints:['金へんの漢字','とても硬い金属'],explain:'金＋失＝鉄（てつ）'},
  {d:'normal',cat:'single',answer:'解',reading:'とく',parts:['角','刀','牛'],hints:['角と刀と牛','問題を解くこと'],explain:'角＋刀＋牛＝解（とく）'},

  // ===== normal / jukugo (15) — パーツ分解版 =====
  {d:'normal',cat:'jukugo',answer:'時計',reading:'とけい',parts:['日','寺','言','十'],hints:['時刻を知る道具','日＋寺で1文字目、言＋十で2文字目'],explain:'日＋寺＝時、言＋十＝計→時計（とけい）'},
  {d:'normal',cat:'jukugo',answer:'新聞',reading:'しんぶん',parts:['立','木','斤','門','耳'],hints:['毎朝届くニュース','立＋木＋斤で1文字目、門＋耳で2文字目'],explain:'立＋木＋斤＝新、門＋耳＝聞→新聞（しんぶん）'},
  {d:'normal',cat:'jukugo',answer:'教室',reading:'きょうしつ',parts:['孝','攵','宀','至'],hints:['勉強する部屋','孝＋攵で1文字目、うかんむり＋至で2文字目'],explain:'孝＋攵＝教、宀＋至＝室→教室（きょうしつ）'},
  {d:'normal',cat:'jukugo',answer:'話題',reading:'わだい',parts:['言','舌','日','頁'],hints:['みんなが語ること','言＋舌で1文字目、日＋頁で2文字目'],explain:'言＋舌＝話、日＋頁＝題→話題（わだい）'},
  {d:'normal',cat:'jukugo',answer:'鉄橋',reading:'てっきょう',parts:['金','失','木','喬'],hints:['金属でできた橋','金＋失で1文字目、木＋喬で2文字目'],explain:'金＋失＝鉄、木＋喬＝橋→鉄橋（てっきょう）'},
  {d:'normal',cat:'jukugo',answer:'湖畔',reading:'こはん',parts:['氵','胡','田','半'],hints:['湖のほとり','さんずい＋胡で1文字目、田＋半で2文字目'],explain:'氵＋胡＝湖、田＋半＝畔→湖畔（こはん）'},
  {d:'normal',cat:'jukugo',answer:'清流',reading:'せいりゅう',parts:['氵','青','氵','㐬'],hints:['きれいな川の流れ','さんずいが2つ！'],explain:'氵＋青＝清、氵＋㐬＝流→清流（せいりゅう）'},
  {d:'normal',cat:'jukugo',answer:'悲鳴',reading:'ひめい',parts:['非','心','口','鳥'],hints:['驚いて叫ぶ声','非＋心で1文字目、口＋鳥で2文字目'],explain:'非＋心＝悲、口＋鳥＝鳴→悲鳴（ひめい）'},
  {d:'normal',cat:'jukugo',answer:'想像',reading:'そうぞう',parts:['相','心','亻','象'],hints:['頭の中で思い描くこと','相＋心で1文字目、人偏＋象で2文字目'],explain:'相＋心＝想、亻＋象＝像→想像（そうぞう）'},
  {d:'normal',cat:'jukugo',answer:'銅像',reading:'どうぞう',parts:['金','同','亻','象'],hints:['金属でできた人の形','金＋同で1文字目、人偏＋象で2文字目'],explain:'金＋同＝銅、亻＋象＝像→銅像（どうぞう）'},
  {d:'normal',cat:'jukugo',answer:'頭脳',reading:'ずのう',parts:['豆','頁','月','凶'],hints:['考える力のこと','豆＋頁で1文字目、月＋凶で2文字目'],explain:'豆＋頁＝頭、月＋凶＝脳→頭脳（ずのう）'},
  {d:'normal',cat:'jukugo',answer:'雪国',reading:'ゆきぐに',parts:['雨','ヨ','囗','玉'],hints:['冬に雪が多い地域','雨＋ヨで1文字目、囗＋玉で2文字目'],explain:'雨＋ヨ＝雪、囗＋玉＝国→雪国（ゆきぐに）'},
  {d:'normal',cat:'jukugo',answer:'親切',reading:'しんせつ',parts:['立','木','見','刀','七'],hints:['やさしくすること','立＋木＋見で1文字目、七＋刀で2文字目'],explain:'立＋木＋見＝親、七＋刀＝切→親切（しんせつ）'},
  {d:'normal',cat:'jukugo',answer:'歌声',reading:'うたごえ',parts:['可','可','欠','士','尸'],hints:['歌っている声','可×2＋欠で1文字目'],explain:'可＋可＋欠＝歌、士＋尸＝声→歌声（うたごえ）'},
  {d:'normal',cat:'jukugo',answer:'算数',reading:'さんすう',parts:['竹','目','廾','米','女'],hints:['小学校の教科','竹＋目＋廾で1文字目、米＋女で2文字目'],explain:'竹＋目＋廾＝算、米＋女→数→算数（さんすう）'},

  // ===== hard / jukugo (10) — パーツ分解版 =====
  {d:'hard',cat:'jukugo',answer:'挑戦',reading:'ちょうせん',parts:['扌','兆','戈','単'],hints:['難しいことに立ち向かう','扌＋兆で1文字目、戈＋単で2文字目'],explain:'扌＋兆＝挑、戈＋単＝戦→挑戦（ちょうせん）'},
  {d:'hard',cat:'jukugo',answer:'矛盾',reading:'むじゅん',parts:['矛','目','十','丿','厂'],hints:['つじつまが合わないこと','1文字目はそのまま、2文字目は5パーツの組み合わせ'],explain:'矛＋目＋十＋丿＋厂＝盾→矛盾（むじゅん）'},
  {d:'hard',cat:'jukugo',answer:'感想',reading:'かんそう',parts:['咸','心','相','心'],hints:['思ったことを述べる','心が2つ！'],explain:'咸＋心＝感、相＋心＝想→感想（かんそう）'},
  {d:'hard',cat:'jukugo',answer:'解答',reading:'かいとう',parts:['角','刀','牛','竹','合'],hints:['問題に対する正解','角＋刀＋牛で1文字目、竹＋合で2文字目'],explain:'角＋刀＋牛＝解、竹＋合＝答→解答（かいとう）'},
  {d:'hard',cat:'jukugo',answer:'議論',reading:'ぎろん',parts:['言','義','言','侖'],hints:['意見を交わし合うこと','言が2つ！'],explain:'言＋義＝議、言＋侖＝論→議論（ぎろん）'},
  {d:'hard',cat:'jukugo',answer:'記録',reading:'きろく',parts:['言','己','金','录'],hints:['書き残すこと','言＋己で1文字目、金＋录で2文字目'],explain:'言＋己＝記、金＋录＝録→記録（きろく）'},
  {d:'hard',cat:'jukugo',answer:'説明',reading:'せつめい',parts:['言','兌','日','月'],hints:['わかりやすく伝える','言＋兌で1文字目、日＋月で2文字目'],explain:'言＋兌＝説、日＋月＝明→説明（せつめい）'},
  {d:'hard',cat:'jukugo',answer:'鏡花',reading:'きょうか',parts:['金','竟','艹','化'],hints:['はかない美しさのたとえ','金＋竟で1文字目、草かんむり＋化で2文字目'],explain:'金＋竟＝鏡、艹＋化＝花→鏡花（きょうか）'},
  {d:'hard',cat:'jukugo',answer:'繊細',reading:'せんさい',parts:['糸','戔','糸','田'],hints:['細やかで敏感なこと','糸が2つ！'],explain:'糸＋戔＝繊、糸＋田＝細→繊細（せんさい）'},
  {d:'hard',cat:'jukugo',answer:'葛藤',reading:'かっとう',parts:['艹','曷','艹','滕'],hints:['心の中で迷い悩む','草かんむりが2つ！'],explain:'艹＋曷＝葛、艹＋滕＝藤→葛藤（かっとう）'},

  // ===== hard / yoji (10) — パーツ分解版 =====
  {d:'hard',cat:'yoji',answer:'一石二鳥',reading:'いっせきにちょう',parts:['一','口','丆','二','鳥'],hints:['1つのことで2つの利益','口＋丆で2文字目'],explain:'一、口＋丆＝石、二、鳥→一石二鳥（いっせきにちょう）'},
  {d:'hard',cat:'yoji',answer:'花鳥風月',reading:'かちょうふうげつ',parts:['艹','化','鳥','几','虫','月'],hints:['自然の美しい景色','草かんむり＋化で1文字目、几＋虫で3文字目'],explain:'艹＋化＝花、鳥、几＋虫＝風、月→花鳥風月（かちょうふうげつ）'},
  {d:'hard',cat:'yoji',answer:'以心伝心',reading:'いしんでんしん',parts:['以','心','亻','云','心'],hints:['言葉なしで心が通じる','心が2つ！人偏＋云で3文字目'],explain:'以、心、亻＋云＝伝、心→以心伝心（いしんでんしん）'},
  {d:'hard',cat:'yoji',answer:'温故知新',reading:'おんこちしん',parts:['氵','昷','古','矢','口','立','木','斤'],hints:['古いことから新しいことを学ぶ','さんずい＋昷で1文字目、立＋木＋斤で4文字目'],explain:'氵＋昷＝温、古、矢＋口＝知、立＋木＋斤＝新→温故知新'},
  {d:'hard',cat:'yoji',answer:'起死回生',reading:'きしかいせい',parts:['走','己','歹','匕','囗','丿','生'],hints:['絶望から立ち直る','走＋己で1文字目、歹＋匕で2文字目'],explain:'走＋己＝起、歹＋匕＝死、囗＋丿＝回、生→起死回生'},
  {d:'hard',cat:'yoji',answer:'弱肉強食',reading:'じゃくにくきょうしょく',parts:['弓','冫','冫','内','弓','虫','食'],hints:['強い者が弱い者を食べる','弓が2つ！'],explain:'弓＋冫冫＝弱、内→肉、弓＋虫＝強、食→弱肉強食'},
  {d:'hard',cat:'yoji',answer:'七転八起',reading:'しちてんはっき',parts:['七','車','云','八','走','己'],hints:['何度倒れても立ち上がる','車＋云で2文字目、走＋己で4文字目'],explain:'七、車＋云＝転、八、走＋己＝起→七転八起'},
  {d:'hard',cat:'yoji',answer:'十人十色',reading:'じゅうにんといろ',parts:['十','人','十','⺈','巾'],hints:['みんなそれぞれ違う','十が2つ！⺈＋巾で4文字目'],explain:'十、人、十、⺈＋巾＝色→十人十色（じゅうにんといろ）'},
  {d:'hard',cat:'yoji',answer:'自業自得',reading:'じごうじとく',parts:['自','木','丷','一','自','彳','寸','日'],hints:['自分の行いの結果が返る','自が2つ！'],explain:'自、木＋丷＋一＝業、自、彳＋寸＋日＝得→自業自得'},
  {d:'hard',cat:'yoji',answer:'四面楚歌',reading:'しめんそか',parts:['囗','儿','面','林','疋','可','可','欠'],hints:['周りが全部敵だらけ','可が2つ！林＋疋で3文字目'],explain:'囗＋儿＝四、面、林＋疋＝楚、可＋可＋欠＝歌→四面楚歌'},
];

// --- Constants ---
const STORAGE_KEY = 'kanjipuzzle_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🔥'];
const TIMER_MAP = { easy: 40, normal: 30, hard: 24 };
const HINT1_TIME = 10; // seconds after start
const HINT2_TIME = 20;
const QUESTIONS_PER_ROUND = 8;
const SCORE_NO_HINT = 10;
const SCORE_ONE_HINT = 7;
const SCORE_TWO_HINTS = 4;
const SCORE_WRONG = -2;

// --- State ---
let players = [];
let scores = {};
let logs = [];
let round = 0;
let difficulty = 'easy';
let category = 'mix';

// Round state
let roundProblems = [];
let currentProblemIndex = 0;
let currentProblem = null;
let timerInterval = null;
let timerLeft = 0;
let hintsShown = 0;
let hintInterval = null;
let answered = false;
let selectedPlayer = null;
let lastAnswerer = null;
let questionShownAt = 0;
let answerRTs = [];

// DOM
const $setupPhase = document.getElementById('setupPhase');
const $puzzlePhase = document.getElementById('puzzlePhase');
const $resultPhase = document.getElementById('resultPhase');
const $scoreboard = document.getElementById('scoreboard');
const $scoreRows = document.getElementById('scoreRows');
const $answerLog = document.getElementById('answerLog');
const $logEntries = document.getElementById('logEntries');
const $playerList = document.getElementById('playerList');

// --- Utilities ---
function showToast(msg, dur = 2000) {
  const el = document.getElementById('toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), dur);
}
function emitParticles(x, y) {
  const c = document.getElementById('particles');
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('span'); p.className = 'particle';
    p.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
    const a = (Math.PI * 2 * i) / 8 + (Math.random() - .5) * .5;
    const d = 60 + Math.random() * 80;
    p.style.left = x + 'px'; p.style.top = y + 'px';
    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.3)`, opacity: 0 }
    ], { duration: 800, easing: 'ease-out', fill: 'forwards' });
    c.appendChild(p); setTimeout(() => p.remove(), 900);
  }
}
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

let audioCtx = null;
function playBeep(freq, dur) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.value = freq; o.type = 'sine'; g.gain.value = 0.2;
    o.start(); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur / 1000);
    o.stop(audioCtx.currentTime + dur / 1000 + 0.05);
  } catch (e) {}
}

// Kana utilities
const HIRA_START = 0x3041;
const KATA_START = 0x30A1;
function toHiragana(str) {
  return str.replace(/[\u30A1-\u30F6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - KATA_START + HIRA_START)
  );
}

function normalize(str) {
  return toHiragana(str.trim().replace(/\s/g, '').toLowerCase());
}

// --- Persistence ---
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, logs, round, difficulty, category })); } catch (e) {} }
function loadState() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) { const s = JSON.parse(r); if (s.players) players = s.players; if (s.scores) scores = s.scores; if (s.logs) logs = s.logs; if (s.round) round = s.round; if (s.difficulty) difficulty = s.difficulty; if (s.category) category = s.category; }
    if (players.length === 0) { const sh = localStorage.getItem(SHARED_PLAYERS_KEY); if (sh) { const sp = JSON.parse(sh); if (Array.isArray(sp) && sp.length > 0) { players = sp; for (const p of players) scores[p] = scores[p] || 0; } } }
  } catch (e) {}
}
function saveSharedPlayers() { try { localStorage.setItem(SHARED_PLAYERS_KEY, JSON.stringify(players)); } catch (e) {} }

// --- Player Management ---
function addPlayer() {
  const input = document.getElementById('playerNameInput'); const name = input.value.trim();
  if (!name || players.includes(name)) { input.value = ''; return; }
  players.push(name); scores[name] = scores[name] || 0; input.value = '';
  renderPlayers(); renderScoreboard(); saveState(); saveSharedPlayers();
}
function removePlayer(name) {
  players = players.filter(p => p !== name); delete scores[name];
  renderPlayers(); renderScoreboard(); saveState(); saveSharedPlayers();
}
function renderPlayers() {
  renderSessionPlayerBar('playerList', players, scores, function(active) { renderScoreboard(); });
}

function selectOption(type, btn) {
  btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  if (type === 'diff') difficulty = btn.dataset.value;
  if (type === 'cat') category = btn.dataset.value;
}

function showPhase(id) {
  [$setupPhase, $puzzlePhase, $resultPhase].forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = '';
}

// --- Player Select Buttons ---
function renderPlayerSelectButtons() {
  const activePlayers = getActivePlayers(players);
  const preselect = lastAnswerer && activePlayers.includes(lastAnswerer) ? lastAnswerer : null;
  selectedPlayer = preselect;
  const row = document.getElementById('playerSelectRow');
  row.innerHTML = activePlayers.map(p => {
    const sel = p === preselect ? ' selected' : '';
    return `<button class="player-select-btn${sel}" data-player="${esc(p)}" onclick="selectPlayer(this,'${esc(p).replace(/'/g, "\\'")}')">${esc(p)}</button>`;
  }).join('');
}

function selectPlayer(btn, name) {
  document.getElementById('playerSelectRow').querySelectorAll('.player-select-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedPlayer = name;
}

// --- Problem Selection ---
function selectProblems() {
  let pool = PROBLEMS.filter(p => {
    if (difficulty === 'easy' && p.d !== 'easy') return false;
    if (difficulty === 'normal' && p.d === 'hard') return false;
    // hard: all difficulties
    if (category !== 'mix') {
      if (category === 'single' && p.cat !== 'single') return false;
      if (category === 'jukugo' && p.cat !== 'jukugo') return false;
      if (category === 'yoji' && p.cat !== 'yoji') return false;
    }
    return true;
  });

  // If pool is too small with strict filter, relax
  if (pool.length < QUESTIONS_PER_ROUND) {
    pool = PROBLEMS.filter(p => {
      if (difficulty === 'easy' && p.d === 'hard') return false;
      return true;
    });
  }

  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - .5);
  return shuffled.slice(0, QUESTIONS_PER_ROUND);
}

// --- Game Flow ---
function startGame() {
  syncActivePlayers(players, scores);
  if (getActivePlayers(players).length < 1) { showToast('プレイヤーを1人以上登録してください'); return; }

  round++;
  roundProblems = selectProblems();
  currentProblemIndex = 0;
  answerRTs = [];

  if (roundProblems.length === 0) {
    showToast('該当する問題がありません。カテゴリを変更してください');
    return;
  }

  showPhase('puzzlePhase');
  startProblem();
}

function startProblem() {
  if (currentProblemIndex >= roundProblems.length) {
    endRound();
    return;
  }

  currentProblem = roundProblems[currentProblemIndex];
  answered = false;
  hintsShown = 0;
  questionShownAt = Date.now();

  // Reset UI
  document.getElementById('answerInput').value = '';
  document.getElementById('answerInput').disabled = false;
  const $fb = document.getElementById('feedback');
  $fb.classList.remove('show', 'correct', 'wrong', 'timeout');
  document.getElementById('assembledDisplay').classList.remove('show');
  document.getElementById('assembledDisplay').textContent = '';
  document.getElementById('readingDisplay').textContent = '';
  document.getElementById('explainDisplay').textContent = '';

  // Question info
  const catLabel = { single: '漢字1文字', jukugo: '二字熟語', yoji: '四字熟語' };
  document.getElementById('questionInfo').textContent =
    `${catLabel[currentProblem.cat] || ''} / ${currentProblem.d === 'easy' ? 'やさしい' : currentProblem.d === 'normal' ? 'ふつう' : 'むずかしい'}`;
  document.getElementById('questionNumber').textContent =
    `Q${currentProblemIndex + 1} / ${roundProblems.length}`;

  // Hint box reset
  const $hint = document.getElementById('hintBox');
  $hint.innerHTML = '';
  $hint.classList.remove('active');

  // Scatter parts
  scatterParts(currentProblem.parts);

  // Player select
  renderPlayerSelectButtons();

  // Timer
  const totalTime = TIMER_MAP[currentProblem.d] || 15;
  timerLeft = totalTime;
  updateTimerDisplay(totalTime);

  clearInterval(timerInterval);
  clearInterval(hintInterval);

  timerInterval = setInterval(() => {
    timerLeft--;
    updateTimerDisplay(totalTime);

    if (timerLeft <= 3 && timerLeft > 0) playBeep(800, 100);

    if (timerLeft <= 0) {
      clearInterval(timerInterval);
      clearInterval(hintInterval);
      playBeep(400, 500);
      onTimeout();
    }
  }, 1000);

  // Hint schedule
  let elapsed = 0;
  hintInterval = setInterval(() => {
    elapsed++;
    if (elapsed === HINT1_TIME && hintsShown === 0 && !answered) {
      showHint(0);
    }
    if (elapsed === HINT2_TIME && hintsShown === 1 && !answered) {
      showHint(1);
    }
  }, 1000);

}

function scatterParts(parts) {
  const display = document.getElementById('partsDisplay');
  const w = display.offsetWidth || 300;
  const h = display.offsetHeight || 200;
  display.innerHTML = '';

  const shuffled = [...parts].sort(() => Math.random() - .5);

  shuffled.forEach((part, i) => {
    const el = document.createElement('div');
    el.className = 'part-item scattered';
    el.textContent = part;
    el.dataset.index = i;

    // Random position within bounds
    const maxX = Math.max(w - 60, 40);
    const maxY = Math.max(h - 60, 40);
    const x = 20 + Math.random() * (maxX - 20);
    const y = 15 + Math.random() * (maxY - 15);
    const rotation = -30 + Math.random() * 60;

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.transform = `rotate(${rotation}deg)`;

    display.appendChild(el);
  });
}

function assembleParts() {
  const display = document.getElementById('partsDisplay');
  const items = display.querySelectorAll('.part-item');
  const w = display.offsetWidth || 300;
  const h = display.offsetHeight || 200;
  const centerX = w / 2;
  const centerY = h / 2;

  items.forEach((el, i) => {
    el.classList.add('assembled');
    const offset = (i - (items.length - 1) / 2) * 30;
    el.style.left = (centerX + offset - 20) + 'px';
    el.style.top = (centerY - 25) + 'px';
    el.style.transform = 'rotate(0deg)';
  });
}

function showHint(index) {
  if (!currentProblem || index >= currentProblem.hints.length) return;
  hintsShown = index + 1;
  const $hint = document.getElementById('hintBox');
  $hint.classList.add('active');
  let html = '';
  for (let i = 0; i <= index; i++) {
    html += `<div class="hint-label">ヒント${i + 1}</div><div>${esc(currentProblem.hints[i])}</div>`;
  }
  $hint.innerHTML = html;
}

function updateTimerDisplay(totalTime) {
  const pct = Math.max(0, (timerLeft / totalTime) * 100);
  document.getElementById('timerFill').style.width = pct + '%';
  const $text = document.getElementById('timerText');
  $text.textContent = `残り ${timerLeft}秒`;
  $text.classList.toggle('urgent', timerLeft <= 5);
}

// --- Answer Checking ---
function submitAnswer() {
  if (answered) return;
  const player = selectedPlayer;
  if (!player) { showToast('回答者を選択してください'); return; }
  const input = document.getElementById('answerInput').value.trim();
  if (!input) return;

  const normalizedInput = normalize(input);
  const normalizedAnswer = normalize(currentProblem.answer);
  const normalizedReading = normalize(currentProblem.reading);

  const isCorrect = normalizedInput === normalizedAnswer ||
                    normalizedInput === normalizedReading ||
                    input === currentProblem.answer;

  if (isCorrect) {
    onCorrect(player);
  } else {
    onWrong(player, input);
  }
}

function onCorrect(player) {
  const answerRT = Date.now() - questionShownAt;
  answerRTs.push(answerRT);
  answered = true;
  clearInterval(timerInterval);
  clearInterval(hintInterval);

  const pts = hintsShown === 0 ? SCORE_NO_HINT : hintsShown === 1 ? SCORE_ONE_HINT : SCORE_TWO_HINTS;
  scores[player] = (scores[player] || 0) + pts;
  lastAnswerer = player;

  playBeep(1000, 150);
  assembleParts();

  const $fb = document.getElementById('feedback');
  $fb.className = 'feedback show correct';
  const hintLabel = hintsShown === 0 ? 'ノーヒント' : `ヒント${hintsShown}つ`;
  $fb.textContent = `正解！ ${esc(player)} +${pts}pt (${hintLabel})`;

  document.getElementById('answerInput').disabled = true;

  // Show assembled answer
  setTimeout(() => {
    const $assembled = document.getElementById('assembledDisplay');
    $assembled.textContent = currentProblem.answer;
    $assembled.classList.add('show');
    document.getElementById('readingDisplay').textContent = currentProblem.reading;
    document.getElementById('explainDisplay').textContent = currentProblem.explain;

    const rect = $assembled.getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }, 300);

  logs.unshift({
    timestamp: new Date().toISOString(), round,
    player, answer: currentProblem.answer, correct: true,
    hints: hintsShown, pts, difficulty: currentProblem.d, cat: currentProblem.cat,
    answerRT,
  });

  savePlayLog('kanji-puzzle', pts, SCORE_NO_HINT, {
    playMode: players.length <= 1 ? 'solo' : 'centerpiece',
    cognitive: { medianRT: median(answerRTs), rtSD: stddev(answerRTs), difficulty: getDDALevel('kanji-puzzle') || 1 }
  });
  renderScoreboard(); renderLog(); saveState();

  // Next problem after delay
  setTimeout(() => {
    currentProblemIndex++;
    startProblem();
  }, 3000);
}

function onWrong(player, input) {
  const answerRT = Date.now() - questionShownAt;
  scores[player] = (scores[player] || 0) + SCORE_WRONG;
  lastAnswerer = player;

  playBeep(300, 200);

  const $fb = document.getElementById('feedback');
  $fb.className = 'feedback show wrong';
  $fb.textContent = `不正解… ${esc(player)} ${SCORE_WRONG}pt 「${esc(input)}」`;

  // Shake the parts
  document.getElementById('partsDisplay').classList.add('shake');
  setTimeout(() => document.getElementById('partsDisplay').classList.remove('shake'), 400);

  logs.unshift({
    timestamp: new Date().toISOString(), round,
    player, answer: currentProblem.answer, userAnswer: input, correct: false,
    hints: hintsShown, pts: SCORE_WRONG, difficulty: currentProblem.d, cat: currentProblem.cat,
    answerRT,
  });

  // Clear input for retry (don't end the question)
  document.getElementById('answerInput').value = '';
  document.getElementById('answerInput').focus();
  renderScoreboard(); renderLog(); saveState();
}

function onTimeout() {
  answered = true;
  document.getElementById('answerInput').disabled = true;

  const $fb = document.getElementById('feedback');
  $fb.className = 'feedback show timeout';
  $fb.textContent = '時間切れ！';

  assembleParts();

  setTimeout(() => {
    const $assembled = document.getElementById('assembledDisplay');
    $assembled.textContent = currentProblem.answer;
    $assembled.classList.add('show');
    document.getElementById('readingDisplay').textContent = currentProblem.reading;
    document.getElementById('explainDisplay').textContent = currentProblem.explain;
  }, 300);

  logs.unshift({
    timestamp: new Date().toISOString(), round,
    player: '(時間切れ)', answer: currentProblem.answer, correct: false,
    hints: hintsShown, pts: 0, difficulty: currentProblem.d, cat: currentProblem.cat,
  });

  renderLog(); saveState();

  setTimeout(() => {
    currentProblemIndex++;
    startProblem();
  }, 3500);
}

// --- End Round ---
function endRound() {
  clearInterval(timerInterval);
  clearInterval(hintInterval);
  showPhase('resultPhase');

  const activePlayers = getActivePlayers(players);
  const sorted = [...activePlayers].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  const topScore = scores[sorted[0]] || 0;

  document.getElementById('resultIcon').textContent = topScore >= 50 ? '🔥' : topScore >= 30 ? '🎉' : '👍';
  document.getElementById('resultTitle').textContent = `ラウンド ${round} 終了！`;
  document.getElementById('resultDetails').innerHTML =
    `問題数: ${roundProblems.length}<br>難易度: ${difficulty === 'easy' ? 'やさしい' : difficulty === 'normal' ? 'ふつう' : 'むずかしい'}`;

  // Ranking
  const $ranking = document.getElementById('resultRanking');
  $ranking.innerHTML = sorted.map((p, i) => {
    const medal = i === 0 ? '👑 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : '';
    return `<div class="rank-row"><span>${medal}${esc(p)}</span><span class="rank-pts">${scores[p] || 0}pt</span></div>`;
  }).join('');

  // Best badge & recommendation
  let extraHTML = renderBestBadge('kanji-puzzle', topScore);
  extraHTML += renderGameRecommendation('kanji-puzzle');
  document.getElementById('resultExtra').innerHTML = extraHTML;

  if (topScore >= 30) {
    const rect = document.getElementById('resultTitle').getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  renderScoreboard(); saveState();
}

function backToSetup() {
  showPhase('setupPhase');
}

// --- Scoreboard / Log ---
function renderScoreboard() {
  if (players.length === 0) { $scoreboard.style.display = 'none'; return; }
  $scoreboard.style.display = '';
  const sorted = getActivePlayers(players).sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  $scoreRows.innerHTML = sorted.map((p, i) => {
    const medal = i === 0 && (scores[p] || 0) > 0 ? '👑' : '';
    return `<span class="score-item"><span class="name">${medal}${esc(p)}</span><span class="pts">${scores[p] || 0}</span></span>`;
  }).join('');
}

function renderLog() {
  if (logs.length === 0) { $answerLog.style.display = 'none'; return; }
  $answerLog.style.display = '';
  $logEntries.innerHTML = logs.slice(0, 10).map(l => {
    const icon = l.correct ? '✅' : l.player === '(時間切れ)' ? '⏰' : '❌';
    return `<div class="log-entry"><span>${icon} ${esc(l.player)}: ${esc(l.answer)}</span><span>${l.pts > 0 ? '+' : ''}${l.pts}pt</span></div>`;
  }).join('');
}

function clearAllLogs() {
  showToast('リセットしました'); logs = []; round = 0;
  for (const p of players) scores[p] = 0;
  renderScoreboard(); renderLog(); saveState();
}

// --- Init ---
(function init() {
  loadState();
  initSessionPlayers(players, scores);
  renderPlayers(); renderScoreboard(); renderLog();
  // Restore option pill selections
  document.querySelectorAll('#diffPills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === difficulty));
  document.querySelectorAll('#catPills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === category));
})();
