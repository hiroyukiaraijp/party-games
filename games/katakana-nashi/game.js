/* ===== Katakana-Nashi (カタカナーシ) ===== */

// --- Topic Data ---
const TOPICS = {
  easy: [
    { cat: '食べ物', words: ['ハンバーガー','ピザ','チョコレート','アイスクリーム','ケーキ','コーヒー','サラダ','スープ','パン','バター','ジュース','ヨーグルト','チーズ','ソーセージ','ステーキ','カレー','パスタ','ドーナツ','クッキー','ポテトチップス','マヨネーズ','ケチャップ','ジャム','クレープ','プリン','ゼリー','ワイン','ビール','ソフトクリーム','パフェ'] },
    { cat: 'スポーツ', words: ['サッカー','テニス','バスケットボール','ゴルフ','スキー','スノーボード','バレーボール','マラソン','サーフィン','ボクシング','ダンス','ヨガ','バドミントン','ボウリング','スケート','ラグビー','ホッケー','クリケット','フェンシング','トランポリン'] },
    { cat: '動物', words: ['ライオン','ペンギン','コアラ','ゴリラ','パンダ','チーター','カンガルー','ハムスター','オウム','イルカ','ラッコ','アルパカ','カメレオン','フラミンゴ','チンパンジー','ピューマ','レッサーパンダ','オランウータン','プードル','ダックスフンド'] },
    { cat: '乗り物', words: ['バス','タクシー','エレベーター','エスカレーター','ヘリコプター','モノレール','ロープウェー','ジェットコースター','バイク','トラック','パトカー','ボート','ヨット','カヌー','ゴンドラ','トロッコ','リムジン','セグウェイ','スクーター','ロケット'] },
    { cat: '場所', words: ['レストラン','ホテル','デパート','スーパー','コンビニ','プール','ジム','テーマパーク','カフェ','バー','パーキング','ガソリンスタンド','クリニック','ショッピングモール','コインランドリー','キャンプ場','ゴルフ場','スタジアム','アリーナ','ビーチ'] },
  ],
  normal: [
    { cat: 'テクノロジー', words: ['スマートフォン','パソコン','インターネット','アプリ','プログラミング','タブレット','イヤホン','スピーカー','プリンター','マウス','キーボード','モニター','カメラ','ドローン','ロボット','センサー','バッテリー','ケーブル','ルーター','ソフトウェア'] },
    { cat: '音楽', words: ['ギター','ピアノ','カラオケ','ヒップホップ','ジャズ','ロック','クラシック','ドラム','バイオリン','トランペット','マイク','アンプ','ライブ','コンサート','フェスティバル','リズム','メロディー','ハーモニー','サックス','ウクレレ'] },
    { cat: '日用品', words: ['シャンプー','リンス','ティッシュ','トイレットペーパー','タオル','ハンガー','アイロン','ドライヤー','コンタクトレンズ','サングラス','リュック','ポーチ','スリッパ','カーテン','クッション','マットレス','ブランケット','ストロー','コースター','ラップ'] },
    { cat: 'ファッション', words: ['Tシャツ','ジーンズ','ネクタイ','スーツ','ブーツ','スニーカー','ハイヒール','ピアス','ネックレス','ブレスレット','マフラー','ベスト','パーカー','コート','ジャケット','ワンピース','スカート','レギンス','ベルト','ストール'] },
    { cat: '食文化', words: ['バーベキュー','ビュッフェ','デリバリー','テイクアウト','レシピ','メニュー','デザート','ブランチ','ディナー','カクテル','エスプレッソ','カプチーノ','スムージー','グラタン','リゾット','フォンデュ','ガレット','タピオカ','マカロン','ティラミス'] },
  ],
  hard: [
    { cat: '概念', words: ['モチベーション','コミュニケーション','アイデンティティ','プライバシー','リーダーシップ','クリエイティブ','ポジティブ','ネガティブ','ストレス','メンタルヘルス','エンターテインメント','ボランティア','コンプレックス','カリスマ','ジレンマ','パラドックス','アナロジー','メタファー','ノスタルジー','ルーティン'] },
    { cat: 'IT', words: ['クラウド','データベース','アルゴリズム','ブロックチェーン','サブスクリプション','ストリーミング','ダウンロード','アップデート','パスワード','セキュリティ','ハッキング','バグ','サーバー','ドメイン','ブラウザ','オンライン','オフライン','インフルエンサー','フォロワー','プラットフォーム'] },
    { cat: 'ビジネス', words: ['マーケティング','プレゼンテーション','コンサルティング','マネジメント','ブレインストーミング','リモートワーク','フリーランス','スタートアップ','イノベーション','ベンチャー','コンプライアンス','ガバナンス','サステナビリティ','ダイバーシティ','グローバル','ローカル','アウトソーシング','フィードバック','アジェンダ','コンセンサス'] },
    { cat: '文化', words: ['ハロウィン','クリスマス','バレンタイン','カーニバル','フェスティバル','パレード','コスプレ','ミュージカル','オペラ','バレエ','ギャラリー','ミュージアム','ポップカルチャー','サブカルチャー','ルネサンス','ゴシック','バロック','アールヌーボー','ミニマリズム','シュールレアリズム'] },
    { cat: '科学', words: ['エネルギー','プラズマ','ウイルス','バクテリア','ワクチン','カロリー','タンパク質','ビタミン','コレステロール','アレルギー','ホルモン','ニューロン','ゲノム','エコシステム','オゾン','メタン','プランクトン','シナプス','カフェイン','メラトニン'] },
  ],
};

