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

const STORAGE_KEY = 'wordslot_state';

// --- Kana Utilities ---
const HIRA_START = 0x3041;
const KATA_START = 0x30A1;

function toHiragana(str) {
  return str.replace(/[\u30A1-\u30F6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - KATA_START + HIRA_START)
  ).replace(/ー/g, 'ー'); // keep prolonged mark
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

// Count kana characters (ー counts as 1)
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

// --- DOM refs ---
const $numVal = document.getElementById('slotNumVal');
const $charVal = document.getElementById('slotCharVal');
const $hint = document.getElementById('slotHint');
const $spinBtn = document.getElementById('spinBtn');
const $answerSection = document.getElementById('answerSection');
const $answerPlayer = document.getElementById('answerPlayer');
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, logs, round }));
  } catch (e) { /* ignore */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s.players) players = s.players;
    if (s.scores) scores = s.scores;
    if (s.logs) logs = s.logs;
    if (s.round) round = s.round;
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
}

function removePlayer(name) {
  players = players.filter(p => p !== name);
  delete scores[name];
  renderPlayers();
  renderScoreboard();
  saveState();
}

function renderPlayers() {
  $playerList.innerHTML = players.map(p =>
    `<span class="player-tag">${esc(p)} <span class="remove" onclick="removePlayer('${esc(p)}')">&times;</span></span>`
  ).join('');
  // Keep empty default + player options
  const current = $answerPlayer.value;
  $answerPlayer.innerHTML =
    `<option value="" disabled selected>回答者を選択</option>` +
    players.map(p => `<option value="${esc(p)}">${esc(p)}</option>`).join('');
  // Restore selection if it was a valid player
  if (current && players.includes(current)) {
    $answerPlayer.value = current;
  }
}

// --- IME Composition Tracking ---
// Track hiragana readings as user types with IME, auto-fill furigana.
// Strategy: during composition, the input field value contains hiragana.
// We snapshot the value before composition starts and extract the
// composed portion by diffing before/after values.
let imeReadingSegments = [];
let imeAutoFilled = false;
let imePreValue = '';           // input value before composition started
let imePreCursor = 0;           // cursor position before composition
let imeLastCompositionData = ''; // last compositionupdate data (hiragana)

