/* ===== Number Auction (ナンバーオークション) ===== */

const STORAGE_KEY = 'numberauction_state';
const PARTICLE_EMOJIS = ['🎉','✨','⭐','🌟','💫','🏷️','💰'];
const ROUNDS = 5;
const EXPR_SHOW_TIME = 3; // seconds to show expression
const BID_TIME = 10;      // seconds to bid

let players=[],scores={},logs=[],round=0,totalRounds=ROUNDS;
let difficulty='easy';
let currentExpr=null,currentAnswer=0;
let bids={},bidOrder=[],bidIndex=0,bidTimerInterval=null;

const $=id=>document.getElementById(id);
const $setupPhase=$('setupPhase'),$exprPhase=$('exprPhase'),$bidPhase=$('bidPhase'),$resultPhase=$('resultPhase');
const $scoreboard=$('scoreboard'),$scoreRows=$('scoreRows'),$answerLog=$('answerLog'),$logEntries=$('logEntries');

function showToast(m,d=2000){const e=$('toast');e.textContent=m;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),d);}
function emitParticles(x,y){const c=$('particles');for(let i=0;i<8;i++){const p=document.createElement('span');p.className='particle';p.textContent=PARTICLE_EMOJIS[Math.floor(Math.random()*PARTICLE_EMOJIS.length)];const a=(Math.PI*2*i)/8+(Math.random()-.5)*.5,d=60+Math.random()*80;p.style.left=x+'px';p.style.top=y+'px';p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.3)`,opacity:0}],{duration:800,easing:'ease-out',fill:'forwards'});c.appendChild(p);setTimeout(()=>p.remove(),900);}}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}

let audioCtx=null;
function playBeep(f,d){try{if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.frequency.value=f;o.type='sine';g.gain.value=.2;o.start();g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+d/1000);o.stop(audioCtx.currentTime+d/1000+.05);}catch(e){}}

function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({players,scores,logs,round,difficulty}));}catch(e){}}
function loadState(){try{const r=localStorage.getItem(STORAGE_KEY);if(r){const s=JSON.parse(r);if(s.players)players=s.players;if(s.scores)scores=s.scores;if(s.logs)logs=s.logs;if(s.round)round=s.round;if(s.difficulty)difficulty=s.difficulty;}}catch(e){}}

function renderPlayers(){renderSessionPlayerBar('playerList',players,scores,function(){renderScoreboard();});}
function selectOption(t,b){b.parentElement.querySelectorAll('.option-pill').forEach(p=>p.classList.remove('selected'));b.classList.add('selected');if(t==='diff')difficulty=b.dataset.value;}
function showPhase(id){[$setupPhase,$exprPhase,$bidPhase,$resultPhase].forEach(e=>e.style.display='none');$(id).style.display='';}

// --- Problem Generation ---
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}

function generateProblem(){
  let expr,answer;
  if(difficulty==='easy'){
    const type=randInt(0,2);
    if(type===0){ // addition 2-3 numbers
      const nums=[randInt(3,20),randInt(3,20),randInt(2,15)];
      expr=nums.join(' + ');answer=nums.reduce((a,b)=>a+b,0);
    }else if(type===1){ // simple multiply
      const a=randInt(3,9),b=randInt(3,9);
      expr=`${a} × ${b}`;answer=a*b;
    }else{ // subtraction
      const a=randInt(30,80),b=randInt(5,a-5);
      expr=`${a} − ${b}`;answer=a-b;
    }
  }else if(difficulty==='normal'){
    const type=randInt(0,3);
    if(type===0){ // addition 3-4 numbers
      const nums=[randInt(10,99),randInt(10,99),randInt(10,50)];
      expr=nums.join(' + ');answer=nums.reduce((a,b)=>a+b,0);
    }else if(type===1){ // 2digit x 1digit
      const a=randInt(11,30),b=randInt(4,9);
      expr=`${a} × ${b}`;answer=a*b;
    }else if(type===2){ // mixed
      const a=randInt(20,80),b=randInt(10,40),c=randInt(5,20);
      expr=`${a} + ${b} − ${c}`;answer=a+b-c;
    }else{ // large addition
      const nums=[randInt(100,500),randInt(100,500)];
      expr=nums.join(' + ');answer=nums.reduce((a,b)=>a+b,0);
    }
  }else{ // hard
    const type=randInt(0,3);
    if(type===0){ // 2digit x 2digit
      const a=randInt(12,35),b=randInt(12,35);
      expr=`${a} × ${b}`;answer=a*b;
    }else if(type===1){ // big addition
      const nums=[randInt(100,999),randInt(100,999),randInt(50,300)];
      expr=nums.join(' + ');answer=nums.reduce((a,b)=>a+b,0);
    }else if(type===2){ // mixed operations
      const a=randInt(15,40),b=randInt(5,15),c=randInt(10,30);
      expr=`${a} × ${b} + ${c}`;answer=a*b+c;
    }else{ // division
      const b=randInt(3,12),answer2=randInt(10,50);
      const a=b*answer2;
      expr=`${a} ÷ ${b}`;answer=answer2;
    }
  }
  return {expr,answer};
}

// --- Game Flow ---
function startGame(){
  syncActivePlayers(players,scores);
  const active=getActivePlayers(players);
  if(active.length<1){showToast('プレイヤーを1人以上登録してください');return;}
  round=0;
  for(const p of active)scores[p]=scores[p]||0;
  beginRound();
}

function beginRound(){
  round++;
  if(round>totalRounds){endGame();return;}
  bids={};
  const prob=generateProblem();
  currentExpr=prob.expr;currentAnswer=prob.answer;

  // Show expression for 3 seconds
  showPhase('exprPhase');
  $('exprRound').textContent=`ラウンド ${round} / ${totalRounds}`;
  $('exprDisplay').textContent=currentExpr+' = ?';
  $('exprDisplay').classList.remove('hidden');

  let timeLeft=EXPR_SHOW_TIME;
  $('exprTimer').textContent=`${timeLeft}秒`;
  const timer=setInterval(()=>{
    timeLeft--;
    $('exprTimer').textContent=`${timeLeft}秒`;
    if(timeLeft<=1)playBeep(800,100);
    if(timeLeft<=0){
      clearInterval(timer);
      $('exprDisplay').textContent='？？？';
      $('exprDisplay').classList.add('hidden');
      playBeep(400,200);
      setTimeout(()=>startBidPhase(),500);
    }
  },1000);
}

function startBidPhase(){
  const active=getActivePlayers(players);
  bidOrder=[...active].sort(()=>Math.random()-.5);
  bidIndex=0;
  showPhase('bidPhase');
  $('bidRound').textContent=`ラウンド ${round} / ${totalRounds}`;
  showBidUI();
}

function showBidUI(){
  if(bidIndex>=bidOrder.length){showResult();return;}
  const p=bidOrder[bidIndex];
  showBlindScreen('スマホを渡してください',p+' の入札',function(){
    $('bidPlayer').textContent=p+' の番 — 答えを予想！';
    $('bidInput').value='';
    $('bidInput').focus();
    startBidTimer();
  });
}

function startBidTimer(){
  let timeLeft=BID_TIME;
  clearInterval(bidTimerInterval);
  $('bidTimer').textContent=`残り ${timeLeft}秒`;
  $('bidTimer').style.color='var(--text-muted)';
  bidTimerInterval=setInterval(()=>{
    timeLeft--;
    $('bidTimer').textContent=`残り ${timeLeft}秒`;
    if(timeLeft<=3){$('bidTimer').style.color='var(--primary)';playBeep(1000,80);}
    if(timeLeft<=0){clearInterval(bidTimerInterval);autoSubmitBid();}
  },1000);
}

function autoSubmitBid(){
  const p=bidOrder[bidIndex];
  const val=parseInt($('bidInput').value)||0;
  bids[p]=val;
  bidIndex++;
  showBidUI();
}

function submitBid(){
  clearInterval(bidTimerInterval);
  const p=bidOrder[bidIndex];
  const val=parseInt($('bidInput').value);
  if(isNaN(val)){showToast('数字を入力してください');return;}
  bids[p]=val;
  bidIndex++;
  showBidUI();
}

function showResult(){
  showPhase('resultPhase');
  $('resultRound').textContent=`ラウンド ${round} / ${totalRounds}`;
  $('resultAnswer').textContent=currentAnswer;

  // Find winner: highest bid that is <= answer
  const active=getActivePlayers(players);
  let winner=null,winnerBid=-Infinity;
  const entries=active.map(p=>({name:p,bid:bids[p]||0,over:bids[p]>currentAnswer}));

  for(const e of entries){
    if(!e.over && e.bid>winnerBid){winnerBid=e.bid;winner=e.name;}
  }

  // Score
  if(winner){
    const isPerfect=winnerBid===currentAnswer;
    const pts=isPerfect?10:5;
    scores[winner]=(scores[winner]||0)+pts;
    savePlayLog('number-auction',isPerfect?10:5,10);
  }

  // Result bar visualization
  const maxVal=Math.max(currentAnswer*1.3,...entries.map(e=>e.bid));
  const bar=$('resultBar');
  const answerPct=(currentAnswer/maxVal)*100;
  let barHtml=`<div class="answer-line" style="left:${answerPct}%"></div>`;
  barHtml+=`<div class="answer-label" style="left:${answerPct}%">正解 ${currentAnswer}</div>`;

  const colors=['#0ea5e9','#8b5cf6','#ec4899','#10b981','#f59e0b','#ef4444','#6366f1'];
  entries.forEach((e,i)=>{
    const pct=Math.min((e.bid/maxVal)*100,100);
    const color=colors[i%colors.length];
    const isWinner=e.name===winner;
    barHtml+=`<div class="result-marker" style="left:${pct}%">
      <div class="dot ${e.over?'over':''}" style="background:${color};${isWinner?'width:18px;height:18px;':''}"></div>
      <div class="name">${isWinner?'👑':''}${esc(e.name)}</div>
      <div class="val">${e.bid}${e.over?' <span class="over-tag">OVER!</span>':''}</div>
    </div>`;
  });
  bar.innerHTML=barHtml;

  // Details
  let details='';
  entries.sort((a,b)=>{
    if(a.over&&!b.over)return 1;if(!a.over&&b.over)return -1;
    return Math.abs(a.bid-currentAnswer)-Math.abs(b.bid-currentAnswer);
  });
  entries.forEach(e=>{
    const diff=e.bid-currentAnswer;
    const tag=e.name===winner?(e.bid===currentAnswer?'🎯 ピッタリ! +10pt':'👑 +5pt'):(e.over?'💥 オーバー!':'');
    details+=`<strong>${esc(e.name)}</strong>: ${e.bid} (差${diff>=0?'+':''}${diff}) ${tag}<br>`;
  });
  $('resultDetails').innerHTML=details;

  if(winner){
    const rect=$('resultAnswer').getBoundingClientRect();
    emitParticles(rect.left+rect.width/2,rect.top+rect.height/2);
  }

  logs.unshift({timestamp:new Date().toISOString(),round,expr:currentExpr,answer:currentAnswer,winner,bids:{...bids}});
  $('nextBtn').textContent=round>=totalRounds?'結果を見る →':'次の問題 →';
  renderScoreboard();saveState();
}

function nextRound(){
  if(round>=totalRounds){endGame();}
  else{beginRound();}
}

function endGame(){
  showPhase('resultPhase');
  $('resultRound').textContent='最終結果';
  $('resultAnswer').textContent='';
  $('resultBar').innerHTML='';

  const active=getActivePlayers(players);
  const sorted=[...active].sort((a,b)=>(scores[b]||0)-(scores[a]||0));
  let details=sorted.map((p,i)=>{
    const medal=i===0?'👑':'';
    return `${medal}<strong>${esc(p)}</strong>: ${scores[p]||0}pt`;
  }).join('<br>');
  details+=renderBestBadge('number-auction',scores[sorted[0]]||0);
  details+=renderGameRecommendation('number-auction');
  $('resultDetails').innerHTML=details;
  $('nextBtn').textContent='もう1回！';
  $('nextBtn').onclick=()=>{showPhase('setupPhase');};

  if(sorted[0]){const rect=$('resultRound').getBoundingClientRect();emitParticles(rect.left+rect.width/2,rect.top+rect.height/2);}
  renderScoreboard();renderLog();saveState();
}

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
    `<div class="log-entry"><span>R${l.round} ${esc(l.expr)}=${l.answer}</span><span>${l.winner?'👑'+esc(l.winner):'—'}</span></div>`
  ).join('');
}
function clearAllLogs(){showToast('リセットしました');logs=[];round=0;for(const p of players)scores[p]=0;renderScoreboard();renderLog();saveState();}

(function init(){loadState();initSessionPlayers(players,scores);renderPlayers();renderScoreboard();renderLog();
  document.querySelectorAll('#diffPills .option-pill').forEach(b=>b.classList.toggle('selected',b.dataset.value===difficulty));
})();
