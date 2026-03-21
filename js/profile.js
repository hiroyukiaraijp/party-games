/* ===== Cognitive Profile System (Firebase版) ===== */
// 名前+生年月日でユーザー識別。Firestoreにプレイログを蓄積し、8軸認知プロファイルを生成。

const CURRENT_SESSION_KEY = 'asobi_session'; // {userId, name, birthday}
const SESSION_PLAYERS_KEY = 'asobi_session_players'; // [{userId, name}]

// 8 cognitive domains
const COG_DOMAINS = [
  { id: 'LNG', name: '語彙力', color: '#6366f1', icon: '📚' },
  { id: 'LOG', name: '論理思考', color: '#8b5cf6', icon: '🧩' },
  { id: 'MEM', name: '記憶力', color: '#06b6d4', icon: '🧠' },
  { id: 'SPD', name: '処理速度', color: '#ef4444', icon: '⚡' },
  { id: 'CRE', name: '創造力', color: '#f59e0b', icon: '💡' },
  { id: 'SOC', name: '社会的知性', color: '#ec4899', icon: '👥' },
  { id: 'SPA', name: '空間認識', color: '#10b981', icon: '📐' },
  { id: 'ATT', name: '注意力', color: '#f97316', icon: '👁' },
];

// Game → cognitive domain weights
const GAME_DOMAIN_MAP = {
  'word-slot':           { LNG: 5, SPD: 4, MEM: 3 },
  'katakana-nashi':      { LNG: 5, SOC: 3, ATT: 2 },
  'word-wolf':           { SOC: 5, LOG: 4, ATT: 3 },
  'master-game':         { LOG: 5, LNG: 3, MEM: 2 },
  'number-expression':   { CRE: 5, SOC: 3, LNG: 2 },
  'hint-bridge':         { LNG: 4, SOC: 4, MEM: 2 },
  'color-panic':         { SPD: 5, ATT: 5, MEM: 1 },
  'flash-memory':        { SPA: 5, MEM: 5, ATT: 3 },
  'rhythm-relay':        { MEM: 5, ATT: 4, SPA: 2 },
  'reverse-dictionary':  { LNG: 5, LOG: 2, MEM: 2 },
  'puzzle-solver':       { LOG: 5, ATT: 3, CRE: 2 },
  'air-reading':         { SOC: 5, CRE: 2 },
  'initial-battle':      { LNG: 4, CRE: 4, SPD: 2 },
  'number-auction':      { LOG: 5, SPD: 3, SOC: 2 },
  'lab-panic':           { LOG: 4, SPA: 3, ATT: 2, CRE: 1 },
  'kanji-puzzle':        { LNG: 5, SPA: 4, SPD: 3, MEM: 2 },
  'where-is-it':         { LOG: 4, MEM: 3, SPA: 4, SOC: 2 },
};

// ---- User ID generation ----
function makeUserId(name, birthday) {
  return (name.trim().toLowerCase() + '_' + birthday).replace(/[^a-z0-9ぁ-んァ-ヶー\-_]/g, '');
}

// ---- Session (localStorage - current device only) ----
function getSession() {
  try { return JSON.parse(localStorage.getItem(CURRENT_SESSION_KEY)); } catch { return null; }
}
function setSession(user) {
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem(CURRENT_SESSION_KEY);
}
function getSessionPlayers() {
  try { return JSON.parse(localStorage.getItem(SESSION_PLAYERS_KEY)) || []; } catch { return []; }
}
function setSessionPlayers(players) {
  localStorage.setItem(SESSION_PLAYERS_KEY, JSON.stringify(players));
  // Also update shared players for game compatibility
  localStorage.setItem('partygames_players', JSON.stringify(players.map(p => p.name)));
}

// ---- Firestore: User Management ----
async function findUser(name, birthday) {
  const db = initFirebase();
  if (!db) return null;
  const id = makeUserId(name, birthday);
  const doc = await db.collection('users').doc(id).get();
  return doc.exists ? { id, ...doc.data() } : null;
}

