/* ===== Word Wolf (ワードウルフ) ===== */

// --- Topic Data ---
// Each pair: { cat, majority (citizen topic), wolf (wolf topic) }
const TOPICS = {
  easy: [
    // Food - very similar pairs
    { cat: '食べ物', majority: 'りんご', wolf: 'みかん' },
    { cat: '食べ物', majority: 'カレー', wolf: 'シチュー' },
    { cat: '食べ物', majority: 'ラーメン', wolf: 'うどん' },
    { cat: '食べ物', majority: '寿司', wolf: '刺身' },
    { cat: '食べ物', majority: 'チョコレート', wolf: 'キャラメル' },
    { cat: '食べ物', majority: 'パン', wolf: 'ご飯' },
    { cat: '食べ物', majority: 'コーヒー', wolf: '紅茶' },
    { cat: '食べ物', majority: 'ケーキ', wolf: 'パフェ' },
    { cat: '食べ物', majority: 'ピザ', wolf: 'お好み焼き' },
    { cat: '食べ物', majority: 'アイスクリーム', wolf: 'かき氷' },
    // Animals
    { cat: '動物', majority: '犬', wolf: '猫' },
    { cat: '動物', majority: 'ライオン', wolf: 'トラ' },
    { cat: '動物', majority: 'ペンギン', wolf: 'アザラシ' },
    { cat: '動物', majority: 'うさぎ', wolf: 'ハムスター' },
    { cat: '動物', majority: 'イルカ', wolf: 'クジラ' },
    // Places
    { cat: '場所', majority: '海', wolf: 'プール' },
    { cat: '場所', majority: '東京', wolf: '大阪' },
    { cat: '場所', majority: '学校', wolf: '塾' },
    { cat: '場所', majority: '公園', wolf: '庭' },
    { cat: '場所', majority: 'コンビニ', wolf: 'スーパー' },
    // Sports
    { cat: 'スポーツ', majority: 'サッカー', wolf: 'フットサル' },
    { cat: 'スポーツ', majority: '野球', wolf: 'ソフトボール' },
    { cat: 'スポーツ', majority: 'テニス', wolf: 'バドミントン' },
    { cat: 'スポーツ', majority: 'スキー', wolf: 'スノーボード' },
    // Daily
    { cat: '日常', majority: 'お風呂', wolf: 'シャワー' },
    { cat: '日常', majority: '電車', wolf: 'バス' },
    { cat: '日常', majority: '映画', wolf: 'ドラマ' },
    { cat: '日常', majority: '漫画', wolf: '小説' },
    { cat: '日常', majority: '朝ごはん', wolf: '昼ごはん' },
    { cat: '日常', majority: '掃除', wolf: '洗濯' },
  ],
  normal: [
    // Food
    { cat: '食べ物', majority: '焼肉', wolf: 'ステーキ' },
    { cat: '食べ物', majority: 'おにぎり', wolf: 'サンドイッチ' },
    { cat: '食べ物', majority: 'たこ焼き', wolf: '焼き鳥' },
    { cat: '食べ物', majority: '味噌汁', wolf: 'スープ' },
    { cat: '食べ物', majority: 'ポテトチップス', wolf: 'ポップコーン' },
    // Concepts
    { cat: '概念', majority: '友情', wolf: '恋愛' },
    { cat: '概念', majority: '夢', wolf: '目標' },
    { cat: '概念', majority: '才能', wolf: '努力' },
    { cat: '概念', majority: '自由', wolf: '平和' },
    { cat: '概念', majority: '正義', wolf: '優しさ' },
    // Events
    { cat: 'イベント', majority: 'クリスマス', wolf: 'バレンタイン' },
    { cat: 'イベント', majority: '花火大会', wolf: 'お祭り' },
    { cat: 'イベント', majority: '運動会', wolf: '文化祭' },
    { cat: 'イベント', majority: '結婚式', wolf: '成人式' },
    { cat: 'イベント', majority: '誕生日', wolf: '記念日' },
    // Seasons / Nature
    { cat: '季節', majority: '春', wolf: '秋' },
    { cat: '季節', majority: '夏', wolf: '冬' },
    { cat: '自然', majority: '山', wolf: '丘' },
    { cat: '自然', majority: '川', wolf: '湖' },
    { cat: '自然', majority: '太陽', wolf: '月' },
    // Entertainment
    { cat: '娯楽', majority: 'カラオケ', wolf: 'ダンス' },
    { cat: '娯楽', majority: 'ゲーム', wolf: 'パズル' },
    { cat: '娯楽', majority: 'YouTube', wolf: 'TikTok' },
    { cat: '娯楽', majority: 'ディズニーランド', wolf: 'USJ' },
    { cat: '娯楽', majority: '旅行', wolf: 'キャンプ' },
    // Jobs
    { cat: '職業', majority: '医者', wolf: '看護師' },
    { cat: '職業', majority: '先生', wolf: '教授' },
    { cat: '職業', majority: '警察官', wolf: '消防士' },
    { cat: '職業', majority: 'パイロット', wolf: '宇宙飛行士' },
    { cat: '職業', majority: 'シェフ', wolf: 'パティシエ' },
  ],
  hard: [
    // Abstract - very similar concepts
    { cat: '感情', majority: '嬉しい', wolf: '楽しい' },
    { cat: '感情', majority: '悲しい', wolf: '寂しい' },
    { cat: '感情', majority: '怒り', wolf: '悔しさ' },
    { cat: '感情', majority: '緊張', wolf: '不安' },
    { cat: '感情', majority: '感動', wolf: '感謝' },
    // Culture
    { cat: '文化', majority: '漫画', wolf: 'アニメ' },
    { cat: '文化', majority: '落語', wolf: '漫才' },
    { cat: '文化', majority: '茶道', wolf: '華道' },
    { cat: '文化', majority: '歌舞伎', wolf: '能' },
    { cat: '文化', majority: 'ジャズ', wolf: 'ブルース' },
    // Time
    { cat: '時間', majority: '昨日', wolf: 'おととい' },
    { cat: '時間', majority: '朝', wolf: '昼' },
    { cat: '時間', majority: '現在', wolf: '未来' },
    // Abstract pairs
    { cat: '概念', majority: '常識', wolf: '普通' },
    { cat: '概念', majority: '成功', wolf: '幸せ' },
    { cat: '概念', majority: '天才', wolf: '秀才' },
    { cat: '概念', majority: 'リーダー', wolf: 'マネージャー' },
    { cat: '概念', majority: '伝統', wolf: '文化' },
    { cat: '概念', majority: '信頼', wolf: '信用' },
    { cat: '概念', majority: '個性', wolf: 'アイデンティティ' },
    // Tricky
    { cat: '生活', majority: '習慣', wolf: 'ルーティン' },
    { cat: '生活', majority: '趣味', wolf: '特技' },
    { cat: '生活', majority: '仕事', wolf: '作業' },
    { cat: '生活', majority: '会話', wolf: '議論' },
    { cat: '生活', majority: '約束', wolf: 'ルール' },
    // Subtle
    { cat: '食べ物', majority: '和菓子', wolf: '洋菓子' },
    { cat: '食べ物', majority: '日本酒', wolf: '焼酎' },
    { cat: '食べ物', majority: '抹茶', wolf: '緑茶' },
    { cat: '動物', majority: 'カラス', wolf: 'スズメ' },
    { cat: '動物', majority: 'カエル', wolf: 'イモリ' },
  ],
};

