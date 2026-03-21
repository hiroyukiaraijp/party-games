/* ===== Shape Snap (かたちスナップ) ===== */
function median(arr) { if (!arr.length) return 0; const s = [...arr].sort((a,b) => a-b); const m = Math.floor(s.length/2); return s.length % 2 ? s[m] : (s[m-1]+s[m])/2; }
function stddev(arr) { if (arr.length < 2) return 0; const m = arr.reduce((a,b) => a+b, 0) / arr.length; return Math.sqrt(arr.reduce((s,v) => s + (v-m)**2, 0) / arr.length); }

const STORAGE_KEY = 'shapesnap_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🔷'];
const SOLO_TIME = 60;
const MULTI_QUESTIONS = 10;

// ===== Shape Definitions (SVG paths) =====
const SHAPES_SIMPLE = [
  { name: 'L', path: 'M20,20 L20,80 L60,80 L60,60 L40,60 L40,20 Z' },
  { name: 'T', path: 'M20,20 L80,20 L80,40 L60,40 L60,80 L40,80 L40,40 L20,40 Z' },
  { name: 'Z', path: 'M20,20 L50,20 L50,45 L80,45 L80,80 L50,80 L50,55 L20,55 Z' },
  { name: 'arrow', path: 'M50,15 L80,45 L65,45 L65,85 L35,85 L35,45 L20,45 Z' },
  { name: 'cross', path: 'M35,20 L65,20 L65,35 L80,35 L80,65 L65,65 L65,80 L35,80 L35,65 L20,65 L20,35 L35,35 Z' },
  { name: 'convex', path: 'M20,40 L40,40 L40,20 L60,20 L60,40 L80,40 L80,80 L20,80 Z' },
  { name: 'F', path: 'M25,15 L75,15 L75,35 L45,35 L45,45 L65,45 L65,60 L45,60 L45,85 L25,85 Z' },
  { name: 'P', path: 'M25,15 L65,15 L75,25 L75,50 L65,60 L45,60 L45,85 L25,85 Z' },
];

const SHAPES_COMPLEX = [
  { name: 'stairL', path: 'M20,20 L40,20 L40,40 L60,40 L60,60 L80,60 L80,80 L60,80 L60,60 L40,60 L40,40 L20,40 Z' },
  { name: 'hook', path: 'M25,20 L55,20 L55,35 L75,35 L75,65 L55,65 L55,80 L25,80 L25,60 L40,60 L40,50 L25,50 Z' },
  { name: 'zigzag', path: 'M20,25 L45,25 L45,40 L65,40 L65,25 L80,25 L80,55 L55,55 L55,70 L35,70 L35,55 L20,55 Z' },
  { name: 'crank', path: 'M20,20 L50,20 L50,35 L70,35 L70,50 L80,50 L80,80 L50,80 L50,65 L30,65 L30,50 L20,50 Z' },
  { name: 'notch', path: 'M20,20 L80,20 L80,50 L65,50 L65,40 L35,40 L35,50 L20,50 Z' },
];

const SHAPES_VERY_COMPLEX = [
  { name: 'puzzle', path: 'M20,20 L45,20 L45,30 L55,30 L55,20 L80,20 L80,45 L70,45 L70,55 L80,55 L80,80 L55,80 L55,70 L45,70 L45,80 L20,80 L20,55 L30,55 L30,45 L20,45 Z' },
  { name: 'castle', path: 'M20,80 L20,40 L30,40 L30,20 L40,20 L40,40 L50,40 L50,25 L60,25 L60,40 L70,40 L70,20 L80,20 L80,80 Z' },
  { name: 'key', path: 'M30,20 L50,20 L55,30 L55,45 L75,45 L75,55 L70,55 L70,60 L65,60 L65,55 L60,55 L60,60 L55,60 L55,55 L45,55 L45,65 L50,70 L50,80 L30,80 L25,70 L25,30 Z' },
  { name: 'star5', path: 'M50,15 L58,38 L82,38 L63,52 L70,76 L50,62 L30,76 L37,52 L18,38 L42,38 Z' },
  { name: 'wave', path: 'M15,50 L25,30 L40,45 L50,25 L60,45 L75,30 L85,50 L75,70 L60,55 L50,75 L40,55 L25,70 Z' },
];

const ROTATION_ANGLES = [90, 180, 270];

// ===== State =====
let players = [];
let scores = {};
let logs = [];
let round = 0;
let playMode = 'solo'; // solo | multi

// Solo state
let soloScore = 0;
let soloTotal = 0;
let timerLeft = 0;
let timerInterval = null;
let questionStartTime = 0;

// Multi state
let multiQuestion = 0;
let multiCorrectIdx = -1;
let multiRotationAngle = 0;

