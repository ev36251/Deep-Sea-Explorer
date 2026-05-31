// ─── Constants ───────────────────────────────────────────────────────────────
const CANVAS_W = 800;
const CANVAS_H = 600;
const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 12000;
const PIXELS_PER_METRE = 4;
const SQUID_DEPTH_THRESHOLD = 400;

// ─── Treasure Definitions ────────────────────────────────────────────────────
const TREASURE_DEFS = [
  { id:'coal',     name:'Coal',             minD:30,   maxD:400,  color:'#7a7a8a', glow:'#446',  value:8,    weight:40, size:10, shape:'rock'     },
  { id:'iron',     name:'Iron Ore',         minD:80,   maxD:600,  color:'#c09878', glow:'#866',  value:22,   weight:35, size:11, shape:'rock'     },
  { id:'copper',   name:'Copper Ore',       minD:150,  maxD:700,  color:'#d08448', glow:'#b64',  value:40,   weight:28, size:11, shape:'rock'     },
  { id:'silver',   name:'Silver Ingot',     minD:250,  maxD:900,  color:'#d4d4e8', glow:'#99c',  value:70,   weight:22, size:11, shape:'ingot'    },
  { id:'gold',     name:'Gold Ingot',       minD:350,  maxD:1200, color:'#ffc830', glow:'#a80',  value:120,  weight:18, size:12, shape:'ingot'    },
  { id:'sapphire', name:'Sapphire',         minD:500,  maxD:1500, color:'#4090ff', glow:'#26f',  value:200,  weight:14, size:10, shape:'gem'      },
  { id:'ruby',     name:'Ruby',             minD:600,  maxD:1800, color:'#ff3848', glow:'#f04',  value:280,  weight:11, size:10, shape:'gem'      },
  { id:'emerald',  name:'Emerald',          minD:800,  maxD:2200, color:'#30d868', glow:'#0b4',  value:380,  weight:9,  size:10, shape:'gem'      },
  { id:'diamond',  name:'Diamond',          minD:1100, maxD:2600, color:'#c8f0ff', glow:'#8df',  value:600,  weight:6,  size:11, shape:'gem'      },
  { id:'artifact', name:'Ancient Artifact', minD:1400, maxD:3000, color:'#e898c8', glow:'#c4a',  value:900,  weight:4,  size:14, shape:'artifact' },
  { id:'bones',    name:'Whale Bones',      minD:1700, maxD:3000, color:'#e8e4cc', glow:'#cba',  value:1500, weight:3,  size:20, shape:'bones'    },
  { id:'fossil',   name:'Dinosaur Fossil',  minD:2100, maxD:3000, color:'#c8a858', glow:'#a70',  value:2500, weight:2,  size:18, shape:'fossil'   },
  { id:'megalith',  name:'Megalith Crystal',  minD:2500, maxD:3000, color:'#ff88ff', glow:'#d0d',  value:4000, weight:1,  size:16, shape:'crystal'  },
  // Boss-only drops — weight:0 means never spawns naturally
  { id:'wardenCore',  name:"Warden's Core",    minD:2900, maxD:3000, color:'#ff5500', glow:'#f40',  value:9000, weight:0,  size:22, shape:'crystal'  },
  { id:'abyssalShard',name:'Abyssal Shard',    minD:2900, maxD:3000, color:'#8800ff', glow:'#60f',  value:6000, weight:0,  size:18, shape:'gem'      },
  { id:'deepPearl',   name:'Deep Pearl',       minD:2800, maxD:3000, color:'#aaffee', glow:'#0dc',  value:3500, weight:1,  size:13, shape:'gem'      },
];

// ─── Submarine Definitions ───────────────────────────────────────────────────
const SUB_DEFS = {
  nautilus: {
    name:'Nautilus',   desc:'Balanced starter sub',          cost:0,
    color:'#d4d020',   accent:'#a8a818',  w:56,  h:24,
    baseSpeed:3.8,     baseHP:100,        baseSonar:200,
    baseCargo:10,      baseFuel:300,      baseTorpedoDmg:2,  baseFireCD:22,
    upgMult:1.0,
  },
  barracuda: {
    name:'Barracuda',  desc:'Fast & lethal. Fragile hull.',  cost:18000,
    color:'#20c8d0',   accent:'#18a0a8',  w:64,  h:20,
    baseSpeed:5.7,     baseHP:70,         baseSonar:240,
    baseCargo:8,       baseFuel:260,      baseTorpedoDmg:4,  baseFireCD:14,
    upgMult:1.6,
  },
  leviathan: {
    name:'Leviathan',  desc:'Slow behemoth. Unstoppable.',   cost:42000,
    color:'#9030c0',   accent:'#7020a0',  w:74,  h:32,
    baseSpeed:2.6,     baseHP:220,        baseSonar:180,
    baseCargo:20,      baseFuel:520,      baseTorpedoDmg:3,  baseFireCD:30,
    upgMult:2.2,
  },
};

// ─── Upgrades (8 types, up to 8 levels — costs are BASE for Nautilus; ────────
// other subs multiply by their upgMult)                                        ─
const UPGRADE_DEFS = [
  { id:'hull',    name:'Reinforced Hull',  desc:'+35 max HP',         maxLevel:8, costs:[40,  120, 320,  900,  2000, 4000,  7000, 12000] },
  { id:'engine',  name:'Thruster Boost',   desc:'+0.6 speed',         maxLevel:8, costs:[32,  96,  260,  720,  1600, 3500,  6000, 10000] },
  { id:'torpedo', name:'Torpedo Power',    desc:'+1 damage',          maxLevel:8, costs:[35,  105, 280,  800,  1800, 3800,  6500, 11000] },
  { id:'rate',    name:'Fire Rate',        desc:'-2 fire cooldown',   maxLevel:6, costs:[55,  165, 480,  1300, 3000,  6000             ] },
  { id:'fuel',    name:'Fuel Tank',        desc:'+80 fuel cap',       maxLevel:8, costs:[32,  96,  260,  720,  1600, 3500,  6000, 10000] },
  { id:'cargo',   name:'Cargo Hold',       desc:'+3 cargo slots',     maxLevel:8, costs:[40,  120, 320,  900,  2000, 4200,  7500, 13000] },
  { id:'sonar',   name:'Sonar Range',      desc:'+30 range',          maxLevel:8, costs:[28,  84,  220,  620,  1400, 3000,  5500,  9500] },
  { id:'armor',   name:'Depth Armor',      desc:'-10% damage taken',  maxLevel:6, costs:[65,  200, 650,  1800, 4000,  8000             ] },
];

// ─── Utility ─────────────────────────────────────────────────────────────────
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

// ─── Audio System ─────────────────────────────────────────────────────────────
let audioCtx = null;
let ambMaster = null;      // master gain
let ambNoiseFilter = null; // bandpass on ocean noise — cutoff shifts with depth
let ambFilter = null;      // global lowpass: underwater muffle
let ambReverb = null;      // delay node for spacious echo

function getAC() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e) { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// ── Relaxing water-vibe ambient ───────────────────────────────────────────────
// Slow A-minor pentatonic melody. Low-pass filter gives underwater muffle.
// Delay+feedback reverb adds dreamy spaciousness. LFO breathes the volume
// like a gentle ocean swell. ~45-second loop.

// Each entry: [frequency Hz, duration seconds]
const MELODY = [
  [0, 1.5],
  // ── Phrase 1: A → E → C → D → A ──
  [440, 2.0], [0, 0.3],
  [659, 1.8], [0, 0.5],
  [523, 1.6], [0, 0.3],
  [587, 1.4], [0, 0.4],
  [440, 2.8], [0, 1.2],
  // ── Phrase 2: G → C → E → C → A ──
  [392, 1.8], [0, 0.3],
  [523, 1.6], [0, 0.4],
  [659, 2.0], [0, 0.4],
  [523, 1.4], [0, 0.3],
  [440, 2.8], [0, 1.4],
  // ── Phrase 3: D → A → C → E → G-high ──
  [294, 1.6], [0, 0.3],
  [440, 1.8], [0, 0.4],
  [523, 1.6], [0, 0.3],
  [659, 2.0], [0, 0.5],
  [784, 2.5], [0, 0.6],
  // ── Phrase 4: descent home E → C → A (long) ──
  [659, 1.6], [0, 0.3],
  [523, 1.4], [0, 0.3],
  [440, 3.5], [0, 2.5],
];

function initAmbient() {
  const ac = getAC();
  if (!ac || ambMaster) return;

  // Signal chain: sources → ambFilter (lowpass) → ambMaster → destination
  ambMaster = ac.createGain();
  ambMaster.gain.setValueAtTime(0, ac.currentTime);
  ambMaster.gain.linearRampToValueAtTime(0.20, ac.currentTime + 3.0);
  ambMaster.connect(ac.destination);

  ambFilter = ac.createBiquadFilter();
  ambFilter.type = 'lowpass';
  ambFilter.frequency.value = 1100; // muffle high-end like being underwater
  ambFilter.Q.value = 0.7;
  ambFilter.connect(ambMaster);

  // Reverb: delay+feedback loop → wet mix → filter
  ambReverb = ac.createDelay(1.0);
  ambReverb.delayTime.value = 0.42;
  const reverbFb  = ac.createGain(); reverbFb.gain.value  = 0.30;
  const reverbWet = ac.createGain(); reverbWet.gain.value = 0.42;
  ambReverb.connect(reverbFb);   // output → feedback
  reverbFb.connect(ambReverb);   // feedback → input (loop)
  ambReverb.connect(reverbWet);  // output → wet mix
  reverbWet.connect(ambFilter);  // wet mix → global filter

  // Very slow LFO — one gentle swell every ~22 seconds
  const lfo = ac.createOscillator();
  const lfoAmt = ac.createGain();
  lfo.type = 'sine'; lfo.frequency.value = 0.045;
  lfoAmt.gain.value = 0.030;
  lfo.connect(lfoAmt); lfoAmt.connect(ambMaster.gain);
  lfo.start();

  // Ocean noise texture — soft bandpass hiss
  const sr = ac.sampleRate;
  const buf = ac.createBuffer(1, sr * 4, sr);
  const dta = buf.getChannelData(0);
  for (let i = 0; i < dta.length; i++) dta[i] = (Math.random() * 2 - 1) * 0.025;
  const noiseSrc = ac.createBufferSource(); noiseSrc.buffer = buf; noiseSrc.loop = true;
  ambNoiseFilter = ac.createBiquadFilter();
  ambNoiseFilter.type = 'bandpass'; ambNoiseFilter.frequency.value = 520; ambNoiseFilter.Q.value = 0.45;
  const ng = ac.createGain(); ng.gain.value = 0.10;
  noiseSrc.connect(ambNoiseFilter); ambNoiseFilter.connect(ng); ng.connect(ambFilter);
  noiseSrc.start();

  // Background pads — A minor: A2 + E3 + A3 drone, very soft
  for (const [freq, delay, vol] of [[110, 0, 0.026], [165, 0.10, 0.018], [220, 0.20, 0.014]]) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g); g.connect(ambFilter);
    o.start(ac.currentTime + delay);
  }

  playMelodyLoop();
}