const STORAGE_KEY = 'wordwolf_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '💖', '🐺'];
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 56; // r=56

// Wolf count by player count
function getWolfCount(n) {
  if (n <= 4) return 1;
  if (n <= 8) return 1;
  if (n <= 12) return Math.random() < 0.5 ? 1 : 2;
  return 2;
}

// --- State ---
let players = [];
let scores = {};
let logs = [];
let round = 0;
let difficulty = 'easy';
let discussionTime = 180;
let blindMode = false;
let usedTopics = [];

// Round state
let currentTopic = null;
let wolfPlayers = [];
let confirmOrder = [];
let confirmIndex = 0;
let votes = {};
let voteOrder = [];
let voteIndex = 0;
let voteSelection = null;
let timerInterval = null;
let timeLeft = 0;
let discussionStartTime = 0;

// --- Sound ---
let audioCtx = null;
function playBeep(freq, duration, count = 1) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < count; i++) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.value = 0.3;
      const start = audioCtx.currentTime + i * (duration / 1000 + 0.1);
      osc.start(start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration / 1000);
      osc.stop(start + duration / 1000 + 0.05);
    }
  } catch (e) { /* audio not available */ }
}

// --- DOM refs ---
const $setupPhase = document.getElementById('setupPhase');
const $confirmPhase = document.getElementById('confirmPhase');
const $discussionPhase = document.getElementById('discussionPhase');
const $votePhase = document.getElementById('votePhase');
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
      players, scores, logs, round, difficulty, discussionTime, usedTopics
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
      if (s.discussionTime) discussionTime = s.discussionTime;
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
  if (type === 'time') discussionTime = parseInt(btn.dataset.value);
  if (type === 'blind') blindMode = btn.dataset.value === 'true';
}

