/* ===== Puzzle Solver (ナゾトキ) ===== */

const PUZZLES = {
  cipher: [
    // === easy (5) ===
    {d:'easy',q:'「びなは」を逆から読むと？',a:['はなび','花火'],h:['右から左に読んでみよう','夏の夜空に咲くもの','は○び'],ex:'逆さ読み: びなは→はなび（花火）'},
    {d:'easy',q:'たぬき暗号:「た」を抜いて読め →「たいたよたう」',a:['いよう','太陽','たいよう'],h:['「た」の文字を全部消します','空に輝く大きなもの','○いよう'],ex:'た抜き: たいたよたう→いよう→太陽（たいよう）'},
    {d:'easy',q:'「SAKANA」をローマ字で読むと？',a:['さかな','魚'],h:['ローマ字をそのまま読む','海や川にいる','さ○な'],ex:'SAKANA→さかな（魚）'},
    {d:'easy',q:'各行の頭文字を読め:「あしたは / めいっぱい遊ぼう」',a:['あめ','雨'],h:['各行の最初の1文字だけ','空から降るもの','あ○'],ex:'あ/め→あめ（雨）'},
    {d:'easy',q:'「🍦+💃」→ アイス+ダンス。最初の2文字ずつ取ると？',a:['アイダ','あいだ','間'],h:['アイス→「アイ」、ダンス→「ダ」','2つの文字を合わせる','あ○だ'],ex:'アイ+ダ=アイダ→間（あいだ）'},

    // === normal (5) ===
    {d:'normal',q:'A=1,B=2...Z=26 として「8-1-14-1」を解読せよ',a:['はな','花','HANA'],h:['数字をアルファベットに変換','H-A-N-A','ローマ字で日本語に'],ex:'H(8)A(1)N(14)A(1)=HANA=はな（花）'},
    {d:'normal',q:'各行の頭文字を縦読み:「すごいね / いつもありがとう / かならず届くよ」',a:['すいか','スイカ','西瓜'],h:['各行の最初の1文字','す・い・か','夏に食べる大きな果物'],ex:'す/い/か→すいか（西瓜）'},
    {d:'normal',q:'たぬき暗号:「たからたくたり」から「た」を全部抜くと？',a:['からくり','絡繰り'],h:['「た」を全部消す','仕掛けのこと','か○くり'],ex:'た抜き: たからたくたり→からくり'},
    {d:'normal',q:'「ごかぞく」の中に隠れている数字は？',a:['5','五','ご'],h:['最初の1文字に注目','日本語の数字の読み','○かぞく'],ex:'「ご」かぞく→ご=五=5'},
    {d:'normal',q:'「🌙+🐰」→ 月とうさぎ。日本の昔話で関係するものは？',a:['もちつき','餅つき'],h:['月でうさぎが何をしている？','お正月にも関係する','も○つき'],ex:'月のうさぎ=餅つき'},

    // === hard (5) ===
    {d:'hard',q:'A=1,B=2...Z=26 として「19-1-11-21-18-1」を解読せよ',a:['さくら','桜','SAKURA'],h:['数字→アルファベット→ローマ字','S-A-K-U-R-A','春に咲くピンクの花'],ex:'S(19)A(1)K(11)U(21)R(18)A(1)=SAKURA=さくら'},
    {d:'hard',q:'各行の頭文字を縦読み:「ありがとう / いつも元気で / してもらった恩 / たくさんの思い出 / いつまでも忘れない」',a:['あいした','愛した'],h:['5行の最初の1文字','あ・い・し・た・い','気持ちを伝える言葉'],ex:'あ/い/し/た/い→あいした（い）→愛した'},
    {d:'hard',q:'「👁️ + ❤️ + 🫵」を英語で読むと？',a:['アイラブユー','あいらぶゆー','I love you'],h:['絵文字をそれぞれ英語にすると','Eye + Heart + You','愛の告白'],ex:'Eye(I) + Love(❤️) + You(🫵) = I love you'},
    {d:'hard',q:'たぬき暗号:「たつたきたみ」から「た」を全部抜くと？',a:['つきみ','月見'],h:['「た」を全部消す','秋の風物詩','つ○み'],ex:'た抜き: たつたきたみ→つきみ（月見）'},
    {d:'hard',q:'A=1,B=2...Z=26 として「8-1-14-1-2-9」を解読せよ',a:['はなび','花火','HANABI'],h:['数字→アルファベット→ローマ字','H-A-N-A-B-I','夏の夜空に打ち上がるもの'],ex:'H(8)A(1)N(14)A(1)B(2)I(9)=HANABI=はなび（花火）'},
  ],
  riddle: [
    // === easy (5) ===
    {d:'easy',q:'パンはパンでも食べられないパンは？',a:['フライパン','ふらいぱん'],h:['料理に使います','焼くときに使う道具','○ライパン'],ex:'フライパン'},
    {d:'easy',q:'逆立ちすると軽くなる動物は？',a:['イルカ','いるか'],h:['海にいる動物','逆さに読むと「カルイ」','い○か'],ex:'イルカ→カルイ（軽い）'},
    {d:'easy',q:'食べる前は1本、食べた後は2本になるものは？',a:['わりばし','割り箸','割りばし'],h:['食事で使う道具','木でできている','割って使う'],ex:'割り箸は割ると2本になる'},
    {d:'easy',q:'壊すと使えるようになる食べ物は？',a:['たまご','卵','玉子'],h:['殻を割って使う','朝ごはんの定番','た○ご'],ex:'卵は割って（壊して）使う'},
    {d:'easy',q:'タイはタイでも食べられないタイは？',a:['ネクタイ','ねくたい'],h:['身につけるもの','首のあたりにつける','ネク○イ'],ex:'ネクタイ'},

    // === normal (5) ===
    {d:'normal',q:'冷蔵庫の中にいる動物は？',a:['ぞう','象','ゾウ'],h:['「れいぞうこ」をよく見て','名前の中に隠れている','大きな動物'],ex:'れい「ぞう」こ→象'},
    {d:'normal',q:'お父さんが嫌いな果物は？',a:['パパイヤ','ぱぱいや'],h:['お父さんを英語で','パパ+嫌','南国のフルーツ'],ex:'パパ+イヤ=パパイヤ'},
    {d:'normal',q:'かけてもかけても進まないものは？',a:['めがね','眼鏡'],h:['顔にかけるもの','視力を補う道具','め○ね'],ex:'眼鏡は「かけて」も前に進まない'},
    {d:'normal',q:'夜になると現れて、朝になると消えるものは？',a:['ほし','星'],h:['空に見えるもの','キラキラ光る','○し'],ex:'星'},
    {d:'normal',q:'歳をとるほど増えていくのに、決して減らないものは？',a:['おもいで','思い出'],h:['心の中にあるもの','楽しかった記憶','お○いで'],ex:'思い出は増え続ける'},

    // === hard (5) ===
    {d:'hard',q:'買うときは黒、使うときは赤、捨てるときは灰色のものは？',a:['すみ','炭','もくたん','木炭'],h:['キャンプで使う','火をつけて使う','す○'],ex:'炭（黒→赤く燃える→灰になる）'},
    {d:'hard',q:'切っても切っても減らないものは？',a:['トランプ','とらんぷ'],h:['「切る」の別の意味を考えて','カードゲームに使う','シャッフルのこと'],ex:'トランプを「切る」＝シャッフルなので減らない'},
    {d:'hard',q:'世界中を旅しているのに、いつも隅っこにいるものは？',a:['きって','切手'],h:['手紙に貼るもの','郵便局で買える','き○て'],ex:'切手は世界中に届くが封筒の隅にいる'},
    {d:'hard',q:'上は大水、下は大火事。これなーんだ？',a:['おふろ','お風呂','ふろ','風呂'],h:['毎日入るもの','上は湯気、下はガスの火','お○ろ'],ex:'お風呂（上に湯、下に火）'},
    {d:'hard',q:'どんなに走っても絶対に追いつけないものは？',a:['あした','明日','きのう','昨日'],h:['時間に関係するもの','カレンダーを見て','来ると「今日」に変わる'],ex:'明日は走っても追いつけない。来たら今日になる'},
  ],
  pattern: [
    // === easy (5) ===
    {d:'easy',q:'2, 4, 6, 8, ? — 次の数は？',a:['10','１０'],h:['2ずつ増えている','偶数の並び','8+2=?'],ex:'2の倍数: 10'},
    {d:'easy',q:'1, 4, 9, 16, ? — 次の数は？',a:['25','２５'],h:['1×1, 2×2, 3×3...','かけ算で作れる数','5×5=?'],ex:'平方数: 5²=25'},
    {d:'easy',q:'あ, か, さ, た, ? — 次のひらがなは？',a:['な'],h:['五十音表の行を見て','あ行、か行、さ行…','な行の最初の文字'],ex:'五十音の各行の先頭: な'},
    {d:'easy',q:'赤, 橙, 黄, 緑, ? — 次の色は？',a:['青','あお'],h:['虹の色の順番','7色を思い出して','あ○'],ex:'虹の色順: 赤橙黄緑青藍紫'},
    {d:'easy',q:'月, 火, 水, 木, ? — 次は？',a:['金','きん'],h:['毎週繰り返すもの','曜日です','き○'],ex:'曜日の順番: 金曜日'},

    // === normal (5) ===
    {d:'normal',q:'1, 1, 2, 3, 5, 8, ? — 次の数は？',a:['13','１３'],h:['前の2つの数を足してみて','有名な数列','5+8=?'],ex:'フィボナッチ数列: 5+8=13'},
    {d:'normal',q:'1, 3, 6, 10, 15, ? — 次の数は？',a:['21','２１'],h:['差が1ずつ増えている','+2,+3,+4,+5,+?','15+6=?'],ex:'三角数: 15+6=21'},
    {d:'normal',q:'北, 東, 南, ? — 次の方角は？',a:['西','にし'],h:['時計回りに回っている','方角は4つ','に○'],ex:'方角を時計回り: 北→東→南→西'},
    {d:'normal',q:'○, △, □, ○, △, ? — 次の形は？',a:['□','しかく','四角'],h:['3つの形の繰り返し','○△□のパターン','○△の次は？'],ex:'○△□の繰り返し: □'},
    {d:'normal',q:'3, 6, 12, 24, ? — 次の数は？',a:['48','４８'],h:['前の数と次の数の関係','毎回2倍','24×2=?'],ex:'等比数列(×2): 48'},

    // === hard (5) ===
    {d:'hard',q:'3, 3, 5, 4, 4, 3, 5, 5, 4, ? — 次は？（英語で考えよ）',a:['3','３'],h:['数字を英語のスペルで書くと','One=3文字, Two=3文字...','Ten=何文字？'],ex:'英単語の文字数: One(3),Two(3),Three(5)...Ten(3)'},
    {d:'hard',q:'S, M, T, W, T, F, ? — 次のアルファベットは？',a:['S','s'],h:['英語で7つあるもの','Sunday, Monday...','Saturday=?'],ex:'曜日の頭文字: Saturday→S'},
    {d:'hard',q:'い, ろ, は, に, ほ, ? — 次は？',a:['へ'],h:['いろはにほへと','昔の日本語の順番','いろは歌'],ex:'いろは順: へ'},
    {d:'hard',q:'J, F, M, A, M, J, ? — 次は？',a:['J','j'],h:['英語で12個あるもの','January, February...','July=?'],ex:'月の頭文字: July→J'},
    {d:'hard',q:'1, 2, 4, 8, 16, 32, ? — 次の数は？',a:['64','６４'],h:['毎回何倍？','2の累乗','32×2=?'],ex:'2の累乗: 2⁶=64'},
  ],
  escape: [
    // === easy (2) ===
    {d:'easy',title:'色のパスワード',steps:[
      {q:'日本の国旗の丸の色は？',a:['あか','赤','あか'],h:['日の丸といえば','白い旗に○色の丸','あ○'],ex:'赤（日の丸）'},
      {q:'赤と青を混ぜると何色になる？',a:['むらさき','紫'],h:['色の混ぜ方の基本','赤+青','む○さき'],ex:'紫'},
      {q:'紫色の野菜といえば？',a:['なす','茄子','ナス'],h:['夏野菜の代表','漬物にもする','な○'],ex:'なす'},
    ]},
    {d:'easy',title:'漢字パスワード',steps:[
      {q:'「木」を2つ横に並べるとできる漢字は？',a:['林','はやし'],h:['木+木','森ではない方','は○し'],ex:'林（木が2つ）'},
      {q:'「林」にもう1つ「木」を足すとできる漢字は？',a:['森','もり'],h:['木が3つ','自然豊かな場所','も○'],ex:'森（木が3つ）'},
      {q:'「森」の中に木は何本ある？',a:['3','３','三','さん'],h:['漢字をよく見て','木を数えるだけ','さ○'],ex:'木が3本で「森」'},
    ]},

    // === normal (2) ===
    {d:'normal',title:'しりとり脱出',steps:[
      {q:'「りんご」→「ご」で始まる食べ物は？（ご飯、ごま等）',a:['ごはん','ご飯','ごま','胡麻'],h:['「ご」から始まる','毎日食べるもの','ご○ん'],ex:'ごはん'},
      {q:'「ごはん」→「ん」がついた！しりとりでは「ん」がつくと？',a:['まけ','負け','アウト','あうと'],h:['しりとりのルール','「ん」で終わると…','ま○'],ex:'しりとりで「ん」がつくと負け'},
      {q:'「負け」の反対の言葉は？',a:['かち','勝ち'],h:['勝負の結果','負けの反対','か○'],ex:'勝ち'},
    ]},
    {d:'normal',title:'干支パズル',steps:[
      {q:'十二支の最初の動物は？',a:['ねずみ','ネズミ','鼠','ね'],h:['ね・うし・とら…','一番最初に来た動物','ね○み'],ex:'ねずみ（子）'},
      {q:'十二支の3番目の動物は？',a:['とら','虎','トラ'],h:['ね・うし・?','ネコ科の猛獣','と○'],ex:'とら（寅）'},
      {q:'「虎」を使ったことわざ:「虎の○を借る狐」。○に入る漢字1文字は？',a:['威','い'],h:['他人の権力を利用すること','「い」と読む漢字','威張るの「い」'],ex:'虎の威を借る狐（とらのいをかるきつね）'},
    ]},

    // === hard (2) ===
    {d:'hard',title:'言葉の迷宮',steps:[
      {q:'「にわにはにわにわとりがいる」を正しく区切ると、鶏は何羽？',a:['2','２','二','二羽','2羽'],h:['漢字に直して考えて','「庭には二羽鶏がいる」','に○'],ex:'庭には二羽鶏がいる→2羽'},
      {q:'前の答え「2」を漢字で書くと？',a:['二','に'],h:['数字の漢字','い○に','一の次'],ex:'二'},
      {q:'「一石○鳥」の○に入る漢字は？',a:['二','に'],h:['有名な四字熟語','1つの石で○羽の鳥','いっせき○ちょう'],ex:'一石二鳥'},
      {q:'「一石二鳥」の意味に最も近いのは？「一度に○つの利益を得る」',a:['2','２','二','ふたつ'],h:['二鳥=2羽の鳥','1つの行動で得るもの','ふた○'],ex:'一石二鳥=一度に2つの利益を得ること'},
    ]},
    {d:'hard',title:'数字の暗号室',steps:[
      {q:'トランプの絵札(J,Q,K)は全部で何枚？',a:['12','１２','じゅうに'],h:['4つのスート×3種類','ハート・ダイヤ・スペード・クラブ','4×3=?'],ex:'J,Q,Kが4スートずつ: 4×3=12枚'},
      {q:'前の答え「12」は何ダース？',a:['1','１','いち'],h:['1ダース=12個','12÷12=?','い○'],ex:'12個=1ダース'},
      {q:'「1」をローマ数字で書くと？（アルファベット1文字）',a:['I','i','アイ'],h:['ローマ数字の一番小さい数','時計の文字盤で見る','アルファベットの9番目'],ex:'ローマ数字の1=I'},
      {q:'「I」で始まる日本語の挨拶:「I」=「愛」を使って「○してる」',a:['あいしてる','愛してる'],h:['I=愛(あい)','大切な人に言う言葉','あ○してる'],ex:'I=愛→愛してる'},
    ]},
  ],
};

