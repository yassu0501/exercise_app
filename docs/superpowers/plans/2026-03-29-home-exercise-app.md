# 家で運動したくなるアプリ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ゲーミフィケーション（経験値・レベルアップ・キャラクター育成・実績バッジ）で運動継続を助けるWebアプリを、HTML/CSS/Vanilla JSのみで実装する。

**Architecture:** 3ファイル構成（index.html / style.css / app.js）。画面はCSSのdisplay切り替えでSPA風に動作。データはlocalStorageに保存。ゲームロジックはpure functionとして分離し、UIと疎結合にする。

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), localStorage

---

## ファイル構成

| ファイル | 責務 |
|----------|------|
| `index.html` | 全画面のマークアップ、ナビゲーション |
| `style.css` | レイアウト・アニメーション・レスポンシブ |
| `app.js` | ゲームロジック・画面切り替え・localStorage操作 |

---

## Task 1: HTMLスケルトン作成

**Files:**
- Create: `index.html`

- [ ] **Step 1: index.html を作成する**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>運動RPG</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- ナビゲーション -->
  <nav id="nav">
    <button class="nav-btn active" data-screen="home">ホーム</button>
    <button class="nav-btn" data-screen="workout">運動</button>
    <button class="nav-btn" data-screen="badges">実績</button>
    <button class="nav-btn" data-screen="history">履歴</button>
  </nav>

  <!-- ホーム画面 -->
  <section id="screen-home" class="screen active">
    <div id="character-display">
      <div id="character-emoji">🐣</div>
      <div id="character-level">Lv.1</div>
    </div>
    <div id="xp-bar-container">
      <div id="xp-bar"></div>
    </div>
    <div id="xp-label">0 / 100 XP</div>
    <button id="btn-go-workout">運動する！</button>
  </section>

  <!-- 運動選択画面 -->
  <section id="screen-workout" class="screen">
    <h2>運動を選ぼう</h2>
    <div id="exercise-list"></div>
  </section>

  <!-- 実績画面 -->
  <section id="screen-badges" class="screen">
    <h2>実績バッジ</h2>
    <div id="badge-list"></div>
  </section>

  <!-- 履歴画面 -->
  <section id="screen-history" class="screen">
    <h2>運動履歴</h2>
    <div id="history-list"></div>
  </section>

  <!-- ポップアップ -->
  <div id="popup" class="popup hidden">
    <div id="popup-content"></div>
  </div>

  <!-- データリセット -->
  <footer>
    <button id="btn-reset">データをリセット</button>
  </footer>

  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: ブラウザで index.html を開いて構造を確認する**

ブラウザで開き、4つのナビボタンとセクションがあることを目視確認。スタイルはまだ当たっていないので崩れていてOK。

---

## Task 2: CSSスタイル作成

**Files:**
- Create: `style.css`

- [ ] **Step 1: style.css を作成する**