function playMelodyLoop() {
  const ac = getAC();
  if (!ac || !ambMaster || !ambFilter || !ambReverb) return;

  let t = ac.currentTime + 0.15;
  for (const [freq, dur] of MELODY) {
    if (freq > 0) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      // Gentle slow attack, long sustain, soft fading tail
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.22);
      g.gain.setValueAtTime(0.12, Math.max(t + 0.23, t + dur - 0.65));
      g.gain.linearRampToValueAtTime(0, t + dur + 0.45);
      o.connect(g);
      g.connect(ambFilter); // dry path through global filter
      g.connect(ambReverb); // also feed reverb for spaciousness
      o.start(t); o.stop(t + dur + 0.9);
    }
    t += dur;
  }

  const totalDur = MELODY.reduce((s, [,d]) => s + d, 0);
  setTimeout(playMelodyLoop, Math.max(100, (totalDur - 0.3) * 1000));
}

function updateAmbientDepth(depthM) {
  if (!audioCtx) return;
  const t = clamp(depthM / 2500, 0, 1);
  // Noise filter shifts down with depth (ocean gets quieter/murkier)
  if (ambNoiseFilter) ambNoiseFilter.frequency.setTargetAtTime(520 - t * 200, audioCtx.currentTime, 1.5);
  // Global lowpass cuts more at depth — deeper = more muffled
  if (ambFilter) ambFilter.frequency.setTargetAtTime(1100 - t * 500, audioCtx.currentTime, 2.0);
}

// ── Sound Effects ─────────────────────────────────────────────────────────────

function sfxPickup(value) {
  const ac = getAC(); if (!ac) return;
  const now  = ac.currentTime;
  // Higher-value treasure → higher pitch + more shimmer
  const base = value >= 2500 ? 1046.5 : value >= 900 ? 880.0 : value >= 280 ? 659.3 : 523.3;
  const vol  = value >= 1500 ? 0.28 : 0.20;
  const play = (f, delay, dur, v) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(v, now + delay);
    g.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
    o.connect(g); g.connect(ac.destination);
    o.start(now + delay); o.stop(now + delay + dur + 0.05);
  };
  play(base,        0,    0.36, vol);
  play(base * 1.25, 0.06, 0.28, vol * 0.55);
  play(base * 1.5,  0.12, 0.22, vol * 0.35);
  if (value >= 600) play(base * 2, 0.03, 0.46, vol * 0.20); // shimmer for gems+
}

function sfxSquidHit() {
  const ac = getAC(); if (!ac) return;
  const now = ac.currentTime;
  // Deep pitched thud sliding down
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(110, now);
  o.frequency.exponentialRampToValueAtTime(38, now + 0.30);
  g.gain.setValueAtTime(0.40, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
  o.connect(g); g.connect(ac.destination);
  o.start(now); o.stop(now + 0.38);
  // Short noise burst for impact texture
  const bsz = Math.floor(ac.sampleRate * 0.13);
  const nb  = ac.createBuffer(1, bsz, ac.sampleRate);
  const nd  = nb.getChannelData(0);
  for (let i = 0; i < bsz; i++) nd[i] = (Math.random() * 2 - 1) * (1 - i / bsz);
  const ns = ac.createBufferSource(); ns.buffer = nb;
  const nf = ac.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 640;
  const ng = ac.createGain(); ng.gain.value = 0.23;
  ns.connect(nf); nf.connect(ng); ng.connect(ac.destination); ns.start(now);
}

function sfxTorpedoFire() {
  const ac = getAC(); if (!ac) return;
  const now = ac.currentTime;
  // Underwater launch ping — frequency slides down quickly
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(520, now);
  o.frequency.exponentialRampToValueAtTime(190, now + 0.13);
  g.gain.setValueAtTime(0.17, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
  o.connect(g); g.connect(ac.destination);
  o.start(now); o.stop(now + 0.18);
}

function sfxFuelWarning() {
  const ac = getAC(); if (!ac) return;
  const now = ac.currentTime;
  // Two short square-wave beeps
  for (const [delay, vol] of [[0, 0.20], [0.20, 0.16]]) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square'; o.frequency.value = 260;
    g.gain.setValueAtTime(vol, now + delay);
    g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.13);
    o.connect(g); g.connect(ac.destination);
    o.start(now + delay); o.stop(now + delay + 0.15);
  }
}

// ─── Game State ───────────────────────────────────────────────────────────────
function blankUpgrades() {
  return { hull:0, engine:0, torpedo:0, rate:0, fuel:0, cargo:0, sonar:0, armor:0 };
}
const state = {
  phase: 'title',
  coins: 0,
  totalCoins: 0,
  bestDepth: 0,
  diveMaxDepth: 0,
  fuelCanisters: 0,
  teleporters: 0,
  garage: {
    active: 'nautilus',
    owned:  ['nautilus'],
    upgrades: { nautilus: blankUpgrades(), barracuda: blankUpgrades(), leviathan: blankUpgrades() },
  },
};

function getSubDef()      { return SUB_DEFS[state.garage.active]; }
function getSubUpgrades() { return state.garage.upgrades[state.garage.active]; }

// ─── Save / Load ──────────────────────────────────────────────────────────────
function hasSaveData() { return !!localStorage.getItem('deepSeaSave'); }

function saveGame() {
  localStorage.setItem('deepSeaSave', JSON.stringify({
    coins: state.coins, totalCoins: state.totalCoins,
    bestDepth: state.bestDepth,
    fuelCanisters: state.fuelCanisters, teleporters: state.teleporters,
    garage: {
      active: state.garage.active,
      owned:  state.garage.owned,
      upgrades: state.garage.upgrades,
    },
  }));
  const btn = document.getElementById('save-btn');
  if (btn) { btn.textContent = '✓ SAVED'; setTimeout(() => { btn.textContent = '💾 SAVE GAME'; }, 1600); }
  showMessage('Progress saved!');
}

function loadSave() {
  const raw = localStorage.getItem('deepSeaSave');
  if (!raw) return false;
  try {
    const s = JSON.parse(raw);
    state.coins = s.coins || 0;
    state.totalCoins    = s.totalCoins    || 0;
    state.bestDepth     = s.bestDepth     || 0;
    state.fuelCanisters = s.fuelCanisters || 0;
    state.teleporters   = s.teleporters   || 0;
    if (s.garage) {
      state.garage.active = s.garage.active || 'nautilus';
      state.garage.owned  = s.garage.owned  || ['nautilus'];
      for (const id of ['nautilus','barracuda','leviathan']) {
        state.garage.upgrades[id] = { ...blankUpgrades(), ...(s.garage.upgrades?.[id] || {}) };
      }
    } else if (s.upgrades) {
      // migrate old save format
      state.garage.upgrades.nautilus = { ...blankUpgrades(), ...s.upgrades };
    }
    return true;
  } catch(e) { return false; }
}

function clearSave() { localStorage.removeItem('deepSeaSave'); }

function resetProgress() {
  clearSave();
  state.coins = 0; state.totalCoins = 0; state.bestDepth = 0;
  state.fuelCanisters = 0; state.teleporters = 0;
  state.garage = {
    active: 'nautilus', owned: ['nautilus'],
    upgrades: { nautilus: blankUpgrades(), barracuda: blankUpgrades(), leviathan: blankUpgrades() },
  };
}

// ─── Sub ──────────────────────────────────────────────────────────────────────
const sub = {
  x: CANVAS_W / 2, y: 150,
  vx: 0, vy: 0, w: 56, h: 24,
  hp: 100, maxHp: 100,
  facing: 1, invincibleTimer: 0,
  cargo: [], fireCooldown: 0, fuel: 300,
  get maxFuel()        { return getSubDef().baseFuel       + (getSubUpgrades().fuel   ||0)*80; },
  get speed()          { return getSubDef().baseSpeed      + (getSubUpgrades().engine ||0)*0.6; },
  get torpedoDmg()     { return getSubDef().baseTorpedoDmg + (getSubUpgrades().torpedo||0); },
  get fireCooldownMax(){ return Math.max(8, getSubDef().baseFireCD - (getSubUpgrades().rate||0)*2); },
  get sonarRadius()    { return getSubDef().baseSonar      + (getSubUpgrades().sonar  ||0)*30; },
  get maxCargoSlots()  { return getSubDef().baseCargo      + (getSubUpgrades().cargo  ||0)*3; },
  get armorFactor()    { return Math.max(0.4, 1.0 - (getSubUpgrades().armor||0)*0.10); },
};

// ─── World objects ────────────────────────────────────────────────────────────
let torpedoes = [], squids = [], treasures = [], particles = [];
let floatingTexts = [], shipwrecks = [], bubbles = [];
let camX = 0, camY = 0;
let fuelBeepTimer = 0;
let boss = null, bossDefeated = false, bossWarned = false;

// ─── Input ────────────────────────────────────────────────────────────────────
const keys = {};
const keysJustPressed = {};
let isPaused = false;

function togglePause() {
  if (state.phase !== 'playing') return;
  isPaused = !isPaused;
  const overlay = document.getElementById('pause-overlay');
  const btn = document.getElementById('pause-btn');
  overlay.style.display = isPaused ? 'flex' : 'none';
  btn.textContent = isPaused ? '▶ RESUME' : '⏸ PAUSE';
  if (audioCtx) isPaused ? audioCtx.suspend() : audioCtx.resume();
}

window.addEventListener('keydown', e => {
  if (e.code === 'KeyP' || e.code === 'Escape') { togglePause(); return; }
  if (isPaused) return;
  if (!keys[e.code]) keysJustPressed[e.code] = true; // only true on first frame of press
  keys[e.code] = true;
  e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ─── Canvas ───────────────────────────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Offscreen canvas for darkness overlay — avoids the "black hole" composite bug.
// We draw darkness here, cut a hole at the sub, then paste result over main canvas.
const darkCanvas = document.createElement('canvas');
darkCanvas.width = CANVAS_W; darkCanvas.height = CANVAS_H;
const darkCtx = darkCanvas.getContext('2d');

// ─── UI helpers ───────────────────────────────────────────────────────────────
function showMessage(txt, duration = 120) {
  const el = document.getElementById('message');
  el.textContent = txt;
  el.style.opacity = 1;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = 0; }, (duration / 60) * 1000 - 400);
}

