/* ===== Initial Battle (頭文字バトルロイヤル) ===== */

const INITIALS = ['あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ','た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ','ま','み','む','め','も','や','ゆ','よ','ら','り','る','れ','ろ','わ'];
const CATEGORIES = [
  '食べ物','動物','国の名前','スポーツ','職業','乗り物','果物','野菜',
  '魚・海の生き物','鳥','虫','花','木','色が入るもの','丸いもの',
  '夏に関係するもの','冬に関係するもの','学校にあるもの','台所にあるもの',
  '有名人・キャラクター','映画・ドラマ','音楽に関係するもの','お店の種類',
  '体の部位','飲み物','お菓子','料理名','都道府県','世界の都市',
  '3文字の言葉','4文字の言葉','カタカナの言葉',
];

const STORAGE_KEY = 'initialbattle_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉','✨','⭐','🌟','💫','⚡'];

let players=[],scores={},logs=[],round=0;
let currentInitial='',currentCategory='';
let answers={},inputOrder=[],inputIndex=0;
let inputTimer=null;

const $=id=>document.getElementById(id);
const $setupPhase=$('setupPhase'),$inputPhase=$('inputPhase'),$revealPhase=$('revealPhase');
const $scoreboard=$('scoreboard'),$scoreRows=$('scoreRows'),$answerLog=$('answerLog'),$logEntries=$('logEntries'),$playerList=$('playerList');

