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

// === ゲームロジック（pure functions）===

/** レベルアップに必要なXP */
function xpForNextLevel(level) {
  return level * 100;
}

/** XPを加算し、レベルアップを処理した新しいplayerを返す */
function applyXp(player, gainedXp) {
  let { level, xp, totalXp } = player;
  xp += gainedXp;
  totalXp += gainedXp;
  const leveledUp = [];
  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level);
    level += 1;
    leveledUp.push(level);
  }
  return { level, xp, totalXp, leveledUp };
}

/** レベルに対応するキャラクター情報を返す */
function getCharacter(level) {
  if (level <= 5)  return { emoji: '🐣', name: 'ひよっこ' };
  if (level <= 15) return { emoji: '🧍', name: '冒険者' };
  if (level <= 29) return { emoji: '⚔️', name: '戦士' };
  return { emoji: '🦸', name: '勇者' };
}

// === バッジロジック ===

/**
 * 新たに解除されたバッジIDの配列を返す
 * @param {object} badges - 現在のバッジ状態
 * @param {Array}  records - 全記録
 * @returns {{ updatedBadges: object, newlyUnlocked: string[] }}
 */
function checkBadges(badges, records) {
  const updated = { ...badges };
  const newlyUnlocked = [];

  function unlock(id) {
    if (!updated[id]) { updated[id] = true; newlyUnlocked.push(id); }
  }

  // 初回記録
  if (records.length >= 1) unlock('first_step');

  // 累計100セット
  if (records.length >= 100) unlock('total_100');

  // 腕立て伏せ累計50セット
  const pushupCount = records.filter(r => r.exerciseId === 'pushup').length;
  if (pushupCount >= 50) unlock('pushup_50');

  // 連続日数チェック
  const dates = [...new Set(records.map(r => r.date))].sort();
  let maxStreak = 1, currentStreak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    currentStreak = diff === 1 ? currentStreak + 1 : 1;
    if (currentStreak > maxStreak) maxStreak = currentStreak;
  }
  if (maxStreak >= 3) unlock('streak_3');
  if (maxStreak >= 7) unlock('streak_7');

  return { updatedBadges: updated, newlyUnlocked };
}