// --- Phase Management ---
function showPhase(phaseId) {
  [$setupPhase, $confirmPhase, $discussionPhase, $votePhase, $resultPhase].forEach(el => {
    el.style.display = 'none';
  });
  document.getElementById(phaseId).style.display = '';
}

// --- Game Flow ---
function startGame() {
  if (players.length < 3) {
    showToast('プレイヤーを3人以上登録してください');
    return;
  }
  beginRound();
}

function beginRound() {
  round++;

  // Pick topic
  const pool = getTopicPool();
  if (pool.length === 0) {
    usedTopics = [];
  }
  const finalPool = getTopicPool();
  if (finalPool.length === 0) {
    showToast('お題がなくなりました');
    return;
  }
  currentTopic = finalPool[Math.floor(Math.random() * finalPool.length)];
  usedTopics.push(currentTopic.majority + '/' + currentTopic.wolf);

  // Randomly swap majority/wolf so wolf topic isn't always the "wolf" key
  if (Math.random() < 0.5) {
    currentTopic = { cat: currentTopic.cat, majority: currentTopic.wolf, wolf: currentTopic.majority };
  }

  // Assign wolves
  const wolfCount = getWolfCount(players.length);
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  wolfPlayers = shuffled.slice(0, wolfCount);

  // Confirm order = shuffled players
  confirmOrder = [...players].sort(() => Math.random() - 0.5);
  confirmIndex = 0;
  votes = {};
  voteSelection = null;

  showConfirmPhase();
  renderScoreboard();
  renderLog();
  saveState();
}

function getTopicPool() {
  const categories = TOPICS[difficulty] || TOPICS.easy;
  return categories.filter(t => !usedTopics.includes(t.majority + '/' + t.wolf) && !usedTopics.includes(t.wolf + '/' + t.majority));
}

// --- Confirm Phase ---
function showConfirmPhase() {
  showPhase('confirmPhase');
  document.getElementById('confirmRound').textContent = `ラウンド ${round}`;
  updateConfirmUI();
}

function updateConfirmUI() {
  const player = confirmOrder[confirmIndex];
  document.getElementById('confirmPlayerName').textContent = `${player} の番です`;

  // Progress dots
  const dots = confirmOrder.map((_, i) => {
    const cls = i < confirmIndex ? 'done' : i === confirmIndex ? 'current' : '';
    return `<div class="confirm-dot ${cls}"></div>`;
  }).join('');
  document.getElementById('confirmDots').innerHTML = dots;

  // Reset card to hidden state
  document.getElementById('confirmCard').style.display = '';
  document.getElementById('confirmRevealed').style.display = 'none';
}

