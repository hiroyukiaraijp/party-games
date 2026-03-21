/* ===== Color Panic (カラーパニック) ===== */

const BASE_COLORS = [
  { name: 'あか', hex: '#ef4444', shape: '●' },
  { name: 'あお', hex: '#3b82f6', shape: '▲' },
  { name: 'みどり', hex: '#22c55e', shape: '■' },
  { name: 'きいろ', hex: '#eab308', shape: '★' },
];
const EXTRA_COLORS = [
  { name: 'むらさき', hex: '#a855f7', shape: '◆' },  // DDA level 4+
  { name: 'だいだい', hex: '#f97316', shape: '◇' },  // DDA level 7+
];

// Statistical helpers for RT analysis
function median(arr) { if (!arr.length) return 0; const s = [...arr].sort((a,b) => a-b); const m = Math.floor(s.length/2); return s.length % 2 ? s[m] : (s[m-1]+s[m])/2; }
function stddev(arr) { if (arr.length < 2) return 0; const m = arr.reduce((a,b) => a+b, 0) / arr.length; return Math.sqrt(arr.reduce((s,v) => s + (v-m)**2, 0) / arr.length); }

function getActiveColors() {
  const level = getDDALevel('color-panic');
  if (level >= 7) return [...BASE_COLORS, ...EXTRA_COLORS];
  if (level >= 4) return [...BASE_COLORS, EXTRA_COLORS[0]];
  return [...BASE_COLORS];
}

function getDisplayInterval() {
  const level = getDDALevel('color-panic');
  // Not used for timed interval in this game, but controls question pacing feel
  return level;
}

const STORAGE_KEY = 'colorpanic_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🎨'];
const ROUND_TIME = 30;

let players = [];
let scores = {};
let logs = [];
let round = 0;
let gameMode = 'color'; // color | meaning | mix
let currentPlayer = null;
let playerIndex = 0;

// Round state
let currentScore = 0;
let combo = 0;
let maxCombo = 0;
let correctAnswer = null;
let roundMode = 'color';
let timerLeft = 0;
let timerInterval = null;
let questionCount = 0;

// RT (Reaction Time) tracking for Stroop effect measurement
let questionShownAt = 0;
let currentIsCongruent = false;
let congruentRTs = [];
let incongruentRTs = [];
let allRTs = [];

// DOM
const $setupPhase = document.getElementById('setupPhase');
const $gamePhase = document.getElementById('gamePhase');
const $answererPhase = document.getElementById('answererPhase');
const $resultPhase = document.getElementById('resultPhase');
const $scoreboard = document.getElementById('scoreboard');
const $scoreRows = document.getElementById('scoreRows');
const $answerLog = document.getElementById('answerLog');
const $logEntries = document.getElementById('logEntries');
const $playerList = document.getElementById('playerList');

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

// Sound
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

// Persistence
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, logs, round, gameMode })); } catch (e) {} }
function loadState() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) { const s = JSON.parse(r); if (s.players) players = s.players; if (s.scores) scores = s.scores; if (s.logs) logs = s.logs; if (s.round) round = s.round; if (s.gameMode) gameMode = s.gameMode; }
    if (players.length === 0) { const sh = localStorage.getItem(SHARED_PLAYERS_KEY); if (sh) { const sp = JSON.parse(sh); if (Array.isArray(sp) && sp.length > 0) { players = sp; for (const p of players) scores[p] = scores[p] || 0; } } }
  } catch (e) {}
}
function saveSharedPlayers() { try { localStorage.setItem(SHARED_PLAYERS_KEY, JSON.stringify(players)); } catch (e) {} }

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
  renderSessionPlayerBar('playerList', players, scores, function(active) {
    renderScoreboard();
  });
}
function selectOption(type, btn) {
  btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  if (type === 'mode') gameMode = btn.dataset.value;
}

function showPhase(id) {
  [$setupPhase, $gamePhase, $answererPhase, $resultPhase].forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = '';
}

// --- Game ---
let roundPlayers = [];
function startGame() {
  syncActivePlayers(players,scores);
  if (getActivePlayers(players).length < 1) { showToast('プレイヤーを1人以上登録してください'); return; }
  roundPlayers = getActivePlayers(players);
  playerIndex = 0;
  startPlayerRound();
}

function startPlayerRound() {
  currentPlayer = roundPlayers[playerIndex];
  round++;
  currentScore = 0; combo = 0; maxCombo = 0; questionCount = 0;
  congruentRTs = []; incongruentRTs = []; allRTs = [];
  timerLeft = ROUND_TIME;

  showPhase('gamePhase');
  showToast(`${currentPlayer} の番！`, 1500);

  // Render color buttons with shape characters for accessibility
  const activeColors = getActiveColors();
  document.getElementById('colorButtons').innerHTML = activeColors.map(c =>
    `<button class="color-btn" style="background:${c.hex}" data-color="${c.name}" onclick="answer('${c.name}',this)">${c.shape} ${c.name}</button>`
  ).join('');

  nextQuestion();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerLeft--;
    document.getElementById('timerDisplay').textContent = `残り ${timerLeft}秒`;
    if (timerLeft <= 5) playBeep(800, 100);
    if (timerLeft <= 0) { clearInterval(timerInterval); playBeep(400, 500); endPlayerRound(); }
  }, 1000);
}

