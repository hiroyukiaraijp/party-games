/* ===== Lab Panic (ラボパニック) ===== */

const STORAGE_KEY = 'labpanic_state';
const PARTICLE_EMOJIS = ['🧪','🔬','⚗️','💡','🌟','✨','🎉'];
const ROUNDS = 5;
const PREDICT_TIME = 15;

let players=[],scores={},logs=[],round=0,totalRounds=ROUNDS;
let category='mix';
let currentQ=null;
let predictions={},predictOrder=[],predictIndex=0,predictTimerInterval=null;
let selectedChoice=null;

const $=id=>document.getElementById(id);
const $setupPhase=$('setupPhase'),$experimentPhase=$('experimentPhase'),$predictPhase=$('predictPhase'),$resultPhase=$('resultPhase');
const $scoreboard=$('scoreboard'),$scoreRows=$('scoreRows'),$answerLog=$('answerLog'),$logEntries=$('logEntries');

function showToast(m,d=2000){const e=$('toast');e.textContent=m;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),d);}
function emitParticles(x,y){const c=$('particles');for(let i=0;i<8;i++){const p=document.createElement('span');p.className='particle';p.textContent=PARTICLE_EMOJIS[Math.floor(Math.random()*PARTICLE_EMOJIS.length)];const a=(Math.PI*2*i)/8+(Math.random()-.5)*.5,d=60+Math.random()*80;p.style.left=x+'px';p.style.top=y+'px';p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.3)`,opacity:0}],{duration:800,easing:'ease-out',fill:'forwards'});c.appendChild(p);setTimeout(()=>p.remove(),900);}}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}

let audioCtx=null;
function playBeep(f,d){try{if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.frequency.value=f;o.type='sine';g.gain.value=.2;o.start();g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+d/1000);o.stop(audioCtx.currentTime+d/1000+.05);}catch(e){}}

function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({players,scores,logs,round,category}));}catch(e){}}
function loadState(){try{const r=localStorage.getItem(STORAGE_KEY);if(r){const s=JSON.parse(r);if(s.players)players=s.players;if(s.scores)scores=s.scores;if(s.logs)logs=s.logs;if(s.round)round=s.round;if(s.category)category=s.category;}}catch(e){}}

function renderPlayers(){renderSessionPlayerBar('playerList',players,scores,function(){renderScoreboard();});}
function selectOption(t,b){b.parentElement.querySelectorAll('.option-pill').forEach(p=>p.classList.remove('selected'));b.classList.add('selected');if(t==='cat')category=b.dataset.value;}
function showPhase(id){[$setupPhase,$experimentPhase,$predictPhase,$resultPhase].forEach(e=>e.style.display='none');$(id).style.display='';}

// ===== Question Bank (40+ questions across 5 categories) =====
const QUESTIONS = [
  // --- density (重さ・密度) ---
  {d:'easy',cat:'density',q:'りんご・卵・コルク。水に浮くのはどれ？',type:'choice',choices:['りんご','卵','コルク','りんごとコルク'],answer:3,explain:'りんご(密度約0.9)とコルク(密度約0.2)は水より軽いので浮きます。卵(密度約1.03)は水より少し重いので沈みます。'},
  {d:'easy',cat:'density',q:'鉄1kgと綿1kg、重いのはどっち？',type:'choice',choices:['鉄','綿','同じ'],answer:2,explain:'どちらも1kgなので同じ重さです！見た目の大きさに惑わされがちですが、質量は同じです。'},
  {d:'easy',cat:'density',q:'氷は水に浮く？沈む？',type:'choice',choices:['浮く','沈む','ちょうど真ん中'],answer:0,explain:'氷の密度は約0.92で水(1.0)より軽いため浮きます。だからこそ湖は表面から凍り、魚は冬も生きられます。'},
  {d:'normal',cat:'density',q:'油・水・はちみつをコップに入れると、真ん中に来るのは？',type:'choice',choices:['油','水','はちみつ'],answer:1,explain:'密度の順は はちみつ(約1.4) > 水(1.0) > 油(約0.9)。水が真ん中の層になります。'},
  {d:'normal',cat:'density',q:'金(ゴールド)の密度は水の約何倍？',type:'slider',min:2,max:30,unit:'倍',answer:19,explain:'金の密度は約19.3g/cm3。水の約19倍もの重さがあります。非常に重い金属です。'},
  {d:'hard',cat:'density',q:'地球全体の平均密度は水の約何倍？',type:'slider',min:1,max:15,unit:'倍',answer:5,explain:'地球の平均密度は約5.5g/cm3。中心部の鉄の核がとても重いため、岩石だけの場合より高くなります。'},
  {d:'easy',cat:'density',q:'風船にヘリウムを入れると浮くのはなぜ？',type:'choice',choices:['ヘリウムが空気より軽い','風船が魔法','熱で浮く'],answer:0,explain:'ヘリウムの密度は空気の約7分の1。軽いので浮力で上に持ち上げられます。'},
  {d:'normal',cat:'density',q:'鉄の船が浮くのはなぜ？',type:'choice',choices:['鉄が軽いから','船全体の密度が水より小さいから','エンジンの力で浮く'],answer:1,explain:'船は中が空洞なので、鉄+空気を合わせた全体の密度が水より小さくなります。これがアルキメデスの原理です。'},

  // --- speed (速さ) ---
  {d:'easy',cat:'speed',q:'カタツムリとアリ、速いのはどっち？',type:'choice',choices:['カタツムリ','アリ','同じくらい'],answer:1,explain:'アリは時速1.6〜3.2km、カタツムリは時速0.05km程度。アリの方が約50倍速いです！'},
  {d:'easy',cat:'speed',q:'新幹線と音、速いのはどっち？',type:'choice',choices:['新幹線','音','同じくらい'],answer:1,explain:'音速は時速約1,225km。新幹線(N700S)の最高時速は約300km。音は新幹線の約4倍速いです。'},
  {d:'normal',cat:'speed',q:'チーターの最高時速は約何km？',type:'slider',min:50,max:180,unit:'km/h',answer:110,explain:'チーターの最高速度は時速約110km。ただし全力疾走は数百メートルしか持ちません。'},
  {d:'normal',cat:'speed',q:'ウサイン・ボルトの最高時速は約何km？',type:'slider',min:20,max:60,unit:'km/h',answer:45,explain:'ボルトの100m世界記録(9.58秒)時の最高瞬間速度は約44.72km/h。自転車くらいの速さです。'},
  {d:'easy',cat:'speed',q:'光と音、速いのはどっち？',type:'choice',choices:['光','音','同じ'],answer:0,explain:'光は秒速約30万km、音は秒速約340m。光は音の約88万倍速い！雷が光ってから音が遅れるのはこのためです。'},
  {d:'hard',cat:'speed',q:'光の速さは秒速約何万km？',type:'number',min:1,max:100,unit:'万km',answer:30,explain:'光速は秒速約299,792km(約30万km)。1秒で地球を7周半できます。'},
  {d:'normal',cat:'speed',q:'台風の風速が「猛烈」と呼ばれるのは秒速何m以上？',type:'slider',min:30,max:80,unit:'m/s',answer:54,explain:'気象庁の分類で秒速54m/s(時速約194km)以上が「猛烈な台風」。新幹線並みの暴風です。'},
  {d:'hard',cat:'speed',q:'国際宇宙ステーション(ISS)の速度は時速約何km？',type:'number',min:10000,max:50000,unit:'km/h',answer:28000,explain:'ISSは時速約28,000kmで地球を周回。約90分で地球を1周します。'},

  // --- creatures (生き物) ---
  {d:'easy',cat:'creatures',q:'キリンの首の骨の数は人間と同じ？違う？',type:'choice',choices:['同じ(7個)','キリンの方が多い','キリンの方が少ない'],answer:0,explain:'キリンも人間も首の骨(頸椎)は7個！キリンは1つ1つの骨が約25cmもあるため首が長いのです。'},
  {d:'normal',cat:'creatures',q:'象の心臓は1分間に約何回拍動する？',type:'slider',min:10,max:80,unit:'回',answer:30,explain:'象の心拍数は毎分約25〜35回。体が大きい動物ほど心拍がゆっくりです(ネズミは約600回/分)。'},
  {d:'normal',cat:'creatures',q:'キリンの1日の睡眠時間は約何時間？',type:'slider',min:0,max:12,unit:'時間',answer:2,explain:'キリンの睡眠時間はわずか約1.9時間！野生では天敵から身を守るため、ほとんど眠りません。'},
  {d:'easy',cat:'creatures',q:'タコの心臓はいくつある？',type:'choice',choices:['1つ','2つ','3つ','8つ'],answer:2,explain:'タコには心臓が3つ！メインの心臓1つと、エラに血液を送る補助心臓が2つあります。'},
  {d:'hard',cat:'creatures',q:'シロナガスクジラの体重は約何トン？',type:'number',min:50,max:300,unit:'トン',answer:150,explain:'シロナガスクジラは約150トン。地球史上最大の動物で、舌だけでも象1頭分(約3トン)の重さがあります。'},
  {d:'easy',cat:'creatures',q:'ミツバチが一生で作れるはちみつの量は？',type:'choice',choices:['スプーン1杯','コップ1杯','バケツ1杯'],answer:0,explain:'ミツバチ1匹が一生(約6週間)で作れるはちみつはティースプーン約1/12杯。とても貴重です！'},
  {d:'normal',cat:'creatures',q:'犬の嗅覚は人間の約何倍？',type:'slider',min:100,max:100000,unit:'倍',answer:10000,explain:'犬の嗅覚は人間の約1万〜10万倍。嗅覚受容体が人間の約40倍あり、空港での麻薬探知にも活躍します。'},
  {d:'hard',cat:'creatures',q:'世界最速の鳥ハヤブサの急降下速度は時速約何km？',type:'number',min:100,max:500,unit:'km/h',answer:390,explain:'ハヤブサの急降下(ストゥープ)速度は時速約390km。新幹線より速い、動物界最速の速度です。'},

  // --- space (宇宙) ---
  {d:'easy',cat:'space',q:'月の重力は地球の約何分の1？',type:'choice',choices:['2分の1','4分の1','6分の1','10分の1'],answer:2,explain:'月の重力は地球の約6分の1。体重60kgの人が月に行くと体重計は約10kgを示します。'},
  {d:'normal',cat:'space',q:'太陽の光が地球に届くまで約何分？',type:'slider',min:1,max:30,unit:'分',answer:8,explain:'太陽から地球までの距離は約1.5億km。光速でも約8分19秒かかります。'},
  {d:'hard',cat:'space',q:'地球から月までの距離は約何万km？',type:'number',min:10,max:100,unit:'万km',answer:38,explain:'地球から月までの平均距離は約384,400km(約38万km)。車で休まず走ると約半年かかります。'},
  {d:'easy',cat:'space',q:'太陽系で一番大きい惑星は？',type:'choice',choices:['地球','土星','木星','海王星'],answer:2,explain:'木星は太陽系最大の惑星。直径は地球の約11倍、体積は約1,300倍もあります。'},
  {d:'normal',cat:'space',q:'太陽の表面温度は約何度？',type:'slider',min:1000,max:15000,unit:'度',answer:6000,explain:'太陽の表面温度は約5,500〜6,000度。中心部は約1,500万度にも達します。'},
  {d:'hard',cat:'space',q:'地球の年齢は約何億年？',type:'number',min:10,max:100,unit:'億年',answer:46,explain:'地球は約46億年前に誕生しました。最初の生命は約38億年前に現れたと考えられています。'},
  {d:'easy',cat:'space',q:'宇宙で声は聞こえる？',type:'choice',choices:['聞こえる','聞こえない','少しだけ聞こえる'],answer:1,explain:'宇宙は真空なので音を伝える空気がありません。そのため声や音は一切聞こえません。'},
  {d:'normal',cat:'space',q:'火星の1日の長さは地球とほぼ同じ？',type:'choice',choices:['ほぼ同じ(約24.6時間)','半分(約12時間)','2倍(約48時間)'],answer:0,explain:'火星の1日(1ソル)は約24時間37分。地球とほぼ同じです！ただし1年は約687日あります。'},

  // --- everyday (日常科学) ---
  {d:'easy',cat:'everyday',q:'人間の体は何%が水でできている？',type:'slider',min:20,max:90,unit:'%',answer:60,explain:'成人の体の約60%は水分です。脳は約75%、血液は約83%が水でできています。'},
  {d:'easy',cat:'everyday',q:'シャワー1分間で使う水の量は約何リットル？',type:'slider',min:3,max:30,unit:'リットル',answer:12,explain:'一般的なシャワーは1分間に約10〜12リットルの水を使います。5分のシャワーで約60リットル！'},
  {d:'normal',cat:'everyday',q:'人間が1日に呼吸する回数は約何回？',type:'slider',min:5000,max:50000,unit:'回',answer:20000,explain:'人間は1日に約2万回呼吸します。1分間に約12〜20回×60分×24時間です。'},
  {d:'normal',cat:'everyday',q:'電子レンジは何を振動させて食べ物を温める？',type:'choice',choices:['空気の分子','水の分子','鉄の分子','光の粒子'],answer:1,explain:'電子レンジはマイクロ波で食品中の水分子を振動させ、その摩擦熱で温めます。だから乾いたものは温まりにくいのです。'},
  {d:'easy',cat:'everyday',q:'虹の色は全部で何色？',type:'choice',choices:['5色','6色','7色','無限'],answer:2,explain:'日本では赤・橙・黄・緑・青・藍・紫の7色とされます。実際は連続したグラデーションで、国によって6色や5色とする場合も。'},
  {d:'hard',cat:'everyday',q:'人間の体の骨は全部で何本？',type:'number',min:100,max:400,unit:'本',answer:206,explain:'成人の骨は206本。赤ちゃんは約300本ありますが、成長とともにいくつかが融合して206本になります。'},
  {d:'normal',cat:'everyday',q:'人間の脳の重さは約何g？',type:'slider',min:500,max:3000,unit:'g',answer:1400,explain:'成人の脳の重さは平均約1,300〜1,400g。体重の約2%ですが、エネルギーの約20%を消費します。'},
  {d:'easy',cat:'everyday',q:'お湯が水より早く凍ることがある？(ムペンバ効果)',type:'choice',choices:['ある','ない','温度による'],answer:0,explain:'ムペンバ効果と呼ばれ、条件によっては温かい水が冷たい水より早く凍ることがあります。原因はまだ完全に解明されていません。'},
  {d:'hard',cat:'everyday',q:'音の速さは秒速約何m？(空気中・15度)',type:'number',min:100,max:1000,unit:'m/s',answer:340,explain:'15度の空気中での音速は約340m/s(時速約1,224km)。気温が上がると音速も少し速くなります。'},
  {d:'normal',cat:'everyday',q:'地球上の水のうち、飲める淡水は全体の約何%？',type:'slider',min:0,max:30,unit:'%',answer:3,explain:'地球の水の約97%は海水。淡水は約3%で、さらにその大部分が氷河。利用できる淡水は全体のわずか0.01%です。'},
];

const CAT_LABELS = {density:'重さ・密度',speed:'速さ',creatures:'生き物',space:'宇宙',everyday:'日常科学',mix:'ミックス'};
const CAT_ICONS = {density:'⚖️',speed:'💨',creatures:'🐾',space:'🚀',everyday:'🏠'};

// ===== Game Flow =====
function startGame(){
  syncActivePlayers(players,scores);
  const active=getActivePlayers(players);
  if(active.length<1){showToast('プレイヤーを1人以上登録してください');return;}
  round=0;
  for(const p of active)scores[p]=scores[p]||0;
  beginRound();
}

function getQuestionPool(){
  if(category==='mix') return [...QUESTIONS];
  return QUESTIONS.filter(q=>q.cat===category);
}

let usedQuestions=[];

function pickQuestion(){
  let pool=getQuestionPool().filter(q=>!usedQuestions.includes(q));
  if(pool.length===0){usedQuestions=[];pool=getQuestionPool();}
  const q=pool[Math.floor(Math.random()*pool.length)];
  usedQuestions.push(q);
  return q;
}

function beginRound(){
  round++;
  if(round>totalRounds){endGame();return;}
  predictions={};selectedChoice=null;
  currentQ=pickQuestion();

  // Show experiment
  showPhase('experimentPhase');
  $('expRound').textContent=`実験 ${round} / ${totalRounds}`;
  $('expCategory').textContent=(CAT_ICONS[currentQ.cat]||'🧪')+' '+CAT_LABELS[currentQ.cat];
  $('expQuestion').textContent=currentQ.q;
  renderExpVisual(currentQ);
}

function renderExpVisual(q){
  const v=$('expVisual');
  // Simple visual based on category
  const visuals={
    density:'⚗️',speed:'🏃',creatures:'🐾',space:'🌍',everyday:'💡'
  };
  v.innerHTML=`<div style="font-size:3rem;">${visuals[q.cat]||'🧪'}</div>`;
}

function goToPredict(){
  const active=getActivePlayers(players);
  predictOrder=[...active].sort(()=>Math.random()-.5);
  predictIndex=0;
  showPhase('predictPhase');
  $('predictRound').textContent=`実験 ${round} / ${totalRounds}`;
  showPredictUI();
}

function showPredictUI(){
  if(predictIndex>=predictOrder.length){showResult();return;}
  const p=predictOrder[predictIndex];
  showBlindScreen('スマホを渡してください',p+' の予想',function(){
    $('predictPlayer').textContent=p+' の番 — 予想しよう！';
    $('predictQuestion').textContent=currentQ.q;
    renderPredictInput(currentQ);
    startPredictTimer();
  });
}

function renderPredictInput(q){
  const container=$('predictInput');
  selectedChoice=null;

  if(q.type==='choice'){
    const cols=q.choices.length<=3?'':'';
    let html=`<div class="choice-grid${q.choices.length===3?' cols-3':''}">`;
    q.choices.forEach((c,i)=>{
      html+=`<button class="choice-btn" data-idx="${i}" onclick="selectChoice(this,${i})">${esc(c)}</button>`;
    });
    html+='</div>';
    container.innerHTML=html;
  } else if(q.type==='slider'){
    const mid=Math.round((q.min+q.max)/2);
    container.innerHTML=`
      <div class="slider-area">
        <div class="slider-value" id="sliderVal">${mid}</div>
        <div class="slider-unit">${q.unit||''}</div>
        <input type="range" class="slider-input" id="sliderInput" min="${q.min}" max="${q.max}" value="${mid}" step="${getSliderStep(q.min,q.max)}" oninput="$('sliderVal').textContent=this.value">
      </div>`;
  } else { // number
    container.innerHTML=`
      <div class="slider-area">
        <input type="number" class="number-input" id="numberInput" inputmode="numeric" placeholder="?" onkeydown="if(event.key==='Enter')submitPrediction()">
        <div class="slider-unit">${q.unit||''}</div>
      </div>`;
    setTimeout(()=>{const el=$('numberInput');if(el)el.focus();},100);
  }
}

function getSliderStep(min,max){
  const range=max-min;
  if(range<=20) return 1;
  if(range<=200) return 1;
  if(range<=2000) return 10;
  return 100;
}

function selectChoice(btn,idx){
  document.querySelectorAll('.choice-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedChoice=idx;
}

function startPredictTimer(){
  let timeLeft=PREDICT_TIME;
  clearInterval(predictTimerInterval);
  $('predictTimer').textContent=`残り ${timeLeft}秒`;
  $('predictTimer').style.color='var(--text-muted)';
  predictTimerInterval=setInterval(()=>{
    timeLeft--;
    $('predictTimer').textContent=`残り ${timeLeft}秒`;
    if(timeLeft<=3){$('predictTimer').style.color='var(--primary)';playBeep(1000,80);}
    if(timeLeft<=0){clearInterval(predictTimerInterval);autoSubmitPrediction();}
  },1000);
}

function autoSubmitPrediction(){
  const p=predictOrder[predictIndex];
  predictions[p]=getCurrentPrediction();
  predictIndex++;
  showPredictUI();
}

function getCurrentPrediction(){
  if(currentQ.type==='choice'){
    return selectedChoice!==null?selectedChoice:-1;
  } else if(currentQ.type==='slider'){
    const el=$('sliderInput');
    return el?parseFloat(el.value):0;
  } else {
    const el=$('numberInput');
    return el?parseFloat(el.value)||0:0;
  }
}

function submitPrediction(){
  clearInterval(predictTimerInterval);
  const p=predictOrder[predictIndex];
  const val=getCurrentPrediction();
  if(currentQ.type==='choice' && val===-1){showToast('選択肢を選んでください');return;}
  predictions[p]=val;
  predictIndex++;
  showPredictUI();
}

// ===== Scoring =====
function calcScore(q,prediction){
  if(q.type==='choice'){
    return prediction===q.answer?5:0;
  }
  // slider or number: distance-based scoring
  const answer=q.answer;
  const diff=Math.abs(prediction-answer);
  const pct=answer!==0?diff/Math.abs(answer):diff;
  if(diff===0) return 10;
  if(pct<=0.10) return 7;
  if(pct<=0.25) return 4;
  return 1; // participation
}

function getScoreLabel(pts){
  if(pts===10) return '🎯 ピッタリ! +10pt';
  if(pts===7) return '👏 惜しい! +7pt';
  if(pts===5) return '✅ 正解! +5pt';
  if(pts===4) return '👍 まあまあ! +4pt';
  if(pts===1) return '💪 参加 +1pt';
  return '❌ 残念! +0pt';
}

// ===== Result =====
function showResult(){
  showPhase('resultPhase');
  $('resultRound').textContent=`実験 ${round} / ${totalRounds}`;

  // Answer display
  if(currentQ.type==='choice'){
    $('resultAnswer').textContent=currentQ.choices[currentQ.answer];
  } else {
    $('resultAnswer').textContent=currentQ.answer+(currentQ.unit?' '+currentQ.unit:'');
  }

  // Explanation
  $('explainText').textContent=currentQ.explain;

  const active=getActivePlayers(players);

  // Result bar (for slider/number only)
  const bar=$('resultBar');
  if(currentQ.type==='choice'){
    bar.innerHTML='';
    bar.style.display='none';
  } else {
    bar.style.display='';
    const answer=currentQ.answer;
    const vals=active.map(p=>predictions[p]||0);
    const allVals=[answer,...vals];
    const maxVal=Math.max(...allVals.map(v=>Math.abs(v)))*1.3||1;
    const toPercent=v=>Math.min(Math.max((v/(maxVal*2)+0.5)*100,2),98);

    const answerPct=toPercent(answer);
    let barHtml=`<div class="answer-line" style="left:${answerPct}%"></div>`;
    barHtml+=`<div class="answer-label" style="left:${answerPct}%">正解 ${answer}</div>`;

    const colors=['#10b981','#8b5cf6','#ec4899','#0ea5e9','#f59e0b','#ef4444','#6366f1'];
    active.forEach((p,i)=>{
      const val=predictions[p]||0;
      const pct=toPercent(val);
      const color=colors[i%colors.length];
      const pts=calcScore(currentQ,val);
      barHtml+=`<div class="result-marker" style="left:${pct}%">
        <div class="dot" style="background:${color};${pts>=7?'width:18px;height:18px;':''}"></div>
        <div class="name">${pts>=7?'⭐':''}${esc(p)}</div>
        <div class="val">${val}</div>
      </div>`;
    });
    bar.innerHTML=barHtml;
  }

  // Score each player and build details
  let details='';
  let bestPts=0;
  const entries=active.map(p=>{
    const pred=predictions[p];
    const pts=calcScore(currentQ,pred!=null?pred:-1);
    scores[p]=(scores[p]||0)+pts;
    if(pts>bestPts)bestPts=pts;
    return {name:p,pred,pts};
  });

  entries.sort((a,b)=>b.pts-a.pts);
  entries.forEach(e=>{
    let predLabel;
    if(currentQ.type==='choice'){
      predLabel=e.pred>=0&&e.pred<currentQ.choices.length?currentQ.choices[e.pred]:'未回答';
    } else {
      predLabel=e.pred+(currentQ.unit?' '+currentQ.unit:'');
    }
    details+=`<strong>${esc(e.name)}</strong>: ${esc(predLabel)} ${getScoreLabel(e.pts)}<br>`;
  });
  $('resultDetails').innerHTML=details;

  if(bestPts>=5){
    const rect=$('resultAnswer').getBoundingClientRect();
    emitParticles(rect.left+rect.width/2,rect.top+rect.height/2);
  }

  // Save max possible score for play log
  const maxPossible=currentQ.type==='choice'?5:10;
  savePlayLog('lab-panic',bestPts,maxPossible);

  logs.unshift({timestamp:new Date().toISOString(),round,q:currentQ.q,answer:currentQ.type==='choice'?currentQ.choices[currentQ.answer]:currentQ.answer,predictions:{...predictions}});
  $('nextBtn').textContent=round>=totalRounds?'結果を見る →':'次の実験 →';
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
  $('resultBar').innerHTML='';$('resultBar').style.display='none';
  $('explainBox').style.display='none';

  const active=getActivePlayers(players);
  const sorted=[...active].sort((a,b)=>(scores[b]||0)-(scores[a]||0));
  let details=sorted.map((p,i)=>{
    const medal=i===0?'👑':'';
    return `${medal}<strong>${esc(p)}</strong>: ${scores[p]||0}pt`;
  }).join('<br>');
  details+=renderBestBadge('lab-panic',scores[sorted[0]]||0);
  details+=renderGameRecommendation('lab-panic');
  $('resultDetails').innerHTML=details;
  $('nextBtn').textContent='もう1回！';
  $('nextBtn').onclick=()=>{
    $('explainBox').style.display='';
    showPhase('setupPhase');
  };

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
    `<div class="log-entry"><span>R${l.round} ${esc(String(l.q).slice(0,20))}...</span><span>→ ${esc(String(l.answer))}</span></div>`
  ).join('');
}

function clearAllLogs(){showToast('リセットしました');logs=[];round=0;usedQuestions=[];for(const p of players)scores[p]=0;renderScoreboard();renderLog();saveState();}

(function init(){loadState();initSessionPlayers(players,scores);renderPlayers();renderScoreboard();renderLog();
  document.querySelectorAll('#catPills .option-pill').forEach(b=>b.classList.toggle('selected',b.dataset.value===category));
})();
