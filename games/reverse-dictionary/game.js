/* ===== Reverse Dictionary Quiz (逆引き辞書クイズ) ===== */
// QUESTIONS is loaded from questions.js (1050+ questions)
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
function renderPlayers() { renderSessionPlayerBar('playerList', players, scores, function(active) { renderScoreboard(); }); }
function selectOption(type, btn) { btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); if (type === 'category') categoryFilter = btn.dataset.value; }

function showPhase(id) { [$setupPhase, $quizPhase, $resultPhase].forEach(el => el.style.display = 'none'); document.getElementById(id).style.display = ''; }

// --- Game ---
function startGame() {
  syncActivePlayers(players,scores);
  if (getActivePlayers(players).length < 1) { showToast('プレイヤーを1人以上登録してください'); return; }
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
  savePlayLog('reverse-dictionary', setCorrect, setTotal);
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
  initSessionPlayers(players, scores);
  renderPlayers(); renderScoreboard(); renderLog();
  document.querySelectorAll('#categoryPills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === categoryFilter));
})();
