/* ===== Number Rush (ナンバーラッシュ) ===== */

const STORAGE_KEY = 'numberrush_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🔢'];
const PENALTY_MS = 500;

// Grid config by DDA level
function getGridConfig() {
  const level = getDDALevel('number-rush');
  if (level >= 7) return { size: 6, max: 36, maxTime: 90 };
  if (level >= 4) return { size: 5, max: 25, maxTime: 60 };
  return { size: 4, max: 16, maxTime: 30 };
}

let players = [];
let scores = {};
let logs = [];
let round = 0;

let currentPlayer = null;
let playerIndex = 0;
let roundPlayers = [];

// Round state
let nextNumber = 1;
let gridMax = 16;
let gridSize = 4;
let errorTaps = 0;
let penaltyTime = 0;
let tapTimestamps = [];
let startTime = 0;
let timerRAF = null;
let gameRunning = false;

// DDA tracking for time-based level changes
const DDA_TIMES_KEY = 'numberrush_dda_times';

// DOM
const $setupPhase = document.getElementById('setupPhase');
const $gamePhase = document.getElementById('gamePhase');
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
function playBuzz() { playBeep(200, 200); }

// Persistence
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, logs, round })); } catch (e) {} }
function loadState() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) { const s = JSON.parse(r); if (s.players) players = s.players; if (s.scores) scores = s.scores; if (s.logs) logs = s.logs; if (s.round) round = s.round; }
    if (players.length === 0) { const sh = localStorage.getItem(SHARED_PLAYERS_KEY); if (sh) { const sp = JSON.parse(sh); if (Array.isArray(sp) && sp.length > 0) { players = sp; for (const p of players) scores[p] = scores[p] || 0; } } }
  } catch (e) {}
}
function saveSharedPlayers() { try { localStorage.setItem(SHARED_PLAYERS_KEY, JSON.stringify(players)); } catch (e) {} }

// DDA time tracking
function getDDATimes() {
  try { return JSON.parse(localStorage.getItem(DDA_TIMES_KEY)) || []; } catch { return []; }
}
function saveDDATime(timeMs) {
  const times = getDDATimes();
  times.push(timeMs);
  // Keep last 10
  if (times.length > 10) times.splice(0, times.length - 10);
  try { localStorage.setItem(DDA_TIMES_KEY, JSON.stringify(times)); } catch {}
}
function updateDDAByTime(completionMs) {
  const times = getDDATimes();
  const key = 'partygames_dda_number-rush';
  let level = getDDALevel('number-rush');

  if (times.length >= 3) {
    const last3 = times.slice(-3);
    const bestSoFar = Math.min(...times.slice(0, -1));

    // 3 consecutive best time improvements → level up
    const allBetter = last3.every((t, i) => {
      if (i === 0) return t <= bestSoFar;
      return t < last3[i - 1];
    });

    if (allBetter && last3.length >= 3) {
      level = Math.min(level + 1, 10);
    }
  }

  // Time is 1.5x worse than previous → level down
  if (times.length >= 2) {
    const prev = times[times.length - 2];
    if (completionMs > prev * 1.5) {
      level = Math.max(level - 1, 1);
    }
  }

  try { localStorage.setItem(key, String(level)); } catch {}
  return level;
}

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

function showPhase(id) {
  [$setupPhase, $gamePhase, $resultPhase].forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = '';
}

// --- Shuffle array (Fisher-Yates) ---
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Game ---
function startGame() {
  syncActivePlayers(players, scores);
  if (getActivePlayers(players).length < 1) { showToast('プレイヤーを1人以上登録してください'); return; }
  roundPlayers = getActivePlayers(players);
  playerIndex = 0;
  startPlayerRound();
}

function startPlayerRound() {
  currentPlayer = roundPlayers[playerIndex];
  round++;

  const config = getGridConfig();
  gridSize = config.size;
  gridMax = config.max;
  nextNumber = 1;
  errorTaps = 0;
  penaltyTime = 0;
  tapTimestamps = [];
  gameRunning = false;

  showPhase('gamePhase');

  if (roundPlayers.length > 1) {
    showToast(`${currentPlayer} の番！`, 1500);
  }

  renderGrid();
  document.getElementById('nextNumberValue').textContent = '1';
  document.getElementById('timerDisplay').textContent = '0.000';

  // Show countdown then start
  showCountdown(() => {
    gameRunning = true;
    startTime = performance.now();
    updateTimer();
  });
}

function showCountdown(onComplete) {
  const overlay = document.createElement('div');
  overlay.className = 'countdown-overlay';
  document.body.appendChild(overlay);

  let count = 3;
  overlay.innerHTML = `<span>${count}</span>`;
  playBeep(600, 100);

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      overlay.innerHTML = `<span>${count}</span>`;
      playBeep(600, 100);
    } else {
      overlay.innerHTML = `<span>GO!</span>`;
      playBeep(1000, 150);
      setTimeout(() => {
        overlay.remove();
        onComplete();
      }, 400);
      clearInterval(interval);
    }
  }, 800);
}