```css
/* リセット・ベース */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: sans-serif;
  background: #1a1a2e;
  color: #eee;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
}

/* ナビゲーション */
#nav {
  display: flex;
  background: #16213e;
  border-bottom: 2px solid #0f3460;
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-btn {
  flex: 1;
  padding: 12px 4px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-btn.active {
  color: #e94560;
  border-bottom: 2px solid #e94560;
}

/* 画面切り替え */
.screen { display: none; padding: 24px 16px; flex: 1; }
.screen.active { display: block; }

/* ホーム画面 */
#character-display {
  text-align: center;
  margin: 32px 0 16px;
}

#character-emoji {
  font-size: 80px;
  line-height: 1;
  transition: all 0.5s ease;
}

#character-level {
  font-size: 20px;
  font-weight: bold;
  margin-top: 8px;
  color: #e94560;
}

/* 経験値バー */
#xp-bar-container {
  background: #16213e;
  border-radius: 8px;
  height: 16px;
  overflow: hidden;
  margin: 0 16px 8px;
}

#xp-bar {
  height: 100%;
  background: linear-gradient(90deg, #e94560, #f5a623);
  width: 0%;
  transition: width 0.6s ease;
  border-radius: 8px;
}

#xp-label {
  text-align: center;
  font-size: 12px;
  color: #aaa;
  margin-bottom: 24px;
}

#btn-go-workout {
  display: block;
  width: calc(100% - 32px);
  margin: 0 16px;
  padding: 16px;
  background: #e94560;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
}

#btn-go-workout:active { transform: scale(0.97); opacity: 0.9; }

/* 運動カード */
.exercise-card {
  background: #16213e;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exercise-info { flex: 1; }
.exercise-name { font-size: 16px; font-weight: bold; }
.exercise-unit { font-size: 12px; color: #aaa; margin-top: 2px; }
.exercise-xp { font-size: 13px; color: #f5a623; margin-left: 8px; }

.btn-complete {
  padding: 10px 18px;
  background: #0f3460;
  border: 2px solid #e94560;
  border-radius: 8px;
  color: #e94560;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-complete:active { background: #e94560; color: white; }

/* バッジ */
#badge-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.badge-card {
  background: #16213e;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.badge-card.unlocked { border-color: #f5a623; }
.badge-card.locked { opacity: 0.4; }
.badge-emoji { font-size: 36px; }
.badge-name { font-size: 13px; margin-top: 6px; font-weight: bold; }
.badge-desc { font-size: 11px; color: #aaa; margin-top: 4px; }

/* 履歴 */
.history-item {
  background: #16213e;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-name { font-size: 15px; }
.history-meta { font-size: 12px; color: #aaa; }
.history-xp { font-size: 13px; color: #f5a623; }

/* ポップアップ */
.popup {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

.popup.hidden { display: none; }

#popup-content {
  background: #16213e;
  border: 2px solid #e94560;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  max-width: 280px;
}

#popup-content h3 { font-size: 22px; color: #e94560; margin-bottom: 8px; }
#popup-content p { color: #eee; margin-bottom: 16px; }
#popup-content button {
  padding: 10px 24px;
  background: #e94560;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  cursor: pointer;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* フッター */
footer {
  padding: 16px;
  text-align: right;
}

#btn-reset {
  background: none;
  border: 1px solid #444;
  color: #666;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}
```

- [ ] **Step 2: ブラウザで確認する**

ブラウザをリロードしてダークテーマのレイアウトが表示されることを確認。

---

## Task 3: データ層（localStorage）

**Files:**
- Create: `app.js`

- [ ] **Step 1: app.js を作成し、データ定義とlocalStorage操作を実装する**

```js
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
    player:  parse('player',  INITIAL_PLAYER),
    records: parse('records', []),
    badges:  parse('badges',  INITIAL_BADGES),
  };
}

function saveData(state) {
  localStorage.setItem('player',  JSON.stringify(state.player));
  localStorage.setItem('records', JSON.stringify(state.records));
  localStorage.setItem('badges',  JSON.stringify(state.badges));
}

function resetData() {
  localStorage.removeItem('player');
  localStorage.removeItem('records');
  localStorage.removeItem('badges');
}
```

- [ ] **Step 2: ブラウザコンソールでデータ層をテストする**

ブラウザで index.html を開き、コンソールに以下を貼り付けて実行する:

```js
// テストヘルパー
function assert(cond, msg) {
  if (!cond) { console.error('FAIL: ' + msg); } else { console.log('PASS: ' + msg); }
}

const s = loadData();
assert(s.player.level === 1,       'player初期レベルが1');
assert(Array.isArray(s.records),   'records は配列');
assert(s.badges.first_step === false, 'badges 初期値はfalse');

saveData(s);
const s2 = loadData();
assert(s2.player.level === 1, 'save→loadが正常');
console.log('データ層テスト完了');
```

期待結果: 全て PASS と表示される。

- [ ] **Step 3: コミット**

```bash
git init
git add index.html style.css app.js
git commit -m "feat: HTMLスケルトン・CSS・データ層を追加"
```

---

## Task 4: ゲームロジック（XP・レベル）

**Files:**
- Modify: `app.js`

- [ ] **Step 1: XP・レベル計算のpure functionを app.js に追記する**

```js
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
```