// Current question state
let currentCorrectIdx = -1;
let currentRotationAngle = 0;
let currentShapeName = '';

// DOM
const $setupPhase = document.getElementById('setupPhase');
const $gamePhase = document.getElementById('gamePhase');
const $multiGamePhase = document.getElementById('multiGamePhase');
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
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, logs, round, playMode })); } catch (e) {} }
function loadState() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) { const s = JSON.parse(r); if (s.players) players = s.players; if (s.scores) scores = s.scores; if (s.logs) logs = s.logs; if (s.round) round = s.round; if (s.playMode) playMode = s.playMode; }
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
  if (type === 'playMode') playMode = btn.dataset.value;
}

function showPhase(id) {
  [$setupPhase, $gamePhase, $multiGamePhase, $answererPhase, $resultPhase].forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = '';
}

// ===== Shape Generation =====
function getShapePool() {
  const level = getDDALevel('shape-snap');
  if (level >= 7) return [...SHAPES_SIMPLE, ...SHAPES_COMPLEX, ...SHAPES_VERY_COMPLEX];
  if (level >= 4) return [...SHAPES_SIMPLE, ...SHAPES_COMPLEX];
  return [...SHAPES_SIMPLE];
}

function renderSVG(path, transform) {
  const t = transform ? ` transform="${transform}"` : '';
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="#6366F1" stroke="#4338CA" stroke-width="1.5"${t}/></svg>`;
}

function generateQuestion() {
  const pool = getShapePool();
  // Pick the target shape
  const targetIdx = Math.floor(Math.random() * pool.length);
  const target = pool[targetIdx];

  // Pick rotation angle
  const angle = ROTATION_ANGLES[Math.floor(Math.random() * ROTATION_ANGLES.length)];

  // Build 4 choices:
  // 1. Correct: rotated version of target
  // 2. Mirror: flipped version of target
  // 3-4. Different shapes
  const choices = [];

  // Correct answer (rotated)
  choices.push({
    svg: renderSVG(target.path, `rotate(${angle}, 50, 50)`),
    type: 'correct'
  });

  // Mirror (flipped, optionally rotated)
  const mirrorAngle = ROTATION_ANGLES[Math.floor(Math.random() * ROTATION_ANGLES.length)];
  choices.push({
    svg: renderSVG(target.path, `scale(-1,1) translate(-100,0) rotate(${mirrorAngle}, 50, 50)`),
    type: 'mirror'
  });

  // Two different shapes
  const otherShapes = pool.filter((_, i) => i !== targetIdx);
  const shuffled = otherShapes.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 2 && i < shuffled.length; i++) {
    const otherAngle = ROTATION_ANGLES[Math.floor(Math.random() * ROTATION_ANGLES.length)];
    choices.push({
      svg: renderSVG(shuffled[i].path, `rotate(${otherAngle}, 50, 50)`),
      type: 'other'
    });
  }

  // Shuffle choices
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffledChoices = indices.map(i => choices[i]);
  const correctIdx = shuffledChoices.findIndex(c => c.type === 'correct');

  return {
    reference: renderSVG(target.path),
    choices: shuffledChoices,
    correctIdx,
    angle,
    shapeName: target.name
  };
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

// ===== Solo Mode =====
let roundPlayers = [];
let playerIndex = 0;
let currentPlayer = null;

function startGame() {
  syncActivePlayers(players, scores);
  if (getActivePlayers(players).length < 1) { showToast('プレイヤーを1人以上登録してください'); return; }
  roundPlayers = getActivePlayers(players);
  playerIndex = 0;

  if (playMode === 'solo') {
    startSoloRound();
  } else {
    startMultiRound();
  }
}

function startSoloRound() {
  currentPlayer = roundPlayers[playerIndex];
  round++;
  soloScore = 0;
  soloTotal = 0;
  timerLeft = SOLO_TIME;

  showPhase('gamePhase');
  showToast(`${currentPlayer} の番！`, 1500);

  document.getElementById('scoreDisplay').textContent = '0';
  document.getElementById('timerDisplay').textContent = `残り ${timerLeft}秒`;

  nextSoloQuestion();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerLeft--;
    document.getElementById('timerDisplay').textContent = `残り ${timerLeft}秒`;
    if (timerLeft <= 5) playBeep(800, 100);
    if (timerLeft <= 0) { clearInterval(timerInterval); playBeep(400, 500); endSoloRound(); }
  }, 1000);
}

function nextSoloQuestion() {
  const q = generateQuestion();
  currentCorrectIdx = q.correctIdx;
  currentRotationAngle = q.angle;
  currentShapeName = q.shapeName;
  questionStartTime = Date.now();

  document.getElementById('referenceShape').innerHTML = q.reference;

  const $choices = document.getElementById('shapeChoices');
  $choices.innerHTML = q.choices.map((c, i) =>
    `<div class="shape-choice" onclick="answerSolo(${i}, this)" data-type="${c.type}">
      ${c.svg}
      <span class="choice-label">${CHOICE_LABELS[i]}</span>
    </div>`
  ).join('');
}

function answerSolo(idx, el) {
  soloTotal++;
  const timeToAnswer = Date.now() - questionStartTime;
  const isCorrect = idx === currentCorrectIdx;
  const isMirrorError = !isCorrect && el && el.dataset.type === 'mirror';

  updateDDALevel('shape-snap', isCorrect);

  if (isCorrect) {
    soloScore++;
    playBeep(1000, 80);
    el.classList.add('correct');
    const rect = el.getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    setTimeout(() => nextSoloQuestion(), 300);
  } else {
    playBeep(300, 200);
    el.classList.add('wrong');
    // Highlight correct answer
    const choices = document.querySelectorAll('#shapeChoices .shape-choice');
    choices[currentCorrectIdx].classList.add('correct');
    // Shake reference
    const ref = document.querySelector('.shape-reference');
    ref.classList.add('shake');
    setTimeout(() => ref.classList.remove('shake'), 400);
    setTimeout(() => nextSoloQuestion(), 600);
  }

  document.getElementById('scoreDisplay').textContent = soloScore;

  // Log cognitive data
  logCognitiveData(isCorrect, currentRotationAngle, isMirrorError, timeToAnswer, getDDALevel('shape-snap'));
}

function endSoloRound() {
  scores[currentPlayer] = (scores[currentPlayer] || 0) + soloScore;

  logs.unshift({
    timestamp: new Date().toISOString(), round,
    player: currentPlayer, score: soloScore, total: soloTotal,
    mode: 'solo',
  });

  showPhase('resultPhase');
  document.getElementById('resultIcon').textContent = soloScore >= 20 ? '🔥' : soloScore >= 10 ? '🎉' : '👍';
  document.getElementById('resultTitle').textContent = `${currentPlayer}: ${soloScore}pt！`;
  document.getElementById('resultDetails').innerHTML =
    `<strong>${soloScore}</strong> / ${soloTotal} 問正解<br>モード: ソロ (${SOLO_TIME}秒)`;

  let extraHTML = renderBestBadge('shape-snap', soloScore);
  extraHTML += renderGameRecommendation('shape-snap');
  document.getElementById('resultExtra').innerHTML = extraHTML;

  if (soloScore >= 10) {
    const rect = document.getElementById('resultTitle').getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  const cogLog = window._cognitiveLog || [];
  const rts = cogLog.filter(e => e.correct).map(e => e.timeToAnswer);
  const mirrorErrs = cogLog.filter(e => e.isMirrorError).length;
  savePlayLog('shape-snap', soloScore, soloTotal, {
    playMode: 'solo',
    cognitive: {
      medianRT: median(rts),
      rtSD: stddev(rts),
      mirrorErrorRate: soloTotal > 0 ? mirrorErrs / soloTotal : 0,
      difficulty: getDDALevel('shape-snap'),
    }
  });
  renderScoreboard(); renderLog(); saveState();
}

// ===== Multi Mode =====
function startMultiRound() {
  round++;
  multiQuestion = 0;
  showPhase('multiGamePhase');
  nextMultiQuestionDisplay();
}

function nextMultiQuestionDisplay() {
  multiQuestion++;
  if (multiQuestion > MULTI_QUESTIONS) {
    endMultiRound();
    return;
  }

  const q = generateQuestion();
  multiCorrectIdx = q.correctIdx;
  multiRotationAngle = q.angle;
  currentShapeName = q.shapeName;
  questionStartTime = Date.now();

  document.getElementById('multiProgress').textContent = `${multiQuestion} / ${MULTI_QUESTIONS}`;
  document.getElementById('multiReferenceShape').innerHTML = q.reference;

  const $choices = document.getElementById('multiShapeChoices');
  $choices.innerHTML = q.choices.map((c, i) =>
    `<div class="shape-choice" data-type="${c.type}" data-idx="${i}">
      ${c.svg}
      <span class="choice-label">${CHOICE_LABELS[i]}</span>
    </div>`
  ).join('');

  document.getElementById('revealBtn').style.display = '';
  showPhase('multiGamePhase');
}

function revealAnswer() {
  const timeToAnswer = Date.now() - questionStartTime;
  document.getElementById('revealBtn').style.display = 'none';

  // Highlight correct/wrong
  const choices = document.querySelectorAll('#multiShapeChoices .shape-choice');
  choices.forEach((el, i) => {
    if (i === multiCorrectIdx) {
      el.classList.add('correct');
    } else {
      el.classList.add('disabled');
    }
  });

  playBeep(1000, 80);

  // Log cognitive data for multi (no individual answer tracking, just question data)
  logCognitiveData(true, multiRotationAngle, false, timeToAnswer, getDDALevel('shape-snap'));

  // Show answerer selection
  setTimeout(() => showAnswererPhase(), 800);
}

function showAnswererPhase() {
  showPhase('answererPhase');
  const activePlayers = getActivePlayers(players);

  // Correct answerers
  document.getElementById('answererGrid').innerHTML = activePlayers.map(p =>
    `<button class="answerer-btn" onclick="toggleAnswerer(this, '${esc(p)}', 'correct')">${esc(p)}</button>`
  ).join('');

  // Wrong answerers (-1pt)
  document.getElementById('wrongGrid').innerHTML = activePlayers.map(p =>
    `<button class="answerer-btn" onclick="toggleAnswerer(this, '${esc(p)}', 'wrong')">${esc(p)}</button>`
  ).join('');
}

function toggleAnswerer(btn, name, type) {
  if (type === 'correct') {
    btn.classList.toggle('selected');
  } else {
    btn.classList.toggle('wrong-selected');
  }
}

function nextMultiQuestion() {
  // Award points
  const correctBtns = document.querySelectorAll('#answererGrid .answerer-btn.selected');
  correctBtns.forEach(btn => {
    const name = btn.textContent;
    if (scores[name] !== undefined) {
      scores[name] = (scores[name] || 0) + 1;
    }
  });

  // Deduct points for wrong answers
  const wrongBtns = document.querySelectorAll('#wrongGrid .answerer-btn.wrong-selected');
  wrongBtns.forEach(btn => {
    const name = btn.textContent;
    if (scores[name] !== undefined) {
      scores[name] = (scores[name] || 0) - 1;
    }
  });

  updateDDALevel('shape-snap', correctBtns.length > 0);

  renderScoreboard(); saveState();
  nextMultiQuestionDisplay();
}

function endMultiRound() {
  logs.unshift({
    timestamp: new Date().toISOString(), round,
    player: 'みんなで', total: MULTI_QUESTIONS,
    mode: 'multi',
  });

  showPhase('resultPhase');
  const activePlayers = getActivePlayers(players);
  const sorted = [...activePlayers].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  const winner = sorted[0];
  const winnerScore = scores[winner] || 0;

  document.getElementById('resultIcon').textContent = '🏆';
  document.getElementById('resultTitle').textContent = winnerScore > 0 ? `${winner} がトップ！` : 'ラウンド終了！';
  document.getElementById('resultDetails').innerHTML =
    sorted.map(p => `<strong>${esc(p)}</strong>: ${scores[p] || 0}pt`).join('<br>');

  let extraHTML = renderBestBadge('shape-snap', winnerScore);
  extraHTML += renderGameRecommendation('shape-snap');
  document.getElementById('resultExtra').innerHTML = extraHTML;

  if (winnerScore >= 5) {
    const rect = document.getElementById('resultTitle').getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  savePlayLog('shape-snap', winnerScore, MULTI_QUESTIONS, {
    playMode: 'centerpiece',
    cognitive: { difficulty: getDDALevel('shape-snap') }
  });
  renderScoreboard(); renderLog(); saveState();
}

function nextRound() {
  if (playMode === 'solo') {
    playerIndex++;
    if (playerIndex < roundPlayers.length) {
      startSoloRound();
    } else {
      showPhase('setupPhase');
    }
  } else {
    showPhase('setupPhase');
  }
}

// ===== Cognitive Data Logging =====
function logCognitiveData(correct, rotationAngle, isMirrorError, timeToAnswer, complexity) {
  // Store cognitive data for analysis (kept in memory, could be extended to persist)
  const entry = {
    timestamp: Date.now(),
    correct,
    rotationAngle,
    isMirrorError,
    timeToAnswer,
    complexity,
  };
  // Could be sent to analytics or stored
  if (typeof window._cognitiveLog === 'undefined') window._cognitiveLog = [];
  window._cognitiveLog.push(entry);
}

// ===== Scoreboard & Log =====
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
    `<div class="log-entry"><span>R${l.round} ${esc(l.player)}</span><span>${l.score !== undefined ? l.score + 'pt' : ''} (${l.total}問)</span></div>`
  ).join('');
}
function clearAllLogs() {
  showToast('リセットしました'); logs = []; round = 0;
  for (const p of players) scores[p] = 0;
  renderScoreboard(); renderLog(); saveState();
}

// ===== Init =====
(function init() {
  loadState();
  initSessionPlayers(players, scores);
  renderPlayers(); renderScoreboard(); renderLog();
  document.querySelectorAll('#modePills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === playMode));
})();