function updateHUD() {
  const depth = Math.max(0, Math.floor((sub.y - 60) / PIXELS_PER_METRE));
  document.getElementById('health-val').textContent = `${Math.ceil(sub.hp)} / ${sub.maxHp}`;
  document.getElementById('health-fill').style.width = `${(sub.hp / sub.maxHp) * 100}%`;
  document.getElementById('depth-val').textContent = `${depth}m`;

  const zones = [[0,'SURFACE'],[200,'TWILIGHT ZONE'],[1000,'MIDNIGHT ZONE'],[2000,'ABYSSAL ZONE'],[2800,'HADAL ZONE']];
  let zone = zones[0][1];
  for (const [d,n] of zones) if (depth >= d) zone = n;
  document.getElementById('zone-label').textContent = zone;

  // Fuel HUD
  const fuelPct = sub.fuel / sub.maxFuel;
  document.getElementById('fuel-val').textContent = `${Math.ceil(sub.fuel)} / ${sub.maxFuel}`;
  const fuelFill = document.getElementById('fuel-fill');
  fuelFill.style.width = `${fuelPct * 100}%`;
  fuelFill.style.background = fuelPct < 0.25
    ? 'linear-gradient(90deg,#f44,#f80)'
    : 'linear-gradient(90deg,#f80,#fd0)';
  const warn = document.getElementById('fuel-warning');
  warn.style.display = fuelPct < 0.2 ? 'block' : 'none';

  document.getElementById('gold-val').textContent = `${state.coins} coins`;

  const cargoUsed = sub.cargo.length, cargoMax = sub.maxCargoSlots;
  document.getElementById('cargo-val').textContent = `${cargoUsed} / ${cargoMax}`;
  const cargoPct = cargoMax > 0 ? (cargoUsed / cargoMax) * 100 : 0;
  const cargoFill = document.getElementById('cargo-fill');
  cargoFill.style.width = `${cargoPct}%`;
  cargoFill.style.background = cargoPct >= 100
    ? 'linear-gradient(90deg,#f84,#f44)'
    : cargoPct >= 75
      ? 'linear-gradient(90deg,#fd0,#f80)'
      : 'linear-gradient(90deg,#0f8,#4fc)';

  document.getElementById('canister-val').textContent =
    `⛽ ${state.fuelCanisters} [F]   🔵 ${state.teleporters} [T]`;

  const items = document.getElementById('cargo-items');
  items.innerHTML = sub.cargo.map(id => {
    const def = TREASURE_DEFS.find(d => d.id === id);
    return def ? `<span style="display:inline-block;width:12px;height:12px;background:${def.color};border-radius:2px;box-shadow:0 0 4px ${def.color}88;" title="${def.name}"></span>` : '';
  }).join('');
}

// ─── World generation ─────────────────────────────────────────────────────────
function generateWorld() {
  treasures=[]; squids=[]; shipwrecks=[]; bubbles=[];
  torpedoes=[]; particles=[]; floatingTexts=[];

  for (let i = 0; i < 200; i++) {
    const depthM = rand(30, 3000);
    const y = 60 + depthM * PIXELS_PER_METRE;
    const eligible = TREASURE_DEFS.filter(d => depthM >= d.minD && depthM <= d.maxD);
    if (!eligible.length) continue;
    const totalW = eligible.reduce((s,d) => s + d.weight, 0);
    let r = rand(0, totalW);
    let def = eligible[eligible.length - 1];
    for (const d of eligible) { r -= d.weight; if (r <= 0) { def = d; break; } }
    treasures.push({ x: rand(30, WORLD_WIDTH - 30), y, def, collected: false, bob: rand(0, Math.PI * 2) });
  }

  for (let i = 0; i < 22; i++) {
    shipwrecks.push({
      x: rand(60, WORLD_WIDTH - 120),
      y: 60 + rand(200, 2200) * PIXELS_PER_METRE,
      w: rand(80, 170), h: rand(30, 62), angle: rand(-0.15, 0.15),
    });
  }

  respawnSquids();

  for (let i = 0; i < 160; i++) {
    bubbles.push({ x: rand(0, WORLD_WIDTH), y: rand(0, WORLD_HEIGHT), r: rand(1, 4), speed: rand(0.3, 1.2), alpha: rand(0.1, 0.4) });
  }

  // Boss — Abyssal Warden patrols the ocean floor
  boss = {
    x: rand(300, WORLD_WIDTH - 300),
    y: WORLD_HEIGHT - 700,
    vx: 0, vy: 0,
    hp: 120, maxHp: 120,
    phase: 0,
    state: 'patrol',  // patrol | agitated | attacking
    attackTimer: 180,
    currentAttack: null,
    attackPhase: 0,
    inkActive: false, inkTimer: 0,
  };
  bossDefeated = false;
  bossWarned = false;
}

function respawnSquids() {
  const minY = 60 + SQUID_DEPTH_THRESHOLD * PIXELS_PER_METRE;
  while (squids.length < 16) {
    const y = rand(minY, WORLD_HEIGHT - 200);
    const depthFactor = clamp((y - 60) / PIXELS_PER_METRE / 2600 - SQUID_DEPTH_THRESHOLD / 2600, 0, 1);
    const hp = Math.round(5 + depthFactor * 15);
    // Each squid only chases within its own depth tier — won't follow you to shallower water
    const tierCeilingM = depthFactor < 0.33 ? 400 : depthFactor < 0.60 ? 1000 : depthFactor < 0.82 ? 1600 : 2300;
    const zoneTopY = 60 + tierCeilingM * PIXELS_PER_METRE;
    squids.push({ x: rand(40, WORLD_WIDTH-40), y,
      vx: rand(-0.6,0.6), vy: rand(-0.4,0.4), hp, maxHp: hp,
      phase: rand(0, Math.PI*2), alertRadius: 280, attackTimer:0, state:'patrol',
      size: rand(0.9,1.4), depthFactor, zoneTopY });
  }
}

// ─── Sub reset ────────────────────────────────────────────────────────────────
function resetSub() {
  // Start at horizontal center of world, slightly underwater — always visible
  const def = getSubDef();
  sub.x = WORLD_WIDTH / 2; sub.y = 150;
  sub.vx = 0; sub.vy = 0;
  sub.w = def.w; sub.h = def.h;
  sub.facing = 1; sub.invincibleTimer = 0; sub.cargo = [];
  sub.maxHp = def.baseHP + (getSubUpgrades().hull || 0) * 35;
  sub.hp = sub.maxHp;
  sub.fireCooldown = 0;
  sub.fuel = sub.maxFuel;
  sub.outOfFuel = false;
  fuelBeepTimer = 0;
  state.diveMaxDepth = 0;
  // Snap camera directly to sub — no lerp on first frame
  camX = clamp(sub.x - CANVAS_W / 2, 0, WORLD_WIDTH - CANVAS_W);
  camY = clamp(sub.y - CANVAS_H * 0.4, 0, WORLD_HEIGHT - CANVAS_H);
}

// ─── Shooting ─────────────────────────────────────────────────────────────────
function fireTorpedo() {
  if (sub.fireCooldown > 0) return;
  sub.fireCooldown = sub.fireCooldownMax;
  torpedoes.push({
    x: sub.x + sub.facing * (sub.w / 2 + 6),
    y: sub.y,
    vx: sub.facing * 10,
    vy: 0,
    life: 90,
    dmg: sub.torpedoDmg,
  });
  spawnParticles(sub.x + sub.facing * sub.w / 2, sub.y, 5, '#8cf', 2.5);
  sfxTorpedoFire();
}

// ─── Particles ────────────────────────────────────────────────────────────────
function spawnParticles(x, y, count, color, speed) {
  for (let i = 0; i < count; i++) {
    const a = rand(0, Math.PI * 2);
    particles.push({ x, y, vx: Math.cos(a)*speed*rand(0.5,1.5), vy: Math.sin(a)*speed*rand(0.5,1.5),
      life: randInt(20,45), maxLife:40, color, r: rand(1.5,4) });
  }
}
function spawnFloatingText(x, y, txt, color='#fd0') {
  floatingTexts.push({ x, y, txt, color, life:90, maxLife:90 });
}

// ─── Camera ───────────────────────────────────────────────────────────────────
function updateCamera() {
  camX += (sub.x - CANVAS_W / 2 - camX) * 0.1;
  camY += (sub.y - CANVAS_H * 0.4 - camY) * 0.08;
  camX = clamp(camX, 0, WORLD_WIDTH - CANVAS_W);
  camY = clamp(camY, 0, WORLD_HEIGHT - CANVAS_H);
}

function getDepthAlpha() {
  const depthM = (sub.y - 60) / PIXELS_PER_METRE;
  return clamp((depthM - 60) / 1440, 0, 0.93);
}