- [ ] **Step 2: コンソールでテストする**

ブラウザをリロードしてコンソールに貼り付け:

```js
function assert(cond, msg) {
  if (!cond) { console.error('FAIL: ' + msg); } else { console.log('PASS: ' + msg); }
}

assert(xpForNextLevel(1) === 100,  'Lv1→2は100XP');
assert(xpForNextLevel(5) === 500,  'Lv5→6は500XP');

const p1 = applyXp({ level: 1, xp: 0, totalXp: 0 }, 100);
assert(p1.level === 2,             'Lv1 + 100XP → Lv2');
assert(p1.xp === 0,                'レベルアップ後の余りXPが0');
assert(p1.leveledUp.length === 1,  'レベルアップ1回');

const p2 = applyXp({ level: 1, xp: 0, totalXp: 0 }, 50);
assert(p2.level === 1,             'XP不足でレベルアップしない');
assert(p2.xp === 50,               '余りXPが正しく加算される');

assert(getCharacter(1).emoji  === '🐣', 'Lv1はひよっこ');
assert(getCharacter(6).emoji  === '🧍', 'Lv6は冒険者');
assert(getCharacter(16).emoji === '⚔️', 'Lv16は戦士');
assert(getCharacter(30).emoji === '🦸', 'Lv30は勇者');
console.log('ゲームロジックテスト完了');
```

期待結果: 全て PASS と表示される。

- [ ] **Step 3: コミット**

```bash
git add app.js
git commit -m "feat: XP・レベルアップ・キャラクターのゲームロジックを追加"
```

---

## Task 5: バッジロジック

**Files:**
- Modify: `app.js`

- [ ] **Step 1: バッジ判定のpure functionを app.js に追記する**

```js
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
```

- [ ] **Step 2: コンソールでテストする**

ブラウザをリロードしてコンソールに貼り付け:

```js
function assert(cond, msg) {
  if (!cond) { console.error('FAIL: ' + msg); } else { console.log('PASS: ' + msg); }
}

const initBadges = { first_step: false, streak_3: false, streak_7: false, total_100: false, pushup_50: false };

// 初回記録
const r1 = checkBadges(initBadges, [{ exerciseId: 'pushup', date: '2026-03-29' }]);
assert(r1.updatedBadges.first_step === true, '初回記録でfirst_step解除');
assert(r1.newlyUnlocked.includes('first_step'), 'newlyUnlockedにfirst_stepが含まれる');

// 連続3日
const records3days = [
  { exerciseId: 'squat', date: '2026-03-27' },
  { exerciseId: 'squat', date: '2026-03-28' },
  { exerciseId: 'squat', date: '2026-03-29' },
];
const r2 = checkBadges(initBadges, records3days);
assert(r2.updatedBadges.streak_3 === true,  '3日連続でstreak_3解除');
assert(r2.updatedBadges.streak_7 === false, '3日ではstreak_7は解除されない');

// 腕立て50セット
const pushupRecords = Array.from({ length: 50 }, (_, i) => ({
  exerciseId: 'pushup', date: '2026-01-01'
}));
const r3 = checkBadges(initBadges, pushupRecords);
assert(r3.updatedBadges.pushup_50 === true, '腕立て50セットでpushup_50解除');
console.log('バッジロジックテスト完了');
```

期待結果: 全て PASS と表示される。

- [ ] **Step 3: コミット**

```bash
git add app.js
git commit -m "feat: バッジ判定ロジックを追加"
```

---

## Task 6: ホーム画面レンダリング

**Files:**
- Modify: `app.js`

- [ ] **Step 1: ホーム画面の描画関数を app.js に追記する**

```js
// === UI レンダリング ===

function renderHome(player) {
  const char = getCharacter(player.level);
  document.getElementById('character-emoji').textContent = char.emoji;
  document.getElementById('character-level').textContent = `Lv.${player.level} ${char.name}`;

  const needed = xpForNextLevel(player.level);
  const pct = Math.min((player.xp / needed) * 100, 100);
  document.getElementById('xp-bar').style.width = pct + '%';
  document.getElementById('xp-label').textContent = `${player.xp} / ${needed} XP`;
}
```

