/* ===== Hint Bridge (連想ブリッジ) ===== */

const TOPICS = {
  things: [
    { cat: '食べ物', word: 'カレーライス' }, { cat: '食べ物', word: 'ラーメン' },
    { cat: '食べ物', word: 'お寿司' }, { cat: '食べ物', word: 'たこ焼き' },
    { cat: '食べ物', word: 'ピザ' }, { cat: '食べ物', word: 'チョコレート' },
    { cat: '食べ物', word: 'おにぎり' }, { cat: '食べ物', word: 'アイスクリーム' },
    { cat: '食べ物', word: 'ハンバーガー' }, { cat: '食べ物', word: '餃子' },
    { cat: '食べ物', word: 'たい焼き' }, { cat: '食べ物', word: 'わたあめ' },
    { cat: '食べ物', word: 'クレープ' }, { cat: '食べ物', word: 'パンケーキ' },
    { cat: '食べ物', word: '焼き芋' },
    { cat: '動物', word: 'ライオン' }, { cat: '動物', word: 'ペンギン' },
    { cat: '動物', word: 'イルカ' }, { cat: '動物', word: 'パンダ' },
    { cat: '動物', word: 'カメレオン' }, { cat: '動物', word: 'クジラ' },
    { cat: '動物', word: 'フラミンゴ' }, { cat: '動物', word: 'カンガルー' },
    { cat: '動物', word: 'コウモリ' }, { cat: '動物', word: 'タコ' },
    { cat: '動物', word: 'カブトムシ' }, { cat: '動物', word: 'ナマケモノ' },
    { cat: '動物', word: 'ハリネズミ' }, { cat: '動物', word: 'ラッコ' },
    { cat: 'モノ', word: '信号機' }, { cat: 'モノ', word: '扇風機' },
    { cat: 'モノ', word: '消しゴム' }, { cat: 'モノ', word: '冷蔵庫' },
    { cat: 'モノ', word: '傘' }, { cat: 'モノ', word: '地球儀' },
    { cat: 'モノ', word: 'ピアノ' }, { cat: 'モノ', word: '望遠鏡' },
    { cat: 'モノ', word: '風鈴' }, { cat: 'モノ', word: 'けん玉' },
    { cat: 'モノ', word: 'こたつ' }, { cat: 'モノ', word: '自動販売機' },
    { cat: 'モノ', word: 'ランドセル' }, { cat: 'モノ', word: '花火' },
    { cat: 'モノ', word: 'サイコロ' }, { cat: 'モノ', word: '将棋' },
    { cat: 'モノ', word: 'エスカレーター' }, { cat: 'モノ', word: '洗濯機' },
    { cat: '乗り物', word: '新幹線' }, { cat: '乗り物', word: '飛行機' },
    { cat: '乗り物', word: 'ヘリコプター' }, { cat: '乗り物', word: '潜水艦' },
    { cat: '乗り物', word: 'ロケット' }, { cat: '乗り物', word: '気球' },
    { cat: '乗り物', word: 'ジェットコースター' }, { cat: '乗り物', word: 'ゴンドラ' },
    { cat: '自然', word: '虹' }, { cat: '自然', word: 'オーロラ' },
    { cat: '自然', word: '火山' }, { cat: '自然', word: '台風' },
    { cat: '自然', word: '流れ星' }, { cat: '自然', word: '滝' },
  ],
  people: [
    { cat: 'キャラ', word: 'ドラえもん' }, { cat: 'キャラ', word: 'ピカチュウ' },
    { cat: 'キャラ', word: 'マリオ' }, { cat: 'キャラ', word: 'アンパンマン' },
    { cat: 'キャラ', word: 'トトロ' }, { cat: 'キャラ', word: 'スヌーピー' },
    { cat: 'キャラ', word: 'ミッキーマウス' }, { cat: 'キャラ', word: '孫悟空' },
    { cat: 'キャラ', word: 'ルフィ' }, { cat: 'キャラ', word: 'ハローキティ' },
    { cat: 'キャラ', word: 'スパイダーマン' }, { cat: 'キャラ', word: 'ジブリ' },
    { cat: '職業', word: '消防士' }, { cat: '職業', word: '宇宙飛行士' },
    { cat: '職業', word: 'パティシエ' }, { cat: '職業', word: '探偵' },
    { cat: '職業', word: '忍者' }, { cat: '職業', word: '海賊' },
    { cat: '職業', word: '魔法使い' }, { cat: '職業', word: 'サンタクロース' },
    { cat: '歴史', word: '織田信長' }, { cat: '歴史', word: 'クレオパトラ' },
    { cat: '歴史', word: 'レオナルド・ダ・ヴィンチ' }, { cat: '歴史', word: 'ナポレオン' },
    { cat: '歴史', word: 'アインシュタイン' }, { cat: '歴史', word: '坂本龍馬' },
  ],
  places: [
    { cat: '国', word: 'エジプト' }, { cat: '国', word: 'ブラジル' },
    { cat: '国', word: 'オーストラリア' }, { cat: '国', word: 'インド' },
    { cat: '国', word: 'イタリア' }, { cat: '国', word: 'フランス' },
    { cat: '場所', word: '東京タワー' }, { cat: '場所', word: '富士山' },
    { cat: '場所', word: 'ディズニーランド' }, { cat: '場所', word: '北極' },
    { cat: '場所', word: 'ピラミッド' }, { cat: '場所', word: 'ハワイ' },
    { cat: '場所', word: '沖縄' }, { cat: '場所', word: '北海道' },
    { cat: '場所', word: '月' }, { cat: '場所', word: '深海' },
    { cat: '場所', word: '動物園' }, { cat: '場所', word: '水族館' },
    { cat: '場所', word: 'お化け屋敷' }, { cat: '場所', word: 'プラネタリウム' },
    { cat: '場所', word: '回転寿司' }, { cat: '場所', word: '温泉' },
    { cat: '場所', word: '図書館' }, { cat: '場所', word: 'ボウリング場' },
  ],
};