async function createUser(name, birthday) {
  const db = initFirebase();
  if (!db) return null;
  const id = makeUserId(name, birthday);
  const data = { name: name.trim(), birthday, createdAt: new Date().toISOString() };
  await db.collection('users').doc(id).set(data);
  return { id, ...data };
}

async function updateUserName(userId, newName) {
  const db = initFirebase();
  if (!db) return;
  await db.collection('users').doc(userId).update({ name: newName.trim() });
}

async function loginOrRegister(name, birthday) {
  const existing = await findUser(name, birthday);
  if (existing) {
    return { user: existing, isNew: false };
  }
  const user = await createUser(name, birthday);
  return { user, isNew: true };
}

// ---- Firestore: Play Logs ----
async function savePlayLogToFirestore(userId, gameId, score, maxScore, withPlayers) {
  const db = initFirebase();
  if (!db) return;
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  await db.collection('playlogs').add({
    userId,
    gameId,
    score: score || 0,
    maxScore: maxScore || 1,
    pct,
    withPlayers: withPlayers || [],
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    createdAt: new Date().toISOString(),
  });
}

async function getPlayLogsForUser(userId) {
  const db = initFirebase();
  if (!db) return [];
  const snap = await db.collection('playlogs')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(500)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ---- Wrapper: savePlayLog (called from games) ----
// Replaces the localStorage version. Saves to Firestore for all session players.
function savePlayLog(gameId, score, maxScore, extra) {
  const session = getSession();
  const sessionPlayers = getSessionPlayers();
  const playerNames = sessionPlayers.map(p => p.name);

  // Try Firestore for logged-in session players
  if (sessionPlayers.length > 0) {
    for (const p of sessionPlayers) {
      if (p.userId) {
        try {
          if (typeof initFirebase === 'function') initFirebase();
          savePlayLogToFirestore(p.userId, gameId, score, maxScore, playerNames).catch(e => {
            console.warn('Firestore write failed for', p.name, ':', e.message);
          });
        } catch (e) {
          console.warn('Firestore init failed:', e.message);
        }
      }
    }
  } else if (session && session.userId) {
    // No session players but have a session - save for self
    try {
      if (typeof initFirebase === 'function') initFirebase();
      savePlayLogToFirestore(session.userId, gameId, score, maxScore, [session.name]).catch(e => {
        console.warn('Firestore write failed:', e.message);
      });
    } catch (e) {
      console.warn('Firestore init failed:', e.message);
    }
  }

  // Always save to localStorage as fallback
  try {
    const logs = JSON.parse(localStorage.getItem('asobi_playlogs') || '[]');
    const userId = session?.userId || (sessionPlayers[0]?.userId) || 'anonymous';
    logs.push({ userId, gameId, score, maxScore, pct: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0, timestamp: new Date().toISOString() });
    if (logs.length > 500) logs.splice(0, logs.length - 500);
    localStorage.setItem('asobi_playlogs', JSON.stringify(logs));
  } catch {}
}

// ---- Profile Calculation ----
function calculateProfileFromLogs(logs) {
  if (!logs || logs.length === 0) return null;

  const domainScores = {};
  const domainCounts = {};
  COG_DOMAINS.forEach(d => { domainScores[d.id] = 0; domainCounts[d.id] = 0; });

  for (const log of logs) {
    const weights = GAME_DOMAIN_MAP[log.gameId];
    if (!weights) continue;
    const pct = (log.pct || 0) / 100;
    for (const [domain, weight] of Object.entries(weights)) {
      domainScores[domain] += pct * weight;
      domainCounts[domain] += weight;
    }
  }

  const profile = {};
  COG_DOMAINS.forEach(d => {
    profile[d.id] = domainCounts[d.id] > 0
      ? Math.round((domainScores[d.id] / domainCounts[d.id]) * 100)
      : 0;
  });
  return profile;
}

// ---- Radar Chart (SVG) ----
function renderRadarChart(containerId, profile) {
  const container = document.getElementById(containerId);
  if (!container || !profile) return;

  const size = 280, cx = size / 2, cy = size / 2, maxR = 110, n = COG_DOMAINS.length;
  let svg = `<svg viewBox="0 0 ${size} ${size}" style="width:100%;max-width:${size}px;">`;

  for (let r = 1; r <= 4; r++) {
    const radius = (maxR * r) / 4;
    svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#e5e1f0" stroke-width="1"/>`;
  }
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x = cx + Math.cos(angle) * maxR, y = cy + Math.sin(angle) * maxR;
    svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e5e1f0" stroke-width="1"/>`;
    const lx = cx + Math.cos(angle) * (maxR + 22), ly = cy + Math.sin(angle) * (maxR + 22);
    svg += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="#7a6b8a">${COG_DOMAINS[i].icon}${COG_DOMAINS[i].name}</text>`;
  }

  const points = COG_DOMAINS.map((d, i) => {
    const val = (profile[d.id] || 0) / 100;
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = maxR * Math.max(val, 0.05);
    return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
  }).join(' ');
  svg += `<polygon points="${points}" fill="rgba(192,132,252,0.2)" stroke="#c084fc" stroke-width="2.5"/>`;

  COG_DOMAINS.forEach((d, i) => {
    const val = (profile[d.id] || 0) / 100;
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = maxR * Math.max(val, 0.05);
    svg += `<circle cx="${cx + Math.cos(angle) * r}" cy="${cy + Math.sin(angle) * r}" r="4" fill="${d.color}" stroke="#fff" stroke-width="2"/>`;
  });

  const avg = Math.round(COG_DOMAINS.reduce((s, d) => s + (profile[d.id] || 0), 0) / n);
  svg += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="22" font-weight="900" fill="#2d2040">${avg}</text>`;
  svg += `<text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="8" fill="#7a6b8a">総合スコア</text>`;
  svg += '</svg>';
  container.innerHTML = svg;
}

// ---- Brain Type ----
function getBrainType(profile) {
  if (!profile) return { type: '???', top: null, bottom: null, avg: 0 };
  const sorted = COG_DOMAINS.map(d => ({ ...d, score: profile[d.id] || 0 })).sort((a, b) => b.score - a.score);
  const top = sorted[0], bottom = sorted[sorted.length - 1];
  const avg = Math.round(sorted.reduce((s, d) => s + d.score, 0) / sorted.length);
  const types = { LNG: '言語マスター', LOG: 'ロジカルシンカー', MEM: '記憶の達人', SPD: 'スピードスター', CRE: 'クリエイター', SOC: '人間観察マスター', SPA: '空間認識の天才', ATT: '集中力の鬼' };
  return { type: types[top.id] || '???', top, bottom, avg };
}

// ---- Advice ----
function getAdvice(profile) {
  if (!profile) return { strengthen: '', improve: '' };
  const sorted = COG_DOMAINS.map(d => ({ ...d, score: profile[d.id] || 0 })).sort((a, b) => b.score - a.score);
  const top = sorted[0], bottom = sorted[sorted.length - 1];

  const gameRecs = {
    LNG: ['ワードスロット', '逆引き辞書クイズ', 'カタカナーシ'],
    LOG: ['ナゾトキ', 'マスターゲーム', 'ワードウルフ'],
    MEM: ['フラッシュメモリー', 'リズムリレー'],
    SPD: ['カラーパニック', 'ワードスロット'],
    CRE: ['数字deコトバ', '頭文字バトル'],
    SOC: ['ワードウルフ', '空気読みスケール', '連想ブリッジ'],
    SPA: ['フラッシュメモリー'],
    ATT: ['カラーパニック', 'リズムリレー'],
  };

  const strengthen = `${top.icon} ${top.name}が得意！${(gameRecs[top.id] || []).join('・')}でさらに伸ばそう`;
  const improve = `${bottom.icon} ${bottom.name}を伸ばすには${(gameRecs[bottom.id] || []).join('・')}がおすすめ`;
  return { strengthen, improve };
}
