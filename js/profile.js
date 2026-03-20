/* ===== Cognitive Profile System ===== */
// ID + 生年月日でユーザー識別。localStorageにプレイログを蓄積し、8軸認知プロファイルを生成。

const PROFILE_KEY = 'asobi_profiles';
const PLAY_LOG_KEY = 'asobi_playlogs';
const CURRENT_USER_KEY = 'asobi_current_user';

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
};

// ---- User Management ----
function getProfiles() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; } catch { return {}; }
}
function saveProfiles(p) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch {}
}

function registerUser(id, birthday) {
  if (!id || !birthday) return null;
  const key = id.trim().toLowerCase();
  const profiles = getProfiles();
  if (!profiles[key]) {
    profiles[key] = { id: id.trim(), birthday, createdAt: new Date().toISOString() };
    saveProfiles(profiles);
  }
  localStorage.setItem(CURRENT_USER_KEY, key);
  return profiles[key];
}

function loginUser(id, birthday) {
  const key = id.trim().toLowerCase();
  const profiles = getProfiles();
  const p = profiles[key];
  if (!p) return null;
  if (p.birthday !== birthday) return null;
  localStorage.setItem(CURRENT_USER_KEY, key);
  return p;
}

function getCurrentUser() {
  const key = localStorage.getItem(CURRENT_USER_KEY);
  if (!key) return null;
  const profiles = getProfiles();
  return profiles[key] || null;
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ---- Play Log ----
function getPlayLogs() {
  try { return JSON.parse(localStorage.getItem(PLAY_LOG_KEY)) || []; } catch { return []; }
}

function savePlayLog(gameId, score, maxScore, extra) {
  const user = getCurrentUser();
  if (!user) return;
  const logs = getPlayLogs();
  logs.push({
    userId: user.id.toLowerCase(),
    gameId,
    score: score || 0,
    maxScore: maxScore || 1,
    pct: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    timestamp: new Date().toISOString(),
    ...extra,
  });
  // Keep last 500 entries
  if (logs.length > 500) logs.splice(0, logs.length - 500);
  try { localStorage.setItem(PLAY_LOG_KEY, JSON.stringify(logs)); } catch {}
}

// ---- Profile Calculation ----
function calculateProfile(userId) {
  const logs = getPlayLogs().filter(l => l.userId === userId.toLowerCase());
  if (logs.length === 0) return null;

  const domainScores = {};
  const domainCounts = {};
  COG_DOMAINS.forEach(d => { domainScores[d.id] = 0; domainCounts[d.id] = 0; });

  for (const log of logs) {
    const weights = GAME_DOMAIN_MAP[log.gameId];
    if (!weights) continue;
    const pct = log.pct / 100; // 0-1
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

  const size = 280;
  const cx = size / 2, cy = size / 2;
  const maxR = 110;
  const n = COG_DOMAINS.length;

  // Background circles
  let svg = `<svg viewBox="0 0 ${size} ${size}" style="width:100%;max-width:${size}px;">`;

  // Grid circles
  for (let r = 1; r <= 4; r++) {
    const radius = (maxR * r) / 4;
    svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#e5e1f0" stroke-width="1"/>`;
  }

  // Axis lines + labels
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x = cx + Math.cos(angle) * maxR;
    const y = cy + Math.sin(angle) * maxR;
    svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e5e1f0" stroke-width="1"/>`;

    // Label
    const lx = cx + Math.cos(angle) * (maxR + 22);
    const ly = cy + Math.sin(angle) * (maxR + 22);
    svg += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="#7a6b8a">${COG_DOMAINS[i].icon}${COG_DOMAINS[i].name}</text>`;
  }

  // Data polygon
  const points = COG_DOMAINS.map((d, i) => {
    const val = (profile[d.id] || 0) / 100;
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = maxR * Math.max(val, 0.05);
    return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
  }).join(' ');

  svg += `<polygon points="${points}" fill="rgba(192,132,252,0.2)" stroke="#c084fc" stroke-width="2.5"/>`;

  // Data dots
  COG_DOMAINS.forEach((d, i) => {
    const val = (profile[d.id] || 0) / 100;
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = maxR * Math.max(val, 0.05);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    svg += `<circle cx="${x}" cy="${y}" r="4" fill="${d.color}" stroke="#fff" stroke-width="2"/>`;
  });

  // Center score
  const avg = Math.round(COG_DOMAINS.reduce((s, d) => s + (profile[d.id] || 0), 0) / n);
  svg += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="22" font-weight="900" fill="#2d2040">${avg}</text>`;
  svg += `<text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="8" fill="#7a6b8a">総合スコア</text>`;

  svg += '</svg>';
  container.innerHTML = svg;
}

// ---- Profile Summary Text ----
function getProfileSummary(profile) {
  if (!profile) return '';
  const sorted = COG_DOMAINS.map(d => ({ ...d, score: profile[d.id] || 0 })).sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  const avg = Math.round(sorted.reduce((s, d) => s + d.score, 0) / sorted.length);

  let type = '';
  if (top.id === 'LNG') type = '言語マスター';
  else if (top.id === 'LOG') type = 'ロジカルシンカー';
  else if (top.id === 'MEM') type = '記憶の達人';
  else if (top.id === 'SPD') type = 'スピードスター';
  else if (top.id === 'CRE') type = 'クリエイター';
  else if (top.id === 'SOC') type = '人間観察マスター';
  else if (top.id === 'SPA') type = '空間認識の天才';
  else if (top.id === 'ATT') type = '集中力の鬼';

  return { type, top, bottom, avg };
}
