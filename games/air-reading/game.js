/* ===== Air Reading Scale (空気読みスケール) ===== */

const TOPICS = [
  {q:'ラーメンの理想の値段は？',low:'300円',high:'2000円'},
  {q:'デートで許せる遅刻は何分？',low:'0分',high:'60分'},
  {q:'理想の睡眠時間は？',low:'4時間',high:'12時間'},
  {q:'カラオケの理想の時間は？',low:'30分',high:'5時間'},
  {q:'一日にスマホを見る理想の時間は？',low:'0分',high:'10時間'},
  {q:'友達との旅行の理想の人数は？',low:'2人',high:'20人'},
  {q:'朝起きるのに理想的な時刻は？',low:'5:00',high:'12:00'},
  {q:'お寿司1回で何皿食べる？',low:'2皿',high:'20皿'},
  {q:'夏と冬、どっちが好き？',low:'夏',high:'冬'},
  {q:'犬派？猫派？',low:'犬',high:'猫'},
  {q:'都会と田舎、住むならどっち？',low:'都会',high:'田舎'},
  {q:'映画は字幕派？吹替派？',low:'字幕',high:'吹替'},
  {q:'朝型？夜型？',low:'超朝型',high:'超夜型'},
  {q:'辛いものの耐性は？',low:'甘口のみ',high:'激辛大好き'},
  {q:'自分はインドア派？アウトドア派？',low:'完全インドア',high:'完全アウトドア'},
  {q:'お風呂の理想の温度は？',low:'ぬるめ36℃',high:'熱め44℃'},
  {q:'1ヶ月の理想のお小遣いは？',low:'1万円',high:'10万円'},
  {q:'結婚式の理想の招待人数は？',low:'2人だけ',high:'200人'},
  {q:'自分の運の良さは？',low:'超不運',high:'超幸運'},
  {q:'自分のコミュ力は？',low:'人見知り',high:'社交的'},
  {q:'ホラー映画の怖さ耐性は？',low:'絶対無理',high:'大好物'},
  {q:'自分の方向感覚は？',low:'迷子の天才',high:'人間GPS'},
  {q:'料理の腕前は？',low:'カップ麺が限界',high:'プロ級'},
  {q:'運動神経は？',low:'超運動音痴',high:'アスリート級'},
  {q:'SNSへの依存度は？',low:'見ない',high:'中毒'},
  {q:'自分のケチ度は？',low:'超太っ腹',high:'1円単位で割り勘'},
  {q:'週末の理想の過ごし方の活動量は？',low:'布団から出ない',high:'朝から晩まで予定びっしり'},
  {q:'コーヒーの甘さの好みは？',low:'ブラック',high:'砂糖たっぷり'},
  {q:'ジェットコースターの好き度は？',low:'絶対乗らない',high:'何回でも乗りたい'},
  {q:'占いを信じる度合いは？',low:'全く信じない',high:'毎日チェック'},
  {q:'自分の几帳面さは？',low:'超ズボラ',high:'完璧主義'},
  {q:'ペットを飼うなら何匹？',low:'0匹（飼わない）',high:'10匹以上'},
  {q:'カラオケで歌う曲の新しさは？',low:'昭和の名曲',high:'今週の新曲'},
  {q:'筋トレへの関心度は？',low:'興味なし',high:'毎日やりたい'},
  {q:'甘いもの好き度は？',low:'甘いの苦手',high:'スイーツ中毒'},
  {q:'自分のおしゃれ度は？',low:'ジャージで外出',high:'毎日コーディネート'},
  {q:'読書量は月に何冊？',low:'0冊',high:'10冊以上'},
  {q:'旅行するなら国内？海外？',low:'近場の国内',high:'地球の裏側'},
  {q:'給食のメニューで一番テンションが上がったのは？',low:'まあまあ',high:'最高に嬉しい'},
  {q:'虫の苦手度は？',low:'平気',high:'見ただけで叫ぶ'},
];