function revealMyTopic() {
  const player = confirmOrder[confirmIndex];
  const isWolf = wolfPlayers.includes(player);
  const topic = isWolf ? currentTopic.wolf : currentTopic.majority;

  document.getElementById('confirmCard').style.display = 'none';
  document.getElementById('confirmRevealed').style.display = '';

  const card = document.getElementById('revealedCard');
  if (blindMode) {
    // Blind mode: no role reveal, just show topic
    card.className = 'topic-card citizen';
    document.getElementById('roleIcon').textContent = '🔒';
    document.getElementById('roleLabel').textContent = 'あなたのお題';
    document.getElementById('myTopicWord').textContent = topic;
    document.getElementById('wolfHint').textContent = '';
  } else {
    card.className = 'topic-card ' + (isWolf ? 'wolf' : 'citizen');
    document.getElementById('roleIcon').textContent = isWolf ? '🐺' : '👤';
    document.getElementById('roleLabel').textContent = isWolf ? 'あなたはウルフです！' : 'あなたは市民です';
    document.getElementById('myTopicWord').textContent = topic;
    document.getElementById('wolfHint').textContent = isWolf ? '（他の人と違うお題です）' : '';
  }
}

function confirmAndNext() {
  confirmIndex++;
  if (confirmIndex >= confirmOrder.length) {
    startDiscussion();
  } else {
    updateConfirmUI();
  }
}

// --- Discussion Phase ---
function startDiscussion() {
  showPhase('discussionPhase');
  document.getElementById('discussionRound').textContent = `ラウンド ${round}`;

  timeLeft = discussionTime;
  discussionStartTime = Date.now();
  updateTimerDisplay();

  const timerArea = document.getElementById('timerArea');
  timerArea.classList.remove('warning');

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft === 60) playBeep(600, 200, 1);
    if (timeLeft === 30) playBeep(800, 200, 2);
    if (timeLeft === 10) playBeep(1000, 150, 3);
    if (timeLeft <= 15 && timeLeft > 0) timerArea.classList.add('warning');
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      playBeep(400, 500, 3);
      endDiscussion();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  document.getElementById('timerText').textContent = `${min}:${sec.toString().padStart(2, '0')}`;
  const offset = TIMER_CIRCUMFERENCE * (1 - timeLeft / discussionTime);
  const circle = document.getElementById('timerCircle');
  circle.style.strokeDasharray = TIMER_CIRCUMFERENCE;
  circle.style.strokeDashoffset = offset;
}

function endDiscussion() {
  clearInterval(timerInterval);
  startVotePhase();
}

// --- Vote Phase ---
function startVotePhase() {
  voteOrder = [...players].sort(() => Math.random() - 0.5);
  voteIndex = 0;
  votes = {};
  voteSelection = null;

  showPhase('votePhase');
  updateVoteUI();
}

function updateVoteUI() {
  const voter = voteOrder[voteIndex];
  document.getElementById('voteProgress').textContent =
    `投票 (${voteIndex}/${voteOrder.length}人完了)`;
  document.getElementById('votePlayerName').textContent = `${voter} の投票`;

  voteSelection = null;
  document.getElementById('voteConfirmBtn').style.display = 'none';

  // Show all players except the voter
  const grid = document.getElementById('voteGrid');
  grid.innerHTML = players
    .filter(p => p !== voter)
    .map(p => `<button class="vote-btn" onclick="selectVote(this, '${esc(p)}')">${esc(p)}</button>`)
    .join('');
}

function selectVote(btn, name) {
  document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  voteSelection = name;
  document.getElementById('voteConfirmBtn').style.display = '';
}

function confirmVoteAndNext() {
  if (!voteSelection) return;
  const voter = voteOrder[voteIndex];
  votes[voter] = voteSelection;

  voteIndex++;
  if (voteIndex >= voteOrder.length) {
    showResult();
  } else {
    updateVoteUI();
  }
}