// ─── Drawing ──────────────────────────────────────────────────────────────────
function drawBackground() {
  const depthM = (camY + CANVAS_H / 2 - 60) / PIXELS_PER_METRE;
  const surfY = 60 - camY;

  // Sky (only if visible)
  if (surfY > 0) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, Math.max(0, surfY));
    skyGrad.addColorStop(0, '#87ceeb');
    skyGrad.addColorStop(1, '#4682b4');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_W, Math.max(0, surfY) + 2);
  }

  // Ocean
  const t = clamp(depthM / 3000, 0, 1);
  const rr = Math.floor((1-t)*12), gg = Math.floor(15+(1-t)*75), bb = Math.floor(50+(1-t)*100);
  const grad = ctx.createLinearGradient(0, Math.max(0, surfY), 0, CANVAS_H);
  grad.addColorStop(0, `rgb(${rr},${gg},${bb})`);
  grad.addColorStop(1, `rgb(${Math.max(0,rr-4)},${Math.max(0,gg-18)},${Math.max(0,bb-28)})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, Math.max(0, surfY), CANVAS_W, CANVAS_H - Math.max(0, surfY));

  // Surface line
  if (surfY > 0 && surfY < CANVAS_H) {
    ctx.save();
    ctx.strokeStyle = 'rgba(100,220,255,0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, surfY); ctx.lineTo(CANVAS_W, surfY);
    ctx.stroke();
    ctx.restore();
  }
}

function drawFloor() {
  const floorY = WORLD_HEIGHT - camY;
  if (floorY > CANVAS_H + 10 || floorY < 0) return;
  ctx.fillStyle = '#1a0e05';
  ctx.fillRect(0, floorY, CANVAS_W, CANVAS_H - floorY + 10);
  ctx.fillStyle = '#251508';
  const startX = -(camX % 24);
  for (let sx = startX; sx < CANVAS_W + 24; sx += 24) {
    const h = 8 + Math.sin((sx + camX) * 0.3) * 6;
    ctx.fillRect(sx, floorY - h, 20, h + 4);
  }
}

function drawBubbles() {
  for (const b of bubbles) {
    const sx = b.x - camX, sy = b.y - camY;
    if (sx < -10 || sx > CANVAS_W + 10 || sy < -10 || sy > CANVAS_H + 10) continue;
    ctx.save();
    ctx.globalAlpha = b.alpha;
    ctx.strokeStyle = '#8cf';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(sx, sy, b.r, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
}

function drawShipwrecks() {
  for (const s of shipwrecks) {
    const sx = s.x - camX, sy = s.y - camY;
    if (sy < -120 || sy > CANVAS_H + 120) continue;
    ctx.save();
    ctx.translate(sx, sy); ctx.rotate(s.angle);
    ctx.fillStyle = '#3a2510';
    ctx.fillRect(-s.w/2, -s.h/2, s.w, s.h);
    ctx.fillStyle = '#5a3015';
    ctx.fillRect(-s.w/2, -s.h/2, s.w*0.3, s.h*0.4);
    ctx.fillRect(s.w*0.1, -s.h/2, s.w*0.2, s.h*0.3);
    ctx.strokeStyle = '#8a6040'; ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.arc(-s.w/2+15+i*22, 0, 7, 0, Math.PI*2); ctx.stroke();
    }
    ctx.fillStyle = '#2a1a08';
    ctx.fillRect(-4, -s.h/2-18, 8, 20);
    ctx.restore();
  }
}

function drawTreasureShape(def, sx, sy, tick, bobOff) {
  const { color, glow, size, shape, value } = def;
  const sy2 = sy + Math.sin(tick * 0.05 + bobOff) * 3;

  ctx.save();

  // Glow (scales with rarity)
  const glowR = size + (value >= 2000 ? 20 : value >= 600 ? 14 : value >= 100 ? 10 : 6);
  const pulseA = value >= 1500 ? 0.5 + 0.18 * Math.sin(tick * 0.07) : 0.32;
  const radGrd = ctx.createRadialGradient(sx, sy2, 1, sx, sy2, glowR);
  radGrd.addColorStop(0, color + 'aa');
  radGrd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = pulseA;
  ctx.fillStyle = radGrd;
  ctx.beginPath(); ctx.arc(sx, sy2, glowR, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  switch (shape) {
    case 'rock': {
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const a = (i/7)*Math.PI*2 - Math.PI/2;
        const r = size * (0.75 + Math.sin(i*2.3)*0.25);
        if (i === 0) ctx.moveTo(sx + Math.cos(a)*r, sy2 + Math.sin(a)*r);
        else ctx.lineTo(sx + Math.cos(a)*r, sy2 + Math.sin(a)*r);
      }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.stroke();
      break;
    }
    case 'ingot': {
      const iw = size*1.8, ih = size*0.85;
      ctx.fillRect(sx-iw/2, sy2-ih/2, iw, ih);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(sx-iw/2+2, sy2-ih/2+2, iw-4, 3);
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth=1;
      ctx.strokeRect(sx-iw/2, sy2-ih/2, iw, ih);
      break;
    }
    case 'gem': {
      ctx.beginPath();
      ctx.moveTo(sx, sy2-size);
      ctx.lineTo(sx+size*0.9, sy2-size*0.1);
      ctx.lineTo(sx, sy2+size*0.8);
      ctx.lineTo(sx-size*0.9, sy2-size*0.1);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.moveTo(sx, sy2-size*0.7);
      ctx.lineTo(sx+size*0.5, sy2-size*0.15);
      ctx.lineTo(sx-size*0.5, sy2-size*0.15);
      ctx.closePath(); ctx.fill();
      break;
    }
    case 'artifact': {
      const aw=size*1.4, ah=size;
      ctx.fillRect(sx-aw/2, sy2-ah/2, aw, ah);
      ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1.5;
      ctx.strokeRect(sx-aw/2, sy2-ah/2, aw, ah);
      ctx.fillStyle='rgba(0,0,0,0.4)';
      ctx.fillRect(sx-1.5, sy2-ah/2+2, 3, ah-4);
      ctx.fillRect(sx-aw/2+2, sy2-1.5, aw-4, 3);
      break;
    }
    case 'bones': {
      ctx.lineWidth=4; ctx.strokeStyle=color; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(sx-size,sy2); ctx.lineTo(sx+size,sy2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx-size*0.4,sy2-size*0.7); ctx.lineTo(sx+size*0.4,sy2+size*0.7); ctx.stroke();
      ctx.fillStyle=color;
      for (const [ox,oy] of [[-size,0],[size,0],[-size*0.4,-size*0.7],[size*0.4,size*0.7]]) {
        ctx.beginPath(); ctx.arc(sx+ox, sy2+oy, 5, 0, Math.PI*2); ctx.fill();
      }
      break;
    }
    case 'fossil': {
      ctx.lineWidth=2; ctx.strokeStyle=color;
      ctx.beginPath(); ctx.arc(sx, sy2, size, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath();
      for (let t2=0; t2<Math.PI*3.5; t2+=0.18) {
        const rr2 = size*0.85*(1-t2/(Math.PI*4.5));
        const x2=sx+Math.cos(t2)*rr2, y2=sy2+Math.sin(t2)*rr2;
        if (t2<0.01) ctx.moveTo(x2,y2); else ctx.lineTo(x2,y2);
      }
      ctx.stroke();
      ctx.lineWidth=1;
      for (let i=0;i<7;i++) {
        const a=(i/7)*Math.PI*2;
        ctx.beginPath();
        ctx.moveTo(sx+Math.cos(a)*size*0.25, sy2+Math.sin(a)*size*0.25);
        ctx.lineTo(sx+Math.cos(a)*size*0.92, sy2+Math.sin(a)*size*0.92);
        ctx.stroke();
      }
      break;
    }
    case 'crystal': {
      ctx.fillStyle=color;
      ctx.beginPath();
      ctx.moveTo(sx, sy2-size*1.6);
      ctx.lineTo(sx+size*0.45, sy2-size*0.3);
      ctx.lineTo(sx+size*0.35, sy2+size*0.6);
      ctx.lineTo(sx-size*0.35, sy2+size*0.6);
      ctx.lineTo(sx-size*0.45, sy2-size*0.3);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.moveTo(sx, sy2-size*1.4);
      ctx.lineTo(sx+size*0.2, sy2-size*0.3);
      ctx.lineTo(sx-size*0.2, sy2-size*0.3);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle=color+'aa';
      for (const side of [1,-1]) {
        ctx.beginPath();
        ctx.moveTo(sx+side*size*0.4, sy2-size*0.9);
        ctx.lineTo(sx+side*size*0.85, sy2-size*0.1);
        ctx.lineTo(sx+side*size*0.75, sy2+size*0.5);
        ctx.lineTo(sx+side*size*0.35, sy2+size*0.5);
        ctx.closePath(); ctx.fill();
      }
      break;
    }
  }

  // Orbiting sparkles for rare items
  if (value >= 1500) {
    const n = value >= 2500 ? 5 : 3;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (let i=0; i<n; i++) {
      const a = (i/n)*Math.PI*2 + tick*0.04;
      const r2 = size + 9 + Math.sin(tick*0.1+i)*2;
      ctx.beginPath(); ctx.arc(sx+Math.cos(a)*r2, sy2+Math.sin(a)*r2, 1.5, 0, Math.PI*2); ctx.fill();
    }
  }

  ctx.restore();
}

function drawTreasures(tick) {
  for (const t of treasures) {
    if (t.collected) continue;
    const sx = t.x - camX, sy = t.y - camY;
    if (sx < -40 || sx > CANVAS_W+40 || sy < -40 || sy > CANVAS_H+40) continue;
    drawTreasureShape(t.def, sx, sy, tick, t.bob);
    if (dist(t, sub) < 100) {
      const bobY = sy + Math.sin(tick*0.05+t.bob)*3;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = t.def.color;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(t.def.name, sx, bobY - t.def.size - 10);
      ctx.fillStyle = '#fd0';
      ctx.font = '10px monospace';
      ctx.fillText(`${t.def.value} coins`, sx, bobY - t.def.size - 22);
      ctx.restore();
    }
  }
}

// ── Fuel status light colour shared by all subs ───────────────────────────────
function fuelLight() {
  const p = sub.fuel / sub.maxFuel;
  return p > 0.5 ? '#0f8' : p > 0.2 ? '#f80' : '#f44';
}

// ── NAUTILUS — cheerful yellow toy submarine ──────────────────────────────────
function drawNautilus(tick) {
  const pa = tick * 0.28;
  // Chubby round body, bright yellow
  ctx.fillStyle = '#f8e000'; ctx.strokeStyle = '#c8a800'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(0, 0, 28, 13, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  // Red racing stripe
  ctx.fillStyle = '#f04000';
  ctx.fillRect(-22, -3, 44, 6);
  ctx.fillStyle = '#f8e000';      // restore yellow over stripe ends
  ctx.beginPath(); ctx.ellipse(28, 0, 8, 13, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-28, 0, 8, 13, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#c8a800'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(0, 0, 28, 13, 0, 0, Math.PI*2); ctx.stroke();

  // Conning tower — round and stubby
  ctx.fillStyle = '#f8d000'; ctx.strokeStyle = '#c8a800'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(-8, -26, 16, 14, 5); ctx.fill(); ctx.stroke();
  // Periscope with star tip
  ctx.strokeStyle = '#b09000'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(4,-26); ctx.lineTo(4,-36); ctx.lineTo(12,-36); ctx.stroke();
  ctx.fillStyle = '#ffe800';
  // ★ star at periscope tip
  for (let i = 0; i < 5; i++) {
    const a = (i*2/5)*Math.PI - Math.PI/2;
    const r = i%2===0 ? 5 : 2.5;
    i===0 ? ctx.beginPath() && ctx.moveTo(12+Math.cos(a)*r,-36+Math.sin(a)*r)
           : ctx.lineTo(12+Math.cos(a)*r,-36+Math.sin(a)*r);
  }
  ctx.closePath(); ctx.fill();

  // Big cheerful porthole
  ctx.fillStyle = '#60d8ff'; ctx.strokeStyle = '#c8a800'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(8, 0, 8, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  // Eye shine
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(6, -2, 3, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#004'; ctx.beginPath(); ctx.arc(9, 1, 2, 0, Math.PI*2); ctx.fill();

  // Propeller (4 blades, chunky)
  for (let i = 0; i < 4; i++) {
    const a = pa + (i*Math.PI/2);
    ctx.strokeStyle = '#c8a800'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(-28-Math.cos(a)*13, -Math.sin(a)*13); ctx.stroke();
  }
  // Torpedo tube
  ctx.fillStyle = '#c8a800'; ctx.beginPath(); ctx.ellipse(30, 0, 6, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#606000'; ctx.beginPath(); ctx.arc(35, 0, 4, 0, Math.PI*2); ctx.fill();

  // Fuel light
  ctx.fillStyle = fuelLight();
  ctx.beginPath(); ctx.arc(-5, -17, 3.5, 0, Math.PI*2); ctx.fill();
}

// ── BARRACUDA — sleek cyan speed sub ─────────────────────────────────────────
function drawBarracuda(tick) {
  const pa = tick * 0.38;
  // Long pointed body
  ctx.fillStyle = '#00c8d8'; ctx.strokeStyle = '#009090'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(38, 0);              // sharp nose
  ctx.quadraticCurveTo(20, -10, -20, -10);
  ctx.lineTo(-32, -6);
  ctx.lineTo(-36, 0);
  ctx.lineTo(-32, 6);
  ctx.lineTo(-20, 10);
  ctx.quadraticCurveTo(20, 10, 38, 0);
  ctx.fill(); ctx.stroke();
  // Silver lightning bolt stripe
  ctx.fillStyle = '#e8f8ff';
  ctx.beginPath(); ctx.moveTo(18,-3); ctx.lineTo(0,0); ctx.lineTo(14,2); ctx.lineTo(-4,8);
  ctx.lineTo(-4,5); ctx.lineTo(10,0); ctx.lineTo(-4,-6); ctx.closePath(); ctx.fill();

  // Swept-back conning tower
  ctx.fillStyle = '#009898'; ctx.strokeStyle = '#006868'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(4,-10); ctx.lineTo(12,-22); ctx.lineTo(18,-22); ctx.lineTo(10,-10); ctx.closePath(); ctx.fill(); ctx.stroke();
  // Antenna
  ctx.strokeStyle = '#60e8e8'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(15,-22); ctx.lineTo(15,-28); ctx.stroke();
  ctx.fillStyle = '#ff4'; ctx.beginPath(); ctx.arc(15,-28,2,0,Math.PI*2); ctx.fill();

  // Twin hexagonal viewports
  for (const [x,y] of [[12,-3],[0,-2]]) {
    ctx.strokeStyle = '#60e8e8'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i=0;i<6;i++){const a=(i/6)*Math.PI*2;i===0?ctx.moveTo(x+5*Math.cos(a),y+5*Math.sin(a)):ctx.lineTo(x+5*Math.cos(a),y+5*Math.sin(a));}
    ctx.closePath();
    ctx.fillStyle='#60d8ff'; ctx.fill(); ctx.stroke();
  }

  // Dual rear fins
  ctx.fillStyle = '#007880'; ctx.strokeStyle = '#004050'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-24,-10); ctx.lineTo(-36,-22); ctx.lineTo(-32,-10); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-24,10); ctx.lineTo(-36,22); ctx.lineTo(-32,10); ctx.closePath(); ctx.fill(); ctx.stroke();

  // Fast spin propeller (3 blade)
  for (let i=0;i<3;i++){
    const a=pa+(i*Math.PI*2/3);
    ctx.strokeStyle='#60f0f0'; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-36,0); ctx.lineTo(-36-Math.cos(a)*12,-Math.sin(a)*12); ctx.stroke();
  }

  // Quad torpedo tubes at nose
  for (const [,ty] of [[-1,-6],[1,-6],[-1,6],[1,6]]) {
    ctx.fillStyle='#004'; ctx.beginPath(); ctx.ellipse(38+Math.abs(ty)*0.3,ty,3,2,0,0,Math.PI*2); ctx.fill();
  }
  ctx.fillStyle = fuelLight();
  ctx.beginPath(); ctx.arc(-2,-13,3,0,Math.PI*2); ctx.fill();
}

// ── LEVIATHAN — wide purple armoured battle-sub ───────────────────────────────
function drawLeviathan(tick) {
  const pa = tick * 0.16;
  const W=37, H=16;
  // Armoured boxy hull
  ctx.fillStyle='#7020a0'; ctx.strokeStyle='#4a1070'; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.roundRect(-W,-H,W*2,H*2,5); ctx.fill(); ctx.stroke();
  // Gold trim lines top and bottom
  ctx.strokeStyle='#f0c000'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-W+4,-H+3); ctx.lineTo(W-4,-H+3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-W+4,H-3); ctx.lineTo(W-4,H-3); ctx.stroke();
  // Armour rivet dots
  ctx.fillStyle='#5010808';
  for (const rx of [-28,-18,-8,8,18,28]) {
    ctx.fillStyle='#9040c0';
    ctx.beginPath(); ctx.arc(rx,-H+1.5,2.5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(rx,H-1.5,2.5,0,Math.PI*2); ctx.fill();
  }

  // Four square portholes
  for (const px of [-20,-6,8,22]) {
    ctx.fillStyle='#50c0ff'; ctx.strokeStyle='#f0c000'; ctx.lineWidth=1.5;
    ctx.fillRect(px-5,-6,10,10);
    ctx.strokeRect(px-5,-6,10,10);
    ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.fillRect(px-3,-4,4,4);
  }

  // Wide fortified conning tower
  ctx.fillStyle='#5a1888'; ctx.strokeStyle='#f0c000'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(-14,-H-20,28,22,4); ctx.fill(); ctx.stroke();
  // Radar dish
  ctx.strokeStyle='#c0c0c0'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(0,-H-20); ctx.lineTo(0,-H-28); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,-H-28,7,Math.PI,0); ctx.stroke();
  ctx.strokeStyle='#f0c000'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(0,-H-28); ctx.lineTo(-7,-H-28); ctx.stroke();

  // Double propellers side by side
  for (const [px] of [[-30,0],[30,0]]) {
    for (let i=0;i<3;i++){
      const a=pa+(i*Math.PI*2/3)+(px>0?0.5:0);
      ctx.strokeStyle='#b080d0'; ctx.lineWidth=4; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-W,px/10); ctx.lineTo(-W-Math.cos(a)*11,-Math.sin(a)*11+px/8); ctx.stroke();
    }
  }

  // Big forward torpedo launcher
  ctx.fillStyle='#3a0870'; ctx.beginPath(); ctx.roundRect(W-2,-7,10,14,3); ctx.fill();
  ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(W+8,-4,3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(W+8,4,3,0,Math.PI*2); ctx.fill();

  ctx.fillStyle=fuelLight();
  ctx.beginPath(); ctx.arc(-5,-H-5,4,0,Math.PI*2); ctx.fill();
}

// ── Dispatcher ────────────────────────────────────────────────────────────────
function drawSub(tick) {
  const sx = sub.x - camX, sy = sub.y - camY;
  const flash = sub.invincibleTimer > 0 && Math.floor(sub.invincibleTimer/4)%2 === 0;
  if (flash) return;

  // Glow halo (colour matches current sub)
  ctx.save();
  const glowCol = getSubDef().color;
  const hg = ctx.createRadialGradient(sx,sy,4,sx,sy,58);
  hg.addColorStop(0, glowCol+'44'); hg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(sx,sy,58,0,Math.PI*2); ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(sx, sy);
  ctx.scale(sub.facing, 1);
  switch (state.garage.active) {
    case 'barracuda': drawBarracuda(tick); break;
    case 'leviathan': drawLeviathan(tick); break;
    default:          drawNautilus(tick);
  }
  ctx.restore();

  // Sonar ring
  if ((sub.y-60)/PIXELS_PER_METRE > 40) {
    ctx.save();
    ctx.globalAlpha = 0.08 + 0.03*Math.sin(tick*0.05);
    ctx.strokeStyle='#0af'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.arc(sx,sy,sub.sonarRadius,0,Math.PI*2); ctx.stroke();
    ctx.restore();
  }
}

function drawTorpedoes() {
  for (const t of torpedoes) {
    const sx = t.x - camX, sy = t.y - camY;
    if (sx < -20 || sx > CANVAS_W+20) continue;
    ctx.save();

    // Trail
    ctx.strokeStyle = 'rgba(80,200,255,0.45)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sx - t.vx * 5, sy);
    ctx.lineTo(sx, sy);
    ctx.stroke();

    // Body
    ctx.shadowColor = '#0cf'; ctx.shadowBlur = 14;
    ctx.fillStyle = '#b0eeff';
    ctx.beginPath(); ctx.ellipse(sx, sy, 11, 4, 0, 0, Math.PI*2); ctx.fill();

    // Bright nose
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(sx + Math.sign(t.vx)*9, sy, 3.5, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  }
}

function drawSquids(tick) {
  for (const s of squids) {
    const sx = s.x - camX, sy = s.y - camY;
    if (sy < -120 || sy > CANVAS_H+120 || sx < -80 || sx > CANVAS_W+80) continue;
    if (dist(s, sub) > sub.sonarRadius + 50) continue;

    const df  = s.depthFactor || 0;  // 0 = shallow (400m), 1 = deepest (3000m)
    const angry = s.state === 'chase' || s.state === 'attack';

    // ── Depth-based colour palette ──────────────────────────────────────────
    // Shallow: pinkish purple → Mid: dark crimson → Deep: near-black + glow
    let bodyCol, tentCol, eyeCol, glowCol;
    if (df < 0.33) {
      // Tier 1 — shallow: classic pink-purple
      bodyCol = angry ? '#c03060' : '#802060';
      tentCol = angry ? '#a02050' : '#601840';
      eyeCol  = angry ? '#ff0'    : '#ffa0a0';
      glowCol = null;
    } else if (df < 0.60) {
      // Tier 2 — mid: dark crimson, slight glow
      bodyCol = angry ? '#c01818' : '#701010';
      tentCol = angry ? '#a00808' : '#500808';
      eyeCol  = '#ff6020';
      glowCol = '#ff4010';
    } else if (df < 0.82) {
      // Tier 3 — deep: near-black with orange bio-glow
      bodyCol = angry ? '#800808' : '#3a0404';
      tentCol = angry ? '#600404' : '#280202';
      eyeCol  = '#ff5000';
      glowCol = '#ff3000';
    } else {
      // Tier 4 — abyss: pitch black, fire eyes, eerie blue bio-spots
      bodyCol = angry ? '#500202' : '#180101';
      tentCol = angry ? '#300000' : '#100000';
      eyeCol  = '#ff2000';
      glowCol = '#ff1000';
    }

    ctx.save();
    ctx.translate(sx, sy);

    // Eye/body glow for deep squids
    if (glowCol) {
      const glowR = 30 * s.size * (0.6 + df * 0.6);
      ctx.shadowColor = glowCol;
      ctx.shadowBlur  = 8 + df * 18;
    }

    // Body — taller and narrower the deeper it is (more eel-like)
    const bw = 22 * s.size;
    const bh = (32 + df * 14) * s.size;   // taller at depth
    ctx.fillStyle = bodyCol;
    ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, 0, Math.PI*2); ctx.fill();

    // Head fin — longer and more jagged deeper
    const finW = (14 + df * 8) * s.size;
    const finH = (36 + df * 18) * s.size;
    ctx.beginPath();
    ctx.moveTo(-finW, -bh*0.55);
    if (df > 0.5) {
      // Jagged fin for deep squids
      ctx.lineTo(-finW*0.4, -(bh*0.55 + finH*0.35));
      ctx.lineTo(0, -bh*0.55 - finH);
      ctx.lineTo(finW*0.4, -(bh*0.55 + finH*0.35));
    } else {
      ctx.lineTo(0, -bh*0.55 - finH);
    }
    ctx.lineTo(finW, -bh*0.55);
    ctx.closePath(); ctx.fill();

    // Eyes — grow and glow with depth
    const eyeW = (5 + df*3)  * s.size;
    const eyeH = (6 + df*4)  * s.size;
    const eyeX = 8 * s.size;
    const eyeY = -6 * s.size;
    ctx.shadowBlur = glowCol ? 12 + df*14 : 0;
    ctx.shadowColor = glowCol || 'transparent';
    ctx.fillStyle = eyeCol;
    ctx.beginPath(); ctx.ellipse(-eyeX, eyeY, eyeW, eyeH, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( eyeX, eyeY, eyeW, eyeH, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(-eyeX, eyeY+s.size, (2.5+df*1.5)*s.size, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc( eyeX, eyeY+s.size, (2.5+df*1.5)*s.size, 0, Math.PI*2); ctx.fill();

    // Bioluminescent spots (tier 2+)
    if (df > 0.33) {
      const spotCol  = df > 0.82 ? '#60d0ff' : '#ff8030'; // blue abyss vs orange deep
      const spotCount = Math.round(2 + df * 6);
      ctx.fillStyle = spotCol;
      ctx.shadowColor = spotCol; ctx.shadowBlur = 8;
      for (let i = 0; i < spotCount; i++) {
        const a  = (i / spotCount) * Math.PI * 1.4 - 0.2;
        const r  = bw * 0.55;
        const px = Math.cos(a) * r * (i%2===0 ? 0.6 : 1.0);
        const py = Math.sin(a) * bh * 0.5;
        const sr2 = (1.5 + df * 2) * s.size;
        ctx.beginPath(); ctx.arc(px, py, sr2, 0, Math.PI*2); ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    // Tentacles — more tentacles the deeper (8 → 10 → 12)
    const tentCount = df < 0.4 ? 8 : df < 0.7 ? 10 : 12;
    const tentLen   = (28 + df * 24) * s.size; // longer at depth
    ctx.strokeStyle = tentCol;
    ctx.lineWidth   = (2.5 + df * 1.5) * s.size;
    ctx.shadowColor = glowCol || 'transparent';
    ctx.shadowBlur  = glowCol ? 6 : 0;
    for (let i = 0; i < tentCount; i++) {
      const bx  = (i - (tentCount-1)/2) * (5.5 - df*0.5) * s.size;
      const wo  = Math.sin(tick * (0.15 + df*0.08) + i * 0.6 + s.phase) * (8 + df*5) * s.size;
      ctx.beginPath();
      ctx.moveTo(bx, bh * 0.8);
      ctx.quadraticCurveTo(bx + wo, bh*0.8 + tentLen*0.6, bx + wo*1.6, bh*0.8 + tentLen);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // HP bar
    if (s.hp < s.maxHp) {
      const bw2 = (22 + df*6) * s.size;
      ctx.fillStyle = '#300'; ctx.fillRect(-bw2, -(bh+8)*s.size*1.5, bw2*2, 5);
      ctx.fillStyle = '#f44'; ctx.fillRect(-bw2, -(bh+8)*s.size*1.5, bw2*2*(s.hp/s.maxHp), 5);
    }
    ctx.restore();
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x-camX, p.y-camY, p.r, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
}

function drawFloatingTexts() {
  for (const ft of floatingTexts) {
    ctx.save();
    ctx.globalAlpha = ft.life / ft.maxLife;
    ctx.fillStyle = ft.color;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ft.txt, ft.x-camX, ft.y-camY);
    ctx.restore();
  }
}

// Darkness overlay using offscreen canvas to correctly show sub in light cone.
function drawDarkness() {
  let darkAlpha = getDepthAlpha();
  // Boss ink cloud shrinks sonar range dramatically
  if (boss && boss.inkActive) darkAlpha = Math.min(0.97, darkAlpha + 0.45);
  if (darkAlpha <= 0) return;
  const cx = sub.x - camX, cy = sub.y - camY;
  const lightR = (boss && boss.inkActive) ? sub.sonarRadius * 0.35 : sub.sonarRadius;

  darkCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  darkCtx.fillStyle = `rgba(0,0,0,${darkAlpha})`;
  darkCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Cut transparent hole — inner half fully lit, gradient to full dark at edge
  const grd = darkCtx.createRadialGradient(cx, cy, lightR*0.45, cx, cy, lightR);
  grd.addColorStop(0, 'rgba(0,0,0,1)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  darkCtx.globalCompositeOperation = 'destination-out';
  darkCtx.fillStyle = grd;
  darkCtx.beginPath(); darkCtx.arc(cx, cy, lightR, 0, Math.PI*2); darkCtx.fill();
  darkCtx.globalCompositeOperation = 'source-over';

  ctx.drawImage(darkCanvas, 0, 0);
}

function drawDepthLine() {
  const lineY = 60 + SQUID_DEPTH_THRESHOLD * PIXELS_PER_METRE - camY;
  if (lineY > 20 && lineY < CANVAS_H - 10) {
    ctx.save();
    ctx.strokeStyle='rgba(255,50,50,0.45)'; ctx.setLineDash([8,8]); ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(0,lineY); ctx.lineTo(CANVAS_W,lineY); ctx.stroke();
    ctx.fillStyle='rgba(255,60,60,0.65)'; ctx.font='11px monospace';
    ctx.fillText('⚠ DANGER ZONE — 400m', 12, lineY-4);
    ctx.restore();
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────
function updateSub() {
  let ax = 0, ay = 0;
  if (!sub.outOfFuel) {
    if (keys['ArrowLeft']  || keys['KeyA']) { ax = -1; sub.facing = -1; }
    if (keys['ArrowRight'] || keys['KeyD']) { ax =  1; sub.facing =  1; }
    if (keys['ArrowUp']    || keys['KeyW']) ay = -1;
    if (keys['ArrowDown']  || keys['KeyS']) ay =  1;
  }

  if (ax !== 0 && ay !== 0) { ax *= 0.707; ay *= 0.707; }
  const driving = ax !== 0 || ay !== 0;
  sub.vx += ax * 0.9; sub.vy += ay * 0.9;
  // Grippy braking: stops quickly when no key held, smooth while steering
  const friction = driving ? 0.84 : 0.68;
  sub.vx *= friction; sub.vy *= friction;

  const spd2 = Math.hypot(sub.vx, sub.vy);
  if (spd2 > sub.speed) { sub.vx = sub.vx/spd2*sub.speed; sub.vy = sub.vy/spd2*sub.speed; }

  sub.x += sub.vx; sub.y += sub.vy;
  sub.x = clamp(sub.x, sub.w/2, WORLD_WIDTH - sub.w/2);
  sub.y = clamp(sub.y, 60, WORLD_HEIGHT - sub.h);

  // Fuel consumption (increases with depth)
  const depthM = Math.max(0, (sub.y - 60) / PIXELS_PER_METRE);
  const fuelRate = 0.025 + depthM * 0.000035;
  const hadFuel = sub.fuel > 0;
  sub.fuel = Math.max(0, sub.fuel - fuelRate);

  // Fuel depleted → engine cuts out, sub floats to surface
  if (hadFuel && sub.fuel <= 0 && !sub.outOfFuel) {
    sub.outOfFuel = true;
    showMessage('ENGINE CUT OUT! Floating to surface...');
    sfxFuelWarning();
  }
  if (sub.outOfFuel) {
    sub.vx *= 0.90;               // horizontal drag — drifts but mostly goes up
    sub.vy = Math.max(sub.vy - 0.18, -1.4); // buoyancy pushes upward
  }

  // Fuel warning sound
  const fuelPct = sub.fuel / sub.maxFuel;
  if (fuelPct < 0.2 && sub.fuel > 0) {
    fuelBeepTimer--;
    if (fuelBeepTimer <= 0) {
      sfxFuelWarning();
      fuelBeepTimer = 150;
    }
  } else {
    fuelBeepTimer = 0;
  }

  // Track deepest point reached this dive
  const curDepth = Math.max(0, Math.floor((sub.y - 60) / PIXELS_PER_METRE));
  if (curDepth > state.diveMaxDepth) state.diveMaxDepth = curDepth;
  if (curDepth > state.bestDepth)    state.bestDepth    = curDepth;

  if (keys['Space'] || keys['KeyZ']) fireTorpedo();
  if (sub.fireCooldown > 0) sub.fireCooldown--;
  if (sub.invincibleTimer > 0) sub.invincibleTimer--;

  // Fuel canister (F key — one-shot per press)
  if (keysJustPressed['KeyF']) {
    keysJustPressed['KeyF'] = false;
    if (state.fuelCanisters > 0 && sub.fuel < sub.maxFuel * 0.99) {
      state.fuelCanisters--;
      const added = Math.min(150, sub.maxFuel - sub.fuel);
      sub.fuel = Math.min(sub.maxFuel, sub.fuel + 150);
      spawnFloatingText(sub.x, sub.y - 44, `+${added} FUEL`, '#f80');
      showMessage(`Canister used! +${added} fuel  (${state.fuelCanisters} left)`);
    } else if (state.fuelCanisters === 0) {
      showMessage('No canisters! Buy some at the surface base.');
    }
  }

  // Teleporter (T key — instant surface)
  if (keysJustPressed['KeyT']) {
    keysJustPressed['KeyT'] = false;
    if (state.teleporters > 0 && sub.y > 120) {
      state.teleporters--;
      spawnParticles(sub.x, sub.y, 30, '#0af', 5);
      sub.x = WORLD_WIDTH / 2; sub.y = 65;
      sub.vx = 0; sub.vy = 0;
      sub.fuel = sub.maxFuel; fuelBeepTimer = 0;
      camX = clamp(sub.x - CANVAS_W/2, 0, WORLD_WIDTH - CANVAS_W);
      camY = 0;
      showMessage(`Teleported to surface! ${state.teleporters} charges left`);
      if (sub.cargo.length > 0) { sellCargo(); return; }
    } else if (state.teleporters === 0) {
      showMessage('No teleporters! Buy at surface base.');
    }
  }

  // Surface actions
  if (sub.y <= 63 && state.phase === 'playing') {
    sub.outOfFuel = false;
    if (sub.fuel < sub.maxFuel) {
      sub.fuel = sub.maxFuel;
      fuelBeepTimer = 0;
    }
    if (sub.cargo.length > 0) {
      sellCargo();
    }
  }
}

function updateTorpedoes() {
  for (let i = torpedoes.length - 1; i >= 0; i--) {
    const t = torpedoes[i];
    t.x += t.vx; t.y += t.vy; t.life--;
    // Expire when leaving the sub's visible sonar radius (can't shoot what you can't see)
    if (t.life <= 0 || t.x < 0 || t.x > WORLD_WIDTH || dist(t, sub) > sub.sonarRadius) {
      torpedoes.splice(i,1); continue;
    }
    let hit = false;
    for (let j = squids.length - 1; j >= 0; j--) {
      const s = squids[j];
      // Elliptical hitbox matching the squid's tall narrow body (22×38 half-axes)
      const tdx = t.x - s.x, tdy = t.y - s.y;
      const trx = 22 * s.size, try_ = 38 * s.size;
      if ((tdx*tdx)/(trx*trx) + (tdy*tdy)/(try_*try_) < 1) {
        s.hp -= t.dmg;
        spawnParticles(t.x,t.y,10,'#f84',3);
        torpedoes.splice(i,1); hit=true;
        if (s.hp <= 0) {
          spawnParticles(s.x,s.y,25,'#c03060',4);
          spawnFloatingText(s.x,s.y-40,'+50 coins','#fd0');
          state.coins += 50; state.totalCoins += 50;
          squids.splice(j,1);
          respawnSquids();
          showMessage('Squid defeated! +50 coins');
        } else {
          s.state = 'chase';
          spawnFloatingText(s.x,s.y-40,`-${t.dmg} HP`,'#f84');
        }
        break;
      }
    }
    if (hit) continue;
    // Check boss hit
    if (boss && !bossDefeated && dist(t, boss) < 80) {
      boss.hp -= t.dmg;
      spawnParticles(t.x, t.y, 12, '#f84', 4);
      torpedoes.splice(i, 1);
      if (boss.hp <= 0) {
        defeatBoss();
      } else {
        boss.state = 'agitated';
        spawnFloatingText(boss.x, boss.y - 100, `-${t.dmg}`, '#f84');
      }
    }
  }
}

function defeatBoss() {
  bossDefeated = true;
  spawnParticles(boss.x, boss.y, 60, '#9000ff', 6);
  spawnParticles(boss.x, boss.y, 40, '#ff5500', 5);
  state.coins += 800; state.totalCoins += 800;
  spawnFloatingText(boss.x, boss.y - 120, '+800 BOSS BONUS!', '#fd0');
  showMessage('THE WARDEN IS DEFEATED! Rare treasures revealed!', 240);
  // Spawn boss-only loot around it
  const lootDefs = ['wardenCore','wardenCore','abyssalShard','abyssalShard','abyssalShard'];
  for (const id of lootDefs) {
    const lDef = TREASURE_DEFS.find(d => d.id === id);
    if (lDef) treasures.push({
      x: boss.x + rand(-250, 250),
      y: boss.y + rand(-80, 80),
      def: lDef, collected: false, bob: rand(0, Math.PI*2),
    });
  }
  boss = null;
}

function updateSquids() {
  const subDepthM = (sub.y - 60) / PIXELS_PER_METRE;
  for (const s of squids) {
    s.phase += 0.05;
    const d = dist(s, sub);
    // Squid retreats if sub ascends above this squid's zone ceiling
    if (sub.y < (s.zoneTopY || 60 + SQUID_DEPTH_THRESHOLD * PIXELS_PER_METRE)) s.state = 'patrol';

    if (s.state === 'patrol') {
      s.vx += rand(-0.08,0.08); s.vy += rand(-0.06,0.06);
      s.vx = clamp(s.vx,-0.8,0.8); s.vy = clamp(s.vy,-0.6,0.6);
      if (d < s.alertRadius && sub.y >= s.zoneTopY) s.state = 'chase';
    } else if (s.state === 'chase') {
      const dx=sub.x-s.x, dy=sub.y-s.y, len=Math.hypot(dx,dy);
      const spd = (1.5 + (s.size-0.9)*0.8) * (1 + (s.depthFactor||0)*0.6); // faster deeper
      s.vx += (dx/len)*0.12; s.vy += (dy/len)*0.12;
      const sv = Math.hypot(s.vx,s.vy);
      if (sv > spd) { s.vx=s.vx/sv*spd; s.vy=s.vy/sv*spd; }
      // Elliptical attack-entry range: sum of sub half-width + squid half-width
      const adx = sub.x - s.x, ady = sub.y - s.y;
      const arx = sub.w/2 + 22*s.size, ary = sub.h/2 + 36*s.size;
      if ((adx*adx)/(arx*arx) + (ady*ady)/(ary*ary) < 1) {
        s.state = 'attack'; s.attackTimer = 40;
      }
      if (d > s.alertRadius*1.5) s.state='patrol';
    } else if (s.state === 'attack') {
      s.attackTimer--;
      if (s.attackTimer <= 0 && sub.invincibleTimer <= 0) {
        // Bigger squids hit harder; armor upgrade reduces damage
        // Deeper squids hit harder (up to 2× at 3000m), bigger squids hit harder, armor reduces
        const dmg = Math.round(s.size * 15 * (1 + (s.depthFactor||0) * 1.0) * sub.armorFactor);
        sub.hp -= dmg;
        sub.invincibleTimer = 80;
        sfxSquidHit();
        spawnParticles(sub.x,sub.y,15,'#f44',3);
        showMessage(`HULL DAMAGED! -${dmg} HP`);
        if (sub.hp <= 0) { sub.hp=0; triggerDeath('squid'); return; }
        s.state='chase'; s.attackTimer=40;
      }
    }

    s.x += s.vx; s.y += s.vy;
    const minY = 60 + SQUID_DEPTH_THRESHOLD * PIXELS_PER_METRE;
    if (s.x < 20) s.vx += 0.3;
    if (s.x > WORLD_WIDTH-20) s.vx -= 0.3;
    if (s.y < minY) s.vy += 0.3;
    if (s.y > WORLD_HEIGHT-50) s.vy -= 0.3;
  }
}

function updateBoss() {
  if (!boss || bossDefeated) return;
  boss.phase += 0.04;

  // Warn player when approaching
  if (!bossWarned && dist(boss, sub) < 900) {
    bossWarned = true;
    showMessage('⚠ A MASSIVE CREATURE STIRS IN THE DARKNESS...', 200);
  }

  const d = dist(boss, sub);

  if (boss.state === 'patrol') {
    boss.vx += rand(-0.06,0.06); boss.vy += rand(-0.04,0.04);
    boss.vx = clamp(boss.vx,-0.6,0.6); boss.vy = clamp(boss.vy,-0.5,0.5);
    if (d < 700) boss.state = 'agitated';
  }

  if (boss.state === 'agitated') {
    const dx=sub.x-boss.x, dy=sub.y-boss.y, len=Math.hypot(dx,dy);
    boss.vx += (dx/len)*0.06; boss.vy += (dy/len)*0.06;
    boss.vx = clamp(boss.vx,-1.2,1.2); boss.vy = clamp(boss.vy,-1.0,1.0);
    boss.attackTimer--;
    if (boss.attackTimer <= 0) {
      const hpPct = boss.hp / boss.maxHp;
      const pool = hpPct < 0.5 ? ['sweep','charge','charge','ink'] : ['sweep','charge','charge'];
      boss.currentAttack = pool[Math.floor(Math.random()*pool.length)];
      boss.attackPhase = 0;
      boss.state = 'attacking';
      boss.attackTimer = 220;
    }
  }

  if (boss.state === 'attacking') {
    boss.attackPhase++;
    const atk = boss.currentAttack;

    if (atk === 'sweep') {
      // Wind up 70 frames then slam
      if (boss.attackPhase === 70 && d < 220 && sub.invincibleTimer <= 0) {
        const dmg = Math.round(55 * sub.armorFactor);
        sub.hp -= dmg; sub.invincibleTimer = 100;
        sfxSquidHit(); spawnParticles(sub.x,sub.y,25,'#f44',5);
        showMessage(`TENTACLE SWEEP! -${dmg} HP`);
        if (sub.hp <= 0) { triggerDeath('boss'); return; }
      }
      if (boss.attackPhase > 110) boss.state = 'agitated';
    } else if (atk === 'charge') {
      if (boss.attackPhase === 1) { boss._cx = sub.x; boss._cy = sub.y; }
      if (boss.attackPhase < 100) {
        const dx=boss._cx-boss.x, dy=boss._cy-boss.y, len=Math.hypot(dx,dy)||1;
        boss.vx = (dx/len)*4.5; boss.vy = (dy/len)*4.5;
        if (d < 65 && sub.invincibleTimer <= 0) {
          const dmg = Math.round(40 * sub.armorFactor);
          sub.hp -= dmg; sub.invincibleTimer = 80;
          sfxSquidHit(); spawnParticles(sub.x,sub.y,20,'#f44',4);
          showMessage(`BODY SLAM! -${dmg} HP`);
          if (sub.hp <= 0) { triggerDeath('boss'); return; }
        }
      } else { boss.vx *= 0.88; boss.vy *= 0.88; }
      if (boss.attackPhase > 130) boss.state = 'agitated';
    } else if (atk === 'ink') {
      if (boss.attackPhase === 1) {
        boss.inkActive = true; boss.inkTimer = 350;
        showMessage('ABYSSAL INK! Vision severely reduced!', 180);
      }
      if (boss.attackPhase > 60) boss.state = 'agitated';
    }
  }

  if (boss.inkTimer > 0) { boss.inkTimer--; if (boss.inkTimer <= 0) boss.inkActive = false; }

  boss.x += boss.vx; boss.y += boss.vy;
  boss.vx *= 0.96; boss.vy *= 0.96;
  boss.x = clamp(boss.x, 120, WORLD_WIDTH-120);
  boss.y = clamp(boss.y, WORLD_HEIGHT-1600, WORLD_HEIGHT-150);
}

function drawBoss(tick) {
  if (!boss || bossDefeated) return;
  const sx = boss.x - camX, sy = boss.y - camY;
  if (sy < -250 || sy > CANVAS_H+250) return;
  if (dist(boss, sub) > sub.sonarRadius + 300) return; // only visible within extended sonar

  const enraged = boss.hp < boss.maxHp * 0.3;
  const angry   = boss.state !== 'patrol';
  const charging = boss.state === 'attacking' && boss.currentAttack === 'sweep' && boss.attackPhase < 70;

  ctx.save();
  ctx.translate(sx, sy);

  // Pre-charge warning glow
  if (charging) {
    const pr = 110 + Math.sin(tick*0.35)*18;
    const grd = ctx.createRadialGradient(0,0,20,0,0,pr);
    grd.addColorStop(0,'rgba(255,60,0,0.45)'); grd.addColorStop(1,'transparent');
    ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(0,0,pr,0,Math.PI*2); ctx.fill();
  }

  const bodyCol = enraged ? '#1a0008' : angry ? '#380018' : '#200010';
  const eyeCol  = enraged ? '#ff3000' : '#ff0055';

  // Body
  ctx.fillStyle = bodyCol;
  ctx.beginPath(); ctx.ellipse(0,0,68,96,0,0,Math.PI*2); ctx.fill();
  // Head fin
  ctx.beginPath();
  ctx.moveTo(-46,-58); ctx.lineTo(0,-118); ctx.lineTo(46,-58);
  ctx.closePath(); ctx.fill();
  // Eyes (glowing)
  ctx.fillStyle = eyeCol; ctx.shadowColor = eyeCol; ctx.shadowBlur = 22;
  ctx.beginPath(); ctx.ellipse(-24,-18,16,19,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(24,-18,16,19,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#000'; ctx.shadowBlur=0;
  ctx.beginPath(); ctx.arc(-24,-17,8,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(24,-17,8,0,Math.PI*2); ctx.fill();
  // Tentacles
  ctx.strokeStyle = enraged ? '#400018' : '#300012'; ctx.lineWidth = 9;
  for (let i=0;i<12;i++) {
    const bx=(i-5.5)*14;
    const wo=Math.sin(tick*0.1+i*0.45+boss.phase)*22;
    ctx.beginPath();
    ctx.moveTo(bx,88);
    ctx.quadraticCurveTo(bx+wo,132,bx+wo*1.6,175);
    ctx.stroke();
  }

  ctx.restore();

  // HP bar (always visible near boss)
  const barW=220, barH=16, barX=sx-barW/2, barY=sy-130;
  ctx.fillStyle='rgba(0,0,0,0.75)'; ctx.fillRect(barX-3,barY-3,barW+6,barH+6);
  ctx.fillStyle='#300'; ctx.fillRect(barX,barY,barW,barH);
  const hpC = enraged?'#f00':boss.hp/boss.maxHp>0.5?'#f80':'#f44';
  ctx.fillStyle=hpC; ctx.fillRect(barX,barY,barW*(boss.hp/boss.maxHp),barH);
  ctx.strokeStyle='#f80'; ctx.lineWidth=1.5; ctx.strokeRect(barX,barY,barW,barH);
  ctx.fillStyle='#fff'; ctx.font='bold 12px monospace'; ctx.textAlign='center';
  ctx.fillText(`⚓ THE ABYSSAL WARDEN  ${boss.hp}/${boss.maxHp}`,sx,barY-5);
}

function updateTreasures() {
  for (const t of treasures) {
    if (t.collected) continue;
    if (dist(t,sub) < 28) {
      if (sub.cargo.length >= sub.maxCargoSlots) {
        showMessage('Cargo hold full! Surface to sell.');
        continue;
      }
      t.collected = true;
      sub.cargo.push(t.def.id);
      sfxPickup(t.def.value);
      spawnFloatingText(t.x, t.y-20, `+${t.def.value} ${t.def.name}`, t.def.color);
      spawnParticles(t.x, t.y, 12, t.def.color, 2.5);
      showMessage(`${t.def.name} — ${t.def.value} coins  (${sub.cargo.length}/${sub.maxCargoSlots})`);
    }
  }
}

function updateBubbles() {
  for (const b of bubbles) { b.y -= b.speed; if (b.y < 0) b.y = WORLD_HEIGHT; }
}
function updateParticles() {
  for (let i=particles.length-1; i>=0; i--) {
    const p=particles[i];
    p.x+=p.vx; p.y+=p.vy; p.vx*=0.94; p.vy*=0.94; p.life--;
    if (p.life<=0) particles.splice(i,1);
  }
}
function updateFloatingTexts() {
  for (let i=floatingTexts.length-1; i>=0; i--) {
    floatingTexts[i].y -= 0.6; floatingTexts[i].life--;
    if (floatingTexts[i].life<=0) floatingTexts.splice(i,1);
  }
}

// ─── Surface actions ──────────────────────────────────────────────────────────
function sellCargo() {
  if (!sub.cargo.length) return;
  let total = 0;
  for (const id of sub.cargo) {
    const def = TREASURE_DEFS.find(d => d.id === id);
    if (def) total += def.value;
  }
  state.coins += total;
  state.totalCoins += total;
  sub.cargo = [];
  showMessage(`Cargo sold for ${total} coins! Total: ${state.coins}`);
  state.phase = 'surface';
  showUpgradeScreen();
}

function triggerDeath(cause = 'squid') {
  state.phase = 'dead';
  spawnParticles(sub.x, sub.y, 40, '#f84', 5);

  // Use the deepest point of THIS dive, not where they died
  const diveDepth = state.diveMaxDepth;
  if (diveDepth > state.bestDepth) state.bestDepth = diveDepth;

  const causeMsg = cause === 'fuel'
    ? '<p style="color:#f80;margin-top:12px">You ran out of fuel and sank.</p>'
    : '<p style="color:#f44;margin-top:12px">The Giant Squid destroyed your hull.</p>';

  setTimeout(() => {
    document.getElementById('overlay-title').textContent = 'SUBMARINE LOST';
    document.getElementById('overlay-body').innerHTML =
      `<p>Deepest dive: <b>${diveDepth}m</b></p>` +
      `<p>Best ever: <b>${state.bestDepth}m</b></p>` +
      `<p>Total coins collected: <b>${state.totalCoins}</b></p>` +
      causeMsg;

    const btn1 = document.getElementById('overlay-btn');
    const btn2 = document.getElementById('overlay-btn2');

    if (hasSaveData()) {
      btn1.textContent = 'RESTORE SAVE';
      btn1.style.background = '#0f8';
      btn1.onclick = () => {
        loadSave();
        document.getElementById('screen-overlay').style.display = 'none';
        showUpgradeScreen();
      };
      btn2.style.display = 'block';
      btn2.textContent = 'NEW GAME — lose all progress';
      btn2.onclick = () => {
        if (confirm('Start fresh? Your saved progress will be deleted.')) {
          resetProgress();
          document.getElementById('screen-overlay').style.display = 'none';
          startDive();
        }
      };
    } else {
      btn1.textContent = 'TRY AGAIN';
      btn1.style.background = '#0af';
      btn1.onclick = () => {
        resetProgress();
        document.getElementById('screen-overlay').style.display = 'none';
        startDive();
      };
      btn2.style.display = 'none';
    }

    document.getElementById('screen-overlay').style.display = 'flex';
  }, 1200);
}

// ─── Upgrade screen ───────────────────────────────────────────────────────────
function showUpgradeScreen() {
  document.getElementById('upgrade-gold').textContent = `${state.coins} coins`;

  // ── Garage section ──
  const garageEl = document.getElementById('garage-section');
  garageEl.innerHTML = '';
  for (const [id, def] of Object.entries(SUB_DEFS)) {
    const owned   = state.garage.owned.includes(id);
    const active  = state.garage.active === id;
    const card = document.createElement('div');
    card.className = 'sub-card' + (active ? ' sub-active' : owned ? '' : ' sub-locked');
    card.innerHTML = `
      <div class="sub-icon" style="background:${def.color}22;border:2px solid ${def.color}88"></div>
      <div class="sub-name" style="color:${def.color}">${def.name}</div>
      <div class="sub-desc">${def.desc}</div>
      <div class="sub-stats">
        <span>⚡ ${def.baseSpeed}</span>
        <span>❤ ${def.baseHP}</span>
        <span>📦 ${def.baseCargo}</span>
      </div>
      ${active  ? '<div class="sub-btn" style="color:#0f8;border-color:#0f8">ACTIVE</div>'
       : owned  ? `<div class="sub-btn sub-btn-select" data-sub="${id}">SELECT</div>`
       : `<div class="sub-btn sub-btn-buy" data-sub="${id}" data-cost="${def.cost}">BUY — ${def.cost.toLocaleString()} coins</div>`}
    `;
    garageEl.appendChild(card);
  }
  garageEl.querySelectorAll('.sub-btn-select').forEach(btn =>
    btn.addEventListener('click', () => { state.garage.active = btn.dataset.sub; showUpgradeScreen(); })
  );
  garageEl.querySelectorAll('.sub-btn-buy').forEach(btn => {
    const cost = parseInt(btn.dataset.cost);
    btn.style.opacity = state.coins >= cost ? '1' : '0.4';
    if (state.coins >= cost) btn.addEventListener('click', () => {
      if (state.coins >= cost) {
        state.coins -= cost;
        state.garage.owned.push(btn.dataset.sub);
        state.garage.active = btn.dataset.sub;
        showUpgradeScreen();
      }
    });
  });

  // ── Consumables ──
  const canCount = state.fuelCanisters;
  document.getElementById('canister-count-shop').textContent =
    `${canCount}/10 canisters [F]  ·  ${state.teleporters}/5 teleporters [T]`;
  const buyCanBtn = document.getElementById('buy-canister-btn');
  buyCanBtn.disabled = state.coins < 25 || canCount >= 10;
  buyCanBtn.onclick = () => { if (state.coins >= 25 && canCount < 10) { state.coins -= 25; state.fuelCanisters++; showUpgradeScreen(); } };
  const buyTpBtn = document.getElementById('buy-teleporter-btn');
  if (buyTpBtn) {
    buyTpBtn.disabled = state.coins < 200 || state.teleporters >= 5;
    buyTpBtn.onclick = () => { if (state.coins >= 200 && state.teleporters < 5) { state.coins -= 200; state.teleporters++; showUpgradeScreen(); } };
  }

  // ── Upgrade cards (cost adjusted for active sub's upgMult) ──
  const upgMult = getSubDef().upgMult;
  const grid = document.getElementById('upgrades-grid');
  grid.innerHTML = `<div style="grid-column:1/-1;font-size:11px;color:#468;margin-bottom:4px">
    Upgrading: <b style="color:${getSubDef().color}">${getSubDef().name}</b>
    ${upgMult > 1 ? `<span style="color:#f80">(costs ×${upgMult})</span>` : ''}
  </div>`;
  for (const def of UPGRADE_DEFS) {
    const upg = getSubUpgrades();
    const level = upg[def.id] || 0;
    const maxed = level >= def.maxLevel;
    const cost  = maxed ? 0 : Math.round(def.costs[level] * upgMult);
    const canAfford = state.coins >= cost;

    const dots = Array.from({ length: def.maxLevel }, (_, i) =>
      `<span style="color:${i < level ? '#0f8' : '#1a3a28'};font-size:16px">●</span>`
    ).join('&thinsp;');

    // Progress bar width
    const pct = maxed ? 100 : Math.round((level / def.maxLevel) * 100);

    const card = document.createElement('div');
    card.className = 'upgrade-card' + (maxed ? ' maxed' : !canAfford ? ' cant-afford' : '');
    card.innerHTML = `
      <h3>${def.name}</h3>
      <div class="upgrade-dots">${dots}</div>
      <div class="upgrade-bar-track"><div class="upgrade-bar-fill" style="width:${pct}%"></div></div>
      <div class="level-text">Level ${level} / ${def.maxLevel}</div>
      ${maxed
        ? '<div class="cost" style="color:#0f8;font-size:12px">✓ MAXED</div>'
        : `<div class="cost">${cost} coins</div>`}
      <div class="effect">${def.desc}</div>
    `;
    if (!maxed && canAfford) {
      card.addEventListener('click', () => {
        state.coins -= cost;
        const upg = getSubUpgrades();
        upg[def.id] = (upg[def.id] || 0) + 1;
        showUpgradeScreen();
      });
    }
    grid.appendChild(card);
  }

  document.getElementById('save-btn').onclick = saveGame;
  document.getElementById('dive-btn').onclick = startDive;
  document.getElementById('upgrade-screen').style.display = 'flex';
}

function startDive() {
  document.getElementById('screen-overlay').style.display = 'none';
  document.getElementById('upgrade-screen').style.display = 'none';
  document.getElementById('pause-overlay').style.display = 'none';
  document.getElementById('pause-btn').textContent = '⏸ PAUSE';
  isPaused = false;
  initAmbient(); // safe to call multiple times — only initialises once
  generateWorld();
  resetSub();
  state.phase = 'playing';
  showMessage('WASD/Arrows: move  |  Space/Z: fire torpedoes');
}

function showTitle() {
  document.getElementById('overlay-title').textContent = 'DEEP SEA EXPLORER';
  document.getElementById('overlay-body').innerHTML = `
    <p>Dive into the abyss — collect treasure — return to sell</p>
    <p style="color:#f84;margin-top:8px">⚠ Giant Squids lurk below 400m</p>
    <p style="margin-top:14px;color:#8cf">WASD / Arrows — Move submarine</p>
    <p style="color:#8cf">Space / Z — Fire Torpedoes &nbsp;|&nbsp; F — Use Fuel Canister</p>
    <p style="color:#8cf">Surface with cargo to sell &amp; upgrade</p>
    <p style="color:#fd0;margin-top:8px">Watch your FUEL — deeper burns more!</p>
  `;

  const btn1 = document.getElementById('overlay-btn');
  const btn2 = document.getElementById('overlay-btn2');

  if (hasSaveData()) {
    btn1.textContent = 'CONTINUE';
    btn1.style.background = '#0f8';
    btn1.onclick = () => {
      loadSave();
      document.getElementById('screen-overlay').style.display = 'none';
      showUpgradeScreen();
    };
    btn2.style.display = 'block';
    btn2.textContent = 'NEW GAME';
    btn2.onclick = () => {
      if (confirm('Start a new game? Your saved progress will be deleted.')) {
        resetProgress();
        document.getElementById('screen-overlay').style.display = 'none';
        startDive();
      }
    };
  } else {
    btn1.textContent = 'NEW GAME';
    btn1.style.background = '#0af';
    btn1.onclick = startDive;
    btn2.style.display = 'none';
  }

  document.getElementById('screen-overlay').style.display = 'flex';
}

// ─── Main loop ────────────────────────────────────────────────────────────────
let tick = 0;
function loop() {
  requestAnimationFrame(loop);
  tick++;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  if (state.phase === 'playing' || state.phase === 'dead') {
    if (!isPaused) {
      updateCamera();
      updateBubbles(); updateParticles(); updateFloatingTexts();
      if (state.phase === 'playing') {
        updateSub(); updateTorpedoes(); updateSquids(); updateBoss(); updateTreasures();
        if (tick % 120 === 0) updateAmbientDepth(Math.max(0,(sub.y-60)/PIXELS_PER_METRE));
      }
    }
    drawBackground();
    drawFloor();
    drawBubbles();
    drawShipwrecks();
    drawTreasures(tick);
    drawTorpedoes();
    drawSquids(tick);
    drawBoss(tick);
    drawSub(tick);
    drawParticles();
    drawDarkness();
    drawFloatingTexts();
    drawDepthLine();
    updateHUD();
  } else {
    ctx.fillStyle = '#000a18';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    updateBubbles(); drawBubbles();
  }
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.getElementById('pause-btn').addEventListener('click', togglePause);

for (let i = 0; i < 80; i++) {
  bubbles.push({ x: rand(0, CANVAS_W), y: rand(0, CANVAS_H*3), r: rand(1,4), speed: rand(0.3,1.2), alpha: rand(0.1,0.4) });
}
showTitle();
loop();