const STORAGE_KEY = 'katakananashi_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '💖', '🔥'];
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 52; // r=52

// --- State ---
let players = [];
let scores = {};
let logs = [];
let difficulty = 'easy';
let timeLimit = 45;
let round = 0;

// Round state
let currentPresenter = null;
let currentTopic = null;
let currentCategory = null;
let violations = 0;
let timeLeft = 0;
let timerInterval = null;
let roundStartTime = 0;
let usedTopics = [];
let topicRevealed = false;

// --- DOM refs ---
const $setupPhase = document.getElementById('setupPhase');
const $presenterPhase = document.getElementById('presenterPhase');
const $explainingPhase = document.getElementById('explainingPhase');
const $answererPhase = document.getElementById('answererPhase');
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
      players, scores, logs, round, difficulty, timeLimit, usedTopics
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
      if (s.difficulty) difficulty = s.difficulty;
      if (s.timeLimit) timeLimit = s.timeLimit;
      if (s.usedTopics) usedTopics = s.usedTopics;
    }
    // Import players from shared key if this game has none yet
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
  try {
    localStorage.setItem(SHARED_PLAYERS_KEY, JSON.stringify(players));
  } catch (e) { /* ignore */ }
}

// --- Player Management ---
function addPlayer() {
  const input = document.getElementById('playerNameInput');
  const name = input.value.trim();
  if (!name || players.includes(name)) { input.value = ''; return; }
  players.push(name);
  scores[name] = (scores[name] || 0);
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
  $playerList.innerHTML = players.map(p =>
    `<span class="player-tag">${esc(p)} <span class="remove" onclick="removePlayer('${esc(p)}')">&times;</span></span>`
  ).join('');
}

// --- Options ---
function selectOption(type, btn) {
  const parent = btn.parentElement;
  parent.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  if (type === 'difficulty') difficulty = btn.dataset.value;
  if (type === 'time') timeLimit = parseInt(btn.dataset.value);
}

// --- Help ---
function showHelp() {
  document.getElementById('helpModal').classList.add('show');
}

// --- Phase Management ---
function showPhase(phaseId) {
  [$setupPhase, $presenterPhase, $explainingPhase, $answererPhase, $resultPhase].forEach(el => {
    el.style.display = 'none';
  });
  document.getElementById(phaseId).style.display = '';
}

// --- Game Flow ---
function startGame() {
  if (players.length < 2) {
    showToast('プレイヤーを2人以上登録してください');
    return;
  }
  showPresenterPhase();
}

function showPresenterPhase() {
  round++;
  violations = 0;
  topicRevealed = false;

  // Pick topic
  const pool = getTopicPool();
  if (pool.length === 0) {
    usedTopics = [];
    // retry
    const retryPool = getTopicPool();
    if (retryPool.length === 0) {
      showToast('お題がなくなりました');
      return;
    }
  }
  const finalPool = getTopicPool();
  const pick = finalPool[Math.floor(Math.random() * finalPool.length)];
  currentTopic = pick.word;
  currentCategory = pick.cat;
  usedTopics.push(currentTopic);

  showPhase('presenterPhase');
  document.getElementById('roundCounter').textContent = `ラウンド ${round}`;

  // Step 1: show presenter select buttons
  document.getElementById('presenterSelectArea').style.display = '';
  document.getElementById('topicArea').style.display = 'none';
  document.getElementById('presenterGrid').innerHTML = players.map(p =>
    `<button class="answerer-btn" onclick="onSelectPresenter('${esc(p)}')">${esc(p)}</button>`
  ).join('');

  // Reset topic card
  const topicCard = document.getElementById('topicCard');
  topicCard.classList.remove('revealed');
  document.getElementById('topicHidden').style.display = '';
  document.getElementById('topicRevealed').style.display = 'none';
  document.getElementById('confirmBtn').style.display = 'none';
  topicCard.onclick = function() { revealTopic(); };

  renderScoreboard();
  renderLog();
  saveState();
}

