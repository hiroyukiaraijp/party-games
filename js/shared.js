/* ===== Shared Components (全ゲーム共通) ===== */

// ========== 1. Blind Screen (覗き見防止) ==========
// Usage: showBlindScreen('次の人にスマホを渡してください', 'Aさん の番', callback)
let _blindScreenCallback = null;
function showBlindScreen(instruction, playerName, onReady) {
  _blindScreenCallback = onReady;
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
    <button onclick="document.getElementById('_blindScreen').style.display='none';if(_blindScreenCallback)_blindScreenCallback();" style="margin-top:1rem;padding:.7rem 2rem;font-size:1rem;font-weight:700;border:none;border-radius:999px;background:var(--gradient-btn,linear-gradient(135deg,#ff6b9d,#c084fc));color:#fff;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(0,0,0,.15);">準備OK</button>
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
    {id:'number-auction',icon:'🏷️',name:'ナンバーオークション',href:'../number-auction/index.html'},
    {id:'lab-panic',icon:'🧪',name:'ラボパニック',href:'../lab-panic/index.html'},
    {id:'kanji-puzzle',icon:'🀄',name:'漢字バラバラ',href:'../kanji-puzzle/index.html'},
    {id:'where-is-it',icon:'🗺️',name:'どこでしょう？',href:'../where-is-it/index.html'},
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
// セッションメンバーが最初からセット。除外/復帰が可能。新規追加は名前+生年月日。

function getSessionMembers() {
  try { return JSON.parse(localStorage.getItem('asobi_session_players') || '[]'); } catch { return []; }
}
function getSessionMemberNames() {
  return getSessionMembers().map(p => p.name);
}

// Load session members into game's player/score arrays
// Always merges session members (even if players already has data from localStorage)
function initSessionPlayers(playersRef, scoresRef) {
  const members = getSessionMemberNames();
  members.forEach(name => {
    if (!playersRef.includes(name)) {
      playersRef.push(name);
      scoresRef[name] = scoresRef[name] || 0;
    }
  });
}

// Global excluded set - persists across re-renders
const _excludedPlayers = new Set();

// Render session-aware player bar into a container element
function renderSessionPlayerBar(containerId, players, scores, onChangeCallback) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sessionMembers = getSessionMembers();
  const excluded = _excludedPlayers; // use global set

  function render() {
    let html = '<div style="display:flex;flex-wrap:wrap;gap:.3rem;align-items:center;">';

    // Session member tags (toggleable)
    players.forEach((name, i) => {
      const isExcluded = excluded.has(name);
      const style = isExcluded
        ? 'opacity:.4;text-decoration:line-through;'
        : '';
      html += `<span class="player-tag" style="cursor:pointer;${style}" onclick="window._togglePlayer('${_escSPB(name)}')">${_escSPB(name)} ${isExcluded ? '＋' : '×'}</span>`;
    });

    // Add new member button
    html += `<button onclick="window._showAddMemberForm()" style="background:none;border:2px dashed var(--surface2,#e5e1f0);color:var(--text-muted,#7a6b8a);padding:.15rem .5rem;border-radius:999px;font-size:.7rem;cursor:pointer;font-family:inherit;font-weight:600;">+ 追加</button>`;
    html += '</div>';

    // Add member form (hidden by default)
    html += `<div id="_addMemberForm" style="display:none;margin-top:.4rem;padding:.5rem;background:var(--surface2,#f0ecf9);border-radius:10px;">
      <div style="font-size:.7rem;font-weight:700;color:var(--text-muted);margin-bottom:.3rem;">新しいメンバー（名前＋生年月日）</div>
      <div style="display:flex;gap:.3rem;flex-wrap:wrap;">
        <input type="text" id="_addMemberName" placeholder="名前" maxlength="20" style="padding:.3rem .5rem;font-size:.8rem;border-radius:8px;border:2px solid var(--surface2,#e5e1f0);width:80px;min-width:0;font-family:inherit;">
        <input type="date" id="_addMemberBday" style="padding:.3rem .5rem;font-size:.8rem;border-radius:8px;border:2px solid var(--surface2,#e5e1f0);font-family:inherit;">
        <button onclick="window._doAddMember()" style="padding:.3rem .6rem;font-size:.75rem;border-radius:8px;background:var(--gradient-btn,linear-gradient(135deg,#ff6b9d,#c084fc));color:#fff;border:none;cursor:pointer;font-family:inherit;font-weight:700;">登録</button>
        <button onclick="document.getElementById('_addMemberForm').style.display='none'" style="padding:.3rem .6rem;font-size:.75rem;border-radius:8px;background:var(--surface,#fff);color:var(--text-muted);border:1px solid var(--surface2);cursor:pointer;font-family:inherit;">閉じる</button>
      </div>
      <div id="_addMemberAlert" style="font-size:.7rem;margin-top:.2rem;"></div>
    </div>`;

    container.innerHTML = html;
  }

  // Toggle player active/excluded
  window._togglePlayer = function(name) {
    if (excluded.has(name)) {
      excluded.delete(name);
    } else {
      excluded.add(name);
    }
    render();
    if (onChangeCallback) onChangeCallback(players.filter(n => !excluded.has(n)));
  };

  window._showAddMemberForm = function() {
    document.getElementById('_addMemberForm').style.display = '';
  };

  window._doAddMember = async function() {
    const nameEl = document.getElementById('_addMemberName');
    const bdayEl = document.getElementById('_addMemberBday');
    const alertEl = document.getElementById('_addMemberAlert');
    const name = nameEl.value.trim();
    const bday = bdayEl.value;
    if (!name || !bday) { alertEl.textContent = '名前と生年月日を入力してください'; return; }

    try {
      if (typeof initFirebase === 'function') initFirebase();
      if (typeof loginOrRegister === 'function') {
        const result = await loginOrRegister(name, bday);
        if (result.isNew) {
          alertEl.innerHTML = '<span style="color:#10b981;">新規登録しました！</span>';
        } else {
          alertEl.innerHTML = '<span style="color:#6366f1;">既存データが見つかりました！</span>';
        }
        // Add to session
        const sp = getSessionMembers();
        if (!sp.some(m => m.userId === result.user.id)) {
          sp.push({ userId: result.user.id, name: result.user.name });
          localStorage.setItem('asobi_session_players', JSON.stringify(sp));
          localStorage.setItem('partygames_players', JSON.stringify(sp.map(p => p.name)));
        }
      }
    } catch (e) {
      alertEl.textContent = 'オフラインです。名前だけで追加します。';
    }

    if (!players.includes(name)) {
      players.push(name);
      scores[name] = scores[name] || 0;
    }
    nameEl.value = ''; bdayEl.value = '';
    render();
    if (onChangeCallback) onChangeCallback(players.filter(n => !excluded.has(n)));
    setTimeout(() => { document.getElementById('_addMemberForm').style.display = 'none'; }, 1000);
  };

  // Get current active (non-excluded) players
  window._getActivePlayers = function() {
    return players.filter(n => !excluded.has(n));
  };

  render();
}

// Get active players for game start. Does NOT modify the master players array.
// Games should use this to get the list of who's playing this round.
function getActivePlayers(playersRef) {
  if (typeof _getActivePlayers === 'function') {
    return _getActivePlayers();
  }
  return playersRef || [];
}

// Backward compat: syncActivePlayers is now a no-op to avoid breaking games
function syncActivePlayers(playersRef, scoresRef) {
  // No-op: players array should not be mutated.
  // Games should use getActivePlayers() when building round player lists.
}

function _escSPB(s) { return s.replace(/'/g, "\\'").replace(/</g, '&lt;'); }
