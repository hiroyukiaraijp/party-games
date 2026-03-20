/* ===== Rhythm Relay (リズムリレー) ===== */

const STORAGE_KEY = 'rhythmrelay_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🔔'];
const COLOR_NAMES = ['赤', '青', '緑', '黄'];
const TONES = [261, 329, 392, 523]; // C4, E4, G4, C5

let players = [];
let scores = {};
let logs = [];
let round = 0;

// Round state
let sequence = [];       // full chain so far
let inputIndex = 0;      // where in replay the current player is
let phase = 'idle';      // idle | replay | add
let playerOrder = [];
let turnIndex = 0;
let inputLocked = false;

const $setupPhase = document.getElementById('setupPhase');
const $gamePhase = document.getElementById('gamePhase');
const $resultPhase = document.getElementById('resultPhase');
const $scoreboard = document.getElementById('scoreboard');
const $scoreRows = document.getElementById('scoreRows');
const $answerLog = document.getElementById('answerLog');
const $logEntries = document.getElementById('logEntries');
const $playerList = document.getElementById('playerList');

function showToast(msg, dur = 2000) { const el = document.getElementById('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), dur); }
function emitParticles(x, y) { const c = document.getElementById('particles'); for (let i = 0; i < 8; i++) { const p = document.createElement('span'); p.className = 'particle'; p.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)]; const a = (Math.PI * 2 * i) / 8 + (Math.random() - .5) * .5, d = 60 + Math.random() * 80; p.style.left = x + 'px'; p.style.top = y + 'px'; p.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.3)`, opacity: 0 }], { duration: 800, easing: 'ease-out', fill: 'forwards' }); c.appendChild(p); setTimeout(() => p.remove(), 900); } }
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// Sound
let audioCtx = null;
function playTone(colorIndex, dur = 200) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.value = TONES[colorIndex]; o.type = 'sine'; g.gain.value = 0.25;
    o.start(); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur / 1000);
    o.stop(audioCtx.currentTime + dur / 1000 + 0.05);
  } catch (e) {}
}
function playBuzz() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.value = 150; o.type = 'sawtooth'; g.gain.value = 0.2;
    o.start(); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    o.stop(audioCtx.currentTime + 0.45);
  } catch (e) {}
}

function flashButton(colorIndex, dur = 300) {
  const btns = document.querySelectorAll('.simon-btn');
  btns[colorIndex].classList.add('lit');
  playTone(colorIndex, dur);
  setTimeout(() => btns[colorIndex].classList.remove('lit'), dur);
}

function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, logs, round })); } catch (e) {} }
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) { const s = JSON.parse(r); if (s.players) players = s.players; if (s.scores) scores = s.scores; if (s.logs) logs = s.logs; if (s.round) round = s.round; }
    if (players.length === 0) { const sh = localStorage.getItem(SHARED_PLAYERS_KEY); if (sh) { const sp = JSON.parse(sh); if (Array.isArray(sp) && sp.length > 0) { players = sp; for (const p of players) scores[p] = scores[p] || 0; } } }
  } catch (e) {}
}
function saveSharedPlayers() { try { localStorage.setItem(SHARED_PLAYERS_KEY, JSON.stringify(players)); } catch (e) {} }

function addPlayer() { const input = document.getElementById('playerNameInput'); const name = input.value.trim(); if (!name || players.includes(name)) { input.value = ''; return; } players.push(name); scores[name] = scores[name] || 0; input.value = ''; renderPlayers(); renderScoreboard(); saveState(); saveSharedPlayers(); }
function removePlayer(name) { players = players.filter(p => p !== name); delete scores[name]; renderPlayers(); renderScoreboard(); saveState(); saveSharedPlayers(); }
function renderPlayers() { $playerList.innerHTML = players.map(p => `<span class="player-tag">${esc(p)} <span class="remove" onclick="removePlayer('${esc(p)}')">&times;</span></span>`).join(''); }

function showPhase(id) { [$setupPhase, $gamePhase, $resultPhase].forEach(el => el.style.display = 'none'); document.getElementById(id).style.display = ''; }

function startGame() {
  if (players.length < 1) { showToast('プレイヤーを1人以上登録してください'); return; }
  round++;
  sequence = [];
  playerOrder = [...players];
  turnIndex = 0;
  showPhase('gamePhase');
  startTurn();
}

function startTurn() {
  // Wrap around
  if (turnIndex >= playerOrder.length) {
    turnIndex = 0;
  }

  const player = playerOrder[turnIndex];
  document.getElementById('turnPlayer').textContent = player;
  document.getElementById('chainDisplay').textContent = sequence.length;

  if (sequence.length === 0) {
    // First move: just add
    phase = 'add';
    inputIndex = 0;
    inputLocked = false;
    document.getElementById('phaseLabel').textContent = '好きな色を1つタップ！';
  } else {
    // Replay existing sequence first
    phase = 'replay';
    inputIndex = 0;
    inputLocked = true;
    document.getElementById('phaseLabel').textContent = 'まず順番を再現してください';

    // Play back sequence for reference
    playbackSequence(() => {
      inputLocked = false;
      document.getElementById('phaseLabel').textContent = `再現してください (${sequence.length}個) → 新しく1つ追加`;
    });
  }
}

function playbackSequence(callback) {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= sequence.length) { clearInterval(interval); setTimeout(callback, 300); return; }
    flashButton(sequence[i], 250);
    i++;
  }, 400);
}

function onSimonTap(colorIndex) {
  if (inputLocked) return;

  flashButton(colorIndex, 200);

  if (phase === 'replay') {
    if (colorIndex === sequence[inputIndex]) {
      inputIndex++;
      if (inputIndex >= sequence.length) {
        // Replay complete, now add
        phase = 'add';
        document.getElementById('phaseLabel').textContent = '新しく1つ追加！';
      }
    } else {
      // Wrong!
      playerFailed();
    }
  } else if (phase === 'add') {
    // Add new color to sequence
    sequence.push(colorIndex);
    inputLocked = true;

    // Award points to everyone
    for (const p of playerOrder) scores[p] = (scores[p] || 0) + 1;
    renderScoreboard();
    saveState();

    // Next player
    setTimeout(() => {
      turnIndex++;
      startTurn();
    }, 600);
  }
}

function playerFailed() {
  const player = playerOrder[turnIndex];
  playBuzz();
  inputLocked = true;
  scores[player] = (scores[player] || 0) - 2;
  showToast(`${player} -2点！`, 1500);
  renderScoreboard();
  saveState();

  document.getElementById('phaseLabel').textContent = `${player} がミス！ -2点`;

  // Continue from next player, chain stays as-is
  setTimeout(() => {
    turnIndex++;
    startTurn();
  }, 1500);
}

function endGame() {
  showPhase('resultPhase');

  document.getElementById('resultIcon').textContent = '🔔';
  document.getElementById('resultTitle').textContent = 'ゲーム終了！';
  let html = `チェイン長: <strong>${sequence.length}</strong><br>`;
  html += `全員にチェイン分の得点が加算されました`;
  if (typeof renderBestBadge === 'function') {
    html += renderBestBadge('rhythm-relay', sequence.length);
  }
  document.getElementById('resultDetails').innerHTML = html;

  if (typeof renderGameRecommendation === 'function') {
    const recEl = renderGameRecommendation('rhythm-relay');
    if (recEl) document.getElementById('resultDetails').insertAdjacentHTML('beforeend', recEl);
  }

  if (sequence.length >= 8) {
    const rect = document.getElementById('resultTitle').getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  logs.unshift({ timestamp: new Date().toISOString(), round, chainLength: sequence.length, playerCount: players.length });
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
    `<div class="log-entry"><span>R${l.round} チェイン${l.chainLength}</span><span>${l.playerCount}人</span></div>`
  ).join('');
}
function clearAllLogs() { showToast('リセットしました'); logs = []; round = 0; for (const p of players) scores[p] = 0; renderScoreboard(); renderLog(); saveState(); }

(function init() { loadState(); if (players.length > 0) { renderPlayers(); renderScoreboard(); renderLog(); } })();