- [ ] **Step 2: アプリ初期化関数を追記する**

```js
// === 初期化 ===

let state;

function init() {
  if (!storageAvailable()) {
    alert('このブラウザではlocalStorageが使えません。プライベートブラウジングを解除してください。');
    return;
  }
  state = loadData();
  renderHome(state.player);
  bindNavigation();
  bindWorkoutButtons();
  bindResetButton();
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 3: ナビゲーション・ボタンのイベント登録を追記する**

```js
// === イベント登録 ===

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('screen-' + screenId).classList.add('active');
  document.querySelector(`.nav-btn[data-screen="${screenId}"]`).classList.add('active');

  if (screenId === 'badges')  renderBadges(state.badges);
  if (screenId === 'history') renderHistory(state.records);
}

function bindNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });
  document.getElementById('btn-go-workout').addEventListener('click', () => showScreen('workout'));
}

function bindResetButton() {
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (!confirm('データをリセットしますか？')) return;
    resetData();
    state = loadData();
    renderHome(state.player);
    alert('リセットしました');
  });
}
```

- [ ] **Step 4: ブラウザで確認する**

ブラウザをリロード。ホーム画面にキャラクター🐣、Lv.1、経験値バー0%が表示されること。ナビボタンで画面が切り替わることを確認。

- [ ] **Step 5: コミット**

```bash
git add app.js
git commit -m "feat: ホーム画面レンダリングとナビゲーションを追加"
```

---

## Task 7: 運動選択・記録機能

**Files:**
- Modify: `app.js`

- [ ] **Step 1: 運動カード描画と完了ボタンの処理を追記する**

```js
function renderWorkout() {
  const list = document.getElementById('exercise-list');
  list.innerHTML = EXERCISES.map(ex => `
    <div class="exercise-card">
      <div class="exercise-info">
        <div class="exercise-name">${ex.name}</div>
        <div class="exercise-unit">${ex.unit} / 1セット</div>
      </div>
      <span class="exercise-xp">+${ex.xpPerSet}XP</span>
      <button class="btn-complete" data-id="${ex.id}">完了</button>
    </div>
  `).join('');
}

function bindWorkoutButtons() {
  renderWorkout();
  document.getElementById('exercise-list').addEventListener('click', e => {
    const btn = e.target.closest('.btn-complete');
    if (!btn) return;
    recordExercise(btn.dataset.id);
  });
}