const STORAGE_KEY = 'puzzlesolver_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉','✨','⭐','🌟','💫','🔍'];
const PUZZLES_PER_SET = 10;
const SCORE_BASE = {easy:2, normal:3, hard:5};

let players=[],scores={},logs=[],round=0;
let categoryFilter='all',difficultyFilter='normal';
let usedPuzzles=new Set();

let currentPuzzles=[],puzzleIndex=0,setCorrect=0,setTotal=0;
let hintsUsed=0,answered=false,puzzleStartTime=0;
let escapeStepIndex=0,escapeCompleted=false;
let currentEscape=null;

const $=id=>document.getElementById(id);
const $setupPhase=$('setupPhase'),$puzzlePhase=$('puzzlePhase'),$resultPhase=$('resultPhase');
const $scoreboard=$('scoreboard'),$scoreRows=$('scoreRows');
const $answerLog=$('answerLog'),$logEntries=$('logEntries'),$playerList=$('playerList');

function showToast(m,d=2000){const e=$('toast');e.textContent=m;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),d);}
function emitParticles(x,y){const c=$('particles');for(let i=0;i<8;i++){const p=document.createElement('span');p.className='particle';p.textContent=PARTICLE_EMOJIS[Math.floor(Math.random()*PARTICLE_EMOJIS.length)];const a=(Math.PI*2*i)/8+(Math.random()-.5)*.5,d=60+Math.random()*80;p.style.left=x+'px';p.style.top=y+'px';p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.3)`,opacity:0}],{duration:800,easing:'ease-out',fill:'forwards'});c.appendChild(p);setTimeout(()=>p.remove(),900);}}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function normalize(s){return s.toLowerCase().replace(/[Ａ-Ｚａ-ｚ０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0)).replace(/[\s・\-ー。、！？!?]/g,'').replace(/[\u30A1-\u30F6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));}

let audioCtx=null;
function playBeep(f,d){try{if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.frequency.value=f;o.type='sine';g.gain.value=.2;o.start();g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+d/1000);o.stop(audioCtx.currentTime+d/1000+.05);}catch(e){}}

function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({players,scores,logs,round,categoryFilter,difficultyFilter}));}catch(e){}}
function loadState(){try{const r=localStorage.getItem(STORAGE_KEY);if(r){const s=JSON.parse(r);if(s.players)players=s.players;if(s.scores)scores=s.scores;if(s.logs)logs=s.logs;if(s.round)round=s.round;if(s.categoryFilter)categoryFilter=s.categoryFilter;if(s.difficultyFilter)difficultyFilter=s.difficultyFilter;}if(players.length===0){const sh=localStorage.getItem(SHARED_PLAYERS_KEY);if(sh){const sp=JSON.parse(sh);if(Array.isArray(sp)&&sp.length>0){players=sp;for(const p of players)scores[p]=scores[p]||0;}}}}catch(e){}}
function saveSharedPlayers(){try{localStorage.setItem(SHARED_PLAYERS_KEY,JSON.stringify(players));}catch(e){}}

function addPlayer(){const i=$('playerNameInput');const n=i.value.trim();if(!n||players.includes(n)){i.value='';return;}players.push(n);scores[n]=scores[n]||0;i.value='';renderPlayers();renderScoreboard();saveState();saveSharedPlayers();}
function removePlayer(n){players=players.filter(p=>p!==n);delete scores[n];renderPlayers();renderScoreboard();saveState();saveSharedPlayers();}
function renderPlayers(){renderSessionPlayerBar('playerList',players,scores,function(active){renderScoreboard();});}

function selectOption(t,b){b.parentElement.querySelectorAll('.option-pill').forEach(p=>p.classList.remove('selected'));b.classList.add('selected');if(t==='category')categoryFilter=b.dataset.value;if(t==='difficulty')difficultyFilter=b.dataset.value;}

function showPhase(id){[$setupPhase,$puzzlePhase,$resultPhase].forEach(e=>e.style.display='none');$(id).style.display='';}

function startGame(){
  syncActivePlayers(players,scores);
  if(getActivePlayers(players).length<1){showToast('プレイヤーを1人以上登録してください');return;}
  round++; setCorrect=0; setTotal=0;

  // Build puzzle pool
  let pool=[];
  const cats=categoryFilter==='all'?['cipher','riddle','pattern','escape']:[categoryFilter];
  for(const cat of cats){
    const items=PUZZLES[cat]||[];
    if(cat==='escape'){
      for(const e of items){
        if(difficultyFilter==='all'||e.d===difficultyFilter){
          pool.push({type:'escape',data:e});
        }
      }
    } else {
      for(const p of items){
        if(difficultyFilter==='all'||p.d===difficultyFilter){
          pool.push({type:cat,data:p});
        }
      }
    }
  }

  // Shuffle and pick
  pool=pool.sort(()=>Math.random()-.5);
  currentPuzzles=pool.slice(0,Math.min(PUZZLES_PER_SET,pool.length));
  if(currentPuzzles.length===0){showToast('該当する問題がありません');return;}
  puzzleIndex=0;

  showPhase('puzzlePhase');
  showPuzzle();
  renderScoreboard();renderLog();saveState();
}

function showPuzzle(){
  if(puzzleIndex>=currentPuzzles.length){endSet();return;}
  const p=currentPuzzles[puzzleIndex];
  hintsUsed=0;answered=false;puzzleStartTime=Date.now();
  escapeStepIndex=0;escapeCompleted=false;currentEscape=null;

  // Reset UI
  $('hintText').classList.remove('show');
  $('hintText').textContent='';
  ['hint1Btn','hint2Btn','hint3Btn'].forEach(id=>$(id).disabled=false);
  $('feedback').classList.remove('show','correct','wrong');
  $('answerInput').value='';$('answerInput').disabled=false;

  if(p.type==='escape'){
    currentEscape=p.data;
    showEscapeStep();
  } else {
    const catName={cipher:'暗号解読',riddle:'ひらめきなぞなぞ',pattern:'規則発見'}[p.type]||'';
    $('puzzleMeta').textContent=`${puzzleIndex+1}/${currentPuzzles.length} — ${catName}・${p.data.d==='easy'?'かんたん':p.data.d==='normal'?'ふつう':'むずかしい'}`;
    $('puzzleCard').innerHTML=esc(p.data.q);
  }
  renderProgress();
  $('answerInput').focus();
}

function showEscapeStep(){
  const step=currentEscape.steps[escapeStepIndex];
  $('puzzleMeta').textContent=`${puzzleIndex+1}/${currentPuzzles.length} — 脱出「${currentEscape.title}」ステップ${escapeStepIndex+1}/${currentEscape.steps.length}`;
  $('puzzleCard').innerHTML=`<div class="escape-step">ステップ ${escapeStepIndex+1} / ${currentEscape.steps.length}</div>${esc(step.q)}`;

  // Reset for this step
  hintsUsed=0;answered=false;
  $('hintText').classList.remove('show');
  ['hint1Btn','hint2Btn','hint3Btn'].forEach(id=>$(id).disabled=false);
  $('feedback').classList.remove('show','correct','wrong');
  $('answerInput').value='';$('answerInput').disabled=false;
  $('answerInput').focus();
}

function showHint(level){
  if(answered)return;
  const p=currentPuzzles[puzzleIndex];
  let hints;
  if(p.type==='escape'){
    hints=currentEscape.steps[escapeStepIndex].h;
  } else {
    hints=p.data.h;
  }
  if(!hints||level>=hints.length)return;

  // Disable used hint buttons
  for(let i=0;i<=level;i++){$(`hint${i+1}Btn`).disabled=true;}
  hintsUsed=Math.max(hintsUsed,level+1);

  $('hintText').textContent=`💡 ${hints[level]}`;
  $('hintText').classList.add('show');
}

function submitAnswer(){
  if(answered)return;
  const input=$('answerInput').value.trim();
  if(!input)return;

  const p=currentPuzzles[puzzleIndex];
  let answers,explanation;

  if(p.type==='escape'){
    const step=currentEscape.steps[escapeStepIndex];
    answers=step.a;explanation=step.ex||'';
  } else {
    answers=p.data.a;explanation=p.data.ex||'';
  }

  const norm=normalize(input);
  const isCorrect=answers.some(a=>normalize(a)===norm);

  answered=true;
  $('answerInput').disabled=true;
  const fb=$('feedback');
  fb.classList.add('show');

  if(isCorrect){
    fb.classList.add('correct');
    playBeep(1000,100);

    if(p.type==='escape'){
      // Escape: advance step
      fb.textContent=`⭕ 正解！ ${explanation}`;
      escapeStepIndex++;
      if(escapeStepIndex>=currentEscape.steps.length){
        // Escape completed!
        escapeCompleted=true;
        const pts=Math.max(0,(SCORE_BASE[currentEscape.d]||3)-hintsUsed+3);
        for(const pl of players)scores[pl]=(scores[pl]||0)+pts;
        setCorrect++;setTotal++;
        fb.textContent=`🎉 脱出成功！ +${pts}pt（完走ボーナス込み）`;
        setTimeout(()=>{puzzleIndex++;showPuzzle();},2000);
      } else {
        setTimeout(()=>showEscapeStep(),1500);
      }
      renderScoreboard();saveState();
      return;
    }

    // Normal puzzle
    const elapsed=(Date.now()-puzzleStartTime)/1000;
    const base=SCORE_BASE[p.data.d]||3;
    const pts=Math.max(0,base-hintsUsed);
    for(const pl of players)scores[pl]=(scores[pl]||0)+pts;
    setCorrect++;setTotal++;
    fb.textContent=`⭕ 正解！ +${pts}pt ${explanation?'— '+explanation:''}`;
    renderScoreboard();saveState();
    setTimeout(()=>{puzzleIndex++;showPuzzle();},2000);
  } else {
    fb.classList.add('wrong');
    fb.textContent=`❌ 不正解… もう一度挑戦！`;
    playBeep(300,200);
    // Allow retry
    setTimeout(()=>{
      answered=false;
      $('answerInput').disabled=false;
      $('answerInput').value='';
      $('answerInput').focus();
      fb.classList.remove('show','wrong');
    },1500);
  }
}

function skipPuzzle(){
  if(answered&&!escapeCompleted)return;
  const p=currentPuzzles[puzzleIndex];
  let answer;
  if(p.type==='escape'){
    answer=currentEscape.steps[escapeStepIndex].a[0];
  } else {
    answer=p.data.a[0];
  }
  setTotal++;
  const fb=$('feedback');
  fb.classList.add('show','wrong');
  fb.textContent=`スキップ → 答え: ${answer}`;
  answered=true;

  // Mark in progress
  if(p.type==='escape')p._result='wrong';
  else p._result='wrong';

  setTimeout(()=>{puzzleIndex++;showPuzzle();},2000);
}

function renderProgress(){
  $('progressBar').innerHTML=currentPuzzles.map((_,i)=>{
    let cls='';
    if(i<puzzleIndex)cls=currentPuzzles[i]._result==='wrong'?'wrong':'correct';
    else if(i===puzzleIndex)cls='current';
    return `<div class="progress-dot ${cls}"></div>`;
  }).join('');
}

function endSet(){
  showPhase('resultPhase');
  const pct=setTotal>0?Math.round(setCorrect/setTotal*100):0;
  $('resultIcon').textContent=pct>=80?'🎉':pct>=50?'👍':'🔍';
  $('resultTitle').textContent=`${setCorrect} / ${setTotal} 問正解！（${pct}%）`;

  let details='';
  currentPuzzles.forEach((p,i)=>{
    const icon=p._result==='wrong'?'❌':'⭕';
    const name=p.type==='escape'?`脱出「${p.data.title}」`:(p.data.q||'').slice(0,30)+'...';
    details+=`${icon} ${esc(name)}<br>`;
  });
  $('resultDetails').innerHTML=details;

  if(pct>=80){const r=$('resultTitle').getBoundingClientRect();emitParticles(r.left+r.width/2,r.top+r.height/2);}

  logs.unshift({timestamp:new Date().toISOString(),round,correct:setCorrect,total:setTotal,pct});
  savePlayLog('puzzle-solver', setCorrect, setTotal);
  renderScoreboard();renderLog();saveState();
}

function nextRound(){showPhase('setupPhase');}

function renderScoreboard(){
  if(players.length===0){$scoreboard.style.display='none';return;}
  $scoreboard.style.display='';
  const sorted=[...players].sort((a,b)=>(scores[b]||0)-(scores[a]||0));
  $scoreRows.innerHTML=sorted.map((p,i)=>{
    const medal=i===0&&scores[p]>0?'👑':'';
    return `<span class="score-item"><span class="name">${medal}${esc(p)}</span><span class="pts">${scores[p]||0}</span></span>`;
  }).join('');
}
function renderLog(){
  if(logs.length===0){$answerLog.style.display='none';return;}
  $answerLog.style.display='';
  $logEntries.innerHTML=logs.slice(0,8).map(l=>`<div class="log-entry"><span>R${l.round}</span><span>${l.correct}/${l.total} (${l.pct}%)</span></div>`).join('');
}
function clearAllLogs(){showToast('リセットしました');logs=[];round=0;for(const p of players)scores[p]=0;renderScoreboard();renderLog();saveState();}

(function init(){
  loadState();
  initSessionPlayers(players,scores);
  renderPlayers();renderScoreboard();renderLog();
  document.querySelectorAll('#categoryPills .option-pill').forEach(b=>b.classList.toggle('selected',b.dataset.value===categoryFilter));
  document.querySelectorAll('#difficultyPills .option-pill').forEach(b=>b.classList.toggle('selected',b.dataset.value===difficultyFilter));
})();