function renderGrid() {
  const $grid = document.getElementById('numberGrid');
  $grid.className = 'number-grid grid-' + gridSize;

  // Create shuffled numbers
  const numbers = shuffle(Array.from({ length: gridMax }, (_, i) => i + 1));

  $grid.innerHTML = numbers.map(n =>
    `<button class="grid-cell" data-number="${n}" onclick="tapCell(this, ${n})">${n}</button>`
  ).join('');
}

function tapCell(el, num) {
  if (!gameRunning) return;
  if (el.classList.contains('tapped')) return;

  if (num === nextNumber) {
    // Correct tap
    playBeep(800 + num * 30, 60);
    tapTimestamps.push(performance.now());
    el.classList.add('tapped');
    nextNumber++;
    document.getElementById('nextNumberValue').textContent = nextNumber <= gridMax ? nextNumber : '---';

    if (nextNumber > gridMax) {
      // Completed!
      endPlayerRound();
    }
  } else {
    // Error tap
    errorTaps++;
    penaltyTime += PENALTY_MS;
    playBuzz();

    el.classList.add('error-flash');
    setTimeout(() => el.classList.remove('error-flash'), 400);
  }
}

function updateTimer() {
  if (!gameRunning) return;
  const elapsed = performance.now() - startTime + penaltyTime;
  document.getElementById('timerDisplay').textContent = (elapsed / 1000).toFixed(3);

  // Time-over check
  const config = getGridConfig();
  if (elapsed / 1000 >= config.maxTime) {
    endPlayerRound(true);
    return;
  }

  timerRAF = requestAnimationFrame(updateTimer);
}

function endPlayerRound(timeOver = false) {
  gameRunning = false;
  if (timerRAF) cancelAnimationFrame(timerRAF);

  const config = getGridConfig();
  const maxTime = config.maxTime;

  const rawTime = performance.now() - startTime;
  let completionTime = rawTime + penaltyTime;
  // Cap at maxTime if time-over
  if (timeOver) completionTime = maxTime * 1000;
  const completionSec = completionTime / 1000;

  // Final timer display
  document.getElementById('timerDisplay').textContent = completionSec.toFixed(3);

  // Tap intervals
  const tapIntervals = [];
  for (let i = 1; i < tapTimestamps.length; i++) {
    tapIntervals.push(Math.round(tapTimestamps[i] - tapTimestamps[i - 1]));
  }

  // Score conversion
  const maxScore = maxTime;
  const score = Math.max(0, Math.round((maxTime - completionSec) * 10) / 10);

  // Update scores (use score for ranking - higher is better)
  scores[currentPlayer] = (scores[currentPlayer] || 0) + Math.round(score);

  // DDA update
  saveDDATime(Math.round(completionTime));
  updateDDAByTime(Math.round(completionTime));

  // Log
  logs.unshift({
    timestamp: new Date().toISOString(), round,
    player: currentPlayer, time: completionSec.toFixed(3),
    errors: errorTaps, gridSize: gridSize + 'x' + gridSize,
    score: Math.round(score),
  });

  // Show result
  showPhase('resultPhase');
  const icon = timeOver ? '⏰' : completionSec < maxTime * 0.4 ? '🔥' : completionSec < maxTime * 0.7 ? '🎉' : '👍';
  document.getElementById('resultIcon').textContent = icon;
  document.getElementById('resultTitle').textContent = timeOver
    ? `${currentPlayer}: タイムオーバー！`
    : `${currentPlayer}: ${completionSec.toFixed(3)}秒`;

  let detailsHTML = `グリッド: <strong>${gridSize}x${gridSize}</strong> (${gridMax}マス)<br>`;
  if (timeOver) {
    const tapped = nextNumber - 1;
    detailsHTML += `タップ数: <strong>${tapped}/${gridMax}</strong> (残り${gridMax - tapped})<br>`;
  }
  detailsHTML += `生タイム: <strong>${(rawTime / 1000).toFixed(3)}秒</strong><br>`;
  if (errorTaps > 0) {
    detailsHTML += `誤タップ: <strong>${errorTaps}回</strong> (+${(penaltyTime / 1000).toFixed(1)}秒ペナルティ)<br>`;
  } else {
    detailsHTML += `誤タップ: <strong>なし！</strong> パーフェクト！<br>`;
  }
  detailsHTML += `スコア: <strong>${Math.round(score)}pt</strong>`;
  document.getElementById('resultDetails').innerHTML = detailsHTML;

  // Best badge & game recommendation
  let extraHTML = renderBestBadge('number-rush', Math.round(score));
  extraHTML += renderGameRecommendation('number-rush');
  document.getElementById('resultExtra').innerHTML = extraHTML;

  if (completionSec < maxTime * 0.5) {
    const rect = document.getElementById('resultTitle').getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  // Save play log with cognitive data
  savePlayLog('number-rush', Math.round(score), maxScore, {
    playMode: 'solo',
    completionTime: Math.round(completionTime),
    tapIntervals,
    errorTaps,
    gridSize: gridSize + 'x' + gridSize,
    penaltyTime: Math.round(penaltyTime),
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
    `<div class="log-entry"><span>R${l.round} ${esc(l.player)} [${l.gridSize}]</span><span>${l.time}秒 (誤${l.errors})</span></div>`
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
})();