function onSelectPresenter(name) {
  currentPresenter = name;
  // Hide select, show topic area
  document.getElementById('presenterSelectArea').style.display = 'none';
  document.getElementById('topicArea').style.display = '';
  document.getElementById('presenterName').textContent = name;
}

function getTopicPool() {
  const categories = TOPICS[difficulty] || TOPICS.easy;
  const pool = [];
  for (const cat of categories) {
    for (const word of cat.words) {
      if (!usedTopics.includes(word)) {
        pool.push({ cat: cat.cat, word });
      }
    }
  }
  return pool;
}

function revealTopic() {
  if (!currentPresenter) {
    showToast('まず出題者を選んでください');
    return;
  }
  if (topicRevealed) return;
  topicRevealed = true;

  const topicCard = document.getElementById('topicCard');
  topicCard.classList.add('revealed');
  document.getElementById('topicHidden').style.display = 'none';
  document.getElementById('topicRevealed').style.display = '';
  document.getElementById('topicCategory').textContent = currentCategory;
  document.getElementById('topicWord').textContent = currentTopic;
  document.getElementById('confirmBtn').style.display = '';
  topicCard.onclick = null;
}

function startExplaining() {
  showPhase('explainingPhase');

  document.getElementById('explainRoundCounter').textContent = `ラウンド ${round}`;
  document.getElementById('explainPresenter').textContent = currentPresenter;

  // Timer setup
  timeLeft = timeLimit;
  violations = 0;
  roundStartTime = Date.now();
  updateTimerDisplay();
  document.getElementById('violationCount').textContent = '';

  const timerArea = document.getElementById('timerArea');
  timerArea.classList.remove('warning');

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 10) {
      timerArea.classList.add('warning');
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById('timerText').textContent = timeLeft;
  const offset = TIMER_CIRCUMFERENCE * (1 - timeLeft / timeLimit);
  const circle = document.getElementById('timerCircle');
  circle.style.strokeDasharray = TIMER_CIRCUMFERENCE;
  circle.style.strokeDashoffset = offset;
}

// --- Actions ---
function markCorrect() {
  clearInterval(timerInterval);
  // Show answerer select (exclude presenter)
  showPhase('answererPhase');
  const grid = document.getElementById('answererGrid');
  grid.innerHTML = players
    .filter(p => p !== currentPresenter)
    .map(p => `<button class="answerer-btn" onclick="selectAnswerer('${esc(p)}')">${esc(p)}</button>`)
    .join('');
}

function selectAnswerer(name) {
  const elapsed = Date.now() - roundStartTime;
  scores[currentPresenter] = (scores[currentPresenter] || 0) + 1;
  scores[name] = (scores[name] || 0) + 1;

  logs.unshift({
    timestamp: new Date().toISOString(),
    round,
    presenter: currentPresenter,
    topic: currentTopic,
    category: currentCategory,
    difficulty,
    result: 'correct',
    answerer: name,
    timeToAnswer: elapsed,
    violations,
  });

  showResult('correct', name, elapsed);
}

function skipTopic() {
  logs.unshift({
    timestamp: new Date().toISOString(),
    round,
    presenter: currentPresenter,
    topic: currentTopic,
    category: currentCategory,
    difficulty,
    result: 'skip',
    answerer: null,
    timeToAnswer: null,
    violations,
  });

  // Pick next topic, timer continues
  const pool = getTopicPool();
  if (pool.length === 0) {
    showToast('お題がなくなりました');
    clearInterval(timerInterval);
    showResult('skip', null, null);
    return;
  }
  const pick = pool[Math.floor(Math.random() * pool.length)];
  currentTopic = pick.word;
  currentCategory = pick.cat;
  usedTopics.push(currentTopic);

  showToast(`パス！ 答え: ${logs[0].topic}`, 1500);

  renderLog();
  saveState();
}

