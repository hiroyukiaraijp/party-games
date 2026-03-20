/* ===== Word Slot ===== */

// --- Constants ---
const NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // 11 = "11+"
// Weighted: 3-6 chars are more likely
const NUMBER_WEIGHTS = [1, 3, 4, 4, 4, 3, 2, 2, 1, 1]; // weights for [2..11]
const CHARS = [
  'あ','い','う','え','お',
  'か','き','く','け','こ',
  'さ','し','す','せ','そ',
  'た','ち','つ','て','と',
  'な','に','ぬ','ね','の',
  'は','ひ','ふ','へ','ほ',
  'ま','み','む','め','も',
  'や','ゆ','よ',
  'ら','り','る','れ','ろ',
  'わ',
  'が','ぎ','ぐ','げ','ご',
  'ざ','じ','ず','ぜ','ぞ',
  'だ','ぢ','づ','で','ど',
  'ば','び','ぶ','べ','ぼ',
  'ぱ','ぴ','ぷ','ぺ','ぽ',
];

const STORAGE_KEY = 'wordslot_state';
const SHARED_PLAYERS_KEY = 'partygames_players';
const PARTICLE_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '💖', '🔥'];

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
    p.style.setProperty('--tx', tx + 'px');
    p.style.setProperty('--ty', ty + 'px');
    p.style.animationName = 'particle-fly';
    p.style.setProperty('animation-duration', '.8s');
    // Override keyframe end transform with custom direction
    p.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0.3)`, opacity: 0 }
    ], { duration: 800, easing: 'ease-out', fill: 'forwards' });
    container.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

// --- Kana Utilities ---
const HIRA_START = 0x3041;
const KATA_START = 0x30A1;

function toHiragana(str) {
  return str.replace(/[\u30A1-\u30F6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - KATA_START + HIRA_START)
  ).replace(/ー/g, 'ー');
}

function toKatakana(str) {
  return str.replace(/[\u3041-\u3096]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - HIRA_START + KATA_START)
  );
}

function isKana(ch) {
  const c = ch.charCodeAt(0);
  return (c >= 0x3041 && c <= 0x3096) || (c >= 0x30A1 && c <= 0x30F6) || ch === 'ー';
}

function isAllKana(str) {
  return [...str].every(ch => isKana(ch));
}

function hasKanji(str) {
  return /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(str);
}

function countKana(reading) {
  return [...reading.replace(/\s/g, '')].length;
}

function getFirstCharHiragana(str) {
  const first = [...str][0];
  if (!first) return null;
  const code = first.charCodeAt(0);
  if (code >= 0x3041 && code <= 0x3096) return first;
  if (code >= 0x30A1 && code <= 0x30F6)
    return String.fromCharCode(code - KATA_START + HIRA_START);
  return null;
}

// --- Weighted random pick ---
function weightedPick(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// --- State ---
let players = [];
let scores = {};
let logs = [];
let currentNumber = null;
let currentChar = null;
let round = 0;
let spinning = false;
let submitting = false;
let editingIndex = -1;
let lastAnswerer = null;
let spinStartTime = null;

// --- DOM refs ---
const $numVal = document.getElementById('slotNumVal');
const $charVal = document.getElementById('slotCharVal');
const $hint = document.getElementById('slotHint');
const $spinBtn = document.getElementById('spinBtn');
const $answerSection = document.getElementById('answerSection');
const $playerSelectRow = document.getElementById('playerSelectRow');
const $answerWord = document.getElementById('answerWord');
const $answerReading = document.getElementById('answerReading');
const $furiganaRow = document.getElementById('furiganaRow');
const $charCount = document.getElementById('charCount');
const $validationResult = document.getElementById('validationResult');
const $scoreboard = document.getElementById('scoreboard');
const $scoreRows = document.getElementById('scoreRows');
const $answerLog = document.getElementById('answerLog');
const $logEntries = document.getElementById('logEntries');
const $roundInfo = document.getElementById('roundInfo');
const $playerList = document.getElementById('playerList');

// --- Persistence ---
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      players, scores, logs, round, lastAnswerer
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
      if (s.lastAnswerer) lastAnswerer = s.lastAnswerer;
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
  renderPlayerSelectButtons();
  renderScoreboard();
  saveState();
  saveSharedPlayers();
}

function removePlayer(name) {
  players = players.filter(p => p !== name);
  delete scores[name];
  if (lastAnswerer === name) lastAnswerer = null;
  renderPlayers();
  renderPlayerSelectButtons();
  renderScoreboard();
  saveState();
  saveSharedPlayers();
}

function renderPlayers() {
  $playerList.innerHTML = players.map(p =>
    `<span class="player-tag">${esc(p)} <span class="remove" onclick="removePlayer('${esc(p)}')">&times;</span></span>`
  ).join('');
}

// --- Player Select Buttons ---
let selectedPlayer = null;

function renderPlayerSelectButtons() {
  const preselect = lastAnswerer && players.includes(lastAnswerer) ? lastAnswerer : null;
  selectedPlayer = preselect;
  $playerSelectRow.innerHTML = players.map(p => {
    const sel = p === preselect ? ' selected' : '';
    return `<button class="player-select-btn${sel}" data-player="${esc(p)}" onclick="selectPlayer(this, '${esc(p)}')">${esc(p)}</button>`;
  }).join('');
}

function selectPlayer(btn, name) {
  $playerSelectRow.querySelectorAll('.player-select-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedPlayer = name;
}

// --- IME Composition Tracking ---
let imeReadingSegments = [];
let imeAutoFilled = false;
let imePreValue = '';
let imePreCursor = 0;
let imeLastCompositionData = '';
let imeDebounceTimer = null;

(function setupIMETracking() {
  $answerWord.addEventListener('compositionstart', () => {
    imePreValue = $answerWord.value;
    imePreCursor = $answerWord.selectionStart || 0;
    imeLastCompositionData = '';
  });

  $answerWord.addEventListener('compositionupdate', (e) => {
    if (e.data) imeLastCompositionData = e.data;
  });

  $answerWord.addEventListener('compositionend', (e) => {
    let reading = '';

    if (imeLastCompositionData && isAllKana(imeLastCompositionData.replace(/ー/g, 'あ'))) {
      reading = imeLastCompositionData;
    }

    if (!reading) {
      const postValue = $answerWord.value;
      const prefixLen = imePreCursor;
      const suffixLen = imePreValue.length - imePreCursor;
      const composedPart = postValue.slice(prefixLen, suffixLen > 0 ? postValue.length - suffixLen : postValue.length);
      if (composedPart && isAllKana(composedPart.replace(/ー/g, 'あ'))) {
        reading = composedPart;
      }
    }

    if (!reading) {
      reading = e.data || '';
    }

    reading = toHiragana(reading);
    if (reading) {
      imeReadingSegments.push(reading);
    }

    imeLastCompositionData = '';
    imePreValue = '';
    imePreCursor = 0;

    // Debounced auto-fill
    clearTimeout(imeDebounceTimer);
    imeDebounceTimer = setTimeout(autoFillReading, 50);
  });
})();

function autoFillReading() {
  const word = $answerWord.value.trim();
  if (hasKanji(word) && imeReadingSegments.length > 0) {
    $answerReading.value = imeReadingSegments.join('');
    imeAutoFilled = true;
    $furiganaRow.style.display = 'flex';
    updateCharCount();
  }
}

function resetIMETracking() {
  imeReadingSegments = [];
  imeAutoFilled = false;
  imePreValue = '';
  imePreCursor = 0;
  imeLastCompositionData = '';
  clearTimeout(imeDebounceTimer);
}

// --- Furigana / Word Input Handling ---
function onWordInput() {
  const word = $answerWord.value.trim();
  if (!word) {
    resetIMETracking();
    $furiganaRow.style.display = 'none';
    $answerReading.value = '';
    $charCount.textContent = '';
    return;
  }
  if (hasKanji(word)) {
    $furiganaRow.style.display = 'flex';
    updateCharCount();
  } else {
    $furiganaRow.style.display = 'none';
    $answerReading.value = '';
    updateCharCount();
  }
}

function onReadingInput() {
  imeAutoFilled = false;
  // Validate: only allow kana
  const raw = $answerReading.value;
  const cleaned = toHiragana(raw);
  if (cleaned !== raw) $answerReading.value = cleaned;
  updateCharCount();
}

function updateCharCount() {
  const word = $answerWord.value.trim().replace(/\s/g, '');
  let reading;
  if (hasKanji(word)) {
    reading = $answerReading.value.trim().replace(/\s/g, '');
  } else {
    reading = toHiragana(word);
  }
  if (reading) {
    $charCount.textContent = `${countKana(reading)}文字`;
  } else {
    $charCount.textContent = '';
  }
}

function getReading(word) {
  if (hasKanji(word)) {
    const r = $answerReading.value.trim().replace(/\s/g, '');
    return toHiragana(r);
  }
  return toHiragana(word);
}

// --- Slot Machine ---
function spin() {
  if (spinning) return;
  if (players.length < 1) {
    showToast('プレイヤーを1人以上登録してください');
    return;
  }
  spinning = true;
  $spinBtn.disabled = true;
  $spinBtn.textContent = '回転中...';
  $answerSection.style.display = 'none';
  $validationResult.classList.remove('show');

  const slotNum = document.getElementById('slotNumber');
  const slotChr = document.getElementById('slotChar');
  slotNum.classList.add('spinning');
  slotNum.classList.remove('decided');
  slotChr.classList.add('spinning');
  slotChr.classList.remove('decided');

  const interval = setInterval(() => {
    $numVal.textContent = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    $charVal.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
  }, 60);

  // First spin = 2s, subsequent = 1s
  const duration = round === 0 ? 2000 : 1000;

  setTimeout(() => {
    clearInterval(interval);
    currentNumber = weightedPick(NUMBERS, NUMBER_WEIGHTS);
    currentChar = CHARS[Math.floor(Math.random() * CHARS.length)];
    $numVal.textContent = currentNumber === 11 ? '11+' : currentNumber;
    $charVal.textContent = currentChar;
    slotNum.classList.remove('spinning');
    slotNum.classList.add('decided');
    slotChr.classList.remove('spinning');
    slotChr.classList.add('decided');

    const numLabel = currentNumber === 11 ? '11文字以上' : `${currentNumber}文字`;
    $hint.innerHTML = `<strong>「${currentChar}」</strong>から始まる <strong>${numLabel}</strong> の単語！`;

    round++;
    spinStartTime = Date.now();
    $roundInfo.textContent = `ラウンド ${round}`;
    $answerSection.style.display = 'block';
    $answerWord.value = '';
    $answerReading.value = '';
    $furiganaRow.style.display = 'none';
    $charCount.textContent = '';
    resetIMETracking();
    renderPlayerSelectButtons();
    $answerWord.focus();

    spinning = false;
    $spinBtn.disabled = false;
    $spinBtn.textContent = 'スロット回す！';
    saveState();
  }, duration);
}

// --- Answer Submission ---
async function submitAnswer() {
  if (submitting) return;
  const player = selectedPlayer;
  if (!player) { showToast('回答者を選択してください'); return; }
  const word = $answerWord.value.trim().replace(/\s/g, '');
  if (!word) return;

  const reading = getReading(word);
  if (hasKanji(word) && !reading) {
    showToast('漢字を含む単語はふりがなを入力してください');
    $answerReading.focus();
    return;
  }

  if (reading && !isAllKana(reading)) {
    showToast('ふりがなはひらがな・カタカナで入力してください');
    $answerReading.focus();
    return;
  }

  submitting = true;
  const reactionMs = spinStartTime ? Date.now() - spinStartTime : null;
  showLoading(word);

  // Length check
  const len = countKana(reading);
  if (currentNumber === 11) {
    if (len < 11) {
      finishSubmit(player, word, reading, false, `${len}文字です。11文字以上必要です`, null, reactionMs);
      return;
    }
  } else if (len !== currentNumber) {
    finishSubmit(player, word, reading, false, `${len}文字です。${currentNumber}文字の単語が必要です`, null, reactionMs);
    return;
  }

  // Sentence check
  if (looksLikeSentence(word)) {
    finishSubmit(player, word, reading, false, '文章のようです。単語・固有名詞・ことわざを入力してください', null, reactionMs);
    return;
  }

  // First char check
  const firstHira = getFirstCharHiragana(reading);
  if (firstHira && firstHira !== currentChar) {
    finishSubmit(player, word, reading, false,
      `頭文字が「${currentChar}」ではありません（読みが「${reading}」→「${firstHira}」で始まっています）`, null, reactionMs);
    return;
  }

  // Dictionary check (parallel)
  let dictResult;
  try {
    dictResult = await checkDictionaryParallel(word);
  } catch (e) {
    dictResult = { found: false, reason: '辞書の検索に失敗しました。もう一度お試しください' };
  }

  if (!dictResult.found) {
    const reason = dictResult.reason || '辞書に見つかりませんでした。実在する単語・人名・作品名を入力してください';
    finishSubmit(player, word, reading, false, reason, null, reactionMs);
    return;
  }

  finishSubmit(player, word, reading, true, '', dictResult, reactionMs);
}

function finishSubmit(player, word, reading, valid, reason, dictResult, reactionMs) {
  showValidation(valid, word, reason, dictResult);

  if (valid) {
    scores[player] = (scores[player] || 0) + 1;
    lastAnswerer = player;
    // Particle effect from validation result
    const rect = $validationResult.getBoundingClientRect();
    emitParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  logs.unshift({
    round, player, word, reading,
    number: currentNumber, char: currentChar,
    valid, reason: reason || null,
    dictInfo: dictResult ? dictResult.description : null,
    reactionMs: reactionMs || null,
    timestamp: new Date().toISOString(),
  });
  renderScoreboard();
  renderLog();
  $answerWord.value = '';
  $answerReading.value = '';
  $furiganaRow.style.display = 'none';
  $charCount.textContent = '';
  resetIMETracking();
  renderPlayerSelectButtons();
  $answerWord.focus();
  submitting = false;
  saveState();
}

// --- Pass ---
async function passRound() {
  if (!currentChar || currentNumber === null) return;

  const $v = $validationResult;
  $v.classList.remove('ok', 'ng', 'pass');
  $v.classList.add('show', 'pass');
  $v.style.background = '';
  $v.style.borderColor = '';
  $v.innerHTML = `⏭ パス！ 例を検索中...`;

  try {
    const examples = await findExampleWords(currentChar, currentNumber);
    if (examples.length > 0) {
      const list = examples.map(e => `<strong>${esc(e)}</strong>`).join('、');
      $v.innerHTML = `⏭ パス！ 例: ${list}`;
    } else {
      $v.innerHTML = `⏭ パス！ (例が見つかりませんでした)`;
    }
  } catch (e) {
    $v.innerHTML = `⏭ パス！`;
  }

  logs.unshift({
    round, player: '(パス)', word: '-', reading: '',
    number: currentNumber, char: currentChar,
    valid: false, reason: 'パス',
    dictInfo: null,
    reactionMs: spinStartTime ? Date.now() - spinStartTime : null,
    timestamp: new Date().toISOString(),
  });
  renderLog();
  saveState();
}

async function findExampleWords(char, number) {
  const examples = [];
  const kataChar = toKatakana(char);
  const queries = [char, kataChar];

  for (const q of queries) {
    if (examples.length >= 3) break;
    try {
      const url = `https://ja.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=30&format=json&origin=*`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const titles = data[1] || [];
      if (titles.length === 0) continue;

      // Fetch readings via defaultsort for all candidates at once
      const readings = await fetchReadings(titles);

      for (const title of titles) {
        if (examples.length >= 3) break;
        const reading = readings[title];
        if (!reading) continue;
        const hira = toHiragana(reading);
        const len = countKana(hira);
        if (number === 11 ? len >= 11 : len === number) {
          if (!examples.includes(title)) examples.push(title);
        }
      }
    } catch (e) { /* continue */ }
  }

  return examples;
}

