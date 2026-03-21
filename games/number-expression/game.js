/* ===== 数字deコトバ (Number Expression) ===== */

// --- Theme Data ---
const THEMES = {
  emotion: [
    '怖いもの', '嬉しいこと', '悲しいこと', '恥ずかしいこと',
    '怒りを感じること', 'ドキドキすること', '切ないもの',
    '感動すること', 'ホッとすること', '退屈なこと',
    'テンションが上がること', '癒されるもの',
  ],
  daily: [
    '朝起きたくない度', '混んでるもの', '値段が高いもの',
    '重いもの', '長いもの', '速いもの', '硬いもの',
    '臭いもの', 'うるさいもの', '眩しいもの',
    '面倒くさいこと', 'あるある度',
  ],
  food: [
    '辛いもの', '甘いもの', '酸っぱいもの', '苦いもの',
    'カロリーが高い食べ物', '高級な食べ物', '子供が好きな食べ物',
    '大人の味', '夏に食べたいもの', '冬に食べたいもの',
    'おなかいっぱいになるもの', 'クセが強い食べ物',
  ],
  experience: [
    '人生で大事なもの', '旅行先の遠さ', 'ロマンチックな場所',
    '仕事のやりがい', '授業の楽しさ', '運動のキツさ',
    '趣味にかけるお金', 'ストレス解消効果',
    '朝のルーティンの重要度', '寝る前にしたいこと',
    'もらって嬉しいプレゼント', '自慢できること',
  ],
  subculture: [
    'アニメキャラの強さ', 'ゲームの難易度', '映画の泣ける度',
    '曲のテンション', 'SNSでバズりそうなこと',
    'マンガの名シーンの衝撃度', 'アプリの中毒性', '推しの尊さ',
    'ホラー映画の怖さ', '二度見するもの',
    'ツッコミどころ', '声に出して読みたい日本語',
  ],
};

const STORAGE_KEY = 'numberexpression_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '💖', '🎲'];

// --- State ---
let players = [];
let scores = {};
let logs = [];
let round = 0;
let themeCategory = 'all';
let numberRange = 100;
let usedThemes = [];

// Round state
let currentTheme = null;
let assignments = {};      // {player: number}
let hints = {};            // {player: text}
let confirmOrder = [];
let confirmIndex = 0;
let submittedOrder = [];

// --- DOM ---
const $setupPhase = document.getElementById('setupPhase');
const $distributionPhase = document.getElementById('distributionPhase');
const $hintPhase = document.getElementById('hintPhase');
const $orderPhase = document.getElementById('orderPhase');
const $resultPhase = document.getElementById('resultPhase');
const $scoreboard = document.getElementById('scoreboard');
const $scoreRows = document.getElementById('scoreRows');
const $answerLog = document.getElementById('answerLog');
const $logEntries = document.getElementById('logEntries');
const $playerList = document.getElementById('playerList');

