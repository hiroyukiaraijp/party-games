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

// Katakana ↔ Hiragana offset
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

// Count "logical" Japanese characters (treating small kana like ゃ as part of previous char for display, but counting independently)
function countChars(word) {
  // Remove spaces/punctuation, count remaining chars
  const clean = word.replace(/[\s・\-ー]/g, '');
  return [...clean].length;
}

// Get first logical character in hiragana
function getFirstChar(word) {
  const first = [...word][0];
  return toHiragana(first);
}

// --- State ---
let players = [];
let scores = {};
let logs = [];
let currentNumber = null;
let currentChar = null;
let round = 0;
let spinning = false;

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
  // Update answer dropdown
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

  // Animate for ~2 seconds
  let tick = 0;
  const interval = setInterval(() => {
    $numVal.textContent = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    const rc = CHARS[Math.floor(Math.random() * CHARS.length)];
    $charVal.textContent = rc;
    tick++;
  }, 60);

  // Slow down and stop
  setTimeout(() => {
    clearInterval(interval);

    // Pick final values
    currentNumber = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    currentChar = CHARS[Math.floor(Math.random() * CHARS.length)];

    // Display with "11+" notation
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
  const player = $answerPlayer.value;
  const word = $answerWord.value.trim();
  if (!word) return;

  const result = validateLocal(word);

  // Try dictionary API check
  let apiResult = null;
  try {
    apiResult = await checkDictionary(word);
  } catch (e) {
    // API unavailable, rely on local validation only
  }

  let valid = result.valid;
  let reason = result.reason;

  if (valid && apiResult !== null) {
    if (!apiResult.found) {
      // API says not found — mark as warning but still accept with note
      reason = '辞書に見つかりませんでした（人名・作品名の可能性あり）';
    }
  }

  // Display result
  showValidation(valid, word, reason, apiResult);

  // Record
  if (valid) {
    scores[player] = (scores[player] || 0) + 1;
  }

  logs.unshift({
    round,
    player,
    word,
    number: currentNumber,
    char: currentChar,
    valid,
    reason: valid ? (reason || null) : reason,
  });

  renderScoreboard();
  renderLog();
  $answerWord.value = '';
  $answerWord.focus();
}

// --- Local Validation ---
function validateLocal(word) {
  const clean = word.replace(/[\s]/g, '');
  if (!clean) return { valid: false, reason: '単語が空です' };

  // Check first character
  const firstHira = getFirstChar(clean);
  if (firstHira !== currentChar) {
    return { valid: false, reason: `頭文字が「${currentChar}」ではありません（「${firstHira}」で始まっています）` };
  }

  // Check length
  const len = countChars(clean);
  if (currentNumber === 11) {
    if (len < 11) {
      return { valid: false, reason: `${len}文字です。11文字以上必要です` };
    }
  } else {
    if (len !== currentNumber) {
      return { valid: false, reason: `${len}文字です。${currentNumber}文字の単語が必要です` };
    }
  }

  // Check if it's likely a sentence (has particles in suspicious positions)
  if (looksLikeSentence(clean)) {
    return { valid: false, reason: '文章のようです。単語・固有名詞・ことわざを入力してください' };
  }

  return { valid: true, reason: '' };
}

function looksLikeSentence(word) {
  // Simple heuristic: if word contains common sentence-ending patterns
  // or has too many particles in a row, flag it
  const sentenceEndings = /[。？！\?\!]$/;
  if (sentenceEndings.test(word)) return true;

  // Check for verb/adjective endings that suggest a full sentence
  // e.g., "わたしのりんご" — has の acting as possessive in a phrase
  // But "もののけ" is fine, so we need to be conservative
  // Only flag if it looks very sentence-like (multiple particles)
  const particles = word.match(/[はがをにへでもの]{1}/g);
  const len = [...word].length;
  if (particles && particles.length >= 3 && len <= 8) return true;

  // Very long strings with common sentence patterns
  if (len > 6) {
    const sentencePatterns = /(です|ます|ました|でした|ている|ません|だった|である)$/;
    if (sentencePatterns.test(word)) return true;
  }

  return false;
}

// --- Dictionary API Check (using free Wiktionary API) ---
async function checkDictionary(word) {
  // Use Wikipedia API to check if the word exists as an article
  // This covers proper nouns, titles, etc.
  const endpoints = [
    // Japanese Wikipedia
    `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.title && data.extract) {
          return { found: true, source: 'Wikipedia', description: data.extract.slice(0, 100) };
        }
      }
    } catch (e) {
      // continue
    }
  }

  // Try Wiktionary
  try {
    const wiktUrl = `https://ja.wiktionary.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`;
    const res = await fetch(wiktUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.title && data.extract) {
        return { found: true, source: 'Wiktionary', description: data.extract.slice(0, 100) };
      }
    }
  } catch (e) {
    // continue
  }

  return { found: false };
}

// --- Display ---
function showValidation(valid, word, reason, apiResult) {
  const $v = $validationResult;
  $v.classList.remove('ok', 'ng');
  $v.classList.add('show', valid ? 'ok' : 'ng');

  if (!valid) {
    $v.innerHTML = `❌ <strong>「${esc(word)}」</strong> — ${esc(reason)}`;
  } else {
    let html = `✅ <strong>「${esc(word)}」</strong> — 正解！`;
    if (apiResult && apiResult.found) {
      html += `<br><span style="font-size:.8rem;color:var(--text-muted)">📖 ${esc(apiResult.source)}: ${esc(apiResult.description)}</span>`;
    } else if (reason) {
      html += `<br><span style="font-size:.8rem;color:#ff9800">⚠️ ${esc(reason)}</span>`;
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

// --- Keyboard shortcut: Space to spin when not in input ---
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
    e.preventDefault();
    spin();
  }
});
