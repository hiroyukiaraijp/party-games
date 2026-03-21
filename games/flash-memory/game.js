/* ===== Flash Memory (フラッシュメモリー) ===== */

const STORAGE_KEY = 'flashmemory_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🧠'];

// Level config: [gridSize, litCount, showTimeMs]
const LEVELS = [
  [4, 3, 2000], [4, 4, 2000], [4, 5, 1800], [4, 6, 1800],
  [5, 5, 2000], [5, 6, 1800], [5, 7, 1500], [5, 8, 1500],
  [6, 7, 1800], [6, 8, 1500], [6, 9, 1200], [6, 10, 1200],
];

let players = [];
let scores = {};
let logs = [];
let round = 0;
let level = 0;
let playerIndex = 0;
let pattern = [];
let selectedCells = new Set();
let patternHiddenAt = 0;

const $setupPhase = document.getElementById('setupPhase');
const $showPhaseEl = document.getElementById('showPhaseEl');
const $answerPhaseEl = document.getElementById('answerPhaseEl');
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

function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, logs, round })); } catch (e) {} }
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) { const s = JSON.parse(r); if (s.players) players = s.players; if (s.scores) scores = s.scores; if (s.logs) logs = s.logs; if (s.round) round = s.round; }
    if (players.length === 0) { const sh = localStorage.getItem(SHARED_PLAYERS_KEY); if (sh) { const sp = JSON.parse(sh); if (Array.isArray(sp) && sp.length > 0) { players = sp; for (const p of players) scores[p] = scores[p] || 0; } } }
  } catch (e) {}
}
function saveSharedPlayers() { try { localStorage.setItem(SHARED_PLAYERS_KEY, JSON.stringify(players)); } catch (e) {} }

function addPlayer() { const input = document.getElementById('playerNameInput'); const name = input.value.trim(); if (!name || players.includes(name)) { input.value = ''; return; } players.push(name); scores[name] = scores[name] || 0; input.value = ''; renderPlayers(); renderScoreboard(); saveState(); saveSharedPlayers(); }
function removePlayer(name) { players = players.filter(p => p !== name); delete scores[name]; renderPlayers(); renderScoreboard(); saveState(); saveSharedPlayers(); }
function renderPlayers() { renderSessionPlayerBar('playerList', players, scores, function(active) { renderScoreboard(); }); }

function showPhase(id) { [$setupPhase, $showPhaseEl, $answerPhaseEl, $resultPhase].forEach(el => el.style.display = 'none'); document.getElementById(id).style.display = ''; }

function buildGrid(containerId, size, interactive) {
  const grid = document.getElementById(containerId);
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.innerHTML = '';
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.className = 'memory-cell';
    cell.dataset.index = i;
    if (interactive) {
      cell.addEventListener('click', () => toggleCell(cell, i));
    }
    grid.appendChild(cell);
  }
}

function toggleCell(cell, index) {
  if (selectedCells.has(index)) {
    selectedCells.delete(index);
    cell.classList.remove('selected');
  } else {
    selectedCells.add(index);
    cell.classList.add('selected');
  }
}

let roundPlayers = [];
function startGame() {
  syncActivePlayers(players,scores);
  if (getActivePlayers(players).length < 1) { showToast('プレイヤーを1人以上登録してください'); return; }
  roundPlayers = getActivePlayers(players);
  level = 0; playerIndex = 0; round++;
  startLevel();
}

function startLevel() {
  const [size, litCount, showTime] = LEVELS[Math.min(level, LEVELS.length - 1)];

  // Generate random pattern
  const total = size * size;
  pattern = [];
  while (pattern.length < litCount) {
    const r = Math.floor(Math.random() * total);
    if (!pattern.includes(r)) pattern.push(r);
  }

  // Show phase
  showPhase('showPhaseEl');
  document.getElementById('levelDisplay').textContent = `レベル ${level + 1}`;
  buildGrid('showGrid', size, false);

  // Light up pattern
  const cells = document.getElementById('showGrid').children;
  for (const idx of pattern) cells[idx].classList.add('lit');
  playBeep(600, 150);

  // Hide after showTime
  setTimeout(() => {
    patternHiddenAt = Date.now();
    startAnswerPhase(size);
  }, showTime);
}