const STORAGE_KEY = 'hintbridge_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '💖', '🔗'];
const MAX_HINTS = 5;
const POINT_TABLE = [5, 4, 3, 2, 1];

// --- State ---
let players = [];
let scores = {};
let logs = [];
let round = 0;
let categoryFilter = 'all';
let usedTopics = [];
let lastPresenter = null;

// Round state
let currentPresenter = null;
let currentTopic = null;
let currentCategory = null;
let hints = [];
let hintCount = 0;
let roundStartTime = 0;

// --- DOM ---
const $setupPhase = document.getElementById('setupPhase');
const $presenterPhase = document.getElementById('presenterPhase');
const $hintPhase = document.getElementById('hintPhase');
const $answererPhase = document.getElementById('answererPhase');
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
    p.style.left = x + 'px'; p.style.top = y + 'px';
    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.3)`, opacity: 0 }
    ], { duration: 800, easing: 'ease-out', fill: 'forwards' });
    c.appendChild(p); setTimeout(() => p.remove(), 900);
  }
}
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// --- Persistence ---
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({
    players, scores, logs, round, categoryFilter, usedTopics, lastPresenter
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
      if (s.categoryFilter) categoryFilter = s.categoryFilter;
      if (s.usedTopics) usedTopics = s.usedTopics;
      if (s.lastPresenter) lastPresenter = s.lastPresenter;
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

// --- Players ---
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
  $playerList.innerHTML = players.map(p =>
    `<span class="player-tag">${esc(p)} <span class="remove" onclick="removePlayer('${esc(p)}')">&times;</span></span>`
  ).join('');
}

function selectOption(type, btn) {
  btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  if (type === 'category') categoryFilter = btn.dataset.value;
}

function showPhase(id) {
  [$setupPhase, $presenterPhase, $hintPhase, $answererPhase, $resultPhase].forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = '';
}

// --- Game Flow ---
function startGame() {
  if (players.length < 2) { showToast('プレイヤーを2人以上登録してください'); return; }
  beginRound();
}

function beginRound() {
  round++;
  hints = []; hintCount = 0; currentPresenter = null;
  roundStartTime = Date.now();

  // Pick topic
  let pool;
  if (categoryFilter === 'all') pool = Object.values(TOPICS).flat();
  else pool = TOPICS[categoryFilter] || [];
  pool = pool.filter(t => !usedTopics.includes(t.word));
  if (pool.length === 0) { usedTopics = []; pool = categoryFilter === 'all' ? Object.values(TOPICS).flat() : (TOPICS[categoryFilter] || []); }
  const pick = pool[Math.floor(Math.random() * pool.length)];
  currentTopic = pick.word; currentCategory = pick.cat;
  usedTopics.push(currentTopic);

  showPhase('presenterPhase');
  document.getElementById('presRound').textContent = `ラウンド ${round}`;

  // Presenter select
  document.getElementById('presenterGrid').innerHTML = players.map(p => {
    const rec = p === lastPresenter ? '' : '';
    return `<button class="presenter-btn" onclick="onSelectPresenter('${esc(p)}')">${esc(p)}</button>`;
  }).join('');
  document.getElementById('topicArea').style.display = 'none';

  renderScoreboard(); renderLog(); saveState();
}

function onSelectPresenter(name) {
  currentPresenter = name;
  document.querySelectorAll('.presenter-btn').forEach(b => {
    b.classList.toggle('selected', b.textContent === name);
  });
  document.getElementById('topicArea').style.display = '';
  document.getElementById('topicCard').style.display = '';
  document.getElementById('topicRevealed').style.display = 'none';
}

function revealTopic() {
  if (!currentPresenter) return;
  document.getElementById('topicCard').style.display = 'none';
  document.getElementById('topicRevealed').style.display = '';
  document.getElementById('topicCategory').textContent = currentCategory;
  document.getElementById('topicWord').textContent = currentTopic;
}

function startHinting() {
  lastPresenter = currentPresenter;
  showPhase('hintPhase');
  document.getElementById('hintRound').textContent = `ラウンド ${round}`;
  document.getElementById('hintPresenter').textContent = currentPresenter;
  renderPointBar();
  renderHintList();
  document.getElementById('hintText').value = '';
}

// --- Hints ---
function addHint() {
  if (hintCount >= MAX_HINTS) { showToast('ヒント上限です'); return; }
  hintCount++;
  const text = document.getElementById('hintText').value.trim();
  hints.push(text || `ヒント${hintCount}`);
  document.getElementById('hintText').value = '';
  renderPointBar();
  renderHintList();

  if (hintCount >= MAX_HINTS) {
    showToast('最後のヒントです！', 1500);
  }
}

function renderPointBar() {
  const bar = document.getElementById('pointBar');
  const pts = hintCount < MAX_HINTS ? POINT_TABLE[hintCount] : POINT_TABLE[MAX_HINTS - 1];
  bar.innerHTML = POINT_TABLE.map((_, i) =>
    `<span class="point-star ${i < hintCount ? 'used' : ''}">⭐</span>`
  ).join('');
  document.getElementById('pointLabel').textContent =
    hintCount >= MAX_HINTS ? '最終ヒント — 正解で1pt' : `正解で ${pts}pt`;
}

function renderHintList() {
  document.getElementById('hintList').innerHTML = hints.map((h, i) =>
    `<div class="hint-card"><span class="hint-number">${i + 1}</span><span class="hint-text">${esc(h)}</span></div>`
  ).join('');
}

// --- Answer ---
function markCorrect() {
  if (players.length === 2) {
    // 2 players: answerer is the other one
    const answerer = players.find(p => p !== currentPresenter);
    finishCorrect(answerer);
  } else {
    // 3+: show answerer select
    showPhase('answererPhase');
    document.getElementById('answererGrid').innerHTML = players
      .filter(p => p !== currentPresenter)
      .map(p => `<button class="answerer-btn" onclick="finishCorrect('${esc(p)}')">${esc(p)}</button>`)
      .join('');
  }
}

function finishCorrect(answerer) {
  const pts = hintCount > 0 ? POINT_TABLE[Math.min(hintCount - 1, MAX_HINTS - 1)] : POINT_TABLE[0];
  scores[answerer] = (scores[answerer] || 0) + pts;
  scores[currentPresenter] = (scores[currentPresenter] || 0) + pts;

  logs.unshift({
    timestamp: new Date().toISOString(), round,
    presenter: currentPresenter, topic: currentTopic, category: currentCategory,
    result: 'solved', answerer, hintCount, hints: [...hints],
    points: pts, elapsedMs: Date.now() - roundStartTime,
  });

  showPhase('resultPhase');
  document.getElementById('resultIcon').textContent = '🎉';
  document.getElementById('resultTitle').textContent = '正解！';
  document.getElementById('resultAnswer').textContent = `「${currentTopic}」`;
  document.getElementById('resultDetails').innerHTML =
    `回答者: <strong>${esc(answerer)}</strong> (+${pts}pt)<br>出題者: <strong>${esc(currentPresenter)}</strong> (+${pts}pt)<br>ヒント数: ${hintCount}回`;
  document.getElementById('resultHints').innerHTML =
    hints.length > 0 ? `ヒント: ${hints.map(h => esc(h)).join(' → ')}` : '';

  const rect = document.getElementById('resultAnswer').getBoundingClientRect();
  emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

  renderScoreboard(); renderLog(); saveState();
}

function markWrong() {
  showToast('不正解！ヒントを追加しよう', 1500);
  if (hintCount >= MAX_HINTS) {
    showToast('ヒント上限です。正解かギブアップしてください', 2000);
  }
}

function giveUp() {
  logs.unshift({
    timestamp: new Date().toISOString(), round,
    presenter: currentPresenter, topic: currentTopic, category: currentCategory,
    result: 'giveup', answerer: null, hintCount, hints: [...hints],
    points: 0, elapsedMs: Date.now() - roundStartTime,
  });

  showPhase('resultPhase');
  document.getElementById('resultIcon').textContent = '🏳️';
  document.getElementById('resultTitle').textContent = 'ギブアップ';
  document.getElementById('resultAnswer').textContent = `「${currentTopic}」`;
  document.getElementById('resultDetails').innerHTML = `ヒント数: ${hintCount}回 — 0pt`;
  document.getElementById('resultHints').innerHTML =
    hints.length > 0 ? `ヒント: ${hints.map(h => esc(h)).join(' → ')}` : '';

  renderScoreboard(); renderLog(); saveState();
}

function nextRound() { showPhase('setupPhase'); }

// --- Scoreboard ---
function renderScoreboard() {
  if (players.length === 0) { $scoreboard.style.display = 'none'; return; }
  $scoreboard.style.display = '';
  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
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
    const icon = l.result === 'solved'
      ? `<span class="solved">🎉 ${esc(l.answerer)} (${l.hintCount}ヒント +${l.points}pt)</span>`
      : `<span class="unsolved">🏳️</span>`;
    return `<div class="log-entry"><span>R${l.round}「${esc(l.topic)}」</span>${icon}</div>`;
  }).join('');
}
function clearAllLogs() {
  showToast('全ログを消去しました');
  logs = []; round = 0; usedTopics = [];
  for (const p of players) scores[p] = 0;
  renderScoreboard(); renderLog(); saveState();
}

// --- Init ---
(function init() {
  loadState();
  if (players.length > 0) { renderPlayers(); renderScoreboard(); renderLog(); }
  document.querySelectorAll('#categoryPills .option-pill').forEach(btn =>
    btn.classList.toggle('selected', btn.dataset.value === categoryFilter));
})();