function nextQuestion() {
  // Pick random word and color; ~30% congruent trials for Stroop effect measurement
  const colors = getActiveColors();
  const wordColor = colors[Math.floor(Math.random() * colors.length)];
  let displayColor;
  if (Math.random() < 0.3) {
    // Congruent: word meaning matches display color
    displayColor = wordColor;
    currentIsCongruent = true;
  } else {
    // Incongruent: ensure they differ
    do { displayColor = colors[Math.floor(Math.random() * colors.length)]; } while (displayColor.name === wordColor.name);
    currentIsCongruent = false;
  }

  roundMode = gameMode === 'mix' ? (Math.random() < 0.5 ? 'color' : 'meaning') : gameMode;
  correctAnswer = roundMode === 'color' ? displayColor.name : wordColor.name;
  questionShownAt = Date.now();

  document.getElementById('stroopMode').textContent = roundMode === 'color' ? '🎨 文字の色を答えろ！' : '📝 文字の意味を答えろ！';
  const $word = document.getElementById('stroopWord');
  $word.textContent = wordColor.name;
  $word.style.color = displayColor.hex;

  document.getElementById('scoreDisplay').textContent = currentScore;
  document.getElementById('comboDisplay').textContent = combo > 1 ? `${combo}コンボ！` : '';
  document.getElementById('timerDisplay').textContent = `残り ${timerLeft}秒`;
}

function answer(colorName, btnEl) {
  const rt = Date.now() - questionShownAt;
  allRTs.push(rt);
  if (currentIsCongruent) { congruentRTs.push(rt); } else { incongruentRTs.push(rt); }

  questionCount++;
  const isCorrect = colorName === correctAnswer;

  // Update DDA
  updateDDALevel('color-panic', isCorrect);

  if (isCorrect) {
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    const pts = combo >= 5 ? 3 : combo >= 3 ? 2 : 1;
    currentScore += pts;
    playBeep(1000, 80);
    // Visual feedback: flash button green
    if (btnEl) {
      const origBg = btnEl.style.background;
      btnEl.style.background = '#22c55e';
      btnEl.style.transform = 'scale(1.08)';
      setTimeout(() => { btnEl.style.background = origBg; btnEl.style.transform = ''; }, 150);
    }
  } else {
    combo = 0;
    playBeep(300, 200);
    // Visual feedback: shake the question display
    const $word = document.getElementById('stroopWord');
    $word.classList.add('shake');
    setTimeout(() => $word.classList.remove('shake'), 400);
  }
  nextQuestion();
}

function endPlayerRound() {
  scores[currentPlayer] = (scores[currentPlayer] || 0) + currentScore;

  const stroopEffect = median(incongruentRTs) - median(congruentRTs);
  logs.unshift({
    timestamp: new Date().toISOString(), round,
    player: currentPlayer, score: currentScore, questions: questionCount,
    maxCombo, mode: gameMode,
    congruentRTs: [...congruentRTs],
    incongruentRTs: [...incongruentRTs],
    stroopEffect,
  });

  showPhase('resultPhase');
  document.getElementById('resultIcon').textContent = currentScore >= 20 ? '🔥' : currentScore >= 10 ? '🎉' : '👍';
  document.getElementById('resultTitle').textContent = `${currentPlayer}: ${currentScore}pt！`;
  document.getElementById('resultDetails').innerHTML =
    `回答数: ${questionCount}<br>最大コンボ: ${maxCombo}<br>モード: ${gameMode === 'color' ? '文字の色' : gameMode === 'meaning' ? '文字の意味' : 'ミックス'}`;

  // Best badge & game recommendation
  let extraHTML = renderBestBadge('color-panic', currentScore);
  extraHTML += renderGameRecommendation('color-panic');
  document.getElementById('resultExtra').innerHTML = extraHTML;

  if (currentScore >= 15) {
    const rect = document.getElementById('resultTitle').getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  const maxScore = 30;
  savePlayLog('color-panic', currentScore, maxScore, {
    playMode: players.length <= 1 ? 'solo' : 'centerpiece',
    cognitive: {
      medianRT: median(allRTs),
      rtSD: stddev(allRTs),
      stroopEffect: median(incongruentRTs) - median(congruentRTs),
      difficulty: getDDALevel('color-panic'),
    }
  });
  renderScoreboard(); renderLog(); saveState();
}

function nextRound() {
  playerIndex++;
  if (playerIndex < roundPlayers.length) {
    startPlayerRound();
  } else {
    showPhase('setupPhase');
  }
}

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
    `<div class="log-entry"><span>R${l.round} ${esc(l.player)}</span><span>${l.score}pt (${l.maxCombo}コンボ)</span></div>`
  ).join('');
}
function clearAllLogs() {
  showToast('リセットしました'); logs = []; round = 0;
  for (const p of players) scores[p] = 0;
  renderScoreboard(); renderLog(); saveState();
}

(function init() {
  loadState();
  initSessionPlayers(players, scores);
  renderPlayers(); renderScoreboard(); renderLog();
  document.querySelectorAll('#modePills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === gameMode));
})();
