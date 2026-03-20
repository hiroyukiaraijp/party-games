/* ===== Reverse Dictionary Quiz (逆引き辞書クイズ) ===== */

const QUESTIONS = {
  daily: [
    { word: '傘', reading: 'かさ', def: '雨や日差しを防ぐために頭の上にさすもの。開くと円形の布が広がる', alt: ['かさ','カサ'] },
    { word: '冷蔵庫', reading: 'れいぞうこ', def: '食べ物や飲み物を冷やして保存するための家電製品', alt: ['れいぞうこ'] },
    { word: '信号機', reading: 'しんごうき', def: '道路の交差点にあり、赤・黄・青の光で車や歩行者の進行を指示するもの', alt: ['しんごうき','しんごう'] },
    { word: '目覚まし時計', reading: 'めざましどけい', def: '設定した時刻になると音を鳴らして起こしてくれる時計', alt: ['めざましどけい','めざまし'] },
    { word: '洗濯機', reading: 'せんたくき', def: '衣服を水と洗剤で自動的に洗ってくれる家電製品', alt: ['せんたくき'] },
    { word: 'エプロン', reading: 'えぷろん', def: '料理をするときに服が汚れないよう体の前に付ける布', alt: ['えぷろん'] },
    { word: 'スリッパ', reading: 'すりっぱ', def: '室内で履く、かかとのない簡単な履物', alt: ['すりっぱ'] },
    { word: '体温計', reading: 'たいおんけい', def: '熱があるか調べるために体の温度を測る道具', alt: ['たいおんけい'] },
    { word: 'カーテン', reading: 'かーてん', def: '窓にかけて日差しや外からの視線を遮る布', alt: ['かーてん'] },
    { word: '消しゴム', reading: 'けしごむ', def: '鉛筆で書いた文字を擦って消すための文房具', alt: ['けしごむ'] },
    { word: 'はさみ', reading: 'はさみ', def: '2枚の刃を交差させて紙や布を切る道具', alt: ['はさみ','ハサミ'] },
    { word: '枕', reading: 'まくら', def: '寝るときに頭の下に置くやわらかいもの', alt: ['まくら'] },
    { word: 'カレンダー', reading: 'かれんだー', def: '日付・曜日・月を一覧で表示し、壁や机に置いて日を確認するもの', alt: ['かれんだー'] },
    { word: '鏡', reading: 'かがみ', def: '光を反射して自分の姿を映し出す平らなもの', alt: ['かがみ'] },
    { word: 'ほうき', reading: 'ほうき', def: '床のゴミやほこりを掃くための長い柄のついた道具', alt: ['ほうき','ホウキ'] },
  ],
  nature: [
    { word: '虹', reading: 'にじ', def: '雨のあとに空に現れる、7色の弧を描く光の現象', alt: ['にじ'] },
    { word: '雷', reading: 'かみなり', def: '雲と地面の間で放電が起き、光と大きな音がする自然現象', alt: ['かみなり','いかずち'] },
    { word: '火山', reading: 'かざん', def: '地下のマグマが噴き出す山。溶岩や火山灰を噴出する', alt: ['かざん'] },
    { word: '蜃気楼', reading: 'しんきろう', def: '暑い日に遠くの景色が浮かび上がったりゆがんで見える現象', alt: ['しんきろう'] },
    { word: 'オーロラ', reading: 'おーろら', def: '北極や南極の近くで、夜空にカーテン状の光が揺れる現象', alt: ['おーろら'] },
    { word: '化石', reading: 'かせき', def: '大昔の生き物の体や痕跡が石になって残ったもの', alt: ['かせき'] },
    { word: '流れ星', reading: 'ながれぼし', def: '宇宙の小さな塵が大気圏に入って燃え、夜空に光の線を引く現象', alt: ['ながれぼし','りゅうせい'] },
    { word: '干潮', reading: 'かんちょう', def: '海の水位が下がり、海岸線が後退する現象。1日に約2回起きる', alt: ['かんちょう','ひきしお'] },
    { word: '地震', reading: 'じしん', def: '地下の岩盤がずれることで地面が揺れる自然現象', alt: ['じしん'] },
    { word: '台風', reading: 'たいふう', def: '熱帯の海上で発生する強い風と雨を伴う大型の低気圧', alt: ['たいふう'] },
    { word: '滝', reading: 'たき', def: '川の水が高い崖から垂直に落下する場所', alt: ['たき'] },
    { word: '氷河', reading: 'ひょうが', def: '山や極地で雪が長い年月をかけて圧縮され、ゆっくり流れ動く巨大な氷の塊', alt: ['ひょうが'] },
    { word: 'サンゴ礁', reading: 'さんごしょう', def: 'サンゴの骨格が積み重なってできた海中の地形。カラフルな魚が集まる', alt: ['さんごしょう'] },
    { word: '霧', reading: 'きり', def: '地表付近で水蒸気が凝結し、小さな水滴が空中に漂って視界が悪くなる現象', alt: ['きり'] },
  ],
  culture: [
    { word: '俳句', reading: 'はいく', def: '五・七・五の十七音で詠む日本の短い詩。季語を含む', alt: ['はいく'] },
    { word: '歌舞伎', reading: 'かぶき', def: '派手な化粧と衣装が特徴の、日本の伝統的な舞台芸術', alt: ['かぶき'] },
    { word: '落語', reading: 'らくご', def: '一人の演者が座布団の上で複数の役を演じ分ける日本の話芸', alt: ['らくご'] },
    { word: '盆踊り', reading: 'ぼんおどり', def: 'お盆の時期に櫓の周りを輪になって踊る日本の夏の伝統行事', alt: ['ぼんおどり'] },
    { word: 'お年玉', reading: 'おとしだま', def: '正月に大人が子供にあげるお金。ポチ袋に入れて渡す', alt: ['おとしだま'] },
    { word: '七夕', reading: 'たなばた', def: '7月7日に笹の葉に願い事を書いた短冊を飾る日本の行事', alt: ['たなばた'] },
    { word: '節分', reading: 'せつぶん', def: '2月の行事。「鬼は外、福は内」と言いながら豆をまく', alt: ['せつぶん'] },
    { word: '茶道', reading: 'さどう', def: 'お茶を点てて客人にふるまう、日本の伝統的な作法・芸道', alt: ['さどう','ちゃどう'] },
    { word: '花見', reading: 'はなみ', def: '桜の花を眺めながら食事やお酒を楽しむ日本の春の習慣', alt: ['はなみ','おはなみ'] },
    { word: '相撲', reading: 'すもう', def: '土俵の上で2人の力士が組み合い、相手を外に出すか倒す日本の国技', alt: ['すもう'] },
    { word: '風呂敷', reading: 'ふろしき', def: '物を包んで運ぶための正方形の布。色々な結び方がある', alt: ['ふろしき'] },
    { word: '書道', reading: 'しょどう', def: '筆と墨を使って文字を美しく書く日本の伝統芸術', alt: ['しょどう'] },
    { word: '和菓子', reading: 'わがし', def: '日本の伝統的なお菓子の総称。あんこや餅を使ったものが多い', alt: ['わがし'] },
  ],
  science: [
    { word: '重力', reading: 'じゅうりょく', def: '物体が地球の中心に向かって引っ張られる力。りんごが木から落ちる原因', alt: ['じゅうりょく'] },
    { word: '光合成', reading: 'こうごうせい', def: '植物が太陽の光を使って水と二酸化炭素から酸素と養分を作る仕組み', alt: ['こうごうせい'] },
    { word: '化学反応', reading: 'かがくはんのう', def: 'ある物質が別の物質に変化すること。例：鉄がさびる', alt: ['かがくはんのう'] },
    { word: '進化', reading: 'しんか', def: '長い時間をかけて生物の形や性質が世代を超えて変化していくこと', alt: ['しんか'] },
    { word: 'ブラックホール', reading: 'ぶらっくほーる', def: '重力がとても強く、光さえも脱出できない天体', alt: ['ぶらっくほーる'] },
    { word: 'DNA', reading: 'でぃーえぬえー', def: '生物の体の設計図が書かれた、細胞の中にある二重らせん構造の物質', alt: ['でぃーえぬえー','ディーエヌエー','dna'] },
    { word: '恐竜', reading: 'きょうりゅう', def: '約6600万年前に絶滅した、地球上に存在した巨大な爬虫類の総称', alt: ['きょうりゅう'] },
    { word: '酸素', reading: 'さんそ', def: '空気の約21%を占め、人間が呼吸するために必要な気体', alt: ['さんそ'] },
    { word: '磁石', reading: 'じしゃく', def: '鉄を引きつける力を持つ物体。N極とS極がある', alt: ['じしゃく'] },
    { word: 'プランクトン', reading: 'ぷらんくとん', def: '水中を漂う微小な生物の総称。クジラの餌になるものもいる', alt: ['ぷらんくとん'] },
    { word: '抗体', reading: 'こうたい', def: '体内に入ったウイルスや細菌を攻撃するために免疫システムが作るタンパク質', alt: ['こうたい'] },
    { word: '浮力', reading: 'ふりょく', def: '水中の物体が上向きに押し上げられる力。船が浮かぶ原理', alt: ['ふりょく'] },
  ],
};

