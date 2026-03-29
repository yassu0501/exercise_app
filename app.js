// === 定数 ===

const EXERCISES = [
  { id: 'pushup',       name: '腕立て伏せ',         unit: '10回',  xpPerSet: 30 },
  { id: 'squat',        name: 'スクワット',           unit: '10回',  xpPerSet: 25 },
  { id: 'plank',        name: 'プランク',             unit: '30秒',  xpPerSet: 20 },
  { id: 'jumping_jack', name: 'ジャンピングジャック', unit: '10回',  xpPerSet: 20 },
  { id: 'situp',        name: '腹筋',                 unit: '10回',  xpPerSet: 25 },
  { id: 'momomage',     name: '腿上げ',               unit: '10回',  xpPerSet: 20 },
];

const BADGE_DEFS = [
  { id: 'first_step',   emoji: '👣', name: '初めの一歩',   desc: '初回記録' },
  { id: 'streak_3',     emoji: '🔥', name: '三日坊主克服', desc: '3日連続記録' },
  { id: 'streak_7',     emoji: '⚡', name: '週の勇者',     desc: '7日連続記録' },
  { id: 'total_100',    emoji: '💯', name: '百戦錬磨',     desc: '累計100セット記録' },
  { id: 'pushup_50',    emoji: '💪', name: '筋肉王',       desc: '腕立て伏せを累計50セット記録' },
];

const INITIAL_PLAYER  = { level: 1, xp: 0, totalXp: 0 };
const INITIAL_BADGES  = Object.fromEntries(BADGE_DEFS.map(b => [b.id, false]));

// === localStorage ===

function storageAvailable() {
  try {
    localStorage.setItem('__test__', '1');
    localStorage.removeItem('__test__');
    return true;
  } catch { return false; }
}

function loadData() {
  const parse = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  return {
    player:  parse('player',  { ...INITIAL_PLAYER }),
    records: parse('records', []),
    badges:  parse('badges',  { ...INITIAL_BADGES }),
  };
}

function saveData(state) {
  try {
    localStorage.setItem('player',  JSON.stringify(state.player));
    localStorage.setItem('records', JSON.stringify(state.records));
    localStorage.setItem('badges',  JSON.stringify(state.badges));
  } catch (e) {
    console.error('データの保存に失敗しました:', e);
  }
}

function resetData() {
  localStorage.removeItem('player');
  localStorage.removeItem('records');
  localStorage.removeItem('badges');
}