// Fetch katakana readings from Wikipedia defaultsort for multiple titles
async function fetchReadings(titles) {
  const readings = {};
  // MediaWiki API accepts up to 50 titles per request
  const batch = titles.slice(0, 50).join('|');
  try {
    const url = `https://ja.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(batch)}&prop=pageprops&ppprop=defaultsort&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return readings;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return readings;
    for (const page of Object.values(pages)) {
      const sort = page?.pageprops?.defaultsort;
      if (sort && isAllKana(toHiragana(sort).replace(/ー/g, 'あ').replace(/\s/g, ''))) {
        readings[page.title] = sort.replace(/\s/g, '');
      }
    }
  } catch (e) { /* ignore */ }

  // Fallback: for kana-only titles without defaultsort, use the title itself
  for (const t of titles) {
    if (!readings[t]) {
      const hira = toHiragana(t);
      if (isAllKana(hira.replace(/ー/g, 'あ'))) {
        readings[t] = hira;
      }
    }
  }
  return readings;
}

// --- Log Edit / Delete ---
function deleteLog(index) {
  const entry = logs[index];
  if (!entry) return;
  if (entry.valid && scores[entry.player] !== undefined) {
    scores[entry.player] = Math.max(0, (scores[entry.player] || 0) - 1);
  }
  logs.splice(index, 1);
  editingIndex = -1;
  renderScoreboard();
  renderLog();
  saveState();
}

function startEditLog(index) {
  editingIndex = index;
  renderLog();
}

function cancelEditLog() {
  editingIndex = -1;
  renderLog();
}

function saveEditLog(index) {
  const entry = logs[index];
  if (!entry) return;

  const newPlayer = document.getElementById(`edit-player-${index}`).value;
  const newWord = document.getElementById(`edit-word-${index}`).value.trim();
  if (!newPlayer || !newWord) return;

  if (entry.valid && scores[entry.player] !== undefined) {
    scores[entry.player] = Math.max(0, (scores[entry.player] || 0) - 1);
  }

  entry.player = newPlayer;
  entry.word = newWord;

  if (entry.valid) {
    scores[newPlayer] = (scores[newPlayer] || 0) + 1;
  }

  editingIndex = -1;
  renderScoreboard();
  renderLog();
  saveState();
}

function clearAllLogs() {
  showToast('全ログを消去しました');
  logs = [];
  for (const p of players) scores[p] = 0;
  editingIndex = -1;
  renderScoreboard();
  renderLog();
  saveState();
}

// --- Validation ---
function looksLikeSentence(word) {
  if (/[。？！?!]$/.test(word)) return true;
  if ([...word].length > 6 && /(です|ます|ました|でした|ている|ません|だった|である)$/.test(word)) return true;
  return false;
}

// --- Dictionary Check (Parallel) ---
async function checkDictionaryParallel(word) {
  const kanaInput = isAllKana(word);
  const hiraWord = toHiragana(word);
  const kataWord = toKatakana(word);

  const directTerms = [word];
  if (kanaInput) {
    if (word !== hiraWord) directTerms.push(hiraWord);
    if (word !== kataWord) directTerms.push(kataWord);
  }

  // Phase 1: fire all REST lookups in parallel
  const restPromises = [];
  for (const term of directTerms) {
    restPromises.push(wikiRestLookup('ja.wikipedia.org', term));
    restPromises.push(wikiRestLookup('ja.wiktionary.org', term));
  }

  const restResults = await Promise.allSettled(restPromises);
  for (const r of restResults) {
    if (r.status === 'fulfilled' && r.value) return r.value;
  }

  // Phase 2: search lookups in parallel
  const searchPromises = [
    wikiSearchLookup('ja.wikipedia.org', word),
    wikiSearchLookup('en.wikipedia.org', word),
  ];
  if (kanaInput && word !== kataWord) {
    searchPromises.push(wikiSearchLookup('ja.wikipedia.org', kataWord));
  }

  const searchResults = await Promise.allSettled(searchPromises);
  for (const r of searchResults) {
    if (r.status === 'fulfilled' && r.value) return r.value;
  }

  return { found: false };
}

async function wikiRestLookup(host, term) {
  try {
    const res = await fetch(`https://${host}/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === 'disambiguation' || (data.title && data.extract)) {
      return {
        found: true,
        source: host.includes('wiktionary') ? 'Wiktionary' : 'Wikipedia',
        description: (data.extract || '(曖昧さ回避ページ)').slice(0, 120),
        matchedTitle: data.title,
      };
    }
  } catch (e) { /* ignore */ }
  return null;
}

