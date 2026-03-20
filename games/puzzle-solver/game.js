/* ===== Puzzle Solver (ナゾトキ) ===== */

const PUZZLES = {
  cipher: [
    {d:'easy',q:'「さくら」を五十音で1文字後ろにずらすと？',a:['しくり'],h:['五十音表を思い浮かべてください','「さ」の次は「し」','し○り'],ex:'さ→し、く→く（くの次はけ…ではなくカ行で考える）'},
    {d:'easy',q:'1=あ、2=い、3=う なら「1-2-3」は？',a:['あいう'],h:['数字をかなに置き換えます','1はあ、2はい','あ○う'],ex:'数字→かな変換'},
    {d:'easy',q:'「りまつな」を逆から読むと？',a:['なつまり','なつまつり','夏祭り'],h:['右から左に読んでください','「り」「ま」「つ」「な」→「な」「つ」「ま」「り」','夏の楽しい行事'],ex:'逆さ読み'},
    {d:'easy',q:'「SAKURA」をローマ字から日本語に直すと？',a:['さくら','桜'],h:['ローマ字読みしてください','SA-KU-RA','春に咲く花'],ex:'ローマ字→日本語'},
    {d:'normal',q:'対応表: A=か B=き C=く D=け E=こ。「ACE」を解読せよ',a:['かくこ'],h:['アルファベットをかなに置換','A=か、C=く','か○こ'],ex:'A→か、C→く、E→こ'},
    {d:'normal',q:'「はひふへほ」の3番目と1番目を組み合わせると？',a:['ふは','ふうは'],h:['3番目は「ふ」','1番目は「は」','風？'],ex:'ふ+は'},
    {d:'normal',q:'「🌸+🗻=？」日本の象徴を2つ組み合わせた言葉は？',a:['ふじさくら','さくらふじ','日本'],h:['🌸は桜、🗻は富士山','日本を代表するもの','に○ん'],ex:'桜+富士山→日本の象徴'},
    {d:'normal',q:'「あ」を1、「い」を2...とすると「3-1-5」は？',a:['うあお'],h:['あ行で考えます','3番目は「う」','う○お'],ex:'う(3)+あ(1)+お(5)'},
    {d:'hard',q:'暗号「GSZIV」をアルファベットを逆順(A=Z,B=Y...)で変換せよ',a:['SHARE','share','シェア'],h:['Aの逆はZ、BはY...','G→S、S→H','英語の単語になります'],ex:'アトバシュ暗号: G→S,S→H,Z→A,I→R,V→E = SHARE'},
    {d:'hard',q:'次の数列の規則で最後を解読:「8-5-12-12-15」(A=1,B=2...Z=26)',a:['HELLO','hello','ハロー','はろー'],h:['数字をアルファベットに変換','8=H, 5=E','英語の挨拶'],ex:'H(8)E(5)L(12)L(12)O(15)=HELLO'},
    {d:'hard',q:'「👁️+❤️+🐑」を英語で読むと？',a:['アイラブユー','i love you','あいらぶゆー'],h:['絵文字を英語に','Eye + Heart + Ewe(羊)','愛の言葉'],ex:'Eye=I, ❤️=Love, Ewe=You'},
    {d:'easy',q:'「たぬき」から「た」を抜くと？',a:['ぬき','ぬきこ'],h:['「た」の文字を取り除きます','た-ぬ-き→ぬ-き','2文字になります'],ex:'た抜き→ぬき'},
    {d:'normal',q:'「月曜」「火曜」「水曜」の頭文字を並べると？',a:['げっかすい','げかすい','月火水'],h:['各曜日の最初の漢字','月・火・水','三つの漢字'],ex:'月+火+水'},
    {d:'hard',q:'二進数「1010」を十進数にすると？',a:['10','１０','じゅう'],h:['二進数の変換です','各桁は2の累乗','1×8+0×4+1×2+0×1'],ex:'8+2=10'},
  ],
  riddle: [
    {d:'easy',q:'パンはパンでも食べられないパンは？',a:['フライパン','ふらいぱん'],h:['料理に使います','焼くときに使う道具','○ライパン'],ex:'フライパン'},
    {d:'easy',q:'上は大水、下は大火事。これなーんだ？',a:['おふろ','お風呂','ふろ','風呂'],h:['毎日入るもの','上は湯気、下はガスの火','お○ろ'],ex:'お風呂（上は湯、下は焚き口）'},
    {d:'easy',q:'逆立ちすると軽くなる動物は？',a:['イルカ','いるか'],h:['海にいる動物','逆さにすると「カルイ」','い○か'],ex:'イルカ→カルイ'},
    {d:'easy',q:'借りるときは小さくて、返すときは大きいものは？',a:['おじぎ','お辞儀'],h:['人に何かをもらうとき','頭を下げる動作','お○ぎ'],ex:'お辞儀（借りるとき軽く、返すとき深く）'},
    {d:'normal',q:'冷蔵庫の中にいる動物は？',a:['ぞう','象'],h:['名前の中に隠れています','「れいぞうこ」をよく見て','大きい動物'],ex:'れい「ぞう」こ'},
    {d:'normal',q:'いつも怒っている食べ物は？',a:['おこのみやき','お好み焼き'],h:['鉄板で焼く食べ物','「怒る」の別の言い方','おこの○○き'],ex:'「おこ」=怒っている'},
    {d:'normal',q:'かけてもかけても進まないものは？',a:['めがね','眼鏡'],h:['顔にかけるもの','視力を補正','め○ね'],ex:'眼鏡は「かけて」も進まない'},
    {d:'normal',q:'食べる前は1本、食べた後は2本。これは？',a:['わりばし','割り箸'],h:['食事に使う道具','木でできている','○りばし'],ex:'割り箸（割る前は1本、割ると2本）'},
    {d:'hard',q:'「1000の上に3画ある漢字」で表される飲み物は？',a:['おちゃ','お茶','茶'],h:['漢字の構造を考えて','「千」の上に草冠','日本人が毎日飲む'],ex:'茶=草冠(3画)+千の組み合わせ的な漢字'},
    {d:'hard',q:'切っても切っても減らないものは？',a:['トランプ','とらんぷ','カード','かーど'],h:['「切る」の別の意味','ゲームで使うもの','カードを○る'],ex:'トランプを「切る」（シャッフル）'},
    {d:'hard',q:'買うときは黒、使うときは赤、捨てるときは灰色。これは？',a:['すみ','炭','もくたん','木炭'],h:['キャンプで使う','火をつけて使う','す○'],ex:'炭（購入時は黒、燃焼中は赤、灰になる）'},
    {d:'easy',q:'壊れているのに関係なく使われるものは？',a:['たまご','卵','玉子'],h:['料理に使う食材','殻を割って使う','た○ご'],ex:'卵は「割って」使う'},
    {d:'normal',q:'お父さんが嫌いな果物は？',a:['パパイヤ','ぱぱいや'],h:['お父さんの英語は','パパが「いや」','南国の果物'],ex:'パパ+イヤ'},
    {d:'hard',q:'4人で関わっているのに、結局2人で関わっているものは？',a:['にんにく','ニンニク'],h:['4人=四人=にんにん+2人=にく？','食べ物です','料理の薬味'],ex:'四人(にんにん)×二人(にく)→にんにく的な語呂'},
  ],
  pattern: [
    {d:'easy',q:'2, 4, 6, 8, ? — 次の数は？',a:['10','１０'],h:['等差数列です','2ずつ増えている','8+2=?'],ex:'2ずつ増える'},
    {d:'easy',q:'月, 火, 水, 木, ? — 次は？',a:['金','きん','金曜日','きんようび'],h:['カレンダーを見て','曜日の順番','○曜日'],ex:'曜日順: 月火水木金'},
    {d:'easy',q:'1, 4, 9, 16, ? — 次の数は？',a:['25','２５'],h:['1×1, 2×2, 3×3...','平方数です','5×5=?'],ex:'5²=25'},
    {d:'normal',q:'1, 1, 2, 3, 5, 8, ? — 次は？',a:['13','１３'],h:['前の2つの数に注目','足し算です','5+8=?'],ex:'フィボナッチ数列: 5+8=13'},
    {d:'normal',q:'A=1, B=2, C=3 なら Z=?',a:['26','２６'],h:['アルファベット順','全部で26文字','Yが25なら...'],ex:'Zは26番目'},
    {d:'normal',q:'3, 6, 12, 24, ? — 次は？',a:['48','４８'],h:['前の数との関係は','2倍ずつ増えている','24×2=?'],ex:'等比数列: ×2'},
    {d:'normal',q:'○, △, □, ○, △, ? — 次は？',a:['□','しかく','四角'],h:['図形の繰り返し','3つのパターン','○△□○△○…'],ex:'○△□の繰り返し'},
    {d:'hard',q:'3, 3, 5, 4, 4, 3, 5, 5, 4, ? — 次は？（ヒント: One, Two, Three...）',a:['3','３'],h:['英語に関係あり','各数字を英語で書くと','Ten=3文字'],ex:'英単語の文字数: One=3,Two=3,...Ten=3'},
    {d:'hard',q:'S, M, T, W, T, F, ? — 次は？',a:['S','s'],h:['英語の曜日','Sunday, Monday...','Saturday'],ex:'曜日の頭文字: Saturday=S'},
    {d:'hard',q:'J, F, M, A, M, J, ? — 次は？',a:['J','j'],h:['英語の月','January, February...','July'],ex:'月の頭文字: July=J'},
    {d:'easy',q:'あ, か, さ, た, ? — 次は？',a:['な'],h:['五十音の行','あ行、か行、さ行...','な行の最初'],ex:'五十音の行の先頭'},
    {d:'normal',q:'1, 3, 6, 10, 15, ? — 次は？',a:['21','２１'],h:['差が1ずつ増えている','1,+2,+3,+4,+5...','15+6=?'],ex:'三角数: +1,+2,+3,+4,+5,+6'},
    {d:'hard',q:'11, 12, 13, 21, 22, 23, 31, ? — 次は？',a:['32','３２'],h:['2桁の数字のパターン','十の位と一の位を別々に','31の次は…'],ex:'十の位が1→2→3、一の位が1→2→3の組み合わせ'},
  ],
  escape: [
    {d:'easy',title:'動物の鍵',steps:[
      {q:'桃太郎が最初に出会った動物は？（ひらがなで）',a:['いぬ'],h:['犬・猿・雉の順','最初です','い○'],ex:'犬'},
      {q:'「いぬ」は何文字？',a:['2','２'],h:['数えてください','い・ぬ','2文字'],ex:'2文字'},
      {q:'十二支の2番目の動物は？',a:['うし','丑','牛'],h:['ね、うし、とら...','2番目です','う○'],ex:'丑(うし)'},
    ]},
    {d:'normal',title:'数字の鍵',steps:[
      {q:'5+3×2=?（計算の順序に注意）',a:['11','１１'],h:['掛け算を先に','3×2=6','5+6=?'],ex:'5+6=11'},
      {q:'前の答えから4を引いた数をローマ数字で書くと？',a:['VII','vii','Ⅶ'],h:['11-4=7','7をローマ数字に','V=5, I=1'],ex:'7=VII'},
      {q:'VIIは何文字？それが最終パスコード',a:['3','３'],h:['V, I, I を数えて','3つの文字','答えは3'],ex:'V-I-I=3文字'},
    ]},
    {d:'normal',title:'色の暗号',steps:[
      {q:'信号機の「進め」の色は？',a:['あお','青','みどり','緑'],h:['交通ルール','一番左の色','○お'],ex:'青（緑）'},
      {q:'「青」の英語の最初の文字は？（大文字で）',a:['B','b'],h:['Blue','Bで始まる','B'],ex:'Blue→B'},
      {q:'Bはアルファベットの何番目？',a:['2','２'],h:['A=1, B=?','2番目','答えは2'],ex:'B=2'},
    ]},
    {d:'hard',title:'言葉の迷路',steps:[
      {q:'「にわにはにわにわとりがいる」— にわとりは何羽？',a:['2','２','二','二羽','2羽'],h:['漢字にしてみて','「庭には二羽鶏がいる」','2羽'],ex:'庭には二羽鶏がいる'},
      {q:'前の答え×4を漢字一文字で書くと？',a:['八','はち'],h:['2×4=8','8を漢字に','○'],ex:'2×4=8→八'},
      {q:'「四方○方」の○に入る漢字は？',a:['八','はち'],h:['四字熟語','しほうはっぽう','八方'],ex:'四方八方'},
      {q:'「八」の画数は？',a:['2','２'],h:['「八」を書いてみて','2画','答えは2'],ex:'八は2画'},
    ]},
    {d:'easy',title:'時間の謎',steps:[
      {q:'1日は何時間？',a:['24','２４'],h:['時計が2周','24時間','にじゅうよん'],ex:'24時間'},
      {q:'前の答えを6で割ると？',a:['4','４'],h:['24÷6','割り算','答えは4'],ex:'24÷6=4'},
      {q:'1年の中で4番目の月は何月？',a:['4','４','四月','しがつ','4月'],h:['1月,2月,3月...','4月','し○つ'],ex:'4月'},
    ]},
    {d:'hard',title:'漢字パスワード',steps:[
      {q:'「木」を2つ横に並べるとどんな漢字？',a:['林','はやし'],h:['木+木','もりではない','は○し'],ex:'林'},
      {q:'「林」にさらに「木」を加えるとどんな漢字？',a:['森','もり'],h:['木が3つ','自然が豊か','も○'],ex:'森'},
      {q:'「森」の画数は？',a:['12','１２'],h:['木は4画','木×3','4×3=?'],ex:'木(4画)×3=12画'},
      {q:'12を半分にした数の英語は？',a:['SIX','six','シックス','しっくす'],h:['12÷2=6','6の英語','S○X'],ex:'6=SIX'},
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
function renderPlayers(){$playerList.innerHTML=players.map(p=>`<span class="player-tag">${esc(p)} <span class="remove" onclick="removePlayer('${esc(p)}')">&times;</span></span>`).join('');}

function selectOption(t,b){b.parentElement.querySelectorAll('.option-pill').forEach(p=>p.classList.remove('selected'));b.classList.add('selected');if(t==='category')categoryFilter=b.dataset.value;if(t==='difficulty')difficultyFilter=b.dataset.value;}

function showPhase(id){[$setupPhase,$puzzlePhase,$resultPhase].forEach(e=>e.style.display='none');$(id).style.display='';}

function startGame(){
  if(players.length<1){showToast('プレイヤーを1人以上登録してください');return;}
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
  if(players.length>0){renderPlayers();renderScoreboard();renderLog();}
  document.querySelectorAll('#categoryPills .option-pill').forEach(b=>b.classList.toggle('selected',b.dataset.value===categoryFilter));
  document.querySelectorAll('#difficultyPills .option-pill').forEach(b=>b.classList.toggle('selected',b.dataset.value===difficultyFilter));
})();
