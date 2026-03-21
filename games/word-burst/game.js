/* ===== Word Burst (ことばバースト) ===== */
function median(arr) { if (!arr.length) return 0; const s = [...arr].sort((a,b) => a-b); const m = Math.floor(s.length/2); return s.length % 2 ? s[m] : (s[m-1]+s[m])/2; }

const CATEGORIES = [
  // Level 1-3 (wide)
  { text: '食べ物', level: 1 },
  { text: '動物', level: 1 },
  { text: '色', level: 1 },
  { text: '国の名前', level: 2 },
  { text: '乗り物', level: 2 },
  { text: 'スポーツ', level: 2 },
  { text: '果物', level: 2 },
  { text: '飲み物', level: 2 },
  { text: '体の部位', level: 2 },
  { text: '学校にあるもの', level: 3 },
  { text: '台所にあるもの', level: 3 },
  { text: '丸いもの', level: 3 },
  { text: '赤いもの', level: 3 },
  { text: '冷たいもの', level: 3 },
  { text: '柔らかいもの', level: 3 },
  // Level 4-6 (medium)
  { text: '魚の種類', level: 4 },
  { text: '楽器', level: 4 },
  { text: '花の名前', level: 4 },
  { text: '虫の名前', level: 4 },
  { text: '野菜', level: 4 },
  { text: '調味料', level: 5 },
  { text: 'お菓子', level: 5 },
  { text: '文房具', level: 5 },
  { text: '家電製品', level: 5 },
  { text: '都道府県', level: 5 },
  { text: 'アニメキャラクター', level: 5 },
  { text: '映画のタイトル', level: 5 },
  { text: '有名人', level: 6 },
  { text: 'ゲームのタイトル', level: 6 },
  { text: '四字熟語', level: 6 },
  // Level 7-10 (narrow)
  { text: '3文字の食べ物', level: 7 },
  { text: 'カタカナの動物', level: 7 },
  { text: '白いもの', level: 7 },
  { text: '朝にすること', level: 7 },
  { text: '夏に関係するもの', level: 8 },
  { text: '音が出るもの', level: 8 },
  { text: '透明なもの', level: 8 },
  { text: 'ポケットに入るもの', level: 8 },
  { text: 'コンビニで買えるもの', level: 9 },
  { text: '誕生日に欲しいもの', level: 9 },
  { text: 'においがするもの', level: 9 },
  { text: '曲がるもの', level: 9 },
  { text: '2文字の動物', level: 10 },
  { text: '5文字以上の食べ物', level: 10 },
  { text: '「き」で始まるもの', level: 10 },
  { text: '「し」で始まるもの', level: 10 },
];

const STORAGE_KEY = 'wordburst_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '💥', '🔥'];

let players = [];
let scores = {};
let logs = [];
let round = 0;
let gameMode = 'multi'; // solo | multi
let totalRounds = 3;

// Round state
let roundPlayers = [];
let currentPlayerIndex = 0;
let currentCategory = '';
let wordsUsed = []; // actual words typed
let wordsPerPlayer = {}; // { name: count }
let timerDuration = 0;
let timerLeft = 0;
let timerInterval = null;
let roundStartTime = 0;

// Solo state
let soloCount = 0;
let soloTapTimes = [];
let gameActive = false;

// DOM
const $setupPhase = document.getElementById('setupPhase');
const $gamePhase = document.getElementById('gamePhase');
const $roundResultPhase = document.getElementById('roundResultPhase');
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
function playBuzz() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.value = 80; o.type = 'sawtooth'; g.gain.value = 0.3;
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    o.stop(audioCtx.currentTime + 0.55);
  } catch (e) {}
}