async function wikiSearchLookup(host, query) {
  try {
    const res = await fetch(
      `https://${host}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3&format=json&origin=*`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const results = data?.query?.search;
    if (!results || results.length === 0) return null;

    const qNorm = query.toLowerCase();
    const qHira = toHiragana(qNorm);
    const exact = results.find(r => {
      const t = r.title.toLowerCase();
      return t === qNorm || toHiragana(t) === qHira;
    });

    if (exact) {
      const s = await wikiRestLookup(host, exact.title);
      if (s) return s;
      const snippet = exact.snippet.replace(/<[^>]+>/g, '').slice(0, 120);
      return { found: true, source: host.includes('en.') ? 'Wikipedia(EN)' : 'Wikipedia', description: snippet, matchedTitle: exact.title };
    }

    const first = results[0];
    const fHira = toHiragana(first.title.toLowerCase());
    if (fHira.includes(qHira) || qHira.includes(fHira)) {
      const s = await wikiRestLookup(host, first.title);
      if (s) return s;
    }
    return null;
  } catch (e) { /* ignore */ }
  return null;
}

// --- Display ---
function showLoading(word) {
  const $v = $validationResult;
  $v.classList.remove('ok', 'ng', 'pass');
  $v.classList.add('show');
  $v.style.background = 'var(--surface2)';
  $v.style.borderColor = 'var(--surface2)';
  $v.innerHTML = `🔍 <strong>「${esc(word)}」</strong> を辞書で確認中...`;
}

function showValidation(valid, word, reason, dictResult) {
  const $v = $validationResult;
  $v.classList.remove('ok', 'ng', 'pass');
  $v.style.background = '';
  $v.style.borderColor = '';
  $v.classList.add('show', valid ? 'ok' : 'ng');

  if (!valid) {
    $v.innerHTML = `❌ <strong>「${esc(word)}」</strong> — ${esc(reason)}`;
  } else {
    let html = `✅ <strong>「${esc(word)}」</strong> — 正解！`;
    if (dictResult && dictResult.found) {
      html += `<br><span style="font-size:.8rem;color:var(--text-muted)">📖 ${esc(dictResult.source)}`;
      if (dictResult.matchedTitle && dictResult.matchedTitle !== word) {
        html += ` (${esc(dictResult.matchedTitle)})`;
      }
      html += `: ${esc(dictResult.description)}</span>`;
    }
    $v.innerHTML = html;
  }
}

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

function renderLog() {
  if (logs.length === 0) { $answerLog.style.display = 'none'; return; }
  $answerLog.style.display = 'block';

  $logEntries.innerHTML = logs.slice(0, 5).map((l, i) => {
    if (i === editingIndex) {
      const allPlayers = [...new Set([...players, l.player])];
      return `<div class="log-edit-form">
        <div class="log-edit-row">
          <select id="edit-player-${i}">
            ${allPlayers.map(p => `<option value="${esc(p)}" ${p === l.player ? 'selected' : ''}>${esc(p)}</option>`).join('')}
          </select>
          <input type="text" id="edit-word-${i}" value="${esc(l.word)}"
                 onkeydown="if(event.key==='Enter')saveEditLog(${i})">
        </div>
        <div class="log-edit-buttons">
          <button class="save-btn" onclick="saveEditLog(${i})">保存</button>
          <button class="cancel-btn" onclick="cancelEditLog()">キャンセル</button>
        </div>
      </div>`;
    }

    const numLabel = l.number === 11 ? '11+' : l.number;
    const readingInfo = l.reading ? ` [${l.reading}]` : '';
    const status = l.valid ? `<span class="valid">✅</span>` : `<span class="invalid">❌</span>`;
    const reasonHtml = l.reason ? `<span class="reason"> ${esc(l.reason)}</span>` : '';
    const reactionHtml = l.reactionMs ? `<span class="reason"> ${(l.reactionMs / 1000).toFixed(1)}s</span>` : '';
    return `<div class="log-entry">
      <span>R${l.round} ${esc(l.player)}: 「${esc(l.word)}」${esc(readingInfo)} (${numLabel}文字・${l.char})${reactionHtml}</span>
      <span style="display:flex;align-items:center;gap:.4rem;flex-shrink:0;">
        ${status}${reasonHtml}
        <span class="log-actions">
          <button onclick="startEditLog(${i})">編集</button>
          <button onclick="deleteLog(${i})">削除</button>
        </span>
      </span>
    </div>`;
  }).join('');
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// Space to spin when not in input
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !['INPUT', 'SELECT', 'BUTTON'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    spin();
  }
});

// --- Init ---
(function init() {
  loadState();
  if (players.length > 0) {
    renderPlayers();
    renderPlayerSelectButtons();
    renderScoreboard();
    renderLog();
    if (round > 0) $roundInfo.textContent = `ラウンド ${round}`;
  }
})();