// --- Helpers ---
function showToast(msg, dur = 2000) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), dur);
}
function emitParticles(x, y) {
  const c = document.getElementById('particles');
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('span'); p.className = 'particle';
    p.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
    const a = (Math.PI * 2 * i) / 8 + (Math.random() - .5) * .5;
    const d = 60 + Math.random() * 80;
    const tx = Math.cos(a) * d, ty = Math.sin(a) * d;
    p.style.left = x + 'px'; p.style.top = y + 'px';
    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px,${ty}px) scale(.3)`, opacity: 0 }
    ], { duration: 800, easing: 'ease-out', fill: 'forwards' });
    c.appendChild(p); setTimeout(() => p.remove(), 900);
  }
}
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// --- Persistence ---
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({
    players, scores, logs, round, themeCategory, numberRange, usedThemes
  })); } catch (e) {}
}
function loadState() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) { const s = JSON.parse(r);
      if (s.players) players = s.players;
      if (s.scores) scores = s.scores;
      if (s.logs) logs = s.logs;
      if (s.round) round = s.round;
      if (s.themeCategory) themeCategory = s.themeCategory;
      if (s.numberRange) numberRange = s.numberRange;
      if (s.usedThemes) usedThemes = s.usedThemes;
    }
    if (players.length === 0) {
      const sh = localStorage.getItem(SHARED_PLAYERS_KEY);
      if (sh) { const sp = JSON.parse(sh);
        if (Array.isArray(sp) && sp.length > 0) { players = sp; for (const p of players) scores[p] = scores[p] || 0; }
      }
    }
  } catch (e) {}
}
function saveSharedPlayers() { try { localStorage.setItem(SHARED_PLAYERS_KEY, JSON.stringify(players)); } catch (e) {} }

// --- Player Management ---
function addPlayer() {
  const input = document.getElementById('playerNameInput');
  const name = input.value.trim();
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

// --- Options ---
function selectOption(type, btn) {
  btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  if (type === 'theme') themeCategory = btn.dataset.value;
  if (type === 'range') numberRange = parseInt(btn.dataset.value);
}

// --- Phase ---
function showPhase(id) {
  [$setupPhase, $distributionPhase, $hintPhase, $orderPhase, $resultPhase].forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = '';
}

// --- Game Flow ---
function startGame() {
  syncActivePlayers(players,scores);
  if (getActivePlayers(players).length < 3) { showToast('プレイヤーを3人以上登録してください'); return; }
  beginRound();
}

function beginRound() {
  round++;
  assignments = {}; hints = {}; submittedOrder = [];

  // Pick theme
  let pool;
  if (themeCategory === 'all') {
    pool = Object.values(THEMES).flat();
  } else {
    pool = THEMES[themeCategory] || [];
  }
  pool = pool.filter(t => !usedThemes.includes(t));
  if (pool.length === 0) { usedThemes = []; pool = themeCategory === 'all' ? Object.values(THEMES).flat() : (THEMES[themeCategory] || []); }
  currentTheme = pool[Math.floor(Math.random() * pool.length)];
  usedThemes.push(currentTheme);

  // Assign numbers (no duplicates)
  const activePlayers = getActivePlayers(players);
  const nums = [];
  while (nums.length < activePlayers.length) {
    const n = Math.floor(Math.random() * numberRange) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  const shuffled = [...activePlayers].sort(() => Math.random() - .5);
  shuffled.forEach((p, i) => { assignments[p] = nums[i]; });

  // Confirm order
  confirmOrder = [...activePlayers].sort(() => Math.random() - .5);
  confirmIndex = 0;

  showDistributionPhase();
  renderScoreboard(); renderLog(); saveState();
}

// --- Distribution Phase ---
function showDistributionPhase() {
  showPhase('distributionPhase');
  document.getElementById('distRound').textContent = `ラウンド ${round}`;
  document.getElementById('distTheme').textContent = currentTheme;
  document.getElementById('distThemeHint').textContent = `${currentTheme}の度合いを1〜${numberRange}で表す数字が配られます`;
  updateDistUI();
}

function updateDistUI() {
  const p = confirmOrder[confirmIndex];
  document.getElementById('distPlayerName').textContent = `${p} の番です`;
  document.getElementById('distDots').innerHTML = confirmOrder.map((_, i) => {
    const cls = i < confirmIndex ? 'done' : i === confirmIndex ? 'current' : '';
    return `<div class="confirm-dot ${cls}"></div>`;
  }).join('');
  document.getElementById('numberCard').style.display = '';
  document.getElementById('numberRevealed').style.display = 'none';
}

function revealNumber() {
  const p = confirmOrder[confirmIndex];
  document.getElementById('numberCard').style.display = 'none';
  document.getElementById('numberRevealed').style.display = '';
  document.getElementById('myNumber').textContent = assignments[p];
  document.getElementById('myNumberHint').textContent = `この度合いに合う「${currentTheme}」を考えてね`;
}

function confirmAndNext() {
  confirmIndex++;
  if (confirmIndex >= confirmOrder.length) {
    showHintPhase();
  } else {
    updateDistUI();
  }
}

// --- Hint Phase ---
function showHintPhase() {
  showPhase('hintPhase');
  document.getElementById('hintRound').textContent = `ラウンド ${round}`;
  document.getElementById('hintTheme').textContent = currentTheme;
  renderHintList();
}

function renderHintList() {
  const list = document.getElementById('hintList');
  list.innerHTML = players.map(p => {
    if (hints[p]) {
      return `<div class="hint-item">
        <span class="hint-name">${esc(p)}</span>
        <span class="hint-text">「${esc(hints[p])}」</span>
        <span class="hint-status">✅</span>
      </div>`;
    }
    return `<div class="hint-item">
      <span class="hint-name">${esc(p)}</span>
      <input class="hint-input" id="hint-${esc(p)}" type="text" placeholder="ヒントを入力"
             onkeydown="if(event.key==='Enter')submitHint('${esc(p)}')">
      <button class="hint-done" onclick="submitHint('${esc(p)}')">決定</button>
    </div>`;
  }).join('');

  const allDone = players.every(p => hints[p]);
  document.getElementById('allHintsBtn').style.display = allDone ? '' : 'none';
}

function submitHint(player) {
  const input = document.getElementById(`hint-${player}`);
  if (!input) return;
  const text = input.value.trim();
  if (!text) { showToast('ヒントを入力してください'); return; }
  hints[player] = text;
  renderHintList();
}

// --- Order Phase ---
function startOrderPhase() {
  showPhase('orderPhase');
  document.getElementById('orderRound').textContent = `ラウンド ${round}`;
  document.getElementById('orderTheme').textContent = currentTheme;

  // Initial order: shuffled
  submittedOrder = [...getActivePlayers(players)].sort(() => Math.random() - .5);
  renderSortList();
}

function renderSortList() {
  const list = document.getElementById('sortList');
  list.innerHTML = submittedOrder.map((p, i) => `
    <div class="sort-item" data-index="${i}" draggable="false">
      <span class="drag-handle">≡</span>
      <span class="sort-name">${esc(p)}</span>
      <span class="sort-hint">「${esc(hints[p] || '')}」</span>
    </div>
  `).join('');
  initDragSort();
}

// --- Touch Drag Sort ---
let dragItem = null;
let dragStartY = 0;
let dragIndex = -1;

function initDragSort() {
  const items = document.querySelectorAll('.sort-item');
  items.forEach(item => {
    item.addEventListener('touchstart', onDragStart, { passive: false });
    item.addEventListener('mousedown', onDragStart);
  });
}

function onDragStart(e) {
  e.preventDefault();
  dragItem = e.currentTarget;
  dragIndex = parseInt(dragItem.dataset.index);
  dragStartY = (e.touches ? e.touches[0].clientY : e.clientY);
  dragItem.classList.add('dragging');
  document.addEventListener('touchmove', onDragMove, { passive: false });
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('touchend', onDragEnd);
  document.addEventListener('mouseup', onDragEnd);
}

function onDragMove(e) {
  e.preventDefault();
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  const items = [...document.querySelectorAll('.sort-item')];
  // Find which item we're over
  for (let i = 0; i < items.length; i++) {
    if (i === dragIndex) continue;
    const rect = items[i].getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    if (y < mid && i < dragIndex) {
      // Move up
      submittedOrder.splice(dragIndex, 1);
      submittedOrder.splice(i, 0, submittedOrder.splice(dragIndex - 1, 1)[0] || players[0]);
      // Rebuild
      const p = submittedOrder;
      submittedOrder = [...p.slice(0, i), players.find(pl => pl === dragItem.querySelector('.sort-name').textContent), ...p.slice(i).filter(x => x !== dragItem.querySelector('.sort-name').textContent)];
      dragIndex = i;
      renderSortList();
      // Re-highlight
      document.querySelectorAll('.sort-item')[i]?.classList.add('dragging');
      dragItem = document.querySelectorAll('.sort-item')[i];
      return;
    }
    if (y > mid && i > dragIndex) {
      const name = dragItem.querySelector('.sort-name').textContent;
      submittedOrder.splice(dragIndex, 1);
      submittedOrder.splice(i, 0, name);
      dragIndex = i;
      renderSortList();
      document.querySelectorAll('.sort-item')[i]?.classList.add('dragging');
      dragItem = document.querySelectorAll('.sort-item')[i];
      return;
    }
  }
}

function onDragEnd() {
  if (dragItem) dragItem.classList.remove('dragging');
  dragItem = null;
  document.removeEventListener('touchmove', onDragMove);
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('touchend', onDragEnd);
  document.removeEventListener('mouseup', onDragEnd);
}

// --- Also support tap-to-swap for simpler interaction ---
let swapFirst = null;
document.addEventListener('click', (e) => {
  const item = e.target.closest('.sort-item');
  if (!item || dragItem) return;
  const idx = parseInt(item.dataset.index);
  if (swapFirst === null) {
    swapFirst = idx;
    item.style.outline = '2px solid #06b6d4';
  } else {
    // Swap
    const temp = submittedOrder[swapFirst];
    submittedOrder[swapFirst] = submittedOrder[idx];
    submittedOrder[idx] = temp;
    swapFirst = null;
    renderSortList();
  }
});

// --- Result ---
function submitOrder() {
  showPhase('resultPhase');

  const activePlayers = getActivePlayers(players);
  const correctOrder = [...activePlayers].sort((a, b) => assignments[a] - assignments[b]);
  let correctPairs = 0;
  const totalPairs = activePlayers.length - 1;
  const pairHTML = [];

  for (let i = 0; i < totalPairs; i++) {
    const p1 = submittedOrder[i], p2 = submittedOrder[i + 1];
    const correct = assignments[p1] <= assignments[p2];
    if (correct) correctPairs++;
    pairHTML.push(`<div class="pair-row">
      <span>${esc(p1)}(${assignments[p1]}) → ${esc(p2)}(${assignments[p2]})</span>
      <span class="${correct ? 'pair-correct' : 'pair-wrong'}">${correct ? '⭕' : '❌'}</span>
    </div>`);
  }

  // Score: individual scoring based on each player's adjacent pair accuracy
  // Each player gets points based on whether THEIR neighbors are in correct order
  const playerScores = {};
  for (let i = 0; i < submittedOrder.length; i++) {
    const p = submittedOrder[i];
    const leftOK = i === 0 || assignments[submittedOrder[i - 1]] <= assignments[submittedOrder[i]];
    const rightOK = i === submittedOrder.length - 1 || assignments[submittedOrder[i]] <= assignments[submittedOrder[i + 1]];
    let pts = 0;
    if (leftOK && rightOK) pts = 3;      // both neighbors correct
    else if (leftOK || rightOK) pts = 1;  // one neighbor correct
    // else 0
    playerScores[p] = pts;
    scores[p] = (scores[p] || 0) + pts;
  }
  // Perfect bonus: everyone gets +2 extra if all pairs correct
  if (correctPairs === totalPairs) {
    for (const p of submittedOrder) scores[p] = (scores[p] || 0) + 2;
  }

  // Display
  const $icon = document.getElementById('resultIcon');
  const $title = document.getElementById('resultTitle');
  const $pairs = document.getElementById('pairResults');
  const $score = document.getElementById('resultScore');

  if (correctPairs === totalPairs) {
    $icon.textContent = '🎉';
    $title.textContent = 'パーフェクト！全問正解！';
    const rect = $title.getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  } else if (correctPairs > 0) {
    $icon.textContent = '👍';
    $title.textContent = `${correctPairs}/${totalPairs}ペア正解！`;
  } else {
    $icon.textContent = '😅';
    $title.textContent = `${correctPairs}/${totalPairs}ペア正解...`;
  }

  // Show all assignments with hints
  let revealHTML = '<div style="margin-bottom:.5rem;font-size:.8rem;font-weight:700;">正解の順番:</div>';
  correctOrder.forEach(p => {
    revealHTML += `<div style="font-size:.8rem;padding:.1rem 0;"><strong>${assignments[p]}</strong> — ${esc(p)}「${esc(hints[p] || '')}」</div>`;
  });
  revealHTML += '<div style="margin-top:.5rem;font-size:.75rem;color:var(--text-muted);font-weight:700;">ペア判定:</div>';
  revealHTML += pairHTML.join('');
  $pairs.innerHTML = revealHTML;

  let scoreText = '';
  if (correctPairs === totalPairs) {
    scoreText = 'パーフェクトボーナス: 全員+2pt！\n';
  }
  submittedOrder.forEach(p => {
    const pts = playerScores[p] || 0;
    const bonus = correctPairs === totalPairs ? '+2' : '';
    scoreText += `${esc(p)}: +${pts}pt${bonus ? '(+2ボーナス)' : ''} `;
  });
  $score.textContent = scoreText;

  // Log
  logs.unshift({
    timestamp: new Date().toISOString(),
    round, theme: currentTheme,
    playerCount: players.length, numberRange,
    correctPairs, totalPairs,
  });

  savePlayLog('number-expression', correctPairs, totalPairs, {
    playMode: 'centerpiece',
    cognitive: { difficulty: 1 }
  });
  renderScoreboard(); renderLog(); saveState();
}

function nextRound() { showPhase('setupPhase'); }

// --- Scoreboard ---
function renderScoreboard() {
  if (players.length === 0) { $scoreboard.style.display = 'none'; return; }
  $scoreboard.style.display = '';
  const sorted = getActivePlayers(players).sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  $scoreRows.innerHTML = sorted.map((p, i) => {
    const medal = i === 0 && scores[p] > 0 ? '👑' : '';
    return `<span class="score-item"><span class="name">${medal}${esc(p)}</span><span class="pts">${scores[p] || 0}</span></span>`;
  }).join('');
}

// --- Log ---
function renderLog() {
  if (logs.length === 0) { $answerLog.style.display = 'none'; return; }
  $answerLog.style.display = '';
  $logEntries.innerHTML = logs.slice(0, 8).map(l => {
    const icon = l.correctPairs === l.totalPairs ? '🎉' : `${l.correctPairs}/${l.totalPairs}`;
    return `<div class="log-entry"><span>R${l.round}「${esc(l.theme)}」</span><span>${icon}</span></div>`;
  }).join('');
}
function clearAllLogs() {
  showToast('全ログを消去しました');
  logs = []; round = 0; usedThemes = [];
  for (const p of players) scores[p] = 0;
  renderScoreboard(); renderLog(); saveState();
}

// --- Init ---
(function init() {
  loadState();
  initSessionPlayers(players, scores);
  renderPlayers(); renderScoreboard(); renderLog();
  document.querySelectorAll('#themePills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === themeCategory));
  document.querySelectorAll('#rangePills .option-pill').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === String(numberRange)));
})();