// Persistence
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, logs, round, gameMode, totalRounds })); } catch (e) {} }
function loadState() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) { const s = JSON.parse(r); if (s.players) players = s.players; if (s.scores) scores = s.scores; if (s.logs) logs = s.logs; if (s.round) round = s.round; if (s.gameMode) gameMode = s.gameMode; if (s.totalRounds) totalRounds = s.totalRounds; }
    if (players.length === 0) { const sh = localStorage.getItem(SHARED_PLAYERS_KEY); if (sh) { const sp = JSON.parse(sh); if (Array.isArray(sp) && sp.length > 0) { players = sp; for (const p of players) scores[p] = scores[p] || 0; } } }
  } catch (e) {}
}
function saveSharedPlayers() { try { localStorage.setItem(SHARED_PLAYERS_KEY, JSON.stringify(players)); } catch (e) {} }

function renderPlayers() {
  renderSessionPlayerBar('playerList', players, scores, function(active) {
    renderScoreboard();
  });
}
function selectOption(type, btn) {
  btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  if (type === 'mode') gameMode = btn.dataset.value;
  if (type === 'rounds') totalRounds = parseInt(btn.dataset.value);
}

function showPhase(id) {
  [$setupPhase, $gamePhase, $roundResultPhase, $resultPhase].forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = '';
}

// --- Category Selection (DDA) ---
function pickCategory() {
  const level = getDDALevel('word-burst');
  const maxLevel = Math.min(level + 2, 10);
  const pool = CATEGORIES.filter(c => c.level <= maxLevel);
  return pool[Math.floor(Math.random() * pool.length)].text;
}

// --- Game Start ---
function startGame() {
  syncActivePlayers(players, scores);
  const active = getActivePlayers(players);

  if (gameMode === 'multi' && active.length < 2) {
    showToast('みんなでモードは2人以上必要です');
    return;
  }
  if (active.length < 1) {
    showToast('プレイヤーを1人以上登録してください');
    return;
  }

  roundPlayers = [...active];
  round = 0;

  // Reset scores for new game
  for (const p of roundPlayers) scores[p] = 0;

  if (gameMode === 'solo') {
    startSoloRound();
  } else {
    startMultiRound();
  }
}

// ==================== SOLO MODE ====================
function startSoloRound() {
  round++;
  currentCategory = pickCategory();
  soloCount = 0;
  soloTapTimes = [];
  wordsUsed = [];
  timerDuration = 60000;
  timerLeft = 60;
  roundStartTime = Date.now();

  gameActive = true;
  showPhase('gamePhase');
  document.getElementById('categoryLabel').textContent = currentCategory;
  document.getElementById('bombIcon').className = 'bomb';
  document.getElementById('bombIcon').style.display = 'none';
  document.getElementById('currentPlayerName').textContent = roundPlayers[0];
  document.getElementById('wordTags').innerHTML = '';
  document.getElementById('wordTags').style.display = 'none';
  document.getElementById('soloCounter').style.display = '';
  document.getElementById('soloCount').textContent = '0';
  document.getElementById('tapBtn').textContent = '送信';
  document.getElementById('wordInput').value = '';
  document.getElementById('wordInput').disabled = false;
  document.getElementById('fuseFill').style.width = '100%';
  document.getElementById('fuseFill').className = 'fuse-fill';
  document.getElementById('timerText').textContent = '残り 60秒';

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerLeft--;
    const pct = Math.max(0, (timerLeft / 60) * 100);
    document.getElementById('fuseFill').style.width = pct + '%';
    if (timerLeft <= 10) document.getElementById('fuseFill').className = 'fuse-fill danger';
    document.getElementById('timerText').textContent = `残り ${timerLeft}秒`;
    if (timerLeft <= 5) playBeep(800, 100);
    if (timerLeft <= 0) {
      clearInterval(timerInterval);
      playBeep(400, 500);
      endSoloRound();
    }
  }, 1000);
}

