/* ===== Master Game (マスターゲーム) ===== */

// --- Topic Data ---
const TOPICS = {
  things: [
    { cat: '食べ物', word: 'カレーライス' }, { cat: '食べ物', word: 'ラーメン' },
    { cat: '食べ物', word: 'お寿司' }, { cat: '食べ物', word: 'たこ焼き' },
    { cat: '食べ物', word: 'ピザ' }, { cat: '食べ物', word: 'チョコレート' },
    { cat: '食べ物', word: 'おにぎり' }, { cat: '食べ物', word: 'アイスクリーム' },
    { cat: '食べ物', word: 'ハンバーガー' }, { cat: '食べ物', word: '餃子' },
    { cat: '食べ物', word: 'うどん' }, { cat: '食べ物', word: 'ステーキ' },
    { cat: '食べ物', word: 'サンドイッチ' }, { cat: '食べ物', word: 'パンケーキ' },
    { cat: '食べ物', word: '味噌汁' },
    { cat: '動物', word: 'ライオン' }, { cat: '動物', word: 'ペンギン' },
    { cat: '動物', word: 'イルカ' }, { cat: '動物', word: 'パンダ' },
    { cat: '動物', word: 'カメレオン' }, { cat: '動物', word: 'コウモリ' },
    { cat: '動物', word: 'クジラ' }, { cat: '動物', word: 'フラミンゴ' },
    { cat: '動物', word: 'カンガルー' }, { cat: '動物', word: 'ゴリラ' },
    { cat: '動物', word: 'タコ' }, { cat: '動物', word: 'カブトムシ' },
    { cat: '動物', word: 'ハチドリ' }, { cat: '動物', word: 'ナマケモノ' },
    { cat: '乗り物', word: '新幹線' }, { cat: '乗り物', word: '飛行機' },
    { cat: '乗り物', word: 'ヘリコプター' }, { cat: '乗り物', word: '潜水艦' },
    { cat: '乗り物', word: 'ロケット' }, { cat: '乗り物', word: '気球' },
    { cat: '乗り物', word: 'ジェットコースター' }, { cat: '乗り物', word: 'ゴンドラ' },
    { cat: 'モノ', word: '消しゴム' }, { cat: 'モノ', word: '冷蔵庫' },
    { cat: 'モノ', word: '信号機' }, { cat: 'モノ', word: '傘' },
    { cat: 'モノ', word: '地球儀' }, { cat: 'モノ', word: 'ピアノ' },
    { cat: 'モノ', word: '望遠鏡' }, { cat: 'モノ', word: 'ランドセル' },
    { cat: 'モノ', word: '風鈴' }, { cat: 'モノ', word: 'けん玉' },
    { cat: 'モノ', word: '花火' }, { cat: 'モノ', word: 'サイコロ' },
    { cat: 'モノ', word: '温泉' }, { cat: 'モノ', word: 'こたつ' },
    { cat: 'モノ', word: 'かき氷' }, { cat: 'モノ', word: '扇風機' },
    { cat: 'モノ', word: 'エスカレーター' }, { cat: 'モノ', word: '自動販売機' },
    { cat: 'モノ', word: 'トランプ' }, { cat: 'モノ', word: '将棋' },
  ],
  people: [
    { cat: '職業', word: '消防士' }, { cat: '職業', word: '宇宙飛行士' },
    { cat: '職業', word: 'パティシエ' }, { cat: '職業', word: '探偵' },
    { cat: '職業', word: '忍者' }, { cat: '職業', word: '海賊' },
    { cat: '職業', word: '魔法使い' }, { cat: '職業', word: 'サンタクロース' },
    { cat: '職業', word: 'お笑い芸人' }, { cat: '職業', word: '大統領' },
    { cat: '職業', word: '裁判官' }, { cat: '職業', word: '考古学者' },
    { cat: '職業', word: 'DJ' }, { cat: '職業', word: '指揮者' },
    { cat: '職業', word: '漫画家' },
    { cat: 'キャラ', word: 'ドラえもん' }, { cat: 'キャラ', word: 'ピカチュウ' },
    { cat: 'キャラ', word: 'マリオ' }, { cat: 'キャラ', word: 'アンパンマン' },
    { cat: 'キャラ', word: 'トトロ' }, { cat: 'キャラ', word: 'スヌーピー' },
    { cat: 'キャラ', word: 'ミッキーマウス' }, { cat: 'キャラ', word: '孫悟空' },
    { cat: 'キャラ', word: 'ルフィ' }, { cat: 'キャラ', word: 'ハローキティ' },
    { cat: '歴史', word: '織田信長' }, { cat: '歴史', word: 'クレオパトラ' },
    { cat: '歴史', word: 'レオナルド・ダ・ヴィンチ' }, { cat: '歴史', word: 'ナポレオン' },
    { cat: '歴史', word: 'アインシュタイン' }, { cat: '歴史', word: '坂本龍馬' },
    { cat: '歴史', word: 'モーツァルト' }, { cat: '歴史', word: 'ガリレオ' },
  ],
  places: [
    { cat: '国', word: 'エジプト' }, { cat: '国', word: 'ブラジル' },
    { cat: '国', word: 'オーストラリア' }, { cat: '国', word: 'インド' },
    { cat: '国', word: 'イタリア' }, { cat: '国', word: 'フランス' },
    { cat: '国', word: 'アメリカ' }, { cat: '国', word: 'ロシア' },
    { cat: '場所', word: '東京タワー' }, { cat: '場所', word: '富士山' },
    { cat: '場所', word: 'ディズニーランド' }, { cat: '場所', word: '北極' },
    { cat: '場所', word: 'ピラミッド' }, { cat: '場所', word: 'コロッセオ' },
    { cat: '場所', word: '万里の長城' }, { cat: '場所', word: 'ハワイ' },
    { cat: '場所', word: '沖縄' }, { cat: '場所', word: '北海道' },
    { cat: '場所', word: 'アマゾン川' }, { cat: '場所', word: 'サハラ砂漠' },
    { cat: '場所', word: '月' }, { cat: '場所', word: '深海' },
    { cat: '場所', word: '図書館' }, { cat: '場所', word: '遊園地' },
    { cat: '場所', word: '動物園' }, { cat: '場所', word: '水族館' },
    { cat: '場所', word: 'お化け屋敷' }, { cat: '場所', word: 'プラネタリウム' },
    { cat: '場所', word: '回転寿司' }, { cat: '場所', word: 'ボウリング場' },
  ],
};