function startAnswerPhase(size) {
  const player = roundPlayers[playerIndex];
  showPhase('answerPhaseEl');
  document.getElementById('answerLevel').textContent = `レベル ${level + 1}`;
  document.getElementById('answerPlayer').textContent = player;
  selectedCells = new Set();
  buildGrid('answerGrid', size, true);
}

function submitAnswer() {
  const answerRT = Date.now() - patternHiddenAt;
  const player = roundPlayers[playerIndex];
  const [size] = LEVELS[Math.min(level, LEVELS.length - 1)];
  const patternSet = new Set(pattern);

  let correctCount = 0;
  const cells = document.getElementById('answerGrid').children;

  // Show results on grid
  for (let i = 0; i < size * size; i++) {
    const inPattern = patternSet.has(i);
    const wasSelected = selectedCells.has(i);
    if (inPattern && wasSelected) { cells[i].classList.add('correct'); correctCount++; }
    else if (inPattern && !wasSelected) { cells[i].classList.add('lit'); }
    else if (!inPattern && wasSelected) { cells[i].classList.add('wrong'); }
  }

  const perfect = correctCount === pattern.length && selectedCells.size === pattern.length;
  const pts = perfect ? pattern.length + 2 : correctCount;
  scores[player] = (scores[player] || 0) + pts;

  playBeep(perfect ? 1000 : 500, 200);

  // Show result after brief delay
  setTimeout(() => {
    showPhase('resultPhase');
    document.getElementById('resultIcon').textContent = perfect ? '🎉' : correctCount > 0 ? '👍' : '😅';
    document.getElementById('resultTitle').textContent = perfect ? 'パーフェクト！' : `${correctCount}/${pattern.length} セル正解`;
    document.getElementById('resultDetails').innerHTML =
      `<strong>${esc(player)}</strong> +${pts}pt<br>レベル ${level + 1} (${size}x${size}, ${pattern.length}セル)`;

    if (perfect) {
      const rect = document.getElementById('resultTitle').getBoundingClientRect();
      emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    logs.unshift({ timestamp: new Date().toISOString(), round, player, level: level + 1, gridSize: size, litCount: pattern.length, correctCount, perfect, pts, answerRT });
    savePlayLog('flash-memory', pts, pattern.length + 2, {
      playMode: players.length <= 1 ? 'solo' : 'passplay',
      cognitive: {
        medianRT: answerRT,
        difficulty: level + 1,
        spanAtFailure: perfect ? null : level + 1,
      }
    });

    // Determine next step
    const $btn = document.getElementById('nextBtn');
    playerIndex++;
    if (playerIndex < roundPlayers.length) {
      $btn.textContent = `次のプレイヤー →`;
      $btn.onclick = () => { startAnswerPhaseForSameLevel(); };
    } else {
      // All players done this level
      if (perfect || correctCount >= pattern.length * 0.7) {
        $btn.textContent = `次のレベルへ →`;
        $btn.onclick = () => { level++; playerIndex = 0; if (level >= LEVELS.length) { showToast('全レベルクリア！'); showPhase('setupPhase'); } else { startLevel(); } };
      } else {
        $btn.textContent = `ゲーム終了`;
        $btn.onclick = () => { showPhase('setupPhase'); };
      }
    }

    renderScoreboard(); renderLog(); saveState();
  }, 1200);
}

function startAnswerPhaseForSameLevel() {
  const [size] = LEVELS[Math.min(level, LEVELS.length - 1)];
  startAnswerPhase(size);
}

function nextStep() {} // placeholder, overridden by onclick

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
    `<div class="log-entry"><span>${esc(l.player)} Lv${l.level}</span><span>${l.perfect ? '🎉' : ''} ${l.correctCount}/${l.litCount} +${l.pts}pt</span></div>`
  ).join('');
}
function clearAllLogs() { showToast('リセットしました'); logs = []; round = 0; for (const p of players) scores[p] = 0; renderScoreboard(); renderLog(); saveState(); }

(function init() { loadState(); initSessionPlayers(players, scores); renderPlayers(); renderScoreboard(); renderLog(); })();