function endSoloRound() {
  gameActive = false;
  document.getElementById('wordInput').disabled = true;
  const player = roundPlayers[0];
  scores[player] = (scores[player] || 0) + soloCount;

  // DDA update
  if (soloCount >= 15) updateDDALevel('word-burst', true);
  else if (soloCount <= 5) updateDDALevel('word-burst', false);

  // Cognitive log
  logs.unshift({
    timestamp: new Date().toISOString(), round,
    player, category: currentCategory,
    wordCount: soloCount, tapIntervals: soloTapTimes,
    duration: 60000,
  });

  // Save play log
  savePlayLog('word-burst', soloCount, Math.max(soloCount, 20), {
    playMode: 'solo',
    cognitive: {
      medianRT: soloTapTimes.length ? median(soloTapTimes) : 0,
      wordCount: soloCount,
      difficulty: getDDALevel('word-burst'),
    }
  });

  if (round < totalRounds) {
    showRoundResult(false);
  } else {
    showFinalResult();
  }
  renderScoreboard(); renderLog(); saveState();
}

// ==================== MULTI MODE ====================
function startMultiRound() {
  round++;
  currentCategory = pickCategory();
  wordsUsed = [];
  wordsPerPlayer = {};
  for (const p of roundPlayers) wordsPerPlayer[p] = 0;
  currentPlayerIndex = 0;
  timerDuration = 60000 + Math.floor(Math.random() * 60001); // 60-120s
  timerLeft = Math.ceil(timerDuration / 1000);
  roundStartTime = Date.now();

  gameActive = true;
  showPhase('gamePhase');
  document.getElementById('categoryLabel').textContent = currentCategory;
  document.getElementById('bombIcon').style.display = '';
  document.getElementById('bombIcon').className = 'bomb';
  document.getElementById('currentPlayerName').textContent = roundPlayers[currentPlayerIndex];
  document.getElementById('wordTags').innerHTML = '';
  document.getElementById('wordTags').style.display = 'none';
  document.getElementById('soloCounter').style.display = 'none';
  document.getElementById('tapBtn').textContent = '送信';
  document.getElementById('wordInput').value = '';
  document.getElementById('wordInput').disabled = false;
  const totalSec = Math.ceil(timerDuration / 1000);
  document.getElementById('fuseFill').style.width = '100%';
  document.getElementById('fuseFill').className = 'fuse-fill';
  document.getElementById('timerText').textContent = '';

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerLeft--;
    const totalSec = Math.ceil(timerDuration / 1000);
    const pct = Math.max(0, (timerLeft / totalSec) * 100);
    document.getElementById('fuseFill').style.width = pct + '%';
    if (pct <= 30) {
      document.getElementById('fuseFill').className = 'fuse-fill danger';
      document.getElementById('bombIcon').className = 'bomb danger';
    }
    if (timerLeft <= 10) playBeep(800, 100);
    if (timerLeft <= 0) {
      clearInterval(timerInterval);
      multiExplode(false);
    }
  }, 1000);
}

function multiExplode(isDuplicate) {
  gameActive = false;
  const explodedPlayer = roundPlayers[currentPlayerIndex];
  const penalty = isDuplicate ? -1 : -10;
  scores[explodedPlayer] = (scores[explodedPlayer] || 0) + penalty;

  // Show explosion overlay
  playBuzz();
  const overlay = document.getElementById('explosionOverlay');
  document.getElementById('explosionPlayer').textContent = isDuplicate
    ? `${explodedPlayer} - 被り！ ${penalty}pt`
    : `${explodedPlayer} - 爆発！ ${penalty}pt`;
  overlay.style.display = 'flex';
  document.getElementById('wordInput').disabled = true;

  // Particles
  emitParticles(window.innerWidth / 2, window.innerHeight / 2);

  if (isDuplicate) {
    // Duplicate: resume after explosion, move to next player
    setTimeout(() => {
      overlay.style.display = 'none';
      gameActive = true;
      document.getElementById('wordInput').disabled = false;
      document.getElementById('wordInput').value = '';
      document.getElementById('wordInput').focus();
      advanceMultiPlayer();
    }, 1500);
  } else {
    // Timer explosion: end round
    setTimeout(() => {
      overlay.style.display = 'none';
      endMultiRound(explodedPlayer);
    }, 1500);
  }
}

function advanceMultiPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % roundPlayers.length;
  document.getElementById('currentPlayerName').textContent = roundPlayers[currentPlayerIndex];
}

function endMultiRound(explodedPlayer) {
  clearInterval(timerInterval);
  const totalWords = wordsUsed.length;

  // Cognitive log
  logs.unshift({
    timestamp: new Date().toISOString(), round,
    category: currentCategory,
    wordsPerPlayer: { ...wordsPerPlayer },
    explodedPlayer,
    totalWords,
    timerDuration,
  });

  // Save play log
  savePlayLog('word-burst', totalWords, totalWords + 5, {
    playMode: 'centerpiece',
    cognitive: {
      difficulty: getDDALevel('word-burst'),
      wordsPerPlayer: { ...wordsPerPlayer },
      totalWords,
    }
  });

  if (round < totalRounds) {
    showRoundResult(true);
  } else {
    showFinalResult();
  }
  renderScoreboard(); renderLog(); saveState();
}

// ==================== INPUT HANDLER ====================
function onWordSubmit(e) {
  e.preventDefault();
  if (!gameActive) return;

  const $input = document.getElementById('wordInput');
  const word = $input.value.trim();
  if (!word) return;

  // Normalize for duplicate check (lowercase, katakana→hiragana)
  const normalized = word.toLowerCase().replace(/[\u30A1-\u30F6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );

  const isDuplicate = wordsUsed.some(w => w.normalized === normalized);

  if (gameMode === 'solo') {
    if (isDuplicate) {
      // Shake input, don't count
      $input.classList.add('shake');
      setTimeout(() => $input.classList.remove('shake'), 300);
      playBuzz();
      showToast('もう出た言葉です！');
      $input.value = '';
      return;
    }

    soloCount++;
    const now = Date.now();
    if (soloTapTimes.length > 0) {
      soloTapTimes.push(now - (roundStartTime + soloTapTimes.reduce((a, b) => a + b, 0)));
    } else {
      soloTapTimes.push(now - roundStartTime);
    }
    wordsUsed.push({ word, normalized });

    document.getElementById('soloCount').textContent = soloCount;
    playBeep(600 + soloCount * 10, 60);
    const counter = document.getElementById('soloCount');
    counter.style.transform = 'scale(1.2)';
    setTimeout(() => { counter.style.transform = ''; }, 100);
  } else {
    // Multi mode
    const player = roundPlayers[currentPlayerIndex];

    if (isDuplicate) {
      $input.value = '';
      multiExplode(true);
      return;
    }

    wordsPerPlayer[player] = (wordsPerPlayer[player] || 0) + 1;
    wordsUsed.push({ word, normalized });
    playBeep(800, 60);
    advanceMultiPlayer();
  }

  $input.value = '';
  $input.focus();
}

// ==================== ROUND/FINAL RESULTS ====================
function showRoundResult(isMulti) {
  showPhase('roundResultPhase');

  if (isMulti) {
    const sorted = [...roundPlayers].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
    document.getElementById('roundResultIcon').textContent = '💣';
    document.getElementById('roundResultTitle').textContent = `ラウンド ${round} 終了！`;
    let details = `カテゴリ: <strong>${esc(currentCategory)}</strong><br>`;
    details += sorted.map(p => `${esc(p)}: <strong>${scores[p] || 0}pt</strong>`).join('<br>');
    document.getElementById('roundResultDetails').innerHTML = details;
  } else {
    document.getElementById('roundResultIcon').textContent = soloCount >= 15 ? '🔥' : soloCount >= 10 ? '🎉' : '👍';
    document.getElementById('roundResultTitle').textContent = `${soloCount}個！`;
    document.getElementById('roundResultDetails').innerHTML =
      `カテゴリ: <strong>${esc(currentCategory)}</strong><br>ラウンド ${round} / ${totalRounds}`;
  }
  document.getElementById('nextRoundBtn').textContent = '次のラウンドへ';
}

function showFinalResult() {
  showPhase('resultPhase');

  if (gameMode === 'solo') {
    const player = roundPlayers[0];
    const total = scores[player] || 0;
    document.getElementById('resultIcon').textContent = total >= 30 ? '🔥' : total >= 15 ? '🎉' : '👍';
    document.getElementById('resultTitle').textContent = `${esc(player)}: 合計 ${total}個！`;
    document.getElementById('resultDetails').innerHTML =
      `${totalRounds}ラウンドの合計スコア`;

    let extraHTML = renderBestBadge('word-burst', total);
    extraHTML += renderGameRecommendation('word-burst');
    document.getElementById('resultExtra').innerHTML = extraHTML;

    if (total >= 20) {
      const rect = document.getElementById('resultTitle').getBoundingClientRect();
      emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  } else {
    const sorted = [...roundPlayers].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
    const winner = sorted[0];
    document.getElementById('resultIcon').textContent = '🏆';
    document.getElementById('resultTitle').textContent = `${esc(winner)} の勝ち！`;
    let details = sorted.map((p, i) => {
      const medal = i === 0 ? '👑 ' : '';
      return `${medal}${esc(p)}: <strong>${scores[p] || 0}pt</strong>`;
    }).join('<br>');
    document.getElementById('resultDetails').innerHTML = details;

    let extraHTML = renderBestBadge('word-burst', scores[winner] || 0);
    extraHTML += renderGameRecommendation('word-burst');
    document.getElementById('resultExtra').innerHTML = extraHTML;

    if ((scores[winner] || 0) > 0) {
      const rect = document.getElementById('resultTitle').getBoundingClientRect();
      emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }
}

function nextRound() {
  if (gameMode === 'solo') {
    startSoloRound();
  } else {
    startMultiRound();
  }
}

function backToSetup() {
  clearInterval(timerInterval);
  showPhase('setupPhase');
}

// ==================== SCOREBOARD & LOG ====================
function renderScoreboard() {
  if (players.length === 0) { $scoreboard.style.display = 'none'; return; }
  $scoreboard.style.display = '';
  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  $scoreRows.innerHTML = sorted.map((p, i) => {
    const medal = i === 0 && (scores[p] || 0) > 0 ? '👑' : '';
    return `<span class="score-item"><span class="name">${medal}${esc(p)}</span><span class="pts">${scores[p] || 0}</span></span>`;
  }).join('');
}
function renderLog() {
  if (logs.length === 0) { $answerLog.style.display = 'none'; return; }
  $answerLog.style.display = '';
  $logEntries.innerHTML = logs.slice(0, 10).map(l => {
    if (l.wordCount !== undefined) {
      // Solo log
      return `<div class="log-entry"><span>R${l.round} ${esc(l.player)}</span><span>${l.wordCount}個 (${esc(l.category)})</span></div>`;
    } else {
      // Multi log
      return `<div class="log-entry"><span>R${l.round} ${esc(l.category)}</span><span>${l.totalWords}語 💥${esc(l.explodedPlayer)}</span></div>`;
    }
  }).join('');
}
function clearAllLogs() {
  showToast('リセットしました'); logs = []; round = 0;
  for (const p of players) scores[p] = 0;
  renderScoreboard(); renderLog(); saveState();
}

// ==================== INIT ====================
(function init() {
  loadState();
  initSessionPlayers(players, scores);
  renderPlayers(); renderScoreboard(); renderLog();
  // Restore UI selections
  document.querySelectorAll('#modePills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === gameMode));
  document.querySelectorAll('#roundPills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === String(totalRounds)));
})();