function timeUp() {
  logs.unshift({
    timestamp: new Date().toISOString(),
    round,
    presenter: currentPresenter,
    topic: currentTopic,
    category: currentCategory,
    difficulty,
    result: 'timeout',
    answerer: null,
    timeToAnswer: null,
    violations,
  });

  showResult('timeout', null, null);
}

function buzzer() {
  violations++;
  document.getElementById('violationCount').textContent = `違反: ${violations}回`;

  // Flash
  const flash = document.getElementById('flashOverlay');
  flash.classList.remove('active');
  void flash.offsetWidth; // reflow
  flash.classList.add('active');

  // Shake
  const phase = document.getElementById('explainingPhase');
  phase.classList.remove('shake');
  void phase.offsetWidth;
  phase.classList.add('shake');

  showToast('🚫 カタカナ使った！', 1000);
}

// --- Result ---
function showResult(result, answerer, elapsed) {
  clearInterval(timerInterval);
  showPhase('resultPhase');

  const $icon = document.getElementById('resultIcon');
  const $topic = document.getElementById('resultTopic');
  const $details = document.getElementById('resultDetails');

  $topic.textContent = `「${currentTopic}」`;

  if (result === 'correct') {
    $icon.textContent = '🎉';
    const secs = (elapsed / 1000).toFixed(1);
    let html = `正解者: <strong>${esc(answerer)}</strong> (+1pt)<br>`;
    html += `出題者: <strong>${esc(currentPresenter)}</strong> (+1pt)<br>`;
    html += `説明時間: ${secs}秒`;
    if (violations > 0) html += `<br>カタカナ違反: ${violations}回`;
    $details.innerHTML = html;

    // Particles
    const rect = $topic.getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  } else if (result === 'timeout') {
    $icon.textContent = '⏰';
    let html = `タイムアップ！ 得点なし`;
    if (violations > 0) html += `<br>カタカナ違反: ${violations}回`;
    $details.innerHTML = html;
  } else {
    $icon.textContent = '⏭';
    $details.innerHTML = 'パス';
  }

  renderScoreboard();
  renderLog();
  saveState();
}

function nextPresenter() {
  showPresenterPhase();
}

// --- Scoreboard ---
function renderScoreboard() {
  if (players.length === 0) { $scoreboard.style.display = 'none'; return; }
  $scoreboard.style.display = '';
  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  $scoreRows.innerHTML = sorted.map((p, i) => {
    const medal = i === 0 && scores[p] > 0 ? '👑' : '';
    return `<span class="score-item">
      <span class="name">${medal}${esc(p)}</span>
      <span class="pts">${scores[p] || 0}</span>
    </span>`;
  }).join('');
}

// --- Log ---
function renderLog() {
  if (logs.length === 0) { $answerLog.style.display = 'none'; return; }
  $answerLog.style.display = '';

  $logEntries.innerHTML = logs.slice(0, 8).map((l, i) => {
    const statusIcon = l.result === 'correct'
      ? '<span class="valid">✅</span>'
      : l.result === 'skip'
        ? '<span class="skip-tag">⏭</span>'
        : '<span class="invalid">⏰</span>';
    const timeTag = l.timeToAnswer
      ? `<span class="time-tag">${(l.timeToAnswer / 1000).toFixed(1)}s</span>`
      : '';
    const violationTag = l.violations > 0 ? ` 🚫${l.violations}` : '';
    const answererTag = l.answerer ? ` → ${esc(l.answerer)}` : '';

    return `<div class="log-entry">
      <span>R${l.round} ${esc(l.presenter)}: 「${esc(l.topic)}」${answererTag}${violationTag} ${timeTag}</span>
      ${statusIcon}
    </div>`;
  }).join('');
}

function clearAllLogs() {
  showToast('全ログを消去しました');
  logs = [];
  round = 0;
  usedTopics = [];
  for (const p of players) scores[p] = 0;
  renderScoreboard();
  renderLog();
  saveState();
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
  if (players.length > 0) {
    renderPlayers();
    renderScoreboard();
    renderLog();
  }
  // Restore option pills
  document.querySelectorAll('#difficultyPills .option-pill').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === difficulty);
  });
  document.querySelectorAll('#timePills .option-pill').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === String(timeLimit));
  });
})();