const STORAGE_KEY = 'airreading_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉','✨','⭐','🌟','💫','🎯'];
const COLORS = ['#ec4899','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#6366f1','#14b8a6','#d97706','#e11d48','#7c3aed','#0d9488','#f97316','#84cc16','#f43f5e'];

let players=[],scores={},logs=[],round=0,usedTopics=[];
let currentTopic=null,answers={},inputOrder=[],inputIndex=0;

const $=id=>document.getElementById(id);
const $setupPhase=$('setupPhase'),$inputPhase=$('inputPhase'),$resultPhase=$('resultPhase');
const $scoreboard=$('scoreboard'),$scoreRows=$('scoreRows'),$answerLog=$('answerLog'),$logEntries=$('logEntries'),$playerList=$('playerList');

function showToast(m,d=2000){const e=$('toast');e.textContent=m;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),d);}
function emitParticles(x,y){const c=$('particles');for(let i=0;i<8;i++){const p=document.createElement('span');p.className='particle';p.textContent=PARTICLE_EMOJIS[Math.floor(Math.random()*PARTICLE_EMOJIS.length)];const a=(Math.PI*2*i)/8+(Math.random()-.5)*.5,d=60+Math.random()*80;p.style.left=x+'px';p.style.top=y+'px';p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.3)`,opacity:0}],{duration:800,easing:'ease-out',fill:'forwards'});c.appendChild(p);setTimeout(()=>p.remove(),900);}}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}

function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({players,scores,logs,round,usedTopics}));}catch(e){}}
function loadState(){try{const r=localStorage.getItem(STORAGE_KEY);if(r){const s=JSON.parse(r);if(s.players)players=s.players;if(s.scores)scores=s.scores;if(s.logs)logs=s.logs;if(s.round)round=s.round;if(s.usedTopics)usedTopics=s.usedTopics;}if(players.length===0){const sh=localStorage.getItem(SHARED_PLAYERS_KEY);if(sh){const sp=JSON.parse(sh);if(Array.isArray(sp)&&sp.length>0){players=sp;for(const p of players)scores[p]=scores[p]||0;}}}}catch(e){}}
function saveSharedPlayers(){try{localStorage.setItem(SHARED_PLAYERS_KEY,JSON.stringify(players));}catch(e){}}

function addPlayer(){const i=$('playerNameInput');const n=i.value.trim();if(!n||players.includes(n)){i.value='';return;}players.push(n);scores[n]=scores[n]||0;i.value='';renderPlayers();renderScoreboard();saveState();saveSharedPlayers();}
function removePlayer(n){players=players.filter(p=>p!==n);delete scores[n];renderPlayers();renderScoreboard();saveState();saveSharedPlayers();}
function renderPlayers(){renderSessionPlayerBar('playerList',players,scores,function(active){renderScoreboard();});}

function showPhase(id){[$setupPhase,$inputPhase,$resultPhase].forEach(e=>e.style.display='none');$(id).style.display='';}

function startGame(){
  syncActivePlayers(players,scores);
  if(getActivePlayers(players).length<3){showToast('プレイヤーを3人以上登録してください');return;}
  beginRound();
}

function beginRound(){
  round++;answers={};
  // Pick topic
  let pool=TOPICS.filter(t=>!usedTopics.includes(t.q));
  if(pool.length===0){usedTopics=[];pool=[...TOPICS];}
  currentTopic=pool[Math.floor(Math.random()*pool.length)];
  usedTopics.push(currentTopic.q);

  inputOrder=[...getActivePlayers(players)].sort(()=>Math.random()-.5);
  inputIndex=0;

  showPhase('inputPhase');
  $('topicDisplay').textContent=currentTopic.q;
  $('labelLow').textContent=currentTopic.low;
  $('labelHigh').textContent=currentTopic.high;
  updateInputUI();
  renderScoreboard();renderLog();saveState();
}

function updateInputUI(){
  const p=inputOrder[inputIndex];
  showBlindScreen('スマホを渡してください', p + ' の番', function() {
    $('inputPlayer').textContent=`${p} の番`;
    $('slider').value=50;
    $('sliderValue').textContent='50';
    $('inputDots').innerHTML=inputOrder.map((_,i)=>{
      const cls=i<inputIndex?'done':i===inputIndex?'current':'';
      return `<div class="confirm-dot ${cls}"></div>`;
    }).join('');
  });
}

function updateSlider(){
  $('sliderValue').textContent=$('slider').value;
}

function submitValue(){
  const p=inputOrder[inputIndex];
  answers[p]=parseInt($('slider').value);
  inputIndex++;
  if(inputIndex>=inputOrder.length){
    showResult();
  } else {
    updateInputUI();
  }
}

function showResult(){
  showPhase('resultPhase');
  $('resultTopic').textContent=currentTopic.q;

  // Calculate average
  const vals=Object.values(answers);
  const avg=Math.round(vals.reduce((s,v)=>s+v,0)/vals.length);

  // Find closest to average
  let minDist=Infinity,winner=null;
  for(const [name,val] of Object.entries(answers)){
    const dist=Math.abs(val-avg);
    if(dist<minDist){minDist=dist;winner=name;}
  }

  // Award points
  scores[winner]=(scores[winner]||0)+3;
  // 2nd closest gets 1pt
  let secondDist=Infinity,second=null;
  for(const [name,val] of Object.entries(answers)){
    if(name===winner)continue;
    const dist=Math.abs(val-avg);
    if(dist<secondDist){secondDist=dist;second=name;}
  }
  if(second)scores[second]=(scores[second]||0)+1;

  // Render result bar
  const bar=$('resultBar');
  let html=`<div class="median-line" style="left:${avg}%"></div>`;
  html+=`<div class="median-label" style="left:${avg}%">平均値: ${avg}</div>`;

  const sorted=Object.entries(answers).sort((a,b)=>a[1]-b[1]);
  sorted.forEach(([name,val],i)=>{
    const color=COLORS[players.indexOf(name)%COLORS.length];
    const isWinner=name===winner;
    html+=`<div class="result-marker" style="left:${val}%">
      <div class="marker-dot" style="background:${color};${isWinner?'width:18px;height:18px;':''}"></div>
      <div class="marker-name">${isWinner?'👑':''}${esc(name)}</div>
      <div class="marker-value">${val}</div>
    </div>`;
  });
  bar.innerHTML=html;

  // Find most extreme
  let maxDist=0,extreme=null;
  for(const [name,val] of Object.entries(answers)){
    const dist=Math.abs(val-avg);
    if(dist>maxDist){maxDist=dist;extreme=name;}
  }

  $('resultIcon').textContent='🎯';
  $('resultTitle').textContent=`${winner} が空気読み名人！(+3pt)`;
  let details=`平均値: <strong>${avg}</strong><br>`;
  sorted.forEach(([name,val])=>{
    const dist=Math.abs(val-avg);
    const tag=name===winner?' 👑':name===extreme?' 😱':'';
    details+=`${esc(name)}: ${val} (差${Math.round(dist)})${tag}<br>`;
  });
  if(extreme&&extreme!==winner)details+=`<br>${esc(extreme)} が一番外れてた！`;
  $('resultDetails').innerHTML=details;

  if(winner){
    const rect=$('resultTitle').getBoundingClientRect();
    emitParticles(rect.left+rect.width/2,rect.top+rect.height/2);
  }

  logs.unshift({timestamp:new Date().toISOString(),round,topic:currentTopic.q,winner,avg});
  savePlayLog('air-reading', 1, 1);
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
  $logEntries.innerHTML=logs.slice(0,8).map(l=>
    `<div class="log-entry"><span>R${l.round}「${esc(l.topic).slice(0,15)}…」</span><span>👑${esc(l.winner)}</span></div>`
  ).join('');
}
function clearAllLogs(){showToast('リセットしました');logs=[];round=0;usedTopics=[];for(const p of players)scores[p]=0;renderScoreboard();renderLog();saveState();}

(function init(){loadState();initSessionPlayers(players,scores);renderPlayers();renderScoreboard();renderLog();})();