function recordExercise(exerciseId) {
  const ex = EXERCISES.find(e => e.id === exerciseId);
  const today = new Date().toISOString().slice(0, 10);

  // 記録追加
  const newRecord = { id: Date.now(), exerciseId, xp: ex.xpPerSet, date: today };
  state.records = [newRecord, ...state.records];

  // XP加算・レベルアップ
  const { level, xp, totalXp, leveledUp } = applyXp(state.player, ex.xpPerSet);
  state.player = { level, xp, totalXp };

  // バッジチェック
  const { updatedBadges, newlyUnlocked } = checkBadges(state.badges, state.records);
  state.badges = updatedBadges;

  saveData(state);
  renderHome(state.player);

  // 通知
  if (leveledUp.length > 0) {
    showPopup('🎉 レベルアップ！', `Lv.${leveledUp[leveledUp.length - 1]} ${getCharacter(level).name} になった！`);
  } else if (newlyUnlocked.length > 0) {
    const badge = BADGE_DEFS.find(b => b.id === newlyUnlocked[0]);
    showPopup(`${badge.emoji} バッジ獲得！`, badge.name);
  } else {
    showPopup('✅ 記録完了！', `+${ex.xpPerSet}XP 獲得`);
  }
}
```

- [ ] **Step 2: ブラウザで確認する**

1. 「運動」タブを開き、カードが6種類表示されること
2. 「完了」ボタンを押す → ポップアップが出ること（まだ showPopup 未定義なのでエラーになる。Task 8 で実装）

- [ ] **Step 3: コミット**

```bash
git add app.js
git commit -m "feat: 運動カード描画・記録ロジックを追加"
```

---

## Task 8: ポップアップ通知

**Files:**
- Modify: `app.js`

- [ ] **Step 1: ポップアップ表示関数を追記する**

```js
function showPopup(title, message) {
  const popup = document.getElementById('popup');
  document.getElementById('popup-content').innerHTML = `
    <h3>${title}</h3>
    <p>${message}</p>
    <button id="popup-close">OK</button>
  `;
  popup.classList.remove('hidden');
  document.getElementById('popup-close').addEventListener('click', () => {
    popup.classList.add('hidden');
  });
}
```

- [ ] **Step 2: ブラウザで動作確認する**

1. ブラウザをリロード
2. 「運動」タブ → 完了ボタンを押す
3. ポップアップが表示される
4. OKを押すと閉じる
5. ホームに戻ると経験値バーが増えている

- [ ] **Step 3: コミット**

```bash
git add app.js
git commit -m "feat: ポップアップ通知を追加"
```

---

## Task 9: 実績バッジ画面

**Files:**
- Modify: `app.js`

- [ ] **Step 1: バッジ画面の描画関数を追記する**

```js
function renderBadges(badges) {
  const list = document.getElementById('badge-list');
  list.innerHTML = BADGE_DEFS.map(b => {
    const unlocked = badges[b.id];
    return `
      <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
        <div class="badge-emoji">${b.emoji}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>
    `;
  }).join('');
}
```

- [ ] **Step 2: ブラウザで確認する**

「実績」タブを開く。5つのバッジが表示され、未解除は暗く表示されること。運動を記録してから開くと「初めの一歩」が明るく表示されること。

- [ ] **Step 3: コミット**

```bash
git add app.js
git commit -m "feat: 実績バッジ画面を追加"
```

---

## Task 10: 履歴画面

**Files:**
- Modify: `app.js`

- [ ] **Step 1: 履歴画面の描画関数を追記する**

```js
function renderHistory(records) {
  const list = document.getElementById('history-list');
  if (records.length === 0) {
    list.innerHTML = '<p style="color:#aaa;text-align:center;margin-top:32px">まだ記録がありません</p>';
    return;
  }
  list.innerHTML = records.map(r => {
    const ex = EXERCISES.find(e => e.id === r.exerciseId);
    return `
      <div class="history-item">
        <div>
          <div class="history-name">${ex ? ex.name : r.exerciseId}</div>
          <div class="history-meta">${r.date}</div>
        </div>
        <div class="history-xp">+${r.xp}XP</div>
      </div>
    `;
  }).join('');
}
```

- [ ] **Step 2: ブラウザで確認する**

「履歴」タブを開く。記録がある場合は日付・種目・XPが一覧表示されること。記録がない場合はメッセージが表示されること。

- [ ] **Step 3: 最終コミット**

```bash
git add app.js
git commit -m "feat: 履歴画面を追加 — 全機能実装完了"
```

---

## Task 11: 最終動作確認

- [ ] **Step 1: 一連の操作を通しで確認する**

1. ブラウザをリロード（キャッシュクリア推奨: Cmd+Shift+R）
2. ホーム画面: 🐣 Lv.1、XPバー0%が表示される
3. 「運動する！」ボタン → 運動選択画面に遷移する
4. 「腕立て伏せ」完了 → ポップアップが表示され、OKを押すとホームのXPバーが増える
5. 複数回繰り返してレベルアップのポップアップが出ることを確認
6. 「実績」タブ → 「初めの一歩」バッジが解除されている
7. 「履歴」タブ → 記録が表示されている
8. フッターの「データをリセット」→ 確認ダイアログ → リセット後にLv.1に戻る
9. スマホサイズ（ブラウザの開発ツールで幅375px）で表示が崩れないことを確認

- [ ] **Step 2: localStorageエラーハンドリングを確認する**

Chromeの場合: DevTools → Application → Storage → Clear site data でデータ削除後にリロードし、正常に初期表示されることを確認。

---

## 完成後のデプロイ方法

```bash
# GitHub Pagesにデプロイする場合
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
# リポジトリの Settings → Pages → Source: main branch → Save
```