const STORAGE_KEY = 'reversedictionary_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '📖'];
const QUESTIONS_PER_SET = 10;

let players = [];
let scores = {};
let logs = [];
let round = 0;
let categoryFilter = 'all';
let usedQuestions = [];

// Round state
let currentQuestions = [];
let questionIndex = 0;
let setCorrect = 0;
let setTotal = 0;
let hintUsed = false;
let answered = false;

const $setupPhase = document.getElementById('setupPhase');
const $quizPhase = document.getElementById('quizPhase');
const $resultPhase = document.getElementById('resultPhase');
const $scoreboard = document.getElementById('scoreboard');
const $scoreRows = document.getElementById('scoreRows');
const $answerLog = document.getElementById('answerLog');
const $logEntries = document.getElementById('logEntries');
const $playerList = document.getElementById('playerList');

function showToast(msg, dur = 2000) { const el = document.getElementById('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), dur); }
function emitParticles(x, y) { const c = document.getElementById('particles'); for (let i = 0; i < 8; i++) { const p = document.createElement('span'); p.className = 'particle'; p.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)]; const a = (Math.PI * 2 * i) / 8 + (Math.random() - .5) * .5, d = 60 + Math.random() * 80; p.style.left = x + 'px'; p.style.top = y + 'px'; p.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.3)`, opacity: 0 }], { duration: 800, easing: 'ease-out', fill: 'forwards' }); c.appendChild(p); setTimeout(() => p.remove(), 900); } }
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

let audioCtx = null;
function playBeep(freq, dur) { try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.frequency.value = freq; o.type = 'sine'; g.gain.value = 0.2; o.start(); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur / 1000); o.stop(audioCtx.currentTime + dur / 1000 + 0.05); } catch (e) {} }

function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, logs, round, categoryFilter, usedQuestions })); } catch (e) {} }
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) { const s = JSON.parse(r); if (s.players) players = s.players; if (s.scores) scores = s.scores; if (s.logs) logs = s.logs; if (s.round) round = s.round; if (s.categoryFilter) categoryFilter = s.categoryFilter; if (s.usedQuestions) usedQuestions = s.usedQuestions; }
    if (players.length === 0) { const sh = localStorage.getItem(SHARED_PLAYERS_KEY); if (sh) { const sp = JSON.parse(sh); if (Array.isArray(sp) && sp.length > 0) { players = sp; for (const p of players) scores[p] = scores[p] || 0; } } }
  } catch (e) {}
}
function saveSharedPlayers() { try { localStorage.setItem(SHARED_PLAYERS_KEY, JSON.stringify(players)); } catch (e) {} }

function addPlayer() { const input = document.getElementById('playerNameInput'); const name = input.value.trim(); if (!name || players.includes(name)) { input.value = ''; return; } players.push(name); scores[name] = scores[name] || 0; input.value = ''; renderPlayers(); renderScoreboard(); saveState(); saveSharedPlayers(); }
function removePlayer(name) { players = players.filter(p => p !== name); delete scores[name]; renderPlayers(); renderScoreboard(); saveState(); saveSharedPlayers(); }
function renderPlayers() { $playerList.innerHTML = players.map(p => `<span class="player-tag">${esc(p)} <span class="remove" onclick="removePlayer('${esc(p)}')">&times;</span></span>`).join(''); }
function selectOption(type, btn) { btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); if (type === 'category') categoryFilter = btn.dataset.value; }

function showPhase(id) { [$setupPhase, $quizPhase, $resultPhase].forEach(el => el.style.display = 'none'); document.getElementById(id).style.display = ''; }

// --- Game ---
function startGame() {
  if (players.length < 1) { showToast('プレイヤーを1人以上登録してください'); return; }
  round++;
  setCorrect = 0; setTotal = 0;

  // Build question pool
  let pool;
  if (categoryFilter === 'all') pool = Object.values(QUESTIONS).flat();
  else pool = QUESTIONS[categoryFilter] || [];
  pool = pool.filter(q => !usedQuestions.includes(q.word));
  if (pool.length < QUESTIONS_PER_SET) { usedQuestions = []; pool = categoryFilter === 'all' ? Object.values(QUESTIONS).flat() : (QUESTIONS[categoryFilter] || []); }

  // Shuffle and pick
  const shuffled = pool.sort(() => Math.random() - .5);
  currentQuestions = shuffled.slice(0, QUESTIONS_PER_SET);
  for (const q of currentQuestions) usedQuestions.push(q.word);
  questionIndex = 0;

  showPhase('quizPhase');
  showQuestion();
  renderScoreboard(); renderLog(); saveState();
}

function showQuestion() {
  if (questionIndex >= currentQuestions.length) { endSet(); return; }
  const q = currentQuestions[questionIndex];
  hintUsed = false; answered = false;

  document.getElementById('questionNum').textContent = `${questionIndex + 1} / ${currentQuestions.length}`;
  document.getElementById('defCategory').textContent = q.word ? '' : ''; // category from finding
  // Find category
  for (const [cat, qs] of Object.entries(QUESTIONS)) {
    if (qs.includes(q)) { document.getElementById('defCategory').textContent = cat === 'daily' ? '日常' : cat === 'nature' ? '自然' : cat === 'culture' ? '文化' : cat === 'science' ? '科学' : cat; break; }
  }
  document.getElementById('defText').textContent = q.def;
  document.getElementById('defHint').textContent = '';
  document.getElementById('hintBtn').style.display = '';
  document.getElementById('answerInput').value = '';
  document.getElementById('answerInput').disabled = false;
  const fb = document.getElementById('feedback'); fb.classList.remove('show', 'correct', 'wrong');
  document.getElementById('answerInput').focus();

  // Progress bar
  renderProgress();
}

function renderProgress() {
  const bar = document.getElementById('progressBar');
  bar.innerHTML = currentQuestions.map((_, i) => {
    let cls = '';
    if (i < questionIndex) cls = currentQuestions[i]._result === 'correct' ? 'correct' : 'wrong';
    else if (i === questionIndex) cls = 'current';
    return `<div class="progress-dot ${cls}"></div>`;
  }).join('');
}

function showHint() {
  if (hintUsed || answered) return;
  const q = currentQuestions[questionIndex];
  hintUsed = true;
  document.getElementById('defHint').textContent = `ヒント: 「${q.reading[0]}」で始まる${q.reading.length}文字の言葉`;
  document.getElementById('hintBtn').style.display = 'none';
}

function normalize(s) {
  return s.toLowerCase().replace(/[\s・\-ー]/g, '')
    .replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)); // katakana to hiragana
}

function submitAnswer() {
  if (answered) return;
  const input = document.getElementById('answerInput').value.trim();
  if (!input) return;

  const q = currentQuestions[questionIndex];
  const norm = normalize(input);
  const answers = [q.reading, q.word, ...(q.alt || [])].map(normalize);
  const isCorrect = answers.includes(norm);

  answered = true;
  document.getElementById('answerInput').disabled = true;
  const fb = document.getElementById('feedback');
  fb.classList.add('show');

  if (isCorrect) {
    const pts = hintUsed ? 1 : 2;
    fb.classList.add('correct');
    fb.textContent = `⭕ 正解！「${q.word}」（${q.reading}）+${pts}pt`;
    q._result = 'correct';
    setCorrect++;
    playBeep(1000, 100);
    // Award points to all players
    for (const p of players) scores[p] = (scores[p] || 0) + pts;
  } else {
    fb.classList.add('wrong');
    fb.textContent = `❌ 不正解… 答えは「${q.word}」（${q.reading}）`;
    q._result = 'wrong';
    playBeep(300, 200);
  }
  setTotal++;
  renderProgress();
  renderScoreboard();

  // Auto advance after delay
  setTimeout(() => {
    questionIndex++;
    showQuestion();
  }, 2000);
}

function skipQuestion() {
  if (answered) return;
  const q = currentQuestions[questionIndex];
  q._result = 'wrong';
  setTotal++;

  const fb = document.getElementById('feedback');
  fb.classList.add('show', 'wrong');
  fb.textContent = `スキップ → 答えは「${q.word}」（${q.reading}）`;
  answered = true;
  renderProgress();

  setTimeout(() => {
    questionIndex++;
    showQuestion();
  }, 2000);
}

function endSet() {
  showPhase('resultPhase');
  const pct = setTotal > 0 ? Math.round(setCorrect / setTotal * 100) : 0;
  document.getElementById('resultIcon').textContent = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📖';
  document.getElementById('resultTitle').textContent = `${setCorrect} / ${setTotal} 問正解！（${pct}%）`;

  let details = '';
  currentQuestions.forEach((q, i) => {
    const icon = q._result === 'correct' ? '⭕' : '❌';
    details += `${icon} ${q.word}（${q.reading}）<br>`;
  });
  document.getElementById('resultDetails').innerHTML = details;

  if (pct >= 80) {
    const rect = document.getElementById('resultTitle').getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  logs.unshift({ timestamp: new Date().toISOString(), round, correct: setCorrect, total: setTotal, pct });
  renderScoreboard(); renderLog(); saveState();
}

function nextRound() { showPhase('setupPhase'); }

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
function clearAllLogs() { showToast('リセットしました'); logs = []; round = 0; usedQuestions = []; for (const p of players) scores[p] = 0; renderScoreboard(); renderLog(); saveState(); }

(function init() {
  loadState();
  if (players.length > 0) { renderPlayers(); renderScoreboard(); renderLog(); }
  document.querySelectorAll('#categoryPills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === categoryFilter));
})();