const STORAGE_KEY = 'mastergame_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '💖', '👑'];

// --- State ---
let players = [];
let scores = {};
let logs = [];
let round = 0;
let categoryFilter = 'all';
let questionLimit = 20;
let usedTopics = [];

// Round state
let currentMaster = null;
let currentTopic = null;
let currentCategory = null;
let questionCount = 0;
let questionHistory = []; // [{q: number, answer: 'yes'|'no'}]
let selectedGuesser = null;
let roundStartTime = 0;

// --- DOM refs ---
const $setupPhase = document.getElementById('setupPhase');
const $masterPhase = document.getElementById('masterPhase');
const $questionPhase = document.getElementById('questionPhase');
const $resultPhase = document.getElementById('resultPhase');
const $scoreboard = document.getElementById('scoreboard');
const $scoreRows = document.getElementById('scoreRows');
const $answerLog = document.getElementById('answerLog');
const $logEntries = document.getElementById('logEntries');
const $playerList = document.getElementById('playerList');

// --- Toast ---
function showToast(msg, duration = 2000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

// --- Particles ---
function emitParticles(x, y) {
  const container = document.getElementById('particles');
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
    const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
    const dist = 60 + Math.random() * 80;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0.3)`, opacity: 0 }
    ], { duration: 800, easing: 'ease-out', fill: 'forwards' });
    container.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

// --- Persistence ---
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      players, scores, logs, round, categoryFilter, questionLimit, usedTopics
    }));
  } catch (e) { /* ignore */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s.players) players = s.players;
      if (s.scores) scores = s.scores;
      if (s.logs) logs = s.logs;
      if (s.round) round = s.round;
      if (s.categoryFilter) categoryFilter = s.categoryFilter;
      if (s.questionLimit !== undefined) questionLimit = s.questionLimit;
      if (s.usedTopics) usedTopics = s.usedTopics;
    }
    if (players.length === 0) {
      const shared = localStorage.getItem(SHARED_PLAYERS_KEY);
      if (shared) {
        const sp = JSON.parse(shared);
        if (Array.isArray(sp) && sp.length > 0) {
          players = sp;
          for (const p of players) scores[p] = scores[p] || 0;
        }
      }
    }
  } catch (e) { /* ignore */ }
}

function saveSharedPlayers() {
  try { localStorage.setItem(SHARED_PLAYERS_KEY, JSON.stringify(players)); } catch (e) {}
}

// --- Player Management ---
function addPlayer() {
  const input = document.getElementById('playerNameInput');
  const name = input.value.trim();
  if (!name || players.includes(name)) { input.value = ''; return; }
  players.push(name);
  scores[name] = scores[name] || 0;
  input.value = '';
  renderPlayers();
  renderScoreboard();
  saveState();
  saveSharedPlayers();
}

function removePlayer(name) {
  players = players.filter(p => p !== name);
  delete scores[name];
  renderPlayers();
  renderScoreboard();
  saveState();
  saveSharedPlayers();
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
  if (type === 'category') categoryFilter = btn.dataset.value;
  if (type === 'limit') questionLimit = parseInt(btn.dataset.value);
}

// --- Phase Management ---
function showPhase(id) {
  [$setupPhase, $masterPhase, $questionPhase, $resultPhase].forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = '';
}

// --- Game Flow ---
function startGame() {
  if (players.length < 2) { showToast('プレイヤーを2人以上登録してください'); return; }
  beginRound();
}

function beginRound() {
  round++;
  questionCount = 0;
  questionHistory = [];
  selectedGuesser = null;
  roundStartTime = Date.now();

  // Random master
  currentMaster = players[Math.floor(Math.random() * players.length)];

  // Pick topic
  const pool = getTopicPool();
  if (pool.length === 0) usedTopics = [];
  const finalPool = getTopicPool();
  if (finalPool.length === 0) { showToast('お題がなくなりました'); return; }
  const pick = finalPool[Math.floor(Math.random() * finalPool.length)];
  currentTopic = pick.word;
  currentCategory = pick.cat;
  usedTopics.push(currentTopic);

  // Show master reveal
  showPhase('masterPhase');
  document.getElementById('masterRound').textContent = `ラウンド ${round}`;
  document.getElementById('masterName').textContent = currentMaster;

  // Reset topic card
  document.getElementById('topicCard').style.display = '';
  document.getElementById('topicRevealed').style.display = 'none';
  document.getElementById('topicCard').classList.remove('revealed');

  renderScoreboard();
  renderLog();
  saveState();
}

function getTopicPool() {
  let cats;
  if (categoryFilter === 'all') {
    cats = [...TOPICS.things, ...TOPICS.people, ...TOPICS.places];
  } else {
    cats = TOPICS[categoryFilter] || [];
  }
  return cats.filter(t => !usedTopics.includes(t.word));
}

function revealTopic() {
  document.getElementById('topicCard').style.display = 'none';
  document.getElementById('topicRevealed').style.display = '';
  document.getElementById('topicCategory').textContent = currentCategory;
  document.getElementById('topicWord').textContent = currentTopic;
}

function startQuestions() {
  showPhase('questionPhase');
  document.getElementById('questionRound').textContent = `ラウンド ${round}`;
  document.getElementById('qMasterName').textContent = currentMaster;
  updateQuestionUI();
}

function updateQuestionUI() {
  document.getElementById('questionCount').textContent = questionCount;
  if (questionLimit > 0) {
    document.getElementById('questionLimit').textContent = `/ ${questionLimit} 問`;
  } else {
    document.getElementById('questionLimit').textContent = '問 (無制限)';
  }
  renderQuestionLog();
}

// --- Question Actions ---
function answerQuestion(answer) {
  questionCount++;
  const $input = document.getElementById('questionText');
  const text = $input.value.trim();
  questionHistory.push({ q: questionCount, answer, text });
  $input.value = '';
  updateQuestionUI();
  renderQuestionLog();

  if (questionLimit > 0 && questionCount >= questionLimit) {
    showToast('質問上限に達しました！推理するかギブアップしてください', 3000);
  }
  document.getElementById('guessArea').style.display = 'none';
}

function renderQuestionLog() {
  const $log = document.getElementById('questionLog');
  if (questionHistory.length === 0) { $log.innerHTML = ''; return; }
  const answerMap = {
    yes: { cls: 'q-answer-yes', label: '⭕' },
    no: { cls: 'q-answer-no', label: '❌' },
    unknown: { cls: 'q-answer-maybe', label: '？' },
    both: { cls: 'q-answer-maybe', label: '△' },
  };
  $log.innerHTML = questionHistory.slice().reverse().map(h => {
    const a = answerMap[h.answer] || answerMap.unknown;
    const text = h.text ? esc(h.text) : `Q${h.q}`;
    return `<div class="q-entry">
      <span class="q-text">${text}</span>
      <span class="${a.cls}">${a.label}</span>
    </div>`;
  }).join('');
}

// --- Guess ---
function showGuessUI() {
  const area = document.getElementById('guessArea');
  area.style.display = '';
  selectedGuesser = null;
  document.getElementById('guessInputRow').style.display = 'none';
  document.getElementById('guessResult').style.display = 'none';
  document.getElementById('guessInput').value = '';

  // Show player buttons (exclude master)
  const grid = document.getElementById('guesserGrid');
  grid.innerHTML = players
    .filter(p => p !== currentMaster)
    .map(p => `<button class="guesser-btn" onclick="selectGuesser(this, '${esc(p)}')">${esc(p)}</button>`)
    .join('');
}

function selectGuesser(btn, name) {
  document.querySelectorAll('.guesser-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedGuesser = name;
  document.getElementById('guessInputRow').style.display = 'flex';
  document.getElementById('guessInput').focus();
}

function cancelGuess() {
  document.getElementById('guessArea').style.display = 'none';
  selectedGuesser = null;
}

function submitGuess() {
  if (!selectedGuesser) { showToast('回答者を選んでください'); return; }
  const guess = document.getElementById('guessInput').value.trim();
  if (!guess) return;

  const $result = document.getElementById('guessResult');
  $result.style.display = 'block';

  // Check if correct (normalize for comparison)
  const norm = s => s.toLowerCase().replace(/[\s・\-]/g, '');
  if (norm(guess) === norm(currentTopic)) {
    // Correct!
    $result.className = 'guess-result correct';
    $result.innerHTML = `🎉 <strong>正解！</strong>「${esc(currentTopic)}」`;
    scores[selectedGuesser] = (scores[selectedGuesser] || 0) + 1;

    setTimeout(() => {
      showResultScreen('solved', selectedGuesser);
    }, 1200);
  } else {
    // Wrong
    $result.className = 'guess-result wrong';
    $result.innerHTML = `❌ 不正解！「${esc(guess)}」ではありません`;
  }
}

function giveUp() {
  scores[currentMaster] = (scores[currentMaster] || 0) + 1;
  showResultScreen('giveup', null);
}

// --- Result ---
function showResultScreen(result, guesser) {
  showPhase('resultPhase');

  const $icon = document.getElementById('resultIcon');
  const $title = document.getElementById('resultTitle');
  const $answer = document.getElementById('resultAnswer');
  const $details = document.getElementById('resultDetails');

  $answer.textContent = `「${currentTopic}」`;
  const elapsed = ((Date.now() - roundStartTime) / 1000).toFixed(0);
  if (result === 'solved') {
    $icon.textContent = '🎉';
    $title.textContent = '正解！';
    $details.innerHTML = `回答者: <strong>${esc(guesser)}</strong> (+1pt)<br>質問数: ${questionCount}回<br>所要時間: ${elapsed}秒`;

    const rect = $answer.getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  } else {
    $icon.textContent = '👑';
    $title.textContent = 'マスターの勝利！';
    $details.innerHTML = `マスター: <strong>${esc(currentMaster)}</strong> (+1pt)<br>質問数: ${questionCount}回<br>誰も当てられませんでした`;
  }

  logs.unshift({
    timestamp: new Date().toISOString(),
    round,
    master: currentMaster,
    topic: currentTopic,
    category: currentCategory,
    result,
    guesser: guesser || null,
    questionCount,
    elapsedMs: Date.now() - roundStartTime,
  });

  savePlayLog('master-game', result === 'solved' ? 1 : 0, 1);
  renderScoreboard();
  renderLog();
  saveState();
}

function nextRound() {
  showPhase('setupPhase');
}

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
      ? `<span class="solved">💡 ${esc(l.guesser)}</span>`
      : `<span class="unsolved">👑 ${esc(l.master)}</span>`;
    return `<div class="log-entry">
      <span>R${l.round} 「${esc(l.topic)}」 Q${l.questionCount}</span>
      ${icon}
    </div>`;
  }).join('');
}

function clearAllLogs() {
  showToast('全ログを消去しました');
  logs = []; round = 0; usedTopics = [];
  for (const p of players) scores[p] = 0;
  renderScoreboard(); renderLog(); saveState();
}

// --- Utility ---
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// --- Init ---
(function init() {
  loadState();
  initSessionPlayers(players, scores);
  renderPlayers(); renderScoreboard(); renderLog();
  document.querySelectorAll('#categoryPills .option-pill').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === categoryFilter);
  });
  document.querySelectorAll('#limitPills .option-pill').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === String(questionLimit));
  });
})();