// --- Result ---
function showResult() {
  showPhase('resultPhase');

  // Tally votes
  const tally = {};
  for (const target of Object.values(votes)) {
    tally[target] = (tally[target] || 0) + 1;
  }

  // Find most voted
  let maxVotes = 0;
  let mostVoted = [];
  for (const [name, count] of Object.entries(tally)) {
    if (count > maxVotes) {
      maxVotes = count;
      mostVoted = [name];
    } else if (count === maxVotes) {
      mostVoted.push(name);
    }
  }

  // Determine result
  const wolfDetected = mostVoted.length === 1 && wolfPlayers.includes(mostVoted[0]);
  const result = wolfDetected ? 'citizen_win' : 'wolf_win';

  // Score
  if (wolfDetected) {
    // Citizens who voted for the wolf get +1
    for (const [voter, target] of Object.entries(votes)) {
      if (wolfPlayers.includes(target)) {
        scores[voter] = (scores[voter] || 0) + 1;
      }
    }
  } else {
    // Wolf escapes: +2
    for (const w of wolfPlayers) {
      scores[w] = (scores[w] || 0) + 2;
    }
  }

  // Display
  const $icon = document.getElementById('resultIcon');
  const $title = document.getElementById('resultTitle');
  const $wolfReveal = document.getElementById('resultWolfReveal');
  const $topics = document.getElementById('resultTopics');

  if (wolfDetected) {
    $icon.textContent = '🎉';
    $title.textContent = '市民の勝利！';
  } else {
    $icon.textContent = '🐺';
    $title.textContent = 'ウルフの勝利！';
  }

  const wolfNames = wolfPlayers.map(w => esc(w)).join('、');
  $wolfReveal.innerHTML = `ウルフは <strong>${wolfNames}</strong> でした！`;
  $topics.innerHTML = `市民のお題: <strong>${esc(currentTopic.majority)}</strong> / ウルフのお題: <strong>${esc(currentTopic.wolf)}</strong>`;

  // Vote summary
  const sortedPlayers = [...players].sort((a, b) => (tally[b] || 0) - (tally[a] || 0));
  const summaryHTML = sortedPlayers.map(p => {
    const count = tally[p] || 0;
    const isWolf = wolfPlayers.includes(p);
    const wolfTag = isWolf ? '<span class="wolf-tag">WOLF</span>' : '';
    const voters = Object.entries(votes)
      .filter(([_, target]) => target === p)
      .map(([voter]) => esc(voter))
      .join(', ');
    const voterText = voters ? `← ${voters}` : '';
    return `<div class="vote-summary-row">
      <span>${esc(p)}${wolfTag} ${voterText}</span>
      <span class="vote-count">${count}票</span>
    </div>`;
  }).join('');
  document.getElementById('voteSummary').innerHTML = summaryHTML;

  // Particles on win
  const rect = $title.getBoundingClientRect();
  emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

  // Log
  const actualTime = discussionTime - timeLeft;
  logs.unshift({
    timestamp: new Date().toISOString(),
    round,
    playerCount: players.length,
    wolfPlayers: [...wolfPlayers],
    topicCategory: currentTopic.cat,
    topicMajority: currentTopic.majority,
    topicWolf: currentTopic.wolf,
    difficulty,
    discussionTimeSetting: discussionTime,
    actualDiscussionTime: actualTime,
    votes: { ...votes },
    wolfDetected,
    result,
  });

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

  $logEntries.innerHTML = logs.slice(0, 8).map(l => {
    const resultIcon = l.result === 'citizen_win'
      ? '<span class="citizen-win">👤✅</span>'
      : '<span class="wolf-win">🐺✅</span>';
    const wolves = l.wolfPlayers.map(w => esc(w)).join(',');
    return `<div class="log-entry">
      <span>R${l.round} 🐺${wolves} (${esc(l.topicMajority)}/${esc(l.topicWolf)})</span>
      ${resultIcon}
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
  document.querySelectorAll('#difficultyPills .option-pill').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === difficulty);
  });
  document.querySelectorAll('#timePills .option-pill').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === String(discussionTime));
  });
  document.querySelectorAll('#blindPills .option-pill').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === String(blindMode));
  });
})();