function showToast(m,d=2000){const e=$('toast');e.textContent=m;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),d);}
function emitParticles(x,y){const c=$('particles');for(let i=0;i<8;i++){const p=document.createElement('span');p.className='particle';p.textContent=PARTICLE_EMOJIS[Math.floor(Math.random()*PARTICLE_EMOJIS.length)];const a=(Math.PI*2*i)/8+(Math.random()-.5)*.5,d=60+Math.random()*80;p.style.left=x+'px';p.style.top=y+'px';p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.3)`,opacity:0}],{duration:800,easing:'ease-out',fill:'forwards'});c.appendChild(p);setTimeout(()=>p.remove(),900);}}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}

function normalize(s){return s.toLowerCase().replace(/[\s・\-ー。、！？!?]/g,'').replace(/[\u30A1-\u30F6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));}

function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({players,scores,logs,round}));}catch(e){}}
function loadState(){try{const r=localStorage.getItem(STORAGE_KEY);if(r){const s=JSON.parse(r);if(s.players)players=s.players;if(s.scores)scores=s.scores;if(s.logs)logs=s.logs;if(s.round)round=s.round;}if(players.length===0){const sh=localStorage.getItem(SHARED_PLAYERS_KEY);if(sh){const sp=JSON.parse(sh);if(Array.isArray(sp)&&sp.length>0){players=sp;for(const p of players)scores[p]=scores[p]||0;}}}}catch(e){}}
function saveSharedPlayers(){try{localStorage.setItem(SHARED_PLAYERS_KEY,JSON.stringify(players));}catch(e){}}

function addPlayer(){const i=$('playerNameInput');const n=i.value.trim();if(!n||players.includes(n)){i.value='';return;}players.push(n);scores[n]=scores[n]||0;i.value='';renderPlayers();renderScoreboard();saveState();saveSharedPlayers();}
function removePlayer(n){players=players.filter(p=>p!==n);delete scores[n];renderPlayers();renderScoreboard();saveState();saveSharedPlayers();}
function renderPlayers(){renderSessionPlayerBar('playerList',players,scores,function(active){renderScoreboard();});}

function showPhase(id){[$setupPhase,$inputPhase,$revealPhase].forEach(e=>e.style.display='none');$(id).style.display='';}

function startGame(){
  if(players.length<2){showToast('プレイヤーを2人以上登録してください');return;}
  beginRound();
}

function beginRound(){
  round++;answers={};
  currentInitial=INITIALS[Math.floor(Math.random()*INITIALS.length)];
  currentCategory=CATEGORIES[Math.floor(Math.random()*CATEGORIES.length)];

  inputOrder=[...players].sort(()=>Math.random()-.5);
  inputIndex=0;

  showPhase('inputPhase');
  $('roundCounter').textContent=`ラウンド ${round}`;
  $('battleInitial').textContent=`「${currentInitial}」`;
  $('battleCategory').textContent=`× ${currentCategory}`;
  updateInputUI();
  renderScoreboard();renderLog();saveState();
}

function updateInputUI(){
  const p=inputOrder[inputIndex];
  clearInterval(inputTimer);
  showBlindScreen('スマホを渡してください', p + ' の番', function() {
    $('inputPlayer').textContent=`${p} の番`;
    $('answerInput').value='';
    $('answerInput').focus();
    $('inputDots').innerHTML=inputOrder.map((_,i)=>{
      const cls=i<inputIndex?'done':i===inputIndex?'current':'';
      return `<div class="confirm-dot ${cls}"></div>`;
    }).join('');
    startInputTimer();
  });
}

function startInputTimer(){
  let timeLeft=30;
  clearInterval(inputTimer);
  let timerEl=$('inputTimer');
  if(!timerEl){
    timerEl=document.createElement('div');
    timerEl.id='inputTimer';
    timerEl.style.cssText='text-align:center;font-size:1.5rem;font-weight:bold;margin:0.5rem 0;';
    const inputArea=$('answerInput').parentElement;
    inputArea.insertBefore(timerEl,inputArea.firstChild);
  }
  timerEl.textContent='残り '+timeLeft+'秒';
  timerEl.style.color='';
  inputTimer=setInterval(function(){
    timeLeft--;
    if(timeLeft<=0){
      clearInterval(inputTimer);
      timerEl.textContent='時間切れ！';
      // Auto-submit with empty answer
      const p=inputOrder[inputIndex];
      answers[p]='';
      inputIndex++;
      if(inputIndex>=inputOrder.length){
        showReveal();
      } else {
        updateInputUI();
      }
      return;
    }
    timerEl.textContent='残り '+timeLeft+'秒';
    if(timeLeft<=10) timerEl.style.color='#ef4444';
  },1000);
}

function submitAnswer(){
  clearInterval(inputTimer);
  const input=$('answerInput').value.trim();
  if(!input){showToast('答えを入力してください');return;}
  const p=inputOrder[inputIndex];
  answers[p]=input;
  inputIndex++;
  if(inputIndex>=inputOrder.length){
    showReveal();
  } else {
    updateInputUI();
  }
}

function showReveal(){
  showPhase('revealPhase');
  $('revealRound').textContent=`ラウンド ${round}`;
  $('revealInitial').textContent=`「${currentInitial}」`;
  $('revealCategory').textContent=`× ${currentCategory}`;

  // Count duplicates (normalized comparison)
  const normMap={};
  for(const [name,ans] of Object.entries(answers)){
    const n=normalize(ans);
    if(!normMap[n])normMap[n]=[];
    normMap[n].push(name);
  }

  // Build reveal list
  let uniqueCount=0;
  const entries=Object.entries(answers);
  // Sort: unique first, then duplicates
  entries.sort((a,b)=>{
    const aUnique=normMap[normalize(a[1])].length===1;
    const bUnique=normMap[normalize(b[1])].length===1;
    if(aUnique&&!bUnique)return -1;
    if(!aUnique&&bUnique)return 1;
    return 0;
  });

  let html='';
  for(const [name,ans] of entries){
    const n=normalize(ans);
    const isUnique=normMap[n].length===1;
    if(isUnique){
      scores[name]=(scores[name]||0)+1;
      uniqueCount++;
    }
    const cls=isUnique?'unique':'duplicate';
    const ptsText=isUnique?'+1pt':'0pt (被り！)';
    const dupeNames=isUnique?'':`← ${normMap[n].filter(x=>x!==name).map(x=>esc(x)).join(',')}と被り`;
    html+=`<div class="reveal-item ${cls}">
      <span>${esc(name)}: 「${esc(ans)}」</span>
      <span class="pts">${ptsText} ${dupeNames}</span>
    </div>`;
  }
  $('revealList').innerHTML=html;

  const allDupe=uniqueCount===0;
  $('resultIcon').textContent=allDupe?'💥':'⚡';

  if(!allDupe){
    const rect=$('resultIcon').getBoundingClientRect();
    emitParticles(rect.left+rect.width/2,rect.top+rect.height/2);
  }

  logs.unshift({timestamp:new Date().toISOString(),round,initial:currentInitial,category:currentCategory,unique:uniqueCount,total:players.length});
  savePlayLog('initial-battle', uniqueCount, entries.length);
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
    `<div class="log-entry"><span>R${l.round}「${l.initial}」${esc(l.category)}</span><span>${l.unique}/${l.total}ユニーク</span></div>`
  ).join('');
}
function clearAllLogs(){showToast('リセットしました');logs=[];round=0;for(const p of players)scores[p]=0;renderScoreboard();renderLog();saveState();}

(function init(){loadState();initSessionPlayers(players,scores);renderPlayers();renderScoreboard();renderLog();})();
