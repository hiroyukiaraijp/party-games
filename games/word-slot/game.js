/* ===== ワードスロット ===== */

// --- Constants ---
const NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // 11 = "11+"
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

// --- Kana Utilities ---
const HIRA_START = 0x3041;
const KATA_START = 0x30A1;

function toHiragana(str) {
  return str.replace(/[\u30A1-\u30F6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - KATA_START + HIRA_START)
  );
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

// Count characters: each char (kanji/hiragana/katakana/ー) = 1. Strip whitespace only.
function countChars(word) {
  const clean = word.replace(/\s/g, '');
  return [...clean].length;
}

// Get first character converted to hiragana (returns null for kanji)
function getFirstCharHiragana(word) {
  const first = [...word][0];
  if (!first) return null;
  const code = first.charCodeAt(0);
  // Hiragana
  if (code >= 0x3041 && code <= 0x3096) return first;
  // Katakana → hiragana
  if (code >= 0x30A1 && code <= 0x30F6)
    return String.fromCharCode(code - KATA_START + HIRA_START);
  // Kanji or other → can't determine reading locally
  return null;
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

// --- DOM refs ---
const $numVal = document.getElementById('slotNumVal');
const $charVal = document.getElementById('slotCharVal');
const $hint = document.getElementById('slotHint');
const $spinBtn = document.getElementById('spinBtn');
const $answerSection = document.getElementById('answerSection');
const $answerPlayer = document.getElementById('answerPlayer');
const $answerWord = document.getElementById('answerWord');
const $validationResult = document.getElementById('validationResult');
const $scoreboard = document.getElementById('scoreboard');
const $scoreRows = document.getElementById('scoreRows');
const $answerLog = document.getElementById('answerLog');
const $logEntries = document.getElementById('logEntries');
const $roundInfo = document.getElementById('roundInfo');
const $playerList = document.getElementById('playerList');

// --- Player Management ---
function addPlayer() {
  const input = document.getElementById('playerNameInput');
  const name = input.value.trim();
  if (!name || players.includes(name)) { input.value = ''; return; }
  players.push(name);
  scores[name] = 0;
  input.value = '';
  renderPlayers();
  renderScoreboard();
}

function removePlayer(name) {
  players = players.filter(p => p !== name);
  delete scores[name];
  renderPlayers();
  renderScoreboard();
}

function renderPlayers() {
  $playerList.innerHTML = players.map(p =>
    `<span class="player-tag">${esc(p)} <span class="remove" onclick="removePlayer('${esc(p)}')">&times;</span></span>`
  ).join('');
  $answerPlayer.innerHTML = players.map(p =>
    `<option value="${esc(p)}">${esc(p)}</option>`
  ).join('');
}

// --- Slot Machine ---
function spin() {
  if (spinning) return;
  if (players.length < 1) {
    alert('プレイヤーを1人以上登録してください');
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
  slotChr.classList.add('spinning');

  const interval = setInterval(() => {
    $numVal.textContent = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    $charVal.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
  }, 60);

  setTimeout(() => {
    clearInterval(interval);
    currentNumber = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    currentChar = CHARS[Math.floor(Math.random() * CHARS.length)];
    $numVal.textContent = currentNumber === 11 ? '11+' : currentNumber;
    $charVal.textContent = currentChar;
    slotNum.classList.remove('spinning');
    slotChr.classList.remove('spinning');

    const numLabel = currentNumber === 11 ? '11文字以上' : `${currentNumber}文字`;
    $hint.innerHTML = `<strong>「${currentChar}」</strong>から始まる <strong>${numLabel}</strong> の単語！`;

    round++;
    $roundInfo.textContent = `ラウンド ${round}`;
    $answerSection.style.display = 'block';
    $answerWord.value = '';
    $answerWord.focus();

    spinning = false;
    $spinBtn.disabled = false;
    $spinBtn.textContent = 'スロット回す！';
  }, 2000);
}

// --- Answer Submission ---
async function submitAnswer() {
  if (submitting) return;
  const player = $answerPlayer.value;
  const word = $answerWord.value.trim().replace(/\s/g, '');
  if (!word) return;

  submitting = true;
  showLoading(word);

  // Step 1: Local length check
  const lenCheck = validateLength(word);
  if (!lenCheck.valid) {
    finishSubmit(player, word, false, lenCheck.reason, null);
    return;
  }

  // Step 2: Sentence check
  if (looksLikeSentence(word)) {
    finishSubmit(player, word, false, '文章のようです。単語・固有名詞・ことわざを入力してください', null);
    return;
  }

  // Step 3: Local first-char check (kana input only; kanji deferred to dictionary)
  const firstHira = getFirstCharHiragana(word);
  if (firstHira !== null && firstHira !== currentChar) {
    finishSubmit(player, word, false,
      `頭文字が「${currentChar}」ではありません（「${firstHira}」で始まっています）`, null);
    return;
  }

  // Step 4: Dictionary check (REQUIRED)
  let dictResult;
  try {
    dictResult = await checkDictionary(word, currentChar);
  } catch (e) {
    dictResult = { found: false, reason: '辞書の検索に失敗しました。もう一度お試しください' };
  }

  if (!dictResult.found) {
    const reason = dictResult.reason || '辞書に見つかりませんでした。実在する単語・人名・作品名を入力してください';
    finishSubmit(player, word, false, reason, null);
    return;
  }

  // Step 5: Verify reading from dictionary matches required first char (for kanji input)
  if (firstHira === null && dictResult.reading) {
    const dictFirst = getFirstCharHiragana(dictResult.reading);
    if (dictFirst && dictFirst !== currentChar) {
      finishSubmit(player, word, false,
        `「${word}」の読みは「${dictResult.reading}」— 頭文字が「${currentChar}」ではありません`, null);
      return;
    }
  }

  finishSubmit(player, word, true, '', dictResult);
}

function finishSubmit(player, word, valid, reason, dictResult) {
  showValidation(valid, word, reason, dictResult);
  if (valid) {
    scores[player] = (scores[player] || 0) + 1;
  }
  logs.unshift({
    round, player, word,
    number: currentNumber, char: currentChar,
    valid, reason: reason || null,
    dictInfo: dictResult ? dictResult.description : null,
  });
  renderScoreboard();
  renderLog();
  $answerWord.value = '';
  $answerWord.focus();
  submitting = false;
}

// --- Local Validation ---
function validateLength(word) {
  const len = countChars(word);
  if (len === 0) return { valid: false, reason: '単語が空です' };
  if (currentNumber === 11) {
    if (len < 11) return { valid: false, reason: `${len}文字です。11文字以上必要です` };
  } else {
    if (len !== currentNumber) return { valid: false, reason: `${len}文字です。${currentNumber}文字の単語が必要です` };
  }
  return { valid: true };
}

function looksLikeSentence(word) {
  if (/[。？！?!]$/.test(word)) return true;
  const len = [...word].length;
  if (len > 6 && /(です|ます|ました|でした|ている|ません|だった|である)$/.test(word)) return true;
  return false;
}

// --- Dictionary Check ---
// Searches Wikipedia (REST + MediaWiki search) and Wiktionary.
// For kana input, searches by reading. For kanji, direct lookup.
// Returns { found, source, description, reading }
async function checkDictionary(word, requiredChar) {
  const kanaInput = isAllKana(word);
  const hiraWord = toHiragana(word);
  const kataWord = toKatakana(word);

  // Build search variants
  const directTerms = [word];
  if (kanaInput) {
    // Also try katakana/hiragana variants
    if (word !== hiraWord) directTerms.push(hiraWord);
    if (word !== kataWord) directTerms.push(kataWord);
  }

  // 1. Wikipedia REST API (direct page lookup)
  for (const term of directTerms) {
    const result = await wikiRestLookup('ja.wikipedia.org', term);
    if (result) return result;
  }

  // 2. Wiktionary REST API (direct page lookup)
  for (const term of directTerms) {
    const result = await wikiRestLookup('ja.wiktionary.org', term);
    if (result) return result;
  }

  // 3. Wikipedia MediaWiki search API (finds articles by content/title)
  {
    const result = await wikiSearchLookup('ja.wikipedia.org', word);
    if (result) return result;
  }

  // 4. For kana input, try MediaWiki search with katakana
  if (kanaInput && word !== kataWord) {
    const result = await wikiSearchLookup('ja.wikipedia.org', kataWord);
    if (result) return result;
  }

  // 5. English Wikipedia (for international proper nouns / titles)
  {
    const result = await wikiSearchLookup('en.wikipedia.org', word);
    if (result) return result;
  }

  return { found: false };
}

// Wikipedia/Wiktionary REST API direct page lookup
async function wikiRestLookup(host, term) {
  try {
    const url = `https://${host}/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === 'disambiguation' || (data.title && data.extract)) {
      const source = host.includes('wiktionary') ? 'Wiktionary' : 'Wikipedia';
      return {
        found: true,
        source,
        description: (data.extract || '(曖昧さ回避ページ)').slice(0, 120),
        reading: null, // REST API doesn't reliably provide reading
        matchedTitle: data.title,
      };
    }
  } catch (e) { /* ignore */ }
  return null;
}

// Wikipedia MediaWiki search API — finds pages matching the query
async function wikiSearchLookup(host, query) {
  try {
    const url = `https://${host}/w/api.php?action=query&list=search` +
      `&srsearch=${encodeURIComponent(query)}&srlimit=3&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const results = data?.query?.search;
    if (!results || results.length === 0) return null;

    // Check if any result title exactly matches the query (case-insensitive)
    const queryNorm = query.toLowerCase();
    const exactMatch = results.find(r => {
      const titleNorm = r.title.toLowerCase();
      const titleHira = toHiragana(titleNorm);
      const queryHira = toHiragana(queryNorm);
      return titleNorm === queryNorm || titleHira === queryHira;
    });

    if (exactMatch) {
      // Fetch summary for the matched article
      const summary = await wikiRestLookup(host, exactMatch.title);
      if (summary) return summary;
      // Fallback: use search snippet
      const snippet = exactMatch.snippet.replace(/<[^>]+>/g, '').slice(0, 120);
      const source = host.includes('en.') ? 'Wikipedia(EN)' : 'Wikipedia';
      return { found: true, source, description: snippet, reading: null, matchedTitle: exactMatch.title };
    }

    // No exact match — check if the first result's title contains the query
    const first = results[0];
    const firstTitle = first.title;
    const firstHira = toHiragana(firstTitle.toLowerCase());
    const queryHira = toHiragana(queryNorm);
    if (firstHira.includes(queryHira) || queryHira.includes(firstHira)) {
      const summary = await wikiRestLookup(host, firstTitle);
      if (summary) return summary;
    }

    return null;
  } catch (e) { /* ignore */ }
  return null;
}

// --- Display ---
function showLoading(word) {
  const $v = $validationResult;
  $v.classList.remove('ok', 'ng');
  $v.classList.add('show');
  $v.style.background = 'var(--surface2)';
  $v.style.borderColor = '#666';
  $v.innerHTML = `🔍 <strong>「${esc(word)}」</strong> を辞書で確認中...`;
}

function showValidation(valid, word, reason, dictResult) {
  const $v = $validationResult;
  $v.classList.remove('ok', 'ng');
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
  $scoreboard.style.display = 'block';
  const sorted = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  $scoreRows.innerHTML = sorted.map((p, i) => {
    const medal = i === 0 && scores[p] > 0 ? '👑 ' : '';
    return `<div class="score-row">
      <span class="name">${medal}${esc(p)}</span>
      <span class="pts">${scores[p] || 0} pt</span>
    </div>`;
  }).join('');
}

function renderLog() {
  if (logs.length === 0) { $answerLog.style.display = 'none'; return; }
  $answerLog.style.display = 'block';
  $logEntries.innerHTML = logs.slice(0, 50).map(l => {
    const numLabel = l.number === 11 ? '11+' : l.number;
    const status = l.valid
      ? `<span class="valid">✅</span>`
      : `<span class="invalid">❌</span>`;
    const reasonHtml = l.reason ? `<span class="reason"> ${esc(l.reason)}</span>` : '';
    return `<div class="log-entry">
      <span>R${l.round} ${esc(l.player)}: 「${esc(l.word)}」(${numLabel}文字・${l.char})</span>
      <span>${status}${reasonHtml}</span>
    </div>`;
  }).join('');
}

// --- Utility ---
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// Space to spin when not in input
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
    e.preventDefault();
    spin();
  }
});