(function setupIMETracking() {
  $answerWord.addEventListener('compositionstart', () => {
    // Snapshot state before composition begins
    imePreValue = $answerWord.value;
    imePreCursor = $answerWord.selectionStart || 0;
    imeLastCompositionData = '';
  });

  $answerWord.addEventListener('compositionupdate', (e) => {
    // e.data contains the current composition string (usually hiragana)
    if (e.data) imeLastCompositionData = e.data;
  });

  $answerWord.addEventListener('compositionend', (e) => {
    // Determine the reading for this composition session.
    // Priority: compositionupdate data > diff-based extraction > compositionend data
    let reading = '';

    // Method 1: compositionupdate captured hiragana
    if (imeLastCompositionData && isAllKana(imeLastCompositionData.replace(/ー/g, 'あ'))) {
      reading = imeLastCompositionData;
    }

    // Method 2: diff the input value to extract what was composed
    if (!reading) {
      const postValue = $answerWord.value;
      const committed = e.data || '';
      // The composed text replaced characters at imePreCursor
      // Extract by comparing pre and post values
      const prefixLen = imePreCursor;
      const suffixLen = imePreValue.length - imePreCursor;
      const postSuffix = postValue.slice(postValue.length - suffixLen || postValue.length);
      const composedPart = postValue.slice(prefixLen, suffixLen > 0 ? postValue.length - suffixLen : postValue.length);
      // If the composed part is kana, use it directly
      if (composedPart && isAllKana(composedPart.replace(/ー/g, 'あ'))) {
        reading = composedPart;
      }
    }

    // Method 3: fallback to compositionend data
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

    // Auto-fill after a short delay (let input event fire first)
    setTimeout(autoFillReading, 10);
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
}

// --- Furigana / Word Input Handling ---
function onWordInput() {
  const word = $answerWord.value.trim();
  if (!word) {
    // Field cleared — reset everything
    resetIMETracking();
    $furiganaRow.style.display = 'none';
    $answerReading.value = '';
    $charCount.textContent = '';
    return;
  }
  if (hasKanji(word)) {
    $furiganaRow.style.display = 'flex';
    // Don't overwrite if user has manually edited
    updateCharCount();
  } else {
    $furiganaRow.style.display = 'none';
    $answerReading.value = '';
    updateCharCount();
  }
}

function onReadingInput() {
  // User is manually editing — mark as not auto-filled
  imeAutoFilled = false;
  $answerReading.value = toHiragana($answerReading.value);
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

// Get the effective reading for a word
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
    $answerReading.value = '';
    $furiganaRow.style.display = 'none';
    $charCount.textContent = '';
    resetIMETracking();
    $answerPlayer.value = '';
    $answerWord.focus();

    spinning = false;
    $spinBtn.disabled = false;
    $spinBtn.textContent = 'スロット回す！';
    saveState();
  }, 2000);
}

// --- Answer Submission ---
async function submitAnswer() {
  if (submitting) return;
  const player = $answerPlayer.value;
  if (!player) { alert('回答者を選択してください'); return; }
  const word = $answerWord.value.trim().replace(/\s/g, '');
  if (!word) return;

  // Get reading
  const reading = getReading(word);
  if (hasKanji(word) && !reading) {
    alert('漢字を含む単語はふりがなを入力してください');
    $answerReading.focus();
    return;
  }

  // Validate reading is all kana
  if (reading && !isAllKana(reading)) {
    alert('ふりがなはひらがな・カタカナで入力してください');
    $answerReading.focus();
    return;
  }

  submitting = true;
  showLoading(word);

  // Length check (based on reading)
  const len = countKana(reading);
  if (currentNumber === 11) {
    if (len < 11) {
      finishSubmit(player, word, reading, false, `${len}文字です。11文字以上必要です`, null);
      return;
    }
  } else if (len !== currentNumber) {
    finishSubmit(player, word, reading, false, `${len}文字です。${currentNumber}文字の単語が必要です`, null);
    return;
  }

  // Sentence check
  if (looksLikeSentence(word)) {
    finishSubmit(player, word, reading, false, '文章のようです。単語・固有名詞・ことわざを入力してください', null);
    return;
  }

  // First char check (based on reading)
  const firstHira = getFirstCharHiragana(reading);
  if (firstHira && firstHira !== currentChar) {
    finishSubmit(player, word, reading, false,
      `頭文字が「${currentChar}」ではありません（読みが「${reading}」→「${firstHira}」で始まっています）`, null);
    return;
  }

  // Dictionary check
  let dictResult;
  try {
    dictResult = await checkDictionary(word, currentChar);
  } catch (e) {
    dictResult = { found: false, reason: '辞書の検索に失敗しました。もう一度お試しください' };
  }

  if (!dictResult.found) {
    const reason = dictResult.reason || '辞書に見つかりませんでした。実在する単語・人名・作品名を入力してください';
    finishSubmit(player, word, reading, false, reason, null);
    return;
  }

  finishSubmit(player, word, reading, true, '', dictResult);
}

function finishSubmit(player, word, reading, valid, reason, dictResult) {
  showValidation(valid, word, reason, dictResult);
  if (valid) {
    scores[player] = (scores[player] || 0) + 1;
  }
  logs.unshift({
    round, player, word, reading,
    number: currentNumber, char: currentChar,
    valid, reason: reason || null,
    dictInfo: dictResult ? dictResult.description : null,
  });
  renderScoreboard();
  renderLog();
  $answerWord.value = '';
  $answerReading.value = '';
  $furiganaRow.style.display = 'none';
  $charCount.textContent = '';
  resetIMETracking();
  $answerPlayer.value = '';
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

  // Search for example words
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

  // Log the pass
  logs.unshift({
    round, player: '(パス)', word: '-', reading: '',
    number: currentNumber, char: currentChar,
    valid: false, reason: 'パス',
    dictInfo: null,
  });
  renderLog();
  saveState();
}

// Find example words using Wikipedia search
async function findExampleWords(char, number) {
  const examples = [];
  const kataChar = toKatakana(char);
  // Search with the character as prefix
  const queries = [char, kataChar];

  for (const q of queries) {
    if (examples.length >= 3) break;
    try {
      const url = `https://ja.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=20&format=json&origin=*`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const titles = data[1] || [];

      for (const title of titles) {
        if (examples.length >= 3) break;
        // Check length — approximate for titles with kanji
        // For kana titles, count directly; for kanji, rough check
        const hira = toHiragana(title);
        const isKanaTitle = isAllKana(hira.replace(/ー/g, 'あ'));
        if (isKanaTitle) {
          const len = countKana(hira);
          if (number === 11 ? len >= 11 : len === number) {
            if (!examples.includes(title)) examples.push(title);
          }
        } else {
          // For kanji titles, use character count as rough estimate
          const len = [...title].length;
          // Accept if roughly in range (kanji titles are shorter than their reading)
          if (number === 11 ? len >= 5 : (len >= number - 2 && len <= number)) {
            if (!examples.includes(title)) examples.push(title);
          }
        }
      }
    } catch (e) { /* continue */ }
  }

  return examples;
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

  // Revert old score
  if (entry.valid && scores[entry.player] !== undefined) {
    scores[entry.player] = Math.max(0, (scores[entry.player] || 0) - 1);
  }

  entry.player = newPlayer;
  entry.word = newWord;

  // Re-add score to new player
  if (entry.valid) {
    scores[newPlayer] = (scores[newPlayer] || 0) + 1;
  }

  editingIndex = -1;
  renderScoreboard();
  renderLog();
  saveState();
}

function clearAllLogs() {
  if (!confirm('全ログを消去しますか？スコアもリセットされます。')) return;
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

// --- Dictionary Check ---
async function checkDictionary(word) {
  const kanaInput = isAllKana(word);
  const hiraWord = toHiragana(word);
  const kataWord = toKatakana(word);

  const directTerms = [word];
  if (kanaInput) {
    if (word !== hiraWord) directTerms.push(hiraWord);
    if (word !== kataWord) directTerms.push(kataWord);
  }

  for (const term of directTerms) {
    const r = await wikiRestLookup('ja.wikipedia.org', term);
    if (r) return r;
  }
  for (const term of directTerms) {
    const r = await wikiRestLookup('ja.wiktionary.org', term);
    if (r) return r;
  }
  { const r = await wikiSearchLookup('ja.wikipedia.org', word); if (r) return r; }
  if (kanaInput && word !== kataWord) {
    const r = await wikiSearchLookup('ja.wikipedia.org', kataWord); if (r) return r;
  }
  { const r = await wikiSearchLookup('en.wikipedia.org', word); if (r) return r; }

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
    // Edit mode
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

    // Normal display
    const numLabel = l.number === 11 ? '11+' : l.number;
    const readingInfo = l.reading ? ` [${l.reading}]` : '';
    const status = l.valid ? `<span class="valid">✅</span>` : `<span class="invalid">❌</span>`;
    const reasonHtml = l.reason ? `<span class="reason"> ${esc(l.reason)}</span>` : '';
    return `<div class="log-entry">
      <span>R${l.round} ${esc(l.player)}: 「${esc(l.word)}」${esc(readingInfo)} (${numLabel}文字・${l.char})</span>
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
  if (e.code === 'Space' && !['INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    spin();
  }
});

// --- Init ---
(function init() {
  loadState();
  if (players.length > 0) {
    renderPlayers();
    renderScoreboard();
    renderLog();
    if (round > 0) $roundInfo.textContent = `ラウンド ${round}`;
  }
})();
