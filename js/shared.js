/* ===== Shared Components (全ゲーム共通) ===== */

// ========== 1. Blind Screen (覗き見防止) ==========
// Usage: showBlindScreen('次の人にスマホを渡してください', 'Aさん の番', callback)
function showBlindScreen(instruction, playerName, onReady) {
  let el = document.getElementById('_blindScreen');
  if (!el) {
    el = document.createElement('div');
    el.id = '_blindScreen';
    el.style.cssText = 'position:fixed;inset:0;z-index:9999;background:var(--bg,#f8f5ff);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;font-family:inherit;padding:1.5rem;text-align:center;';
    document.body.appendChild(el);
  }
  el.innerHTML = `
    <div style="font-size:.85rem;color:var(--text-muted,#7a6b8a);">${_escBS(instruction)}</div>
    <div style="font-size:1.3rem;font-weight:900;color:var(--text,#2d2040);">${_escBS(playerName)}</div>
    <button onclick="document.getElementById('_blindScreen').style.display='none';(${onReady.name||'function(){}'})()" style="margin-top:1rem;padding:.7rem 2rem;font-size:1rem;font-weight:700;border:none;border-radius:999px;background:var(--gradient-btn,linear-gradient(135deg,#ff6b9d,#c084fc));color:#fff;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(0,0,0,.15);">準備OK</button>
  `;
  el.style.display = 'flex';
}
function hideBlindScreen() {
  const el = document.getElementById('_blindScreen');
  if (el) el.style.display = 'none';
}
function _escBS(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// ========== 2. Best Score (ベストスコア記録) ==========
// Usage: updateBestScore('colorpanic', 25); getBestScore('colorpanic');
const BEST_SCORE_KEY = 'partygames_best';
function getBestScores() {
  try { return JSON.parse(localStorage.getItem(BEST_SCORE_KEY)) || {}; } catch { return {}; }
}
function getBestScore(gameId) {
  return getBestScores()[gameId] || 0;
}
function updateBestScore(gameId, score) {
  const bests = getBestScores();
  if (score > (bests[gameId] || 0)) {
    bests[gameId] = score;
    try { localStorage.setItem(BEST_SCORE_KEY, JSON.stringify(bests)); } catch {}
    return true; // new best!
  }
  return false;
}
// Render best score badge in result screen
function renderBestBadge(gameId, currentScore) {
  const isNew = updateBestScore(gameId, currentScore);
  const best = getBestScore(gameId);
  if (isNew && currentScore > 0) {
    return `<div style="margin-top:.4rem;padding:.3rem .8rem;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#fff;border-radius:999px;font-size:.75rem;font-weight:900;display:inline-block;">NEW BEST!</div>`;
  }
  if (best > 0) {
    return `<div style="margin-top:.3rem;font-size:.7rem;color:var(--text-muted);">ベスト記録: ${best}</div>`;
  }
  return '';
}

// ========== 3. Game Recommendation (FTUE: 次のゲーム推薦) ==========
function renderGameRecommendation(currentGameId) {
  const allGames = [
    {id:'word-slot',icon:'🎰',name:'ワードスロット',href:'../word-slot/index.html'},
    {id:'katakana-nashi',icon:'🚫',name:'カタカナーシ',href:'../katakana-nashi/index.html'},
    {id:'word-wolf',icon:'🐺',name:'ワードウルフ',href:'../word-wolf/index.html'},
    {id:'master-game',icon:'👑',name:'マスターゲーム',href:'../master-game/index.html'},
    {id:'number-expression',icon:'🎲',name:'数字deコトバ',href:'../number-expression/index.html'},
    {id:'hint-bridge',icon:'🔗',name:'連想ブリッジ',href:'../hint-bridge/index.html'},
    {id:'color-panic',icon:'🎨',name:'カラーパニック',href:'../color-panic/index.html'},
    {id:'flash-memory',icon:'🧠',name:'フラッシュメモリー',href:'../flash-memory/index.html'},
    {id:'rhythm-relay',icon:'🔔',name:'リズムリレー',href:'../rhythm-relay/index.html'},
    {id:'reverse-dictionary',icon:'📖',name:'逆引き辞書クイズ',href:'../reverse-dictionary/index.html'},
    {id:'puzzle-solver',icon:'🔍',name:'ナゾトキ',href:'../puzzle-solver/index.html'},
    {id:'air-reading',icon:'🎯',name:'空気読みスケール',href:'../air-reading/index.html'},
    {id:'initial-battle',icon:'⚡',name:'頭文字バトル',href:'../initial-battle/index.html'},
  ];
  const others = allGames.filter(g => g.id !== currentGameId);
  const pick = others[Math.floor(Math.random() * others.length)];
  return `<div style="margin-top:1rem;padding:.6rem;background:var(--surface2,#f0ecf9);border-radius:12px;text-align:center;">
    <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:.3rem;">次はこれもどう？</div>
    <a href="${pick.href}" style="text-decoration:none;color:var(--text);font-weight:700;font-size:.85rem;">${pick.icon} ${pick.name}</a>
  </div>`;
}

// ========== 4. Simple DDA (動的難易度調整) ==========
// Staircase method: 3-down/1-up targeting ~79% accuracy
const DDA_KEY_PREFIX = 'partygames_dda_';
function getDDALevel(gameId) {
  try { return parseInt(localStorage.getItem(DDA_KEY_PREFIX + gameId)) || 1; } catch { return 1; }
}
function updateDDALevel(gameId, correct) {
  const key = DDA_KEY_PREFIX + gameId;
  let level = getDDALevel(gameId);
  let streak = parseInt(localStorage.getItem(key + '_streak')) || 0;

  if (correct) {
    streak++;
    if (streak >= 3) { // 3 correct in a row → level up
      level = Math.min(level + 1, 10);
      streak = 0;
    }
  } else {
    level = Math.max(level - 1, 1); // 1 wrong → level down
    streak = 0;
  }

  try {
    localStorage.setItem(key, String(level));
    localStorage.setItem(key + '_streak', String(streak));
  } catch {}
  return level;
}

// ========== 5. Session Player UI (ゲーム内プレイヤー管理) ==========
// セッションメンバーからプレイヤーを選択/除外。新規追加は名前+生年月日が必要。
// Usage: initSessionPlayerUI('playerList', 'playerNameInput', players, scores, callbacks)

function getSessionMemberNames() {
  try {
    const sp = JSON.parse(localStorage.getItem('asobi_session_players') || '[]');
    return sp.map(p => p.name);
  } catch { return []; }
}

// Replace the game's addPlayer to use session-aware version
function initSessionPlayers(playersRef, scoresRef) {
  const sessionNames = getSessionMemberNames();
  if (sessionNames.length > 0 && playersRef.length === 0) {
    sessionNames.forEach(name => {
      if (!playersRef.includes(name)) {
        playersRef.push(name);
        scoresRef[name] = scoresRef[name] || 0;
      }
    });
  }
}
