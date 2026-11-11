/* Make Yourself at Home — prototype core.
 * Pure simulation: no DOM, no audio, no Math.random. Runs in the browser (window.MYAH)
 * and in Node (require) so the branching story state can be tested headlessly.
 * Rendering lives in render.js, input/UI in main.js, sound in audio.js.
 */
(function (root) {
  'use strict';

  const SAVE_VERSION = 1;

  // ---------------------------------------------------------------- tuning
  const T = {
    playerSpeed: 225, carryMul: 0.6, playerR: 13, maxHp: 100,
    light: { startup: 0.05, active: 0.09, recovery: 0.16, range: 50, arc: 2.0, dmg: [9, 9, 15], knock: [190, 190, 360], lunge: 150 },
    heavy: { startup: 0.3, active: 0.1, recovery: 0.34, range: 66, arc: 2.8, dmg: 30, knock: 500, lunge: 280 },
    dodge: { dur: 0.2, carryDur: 0.13, speed: 560, carrySpeed: 440, iframes: 0.26, cooldown: 0.34 },
    hurtInv: 0.8,
    testSong: 6, defendTime: 42, shiftPreserve: 16, shiftDestroy: 8,
    tapMax: 0.25,
  };
  const ED = {
    dancer: { r: 15, hp: 40, speed: 118, slowSpeed: 72, windup: 0.55, slowWindup: 0.85, reach: 62, spinR: 56, spinT: 0.22, recover: 0.6, dmg: 12 },
    bear: { r: 17, hp: 50, speed: 92, slowSpeed: 55, aim: 0.7, slowAim: 1.05, chargeSpeed: 430, slowChargeSpeed: 300, chargeT: 0.42, recover: 0.75, dmg: 10, pedDmg: 12, range: 190 },
    popper: { r: 13, hp: 24, speed: 70, cd: 3.0, flight: 1.0, splash: 36, dmg: 8 },
  };

  // ---------------------------------------------------------------- helpers
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const R = (x, y, w, h, extra) => Object.assign({ x, y, w, h }, extra || {});
  function norm(x, y) { const l = Math.hypot(x, y); return l > 1e-6 ? { x: x / l, y: y / l, l } : { x: 0, y: 0, l: 0 }; }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function angDiff(a, b) { let d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return Math.abs(d); }
  function rand(g) { // mulberry32, deterministic per game
    let t = (g.seed = (g.seed + 0x6D2B79F5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const clone = (o) => JSON.parse(JSON.stringify(o));

  // ---------------------------------------------------------------- maps
  // Jellybean Junction: four connected rooms. Walls are rects; horizontal walls are
  // thick so their front faces read as walls in the 3/4 drawing.
  const LOC = {
    name: 'Jellybean Junction', w: 1400, h: 900,
    rooms: [
      { id: 'lobby', name: 'Lobby', x: 20, y: 56, w: 530, h: 384 },
      { id: 'party', name: 'Party Room', x: 570, y: 56, w: 810, h: 484 },
      { id: 'disposal', name: 'Disposal Room', x: 20, y: 480, w: 530, h: 400 },
      { id: 'service', name: 'Service Route', x: 570, y: 580, w: 810, h: 120 },
    ],
    walls: [
      R(0, 0, 1400, 56), R(0, 0, 20, 900), R(1380, 0, 20, 700), R(0, 880, 560, 20),
      R(550, 0, 20, 170), R(550, 270, 20, 330), R(550, 680, 20, 220),
      R(20, 440, 360, 40), R(460, 440, 90, 40),
      R(570, 540, 50, 40), R(700, 540, 680, 40),
      R(560, 700, 840, 200),
    ],
    solids: [
      R(180, 100, 170, 40, { kind: 'desk' }),
      R(26, 66, 40, 86, { kind: 'coats' }),
      R(620, 110, 100, 46, { kind: 'table' }),
      R(1000, 110, 100, 46, { kind: 'table' }),
      R(620, 330, 100, 46, { kind: 'table' }),
      R(1100, 400, 80, 36, { kind: 'sounddesk' }),
      R(46, 770, 150, 96, { kind: 'crusher' }),
      R(440, 800, 64, 60, { kind: 'bins' }),
    ],
    doors: [ // gaps between rooms, with an approach point on each side (for navigation)
      { a: 'lobby', b: 'party', x: 560, y: 220, pa: { x: 522, y: 220 }, pb: { x: 600, y: 220 } },
      { a: 'party', b: 'service', x: 660, y: 560, pa: { x: 660, y: 515 }, pb: { x: 660, y: 610 } },
      { a: 'lobby', b: 'disposal', x: 420, y: 460, pa: { x: 420, y: 418 }, pb: { x: 420, y: 505 } },
      { a: 'disposal', b: 'service', x: 560, y: 640, pa: { x: 522, y: 640 }, pb: { x: 600, y: 640 } },
    ],
    hatches: { // where the impossible kitchen hatch opens, per room (on a wall face)
      lobby: R(380, 6, 130, 46), party: R(1050, 6, 130, 46),
      service: R(880, 542, 130, 36), disposal: R(110, 442, 130, 36),
    },
    exit: { x: 40, y: 340 },
    pedestal: { x: 930, y: 300 },
    soundDesk: { x: 1140, y: 418 },
    crusher: { x: 121, y: 748 },
    guestExit: { x: 1262, y: 60 },
    banner: R(760, 10, 280, 38),
    stage: R(1200, 90, 180, 330),
    dock: R(740, 432, 180, 60),
    curtain: R(620, 540, 80, 40),
    panel: { dock: { x: 990, y: 690 }, dance: { x: 1070, y: 690 } },
  };
  const NEXT_ROOM = {
    lobby: { party: 'party', disposal: 'disposal', service: 'party' },
    party: { lobby: 'lobby', service: 'service', disposal: 'lobby' },
    disposal: { lobby: 'lobby', service: 'service', party: 'service' },
    service: { party: 'party', disposal: 'disposal', lobby: 'party' },
  };
  const HOME = {
    name: 'Home', w: 960, h: 600,
    rooms: [{ id: 'home', name: 'Home', x: 20, y: 64, w: 920, h: 516 }],
    walls: [R(0, 0, 960, 64), R(0, 0, 20, 600), R(940, 0, 20, 600), R(0, 580, 960, 20)],
    solids: [
      R(40, 64, 320, 36, { kind: 'counter' }),
      R(200, 330, 160, 70, { kind: 'dinner' }),
      R(560, 440, 220, 50, { kind: 'sofa' }),
    ],
    doors: [], hatches: {},
    frontDoor: { x: 925, y: 300 },
    shelf: { x: 500, y: 96 },
    table: { x: 280, y: 365 },
  };

  const PROPS = [
    { id: 'bl1', kind: 'balloon', x: 90, y: 200, c: '#f7a8c4' },
    { id: 'bl2', kind: 'balloon', x: 470, y: 90, c: '#a8d8f7' },
    { id: 'bl3', kind: 'balloon', x: 1350, y: 100, c: '#ffe08a' },
    { id: 'bl4', kind: 'balloon', x: 1170, y: 80, c: '#c9b2f2' },
    { id: 'bl5', kind: 'balloon', x: 1350, y: 480, c: '#9fe3c4' },
    { id: 'bl6', kind: 'balloon', x: 840, y: 90, c: '#f7a8c4' },
    { id: 'bl7', kind: 'balloon', x: 330, y: 400, c: '#ffe08a' },
    { id: 'bl8', kind: 'balloon', x: 300, y: 560, c: '#a8d8f7' },
    { id: 'ck1', kind: 'cake', x: 670, y: 130, c: '#f6b6c9' },
    { id: 'ck2', kind: 'cake', x: 1050, y: 130, c: '#c9e8b8' },
    { id: 'ck3', kind: 'cake', x: 670, y: 350, c: '#fde2a7' },
  ];
  const GUESTS = [
    [640, 180], [700, 186], [612, 100], [728, 96], [990, 178], [1060, 184], [1112, 120], [640, 400], [705, 404], [600, 300],
  ];
  const GUEST_COLORS = ['#f4a7a3', '#9ecfe8', '#ffd58a', '#b8e0a8', '#d4b8f0', '#f7b9d7'];
  const DANCER_POSTS = [['d1', 700, 250], ['d2', 1080, 200], ['d3', 960, 480], ['d4', 500, 140], ['d5', 500, 300]];
  const BEAR_DOCK = [['k1', 770, 462], ['k2', 830, 462], ['k3', 890, 462]];

  function roomAt(map, x, y) {
    if (map === HOME) return 'home';
    if (x < 560) return y < 460 ? 'lobby' : 'disposal';
    return y < 560 ? 'party' : 'service';
  }
  function roomName(map, id) { const r = map.rooms.find((q) => q.id === id); return r ? r.name : ''; }

  // ---------------------------------------------------------------- persistent state
  function freshPersist() {
    return {
      v: SAVE_VERSION, stage: 'intro', commit: null, outcome: null, recording: 'pedestal',
      prep: { tested: false, serviceFound: false, cut: null },
      talked: {}, seen: {}, journal: [], decals: [], broken: {}, dead: {},
      guestsGone: false, shiftSeen: false, attempts: 0, encSnap: null,
    };
  }

  function createGame(persist, seed) {
    const g = {
      p: persist || freshPersist(), seed: seed || 1234567,
      events: [], captions: [], caption: null, dialogue: null, time: 0, hitstop: 0, shake: 0,
      particles: [], shots: [], enemies: [], npcs: [], props: [], guests: [], poofs: [],
      focus: null, hold: null, down: null, music: { on: false, mode: null, t: 0 }, voice: 'pip',
      hatch: null, enc: null, barkT: {}, player: null,
    };
    enterScene(g);
    return g;
  }

  function serialize(g) { return JSON.stringify(g.p); }
  function loadGame(json, seed) {
    try {
      const p = typeof json === 'string' ? JSON.parse(json) : json;
      if (!p || p.v !== SAVE_VERSION || typeof p.stage !== 'string') return null;
      return createGame(Object.assign(freshPersist(), p), seed);
    } catch (e) { return null; }
  }
  function emit(g, type, data) { g.events.push(Object.assign({ type }, data || {})); }
  function save(g) { emit(g, 'save'); }

  function note(g, kind, text) {
    if (g.p.journal.some((j) => j.text === text)) return;
    g.p.journal.push({ kind, text });
    emit(g, 'journal');
  }
  function say(g, lines, after) { g.dialogue = { lines, i: 0, after: after || null }; g.hold = null; emit(g, 'dialogue'); }
  function caption(g, who, text, dur) { g.captions.push({ who: who || '', text, t: dur || 3.4 }); }
  function bark(g, key, who, text, cd) {
    if ((g.barkT[key] || -99) > g.time - (cd || 4)) return;
    g.barkT[key] = g.time; caption(g, who, text, 2.6);
  }
  function advanceDialogue(g) {
    const d = g.dialogue; if (!d) return;
    d.i++;
    if (d.i >= d.lines.length) { g.dialogue = null; if (d.after) d.after(g); }
  }
  function skipDialogue(g) {
    const d = g.dialogue; if (!d) return;
    g.dialogue = null; if (d.after) d.after(g);
  }

  // ---------------------------------------------------------------- scenes
  function newPlayer(x, y) {
    return {
      x, y, r: T.playerR, vx: 0, vy: 0, face: { x: 1, y: 0 }, hp: T.maxHp, maxHp: T.maxHp,
      state: 'free', t: 0, kind: null, phase: null, combo: 0, comboT: 0, buffer: null, bufferT: 0, dodgeBuf: 0,
      inv: 0, iframe: 0, dodgeCd: 0, dx: 1, dy: 0, kvx: 0, kvy: 0, hitSet: null, walkT: 0, pendingAim: null,
    };
  }
  const HOME_STAGES = ['intro', 'home_after', 'home_final', 'end'];

  function enterScene(g, spawn) {
    const p = g.p;
    g.particles = []; g.shots = []; g.captions = []; g.caption = null; g.hatch = null; g.enc = null;
    g.down = null; g.hold = null; g.poofs = []; g.music = { on: false, mode: null, t: 0 }; g.voice = 'pip';
    if (HOME_STAGES.includes(p.stage)) buildHome(g, spawn); else buildLocation(g, spawn);
    g.lastRoom = roomAt(g.map, g.player.x, g.player.y);
  }

  function buildHome(g, spawn) {
    g.scene = 'home'; g.map = HOME;
    g.solids = HOME.walls.concat(HOME.solids);
    g.npcs = [
      { id: 'mara', kind: 'mara', name: 'Mara', x: 300, y: 200, r: 14 },
      { id: 'tobi', kind: 'tobi', name: 'Tobi', x: 670, y: 405, r: 14 },
    ];
    g.circles = g.npcs.slice();
    g.ped = null; g.props = []; g.guests = []; g.enemies = [];
    const s = spawn || (g.p.stage === 'intro' ? { x: 480, y: 330 } : { x: 860, y: 300 });
    g.player = newPlayer(s.x, s.y);
    if (g.p.stage === 'home_after' || g.p.stage === 'home_final') {
      if (g.p.outcome === 'preserve') { g.music = { on: true, mode: 'home', t: 0 }; g.voice = 'you'; }
    }
  }

  function buildLocation(g, spawn) {
    const p = g.p;
    g.scene = 'location'; g.map = LOC;
    g.solids = LOC.walls.concat(LOC.solids);
    g.ped = { x: LOC.pedestal.x, y: LOC.pedestal.y, r: 20, hp: 100 };
    g.npcs = [];
    const st = p.stage;
    if (st === 'explore' || st === 'encounter' || st === 'aftermath') {
      g.npcs.push({ id: 'parent', kind: 'parent', name: 'Dana', x: 110, y: 270, r: 13 });
      g.npcs.push({ id: 'rabbit', kind: 'rabbit', name: 'The Rabbit', x: 1290, y: 250, r: 15 });
      if (st !== 'aftermath') g.npcs.push({ id: 'kid', kind: 'kid', name: 'Milo', x: 600, y: 470, r: 9 });
    } else if (st === 'revisit') {
      if (p.outcome === 'preserve') g.npcs.push({ id: 'rabbit', kind: 'rabbit', name: 'The Rabbit', x: 1290, y: 250, r: 15 });
      else g.npcs.push({ id: 'parent', kind: 'parent', name: 'Dana', x: 110, y: 270, r: 13 });
    }
    g.circles = [g.ped].concat(g.npcs);
    g.props = PROPS.filter((q) => !p.broken[q.id]).map((q) => Object.assign({ r: q.kind === 'cake' ? 14 : 12 }, q));
    g.guests = p.guestsGone ? [] : makeGuests();
    let s = spawn;
    if (!s) {
      if (st === 'aftermath') s = p.outcome === 'preserve' ? { x: 1000, y: 340 } : { x: 230, y: 720 };
      else s = { x: 75, y: 340 };
    }
    g.player = newPlayer(s.x, s.y);
    if (st === 'encounter') startEncounter(g, 'load');
    else g.enemies = calmEnemies(g);
    if (st === 'revisit' && p.outcome === 'preserve') { g.music = { on: true, mode: 'faint', t: 0 }; g.voice = 'you'; }
  }

  function makeGuests() {
    return GUESTS.map((q, i) => ({ x: q[0], y: q[1], hx: q[0], hy: q[1], c: GUEST_COLORS[i % GUEST_COLORS.length], hat: GUEST_COLORS[(i + 3) % GUEST_COLORS.length], state: 'seated', bob: i * 0.7 }));
  }

  function mkEnemy(id, type, x, y, extra) {
    const D = ED[type];
    return Object.assign({ id, type, x, y, r: D.r, hp: D.hp, maxHp: D.hp, home: { x, y }, state: 'idle', t: 0, wake: 0,
      kvx: 0, kvy: 0, flash: 0, face: { x: 0, y: 1 }, dx: 0, dy: 1, cd: 0, slow: false, dark: false, spent: false, dead: false, walk: 0 }, extra || {});
  }

  function calmEnemies(g) {
    const p = g.p, out = [];
    for (const [id, x, y] of DANCER_POSTS) if (!p.dead[id]) out.push(mkEnemy(id, 'dancer', x, y, { state: 'post' }));
    for (const [id, x, y] of BEAR_DOCK) if (!p.dead[id]) {
      const dark = p.stage === 'revisit' || (p.stage === 'aftermath' && p.outcome === 'preserve');
      out.push(mkEnemy(id, 'bear', x, y, { state: dark ? 'dark' : 'dock', dark, spent: dark }));
    }
    return out;
  }

  function encounterEnemies(g) {
    const p = g.p, out = [];
    const secCut = p.prep.cut === 'dance', dockCut = p.prep.cut === 'dock';
    for (const [id, x, y] of DANCER_POSTS) {
      if (p.dead[id]) continue;
      const lobbyGuard = id === 'd4' || id === 'd5';
      out.push(mkEnemy(id, 'dancer', x, y, { wake: 1.0, slow: secCut, dark: secCut && lobbyGuard && p.commit === 'destroy', state: 'post' }));
    }
    for (const [id, x, y] of BEAR_DOCK) {
      if (p.dead[id]) continue;
      out.push(mkEnemy(id, 'bear', x, y, { wake: 1.2, slow: dockCut, state: 'dock' }));
    }
    if (p.commit === 'preserve') out.push(mkEnemy('p1', 'popper', 1290, 470, { wake: 1.5, cd: 1.0 }));
    else {
      out.push(mkEnemy('p1', 'popper', 1250, 640, { wake: 1.5, cd: 0.8 }));
      out.push(mkEnemy('p2', 'popper', 250, 380, { wake: 1.5, cd: 0.8 }));
    }
    return out;
  }

  // ---------------------------------------------------------------- encounter flow
  function snapshot(p) { return { decals: clone(p.decals), broken: clone(p.broken), dead: clone(p.dead) }; }

  function commitPreserve(g) {
    const p = g.p;
    if (p.stage !== 'explore') return;
    p.commit = 'preserve'; p.stage = 'encounter'; p.encSnap = snapshot(p);
    note(g, 'did', 'Left the recording playing at the sound desk and stayed to defend it.');
    startEncounter(g, 'commit');
  }
  function commitDestroy(g) {
    const p = g.p;
    if (p.stage !== 'explore') return;
    p.commit = 'destroy'; p.stage = 'encounter'; p.encSnap = snapshot(p);
    note(g, 'did', 'Took the recording off its pedestal to destroy it.');
    startEncounter(g, 'commit');
  }

  function startEncounter(g, mode) {
    const p = g.p;
    if (mode !== 'commit' && p.encSnap) {
      p.decals = clone(p.encSnap.decals); p.broken = clone(p.encSnap.broken); p.dead = clone(p.encSnap.dead);
      g.props = PROPS.filter((q) => !p.broken[q.id]).map((q) => Object.assign({ r: q.kind === 'cake' ? 14 : 12 }, q));
    }
    if (mode === 'retry') p.attempts++;
    g.enc = { t: 0, shifted: false, waves: {}, mode };
    g.ped.hp = 100; g.shots = []; g.down = null; g.hatch = null; g.voice = 'pip'; g.hold = null; g.poofs = [];
    g.captions = []; g.caption = null;
    g.guests = makeGuests();
    if (p.commit === 'preserve') { g.music = { on: true, mode: 'loop', t: 0 }; p.recording = 'pedestal'; }
    else { g.music = { on: false, mode: null, t: 0 }; p.recording = 'carried'; }
    if (mode !== 'commit') {
      g.player = p.commit === 'preserve' ? newPlayer(1010, 350) : newPlayer(930, 345);
    } else {
      g.player.hp = g.player.maxHp; g.player.state = 'free'; g.player.inv = 0;
    }
    g.enemies = encounterEnemies(g);
    if (p.commit === 'preserve') {
      caption(g, '', 'The song fills the room. The party exit swings open. The cake bears climb off their dock.', 3.6);
      caption(g, 'The Rabbit', 'Keep them off it until the guests are out!', 3);
    } else {
      caption(g, '', 'The music cuts out. Every security dancer turns to look at you.', 3.4);
      caption(g, 'Security dancer', 'Please return the birthday recording!', 2.6);
    }
    emit(g, 'encounter', { mode });
    save(g);
  }

  function retryEncounter(g) {
    if (g.p.stage !== 'encounter') return;
    startEncounter(g, 'retry');
  }

  function triggerShift(g) {
    const p = g.p, P = g.player;
    g.enc.shifted = true; p.shiftSeen = true; g.voice = 'you';
    g.hatch = { room: roomAt(g.map, P.x, P.y), t: 0 };
    const rn = roomName(LOC, g.hatch.room).toLowerCase();
    emit(g, 'shift');
    g.shake = Math.max(g.shake, 3);
    caption(g, 'Mara (through the wall)', 'Wren? Are you nearly done? The candles are going soft.', 3.6);
    if (p.commit === 'preserve') {
      caption(g, 'The recording', '♪ …and the candles are all for you, Wren… ♪  It is your voice now.', 3.6);
      caption(g, '', 'The security dancers keep swaying to the song, exactly as before.', 3.2);
    } else {
      caption(g, 'The recording (your voice)', 'Don\'t. It\'s me. I\'m in here.', 3.4);
      caption(g, '', 'No song is playing, so the dancers still want it back.', 3.2);
    }
    note(g, 'did', `Saw our kitchen through the ${rn} wall. Mara was in it, lighting candles.`);
    note(g, 'did', 'The party banner changed from PIP to WREN.');
    note(g, 'did', p.commit === 'preserve' ? 'Mid-fight, the recording was singing in my voice.' : 'Mid-fight, the recording spoke to me in my own voice.');
  }

  function winPreserve(g) {
    const p = g.p;
    g.music = { on: false, mode: null, t: 0 };
    p.stage = 'aftermath'; p.outcome = 'preserve'; p.guestsGone = true; p.recording = 'pedestal';
    for (const e of g.enemies) {
      if (e.type === 'bear') { e.spent = true; e.state = 'spent'; }
      if (e.type === 'popper') { killEnemy(g, e, true); }
      if (e.type === 'dancer') { e.state = 'post'; e.wake = 0; }
    }
    g.enemies = g.enemies.filter((e) => !e.dead);
    g.shots = []; g.guests = [];
    note(g, 'did', 'Kept the song playing to the end. The guests walked out of the party exit. The cake bears stopped when it ended.');
    caption(g, '', 'The song ends. The cake bears sit down where they stand.', 3.2);
    caption(g, 'The Rabbit', 'They\'re out. All of them. Take it home, Wren. Please.', 3.2);
    emit(g, 'win', { outcome: 'preserve' });
    save(g);
  }

  function winDestroy(g) {
    const p = g.p;
    p.stage = 'aftermath'; p.outcome = 'destroy'; p.guestsGone = true; p.recording = 'shards';
    const c = LOC.crusher;
    burst(g, c.x, c.y + 20, 40, ['#8fd3ff', '#ffffff', '#c9b2f2', '#ffe08a'], 260, 4);
    addDecal(g, c.x + 40, c.y - 20, 22, '#c9b2f2');
    for (const e of g.enemies) {
      if (e.type === 'popper') killEnemy(g, e, true);
      if (e.type === 'dancer') { e.state = 'post'; e.wake = 0; e.dark = false; }
    }
    g.enemies = g.enemies.filter((e) => !e.dead);
    g.shots = []; g.guests = []; g.shake = 8; g.hitstop = 0.12;
    emit(g, 'sfx', { name: 'crush' });
    note(g, 'did', 'Fed the recording into the crusher. Pocketed a handful of warm shards.');
    caption(g, '', 'Crunch. The dancers stop mid-step, bow, and wander back to their posts.', 3.4);
    caption(g, '', 'Somewhere a door opens. Small footsteps run for home.', 3.2);
    emit(g, 'win', { outcome: 'destroy' });
    save(g);
  }

  function takeHome(g) {
    const p = g.p;
    if (p.stage !== 'aftermath' || p.outcome !== 'preserve' || p.recording !== 'pedestal') return;
    p.recording = 'held';
    note(g, 'did', 'Took the recording off the pedestal after the song ended, to bring it home.');
    caption(g, '', 'You tuck the recording under your arm. It is warm.', 2.6);
    emit(g, 'sfx', { name: 'pickup' });
    save(g);
  }

  function goHome(g) {
    const p = g.p;
    if (p.stage === 'aftermath') {
      if (p.recording === 'held') p.recording = 'shelf';
      p.stage = 'home_after';
    } else if (p.stage === 'revisit') {
      p.stage = 'home_final';
    } else return;
    enterScene(g);
    emit(g, 'scene', { scene: 'home' });
    save(g);
  }

  function goLocation(g) {
    const p = g.p;
    if (p.stage === 'intro') p.stage = 'explore';
    else if (p.stage === 'home_after') p.stage = 'revisit';
    else return;
    enterScene(g);
    emit(g, 'scene', { scene: 'location' });
    if (p.stage === 'revisit') caption(g, '', 'Jellybean Junction, a week later. Nobody has cleaned up.', 3.2);
    else caption(g, '', 'Jellybean Junction. It smells of icing and floor polish.', 3);
    save(g);
  }

  function endGame(g) {
    g.p.stage = 'end';
    note(g, 'did', 'Sat down to dinner at home.');
    emit(g, 'end'); save(g);
  }

  function resetAll(g) {
    g.p = freshPersist(); g.dialogue = null; g.barkT = {};
    enterScene(g); emit(g, 'reset'); save(g);
  }
  function replayAssignment(g) {
    g.p = freshPersist(); g.p.stage = 'explore'; g.p.talked.mara = true; g.p.talked.tobi = true;
    g.p.journal.push({ kind: 'told', text: 'Mara: bring the birthday recording home. "It\'s a little song."' });
    g.p.journal.push({ kind: 'told', text: 'Tobi: cleared the shelf "for the recording, or the pieces".' });
    g.dialogue = null; g.barkT = {};
    enterScene(g); emit(g, 'reset'); emit(g, 'scene', { scene: 'location' });
    caption(g, '', 'Jellybean Junction again. Everything is exactly where it was.', 3);
    save(g);
  }

  // ---------------------------------------------------------------- dialogue content
  function talk(g, who) {
    const p = g.p, st = p.stage, t = p.talked;
    const L = (name, text) => ({ who: name, text });
    switch (who) {
      case 'mara':
        if (st === 'intro') {
          if (!t.mara) {
            t.mara = true;
            say(g, [
              L('Mara', 'Wren! There you are. Tea\'s brewing. No, don\'t sit down yet.'),
              L('Mara', 'Jellybean Junction is holding a birthday recording for us. Pop over and bring it home?'),
              L('Mara', 'They might make it sound complicated. It isn\'t. It\'s a little song.'),
            ], () => { note(g, 'told', 'Mara: bring the birthday recording home. "It\'s a little song."'); save(g); });
          } else say(g, [L('Mara', 'Front door, love. The recording. Off you go.')]);
        } else if (st === 'home_after') {
          t.mara2 = true;
          if (p.outcome === 'preserve') say(g, [
            L('Mara', 'You brought it home! Oh, and it\'s already playing.'),
            L('Mara', 'That\'s your voice, you know. You sang that at your seventh birthday. I recorded it right here, on the kitchen tape deck.'),
            L('Mara', 'Pip? I don\'t know a Pip.'),
          ], () => { note(g, 'told', 'Mara: it is MY voice, recorded in our kitchen at my seventh birthday. She has never heard of Pip.'); save(g); });
          else say(g, [
            L('Mara', 'Oh. The bits. Well. It was probably for the best.'),
            L('Mara', 'You did that once before, you know. Smashed it on this very floor at your seventh birthday. I swept for a week.'),
          ], () => { note(g, 'told', 'Mara: I already smashed this recording once, on our kitchen floor, at my seventh birthday.'); save(g); });
        } else if (st === 'home_final') {
          say(g, [L('Mara', p.outcome === 'preserve' ? 'It\'s been playing all afternoon. I don\'t mind. It\'s a nice voice.' : 'Did you put the shards somewhere? They keep turning up in the cutlery drawer.'),
            L('Mara', 'Dinner\'s ready. Sit, sit.')]);
        } else say(g, [L('Mara', 'Mm?')]);
        break;
      case 'tobi':
        if (st === 'intro') {
          t.tobi = true;
          say(g, [
            L('Tobi', 'I cleared a space on the shelf. For the recording. Or for the pieces. Whichever.'),
            L('Tobi', 'You\'re good at those places. You always know what to do.'),
          ], () => { note(g, 'told', 'Tobi: cleared the shelf "for the recording, or the pieces".'); save(g); });
        } else if (st === 'home_after') {
          t.tobi2 = true;
          say(g, p.outcome === 'preserve' ? [
            L('Tobi', 'It sounds like you. Is that weird? That\'s weird.'),
            L('Tobi', 'Your party\'s tomorrow, by the way. I\'ve bought candles. Seven.'),
          ] : [
            L('Tobi', 'The pieces were warm when I put them in the jar. Are they meant to be warm?'),
            L('Tobi', 'Your party\'s tomorrow, by the way. Should I still get candles?'),
          ], () => { note(g, 'told', 'Tobi: my birthday party is tomorrow.'); save(g); });
        } else if (st === 'home_final') {
          say(g, [L('Tobi', 'Party\'s tomorrow. Don\'t forget. Seven candles.')]);
        } else say(g, [L('Tobi', 'Hm?')]);
        break;
      case 'parent':
        if (st === 'explore') {
          if (!t.parent) {
            t.parent = true;
            say(g, [
              L('Dana (a parent)', 'Oh. It\'s you. You booked this party. Your name is on the form at the desk.'),
              L('Dana (a parent)', 'That recording on the pedestal. While it plays, nobody leaves. My son has been eight for a very long time.'),
              L('Dana (a parent)', 'There\'s a cake crusher in the disposal room, through the staff door behind me. Put it in there. Please.'),
            ], () => {
              note(g, 'told', 'Dana (parent): while the song plays, nobody leaves. Destroy it in the crusher.');
              note(g, 'told', 'Dana: says I booked this party.');
              save(g);
            });
          } else say(g, [L('Dana (a parent)', 'The crusher. Staff door, then down. Before it plays again.')]);
        } else if (st === 'revisit') {
          t.parentR = true;
          say(g, [
            L('Dana', 'You came back! We crushed it together, remember? I held the lid.'),
            L('Dana', 'You said the rabbit asked you to. You were very sure about that.'),
          ], () => { note(g, 'told', 'Dana: remembers helping me crush it, "because the rabbit asked me to".'); save(g); });
        } else if (st === 'encounter') bark(g, 'parent', 'Dana', p.commit === 'destroy' ? 'Go! The crusher!' : 'Turn it off! Please!');
        else say(g, [L('Dana (a parent)', p.outcome === 'destroy' ? 'He\'s gone home. I think. Thank you.' : 'You let it play. I hope you know what you\'re doing.')]);
        break;
      case 'rabbit':
        if (st === 'explore') {
          if (!t.rabbit) {
            t.rabbit = true;
            say(g, [
              L('The Rabbit', 'WREN! You came! I told them you\'d come.'),
              L('The Rabbit', 'That\'s Pip singing on the recording. Your friend Pip. It\'s all that\'s left of them.'),
              L('The Rabbit', 'When it plays, the party exit opens. Let it play until every guest is out. Don\'t let the cake bears silence it.'),
              L('The Rabbit', 'Don\'t believe me? Try the sound desk.'),
            ], () => { note(g, 'told', 'The Rabbit: it is my friend Pip\'s voice. Keep it playing until the guests are out.'); save(g); });
          } else say(g, [L('The Rabbit', 'Tap the sound desk to hear a little. Hold it down to leave it playing.')]);
        } else if (st === 'revisit') {
          t.rabbitR = true;
          say(g, [
            L('The Rabbit', 'Back again? Good. Listen. Can you hear it?'),
            L('The Rabbit', 'You took it home. It\'s still playing here. I don\'t know which one is the copy.'),
            L('The Rabbit', 'The guests got home, though. I counted them twice.'),
          ], () => { note(g, 'told', 'The Rabbit: does not know which recording is the copy, the one at home or the one still singing here.'); save(g); });
        } else if (st === 'encounter') bark(g, 'rabbit', 'The Rabbit', p.commit === 'preserve' ? 'Keep the bears off it!' : 'Wren, no! Put it back!');
        else say(g, [L('The Rabbit', p.outcome === 'preserve' ? 'Take it home. Keep it playing.' : 'Why would you do that? Pip trusted you.')]);
        break;
      case 'kid':
        if (st === 'encounter') { bark(g, 'kid', 'Milo', 'Woooah!'); break; }
        t.kid = true;
        say(g, [
          L('Milo (a guest, 8)', 'The bunny goes behind the curtain when the cake bears need charging.'),
          L('Milo (a guest, 8)', 'There are big switches back there. I\'m not allowed.'),
        ], () => { note(g, 'told', 'Milo: the cake bears are charged from switches behind the stage curtain.'); save(g); });
        break;
    }
  }

  // ---------------------------------------------------------------- interactables
  function interactables(g) { return g.scene === 'home' ? homeInteractables(g) : locInteractables(g); }

  function npcIt(g, n, label) { return { id: n.id, x: n.x, y: n.y, r: 52, label: label || `Talk to ${n.name}`, tap: () => talk(g, n.id) }; }

  function homeInteractables(g) {
    const p = g.p, st = p.stage, L = [];
    for (const n of g.npcs) L.push(npcIt(g, n));
    L.push({ id: 'shelf', x: HOME.shelf.x, y: HOME.shelf.y, r: 64, label: 'Look at the shelf', tap: () => {
      const text = p.recording === 'shelf' ? 'The recording sits on the shelf, playing to itself. The label says PIP. You don\'t remember writing that.'
        : p.recording === 'shards' ? 'A jam jar of glittering shards. Tobi has labelled it "WREN\'S" in careful letters.'
        : 'A clean, empty spot on the shelf. There\'s a dust outline of something that used to be here.';
      say(g, [{ who: '', text }]);
    } });
    const fd = HOME.frontDoor;
    if (st === 'intro') L.push({ id: 'door', x: fd.x, y: fd.y, r: 60, label: 'Go to Jellybean Junction', tap: () => {
      if (!p.talked.mara) { bark(g, 'door', 'Mara', 'Wren! Before you go, a quick word?', 2); return; }
      goLocation(g);
    } });
    else if (st === 'home_after') L.push({ id: 'door', x: fd.x, y: fd.y, r: 60, label: 'Revisit Jellybean Junction', tap: () => goLocation(g) });
    else if (st === 'home_final') {
      L.push({ id: 'door', x: fd.x, y: fd.y, r: 60, label: 'Go out', tap: () => bark(g, 'door', 'Mara', 'Dinner first.', 2) });
      L.push({ id: 'table', x: HOME.table.x, y: HOME.table.y, r: 100, label: 'Sit down for dinner (end of prototype)', tap: () => endGame(g) });
    }
    return L;
  }

  function locInteractables(g) {
    const p = g.p, st = p.stage, L = [];
    for (const n of g.npcs) L.push(npcIt(g, n));
    const ped = LOC.pedestal, desk = LOC.soundDesk, cr = LOC.crusher, ex = LOC.exit;

    // Sound desk: tap to test, hold to commit to preserving.
    if (st === 'explore') L.push({
      id: 'desk', x: desk.x, y: desk.y, r: 58,
      label: g.music.on ? 'Playing… (listen, look around)' : 'Play a little of the recording',
      tap: () => testSong(g), hold: 1.0, holdLabel: 'Leave it playing (starts the defence)', act: () => commitPreserve(g),
    });
    else L.push({ id: 'desk', x: desk.x, y: desk.y, r: 58, label: 'Sound desk', tap: () => {
      if (st === 'encounter' && p.commit === 'preserve') bark(g, 'desk', '', 'It\'s looping. Just keep the bears off the pedestal.', 2);
      else bark(g, 'desk', '', 'The desk is silent.', 2);
    } });

    // Pedestal / recording
    if (st === 'explore') L.push({ id: 'pedestal', x: ped.x, y: ped.y, r: 56, label: 'Pedestal: a recording labelled PIP',
      hold: 0.6, holdLabel: 'Take the recording (starts the chase)', act: () => commitDestroy(g),
      tap: () => bark(g, 'pedhint', '', 'Hold E to take it. Taking it will start trouble.', 2) });
    else if (st === 'encounter' && p.commit === 'preserve') L.push({ id: 'pedestal', x: ped.x, y: ped.y, r: 56, label: 'It\'s playing. Defend it', tap: () => bark(g, 'ped', '', 'Not yet. Keep it playing until the guests are out.', 2) });
    else if (st === 'aftermath' && p.outcome === 'preserve' && p.recording === 'pedestal') L.push({ id: 'pedestal', x: ped.x, y: ped.y, r: 56, label: 'Take the recording home', tap: () => takeHome(g) });
    else if (st === 'revisit') L.push({ id: 'pedestal', x: ped.x, y: ped.y, r: 56, label: p.outcome === 'preserve' ? 'Listen at the empty pedestal' : 'Look at the pedestal', tap: () => {
      p.seen.revisitPed = true;
      if (p.outcome === 'preserve') say(g, [{ who: '', text: 'The pedestal is empty. The recording is on your shelf at home.' }, { who: '', text: 'The song is still playing from the pedestal anyway. Faint. Your voice.' }],
        () => { note(g, 'did', 'Heard the song still playing at the empty pedestal, while the recording sits on our shelf.'); save(g); });
      else say(g, [{ who: '', text: 'The recording is back on its pedestal. Whole. Not a scratch.' }, { who: '', text: 'The label reads: WREN, AGE 7. COPY 2 OF 2.' }],
        () => { note(g, 'did', 'Found the recording whole again on its pedestal: "WREN, AGE 7. COPY 2 OF 2."'); save(g); });
    } });

    // Crusher
    if (st === 'encounter' && p.commit === 'destroy') L.push({ id: 'crusher', x: cr.x, y: cr.y, r: 62, label: 'Cake crusher', hold: 0.8, holdLabel: 'Feed the recording to the crusher', act: () => winDestroy(g),
      tap: () => bark(g, 'crhint', '', 'Hold E to feed it in.', 2) });
    else L.push({ id: 'crusher', x: cr.x, y: cr.y, r: 62, label: 'Look at the cake crusher', tap: () => {
      if (st === 'aftermath' && p.outcome === 'preserve') bark(g, 'cr', '', 'You already decided. It\'s coming home.', 2);
      else if (p.outcome === 'destroy') say(g, [{ who: '', text: 'The crusher is dented where you leaned on it. Glitter in the seams.' }]);
      else say(g, [{ who: '', text: 'A cake crusher, still warm. A hand-written sign: NO RECORDINGS. Someone has crossed out NO.' }]);
    } });

    // Fuse panel (preparation): one fuse puller, two sockets.
    if (st === 'explore' && p.prep.serviceFound) {
      const pd = LOC.panel;
      L.push({ id: 'fuse-dock', x: pd.dock.x, y: pd.dock.y, r: 40, label: p.prep.cut === 'dock' ? 'Dock fuse pulled (cake bears weakened)' : 'Pull the cake-bear dock fuse', tap: () => pullFuse(g, 'dock') });
      L.push({ id: 'fuse-dance', x: pd.dance.x, y: pd.dance.y, r: 40, label: p.prep.cut === 'dance' ? 'Dance-floor fuse pulled (dancers weakened)' : 'Pull the dance-floor fuse', tap: () => pullFuse(g, 'dance') });
    } else if (p.prep.serviceFound) {
      L.push({ id: 'fuse-dock', x: (LOC.panel.dock.x + LOC.panel.dance.x) / 2, y: LOC.panel.dock.y, r: 50, label: 'Fuse panel', tap: () => bark(g, 'panel', '', p.prep.cut ? 'The fuse stays where you left it.' : 'No time for the panel now.', 2) });
    }

    // Exit
    L.push({ id: 'exit', x: ex.x, y: ex.y, r: 54, label: st === 'aftermath' || st === 'revisit' ? 'Go home' : 'Way out', tap: () => {
      if (st === 'explore') bark(g, 'exit', '', 'You came for the recording.', 2);
      else if (st === 'encounter') bark(g, 'exit', '', 'The doors locked when the music changed.', 2);
      else if (st === 'aftermath' && p.outcome === 'preserve' && p.recording !== 'held') bark(g, 'exit', '', 'The recording is still on the pedestal.', 2);
      else goHome(g);
    } });

    // Revisit-only evidence
    if (st === 'revisit' && p.outcome === 'preserve') L.push({ id: 'note', x: 110, y: 270, r: 46, label: 'Read the note on the bench', tap: () => {
      say(g, [{ who: 'A note', text: '"Thank you for helping me wreck the place. You told me you were doing it for my son. — Dana"' }],
        () => { note(g, 'told', 'Dana\'s note: thanks me for wrecking the place "for her son". I was defending the song for the rabbit.'); save(g); });
    } });
    if (st === 'revisit' && p.outcome === 'destroy') L.push({ id: 'costume', x: 1290, y: 250, r: 52, label: 'Look at the rabbit costume', tap: () => {
      say(g, [{ who: '', text: 'An empty rabbit costume, folded neatly on the stage.' }, { who: '', text: 'Your name is sewn inside the collar, in Mara\'s handwriting.' }],
        () => { note(g, 'did', 'Found the rabbit costume empty on the stage, with my name sewn into the collar.'); save(g); });
    } });
    return L;
  }

  function testSong(g) {
    if (g.music.on) return;
    g.music = { on: true, mode: 'test', t: 0 };
    g.p.prep.tested = true;
    emit(g, 'sfx', { name: 'click' });
    note(g, 'did', 'Played the song at the sound desk: the security dancers stopped and swayed, the cake bears on the dock woke up, and the party exit opened.');
    caption(g, '', 'Watch the security dancers and the cake bears…', 2.8);
    save(g);
  }

  function pullFuse(g, which) {
    const p = g.p;
    if (p.prep.cut === which) return;
    const swapped = !!p.prep.cut;
    p.prep.cut = which;
    emit(g, 'sfx', { name: 'fuse' });
    g.shake = Math.max(g.shake, 2);
    if (which === 'dock') {
      note(g, 'did', 'Pulled the fuse for the cake-bear dock. Only one fuse puller on the hook.');
      caption(g, '', swapped ? 'You move the fuse puller. The dock lights die; the dance floor hums back on.' : 'Clunk. The cake-bear dock goes dark. Low power: slow bears, no reinforcements.', 3.2);
    } else {
      note(g, 'did', 'Pulled the fuse for the dance floor. Only one fuse puller on the hook.');
      caption(g, '', swapped ? 'You move the fuse puller. The dance floor dies; the dock hums back on.' : 'Clunk. The dance floor goes dark. Low power: slow security dancers, lobby guards stay offline.', 3.2);
    }
    save(g);
  }

  // ---------------------------------------------------------------- update
  function emptyInput() {
    return { mx: 0, my: 0, light: false, heavy: false, dodge: false, interactPressed: false, interactDown: false, aim: null };
  }

  function update(g, inp, dt) {
    if (g.dialogue || g.p.stage === 'end') return; // everything holds still while reading
    g.time += dt;
    updCaptions(g, dt);
    updParticles(g, dt);
    g.shake *= Math.exp(-dt * 10);
    if (g.hitstop > 0) { g.hitstop -= dt; return; }
    if (g.down) {
      g.down.t += dt;
      if (inp.interactPressed && g.down.t > 0.6) retryEncounter(g);
      return;
    }
    updMusic(g, dt);
    updatePlayer(g, inp, dt);
    if (g.dialogue) return;
    updInteract(g, inp, dt);
    if (g.dialogue || g.p.stage === 'end') return;
    for (const e of g.enemies) if (!e.dead) updEnemy(g, e, dt);
    g.enemies = g.enemies.filter((e) => !e.dead);
    separate(g);
    updShots(g, dt);
    updGuests(g, dt);
    updEncounter(g, dt);
    if (g.hatch) g.hatch.t += dt;
    for (const q of g.poofs) q.t += dt;
    g.poofs = g.poofs.filter((q) => q.t < 0.6);
    const room = roomAt(g.map, g.player.x, g.player.y);
    if (room !== g.lastRoom) { g.lastRoom = room; onEnterRoom(g, room); }
  }

  function onEnterRoom(g, room) {
    const p = g.p;
    emit(g, 'room', { room });
    if (g.scene !== 'location') return;
    if (room === 'party' && !p.seen.party && p.stage === 'explore') {
      p.seen.party = true; caption(g, '', 'There it is: the recording, on a pedestal in the middle of the party.', 3);
    }
    if (room === 'service' && !p.prep.serviceFound) {
      p.prep.serviceFound = true;
      note(g, 'did', 'Found a service route behind the stage curtain: a shortcut to the disposal room, with a fuse panel.');
      caption(g, '', 'A service corridor behind the party: a shortcut to disposal, and a fuse panel.', 3.2);
      save(g);
    }
    if (room === 'disposal' && !p.seen.disposal) { p.seen.disposal = true; caption(g, '', 'The disposal room. The cake crusher hums.', 2.6); }
  }

  function updCaptions(g, dt) {
    if (!g.caption && g.captions.length) g.caption = g.captions.shift();
    if (g.caption) { g.caption.t -= dt; if (g.caption.t <= 0) g.caption = null; }
  }

  function updMusic(g, dt) {
    const m = g.music;
    m.t += dt;
    if (m.mode === 'test' && m.t >= T.testSong) {
      g.music = { on: false, mode: null, t: 0 };
      if (!g.p.talked.testDone) {
        g.p.talked.testDone = true;
        caption(g, '', 'The song stops. The dancers straighten up. The cake bears shuffle back to their dock.', 3.2);
      }
    }
  }

  // ---------------------------------------------------------------- player
  function updatePlayer(g, inp, dt) {
    const P = g.player, p = g.p;
    P.inv = Math.max(0, P.inv - dt); P.iframe = Math.max(0, P.iframe - dt);
    P.dodgeCd = Math.max(0, P.dodgeCd - dt); P.comboT = Math.max(0, P.comboT - dt);
    if (P.hp <= 0) return;
    const carrying = p.recording === 'carried';
    const mv = norm(inp.mx, inp.my);
    if (inp.light) { P.buffer = 'light'; P.bufferT = 0.22; P.pendingAim = inp.aim || null; }
    if (inp.heavy) { P.buffer = 'heavy'; P.bufferT = 0.22; P.pendingAim = inp.aim || null; }
    if (inp.dodge) P.dodgeBuf = 0.16;
    P.bufferT -= dt; P.dodgeBuf -= dt;
    if (P.bufferT <= 0) P.buffer = null;

    if (P.dodgeBuf > 0 && P.dodgeCd <= 0 && (P.state === 'free' || P.state === 'attack' || (P.state === 'hurt' && P.t > 0.12))) {
      const d = mv.l ? mv : P.face;
      P.state = 'dodge'; P.t = 0; P.dx = d.x; P.dy = d.y; P.face = { x: d.x, y: d.y };
      P.iframe = T.dodge.iframes; P.dodgeBuf = 0; P.buffer = null;
      P.dodgeCd = T.dodge.cooldown + (carrying ? T.dodge.carryDur : T.dodge.dur);
      emit(g, 'sfx', { name: 'dodge' });
    }

    switch (P.state) {
      case 'free': {
        if (P.buffer) { startAttack(g, P.buffer); break; }
        const sp = T.playerSpeed * (carrying ? T.carryMul : 1);
        P.vx = mv.x * sp; P.vy = mv.y * sp;
        if (mv.l) { P.face = { x: mv.x, y: mv.y }; P.walkT += dt * (carrying ? 7 : 11); }
        break;
      }
      case 'attack': updAttack(g, dt, mv, carrying); break;
      case 'dodge': {
        P.t += dt;
        const sp = carrying ? T.dodge.carrySpeed : T.dodge.speed;
        P.vx = P.dx * sp; P.vy = P.dy * sp;
        if (P.t >= (carrying ? T.dodge.carryDur : T.dodge.dur)) { P.state = 'free'; P.vx *= 0.3; P.vy *= 0.3; }
        break;
      }
      case 'hurt': {
        P.t += dt;
        P.vx = P.kvx; P.vy = P.kvy; P.kvx *= Math.exp(-dt * 9); P.kvy *= Math.exp(-dt * 9);
        if (P.t > 0.22) P.state = 'free';
        break;
      }
    }
    moveEnt(g, P, P.vx * dt, P.vy * dt);
  }

  function startAttack(g, kind) {
    const P = g.player;
    P.buffer = null;
    if (kind === 'heavy' && g.p.recording === 'carried') {
      bark(g, 'heavy', '', 'Both hands are full: light attacks and dodges only.', 3);
      return;
    }
    if (P.pendingAim) {
      const d = norm(P.pendingAim.x - P.x, P.pendingAim.y - P.y);
      if (d.l > 2) P.face = { x: d.x, y: d.y };
      P.pendingAim = null;
    }
    const chain = kind === 'light' && P.state === 'attack' && P.kind === 'light';
    P.combo = kind === 'light' ? (chain || P.comboT > 0 ? (P.combo % 3) + 1 : 1) : 1;
    P.state = 'attack'; P.kind = kind; P.t = 0; P.phase = 'startup'; P.hitSet = new Set();
    if (kind === 'heavy') emit(g, 'sfx', { name: 'charge' });
  }

  function updAttack(g, dt, mv, carrying) {
    const P = g.player;
    const A = P.kind === 'light' ? T.light : T.heavy;
    P.t += dt;
    const st = A.startup, ac = st + A.active, end = ac + A.recovery;
    let lunge = 0;
    if (P.t < st) { P.phase = 'startup'; lunge = P.kind === 'light' ? A.lunge * 0.4 : 0; }
    else if (P.t < ac) {
      if (P.phase !== 'active') { P.phase = 'active'; emit(g, 'sfx', { name: P.kind === 'light' ? 'swing' : 'swingHeavy' }); }
      lunge = A.lunge; doHits(g, A);
    } else {
      P.phase = 'recovery';
      if (P.t > ac + 0.03 && P.buffer === 'light' && P.kind === 'light' && P.combo < 3) { startAttack(g, 'light'); return; }
      if (P.t > ac + 0.03 && P.buffer === 'heavy' && P.kind === 'light' && !carrying) { startAttack(g, 'heavy'); return; }
    }
    const crawl = T.playerSpeed * 0.22 * (carrying ? T.carryMul : 1);
    P.vx = P.face.x * lunge + mv.x * crawl; P.vy = P.face.y * lunge + mv.y * crawl;
    if (P.t >= end) {
      P.state = 'free'; P.comboT = P.kind === 'light' && P.combo < 3 ? 0.3 : 0;
      if (P.kind !== 'light' || P.combo >= 3) P.combo = 0;
    }
  }

  function inArc(P, t, A) {
    const dx = t.x - P.x, dy = t.y - P.y, d = Math.hypot(dx, dy);
    if (d > A.range + t.r) return false;
    if (d < t.r + P.r + 4) return true;
    return angDiff(Math.atan2(dy, dx), Math.atan2(P.face.y, P.face.x)) <= A.arc / 2;
  }

  function doHits(g, A) {
    const P = g.player, heavy = P.kind === 'heavy';
    const dmg = heavy ? A.dmg : A.dmg[P.combo - 1];
    const knock = heavy ? A.knock : A.knock[P.combo - 1];
    for (const e of g.enemies) {
      if (e.dead || P.hitSet.has(e) || !inArc(P, e, A)) continue;
      P.hitSet.add(e);
      hitEnemy(g, e, dmg, knock, heavy || P.combo === 3);
    }
    for (const pr of g.props) {
      if (pr.broken || P.hitSet.has(pr) || !inArc(P, pr, A)) continue;
      P.hitSet.add(pr);
      breakProp(g, pr);
    }
    g.props = g.props.filter((q) => !q.broken);
  }

  const MATERIAL = {
    dancer: ['#3d4f8f', '#ffffff', '#ffd166', '#f4f1ea'],
    bear: ['#f7a8c4', '#e0466b', '#ffffff', '#8fd3ff', '#ffe08a'],
    popper: ['#ffd166', '#ff8fab', '#8fd3ff', '#b8f2a8'],
  };
  const SPLAT = { dancer: '#f4f1ea', bear: '#e0466b', popper: '#ffd166' };

  function hitEnemy(g, e, dmg, knock, strong) {
    const P = g.player;
    if (g.p.stage !== 'encounter') {
      bark(g, 'friendly', e.type === 'dancer' ? 'Security dancer' : '', e.type === 'dancer' ? 'No rough play before cake, please!' : 'It doesn\'t react.', 3);
      emit(g, 'sfx', { name: 'whiff' });
      return;
    }
    const d = norm(e.x - P.x, e.y - P.y);
    e.hp -= dmg; e.flash = 0.12;
    const mass = e.type === 'bear' ? 1.4 : 1;
    e.kvx = d.x * knock / mass; e.kvy = d.y * knock / mass;
    if (strong && (e.state === 'windup' || e.state === 'aim')) { e.state = 'stagger'; e.t = 0; }
    burst(g, e.x, e.y, strong ? 14 : 8, MATERIAL[e.type], strong ? 260 : 180, 3, d);
    g.hitstop = Math.max(g.hitstop, strong ? 0.085 : 0.045);
    g.shake = Math.max(g.shake, strong ? 6 : 3);
    emit(g, 'sfx', { name: strong ? 'hitHeavy' : 'hit' });
    if (e.hp <= 0) killEnemy(g, e, false);
  }

  function killEnemy(g, e, quiet) {
    e.dead = true;
    burst(g, e.x, e.y, quiet ? 14 : 30, MATERIAL[e.type], quiet ? 160 : 300, 4);
    if (!quiet) {
      addDecal(g, e.x, e.y, e.type === 'bear' ? 26 : 20, SPLAT[e.type]);
      if (e.type === 'bear') addDecal(g, e.x + 10, e.y + 6, 12, '#f7a8c4');
      if (e.type === 'dancer') addDecal(g, e.x - 6, e.y + 4, 9, '#3d4f8f');
      if (/^[dk]\d$/.test(e.id)) g.p.dead[e.id] = true;
      g.shake = Math.max(g.shake, 7);
    }
    emit(g, 'sfx', { name: 'pop' });
  }

  function breakProp(g, pr) {
    pr.broken = true; g.p.broken[pr.id] = true;
    if (pr.kind === 'balloon') { burst(g, pr.x, pr.y - 16, 16, [pr.c, '#ffffff', '#ffe08a', '#8fd3ff'], 220, 3); emit(g, 'sfx', { name: 'balloon' }); }
    else { burst(g, pr.x, pr.y, 18, [pr.c, '#ffffff', '#e0466b'], 200, 3); addDecal(g, pr.x, pr.y + 10, 18, pr.c); emit(g, 'sfx', { name: 'splat' }); }
  }

  function hurtPlayer(g, dmg, sx, sy) {
    const P = g.player;
    if (P.inv > 0 || P.iframe > 0 || P.hp <= 0 || g.down) return false;
    P.hp = Math.max(0, P.hp - dmg); P.inv = T.hurtInv;
    const d = norm(P.x - sx, P.y - sy);
    P.state = 'hurt'; P.t = 0; P.kvx = d.x * 280; P.kvy = d.y * 280; P.buffer = null;
    g.hitstop = Math.max(g.hitstop, 0.07); g.shake = Math.max(g.shake, 7);
    burst(g, P.x, P.y, 10, ['#2fa59a', '#7fd6cc', '#fff3d6'], 180, 3);
    emit(g, 'sfx', { name: 'hurt' });
    if (P.hp <= 0) {
      g.down = { t: 0, reason: 'hp' }; g.hold = null;
      emit(g, 'sfx', { name: 'down' }); emit(g, 'down', { reason: 'hp' });
    }
    return true;
  }

  function hitPedestal(g, dmg, src) {
    const ped = g.ped;
    if (!ped || ped.hp <= 0) return;
    ped.hp = Math.max(0, ped.hp - dmg);
    burst(g, ped.x, ped.y, 12, ['#c9b2f2', '#ffffff', '#8fd3ff', '#ffd166'], 200, 3);
    addDecal(g, ped.x + (src.x - ped.x) * 0.6, ped.y + (src.y - ped.y) * 0.6, 10, '#f7a8c4');
    g.shake = Math.max(g.shake, 5);
    emit(g, 'sfx', { name: 'clank' });
    if (ped.hp > 0 && ped.hp <= 40) bark(g, 'pedlow', 'The Rabbit', 'It\'s skipping! Keep them away from it!', 5);
    if (ped.hp <= 0) {
      g.music = { on: false, mode: null, t: 0 };
      g.down = { t: 0, reason: 'pedestal' }; g.hold = null;
      emit(g, 'sfx', { name: 'down' }); emit(g, 'down', { reason: 'pedestal' });
    }
  }

  // ---------------------------------------------------------------- interaction
  function nearestInteractable(g) {
    const P = g.player; let best = null, bd = 1e9;
    for (const it of interactables(g)) {
      const d = Math.hypot(it.x - P.x, it.y - P.y);
      if (d <= it.r && d < bd) { best = it; bd = d; }
    }
    return best;
  }

  function updInteract(g, inp, dt) {
    const P = g.player;
    const it = P.hp > 0 ? nearestInteractable(g) : null;
    g.focus = it;
    if (g.hold && (!it || it.id !== g.hold.id)) g.hold = null;
    if (inp.interactPressed && it) {
      if (it.hold) g.hold = { id: it.id, t: 0, p: 0 };
      else if (it.tap) { emit(g, 'sfx', { name: 'blip' }); it.tap(g); }
      return;
    }
    if (g.hold && it) {
      if (!inp.interactDown) {
        if (g.hold.t < T.tapMax && it.tap) it.tap(g);
        g.hold = null;
      } else {
        g.hold.t += dt; g.hold.p = Math.min(1, g.hold.t / it.hold);
        if (g.hold.t >= it.hold) { g.hold = null; emit(g, 'sfx', { name: 'commit' }); it.act(g); }
      }
    }
  }

  // ---------------------------------------------------------------- movement & collision
  function resolve(ent, rects, circles) {
    let hit = false;
    for (const r of rects) {
      const cx = clamp(ent.x, r.x, r.x + r.w), cy = clamp(ent.y, r.y, r.y + r.h);
      const dx = ent.x - cx, dy = ent.y - cy, d2 = dx * dx + dy * dy;
      if (d2 >= ent.r * ent.r) continue;
      hit = true;
      if (d2 > 1e-9) { const d = Math.sqrt(d2); ent.x += dx / d * (ent.r - d); ent.y += dy / d * (ent.r - d); }
      else {
        const l = ent.x - r.x, rr = r.x + r.w - ent.x, t = ent.y - r.y, b = r.y + r.h - ent.y, m = Math.min(l, rr, t, b);
        if (m === l) ent.x = r.x - ent.r; else if (m === rr) ent.x = r.x + r.w + ent.r; else if (m === t) ent.y = r.y - ent.r; else ent.y = r.y + r.h + ent.r;
      }
    }
    if (circles) for (const c of circles) {
      if (c === ent) continue;
      const dx = ent.x - c.x, dy = ent.y - c.y, d = Math.hypot(dx, dy), m = ent.r + c.r;
      if (d >= m) continue;
      hit = true;
      if (d > 1e-6) { ent.x = c.x + dx / d * m; ent.y = c.y + dy / d * m; } else ent.y = c.y + m;
    }
    return hit;
  }
  function moveEnt(g, ent, dx, dy) {
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 6));
    let hit = false;
    for (let i = 0; i < steps; i++) {
      ent.x += dx / steps; ent.y += dy / steps;
      if (resolve(ent, g.solids, g.circles)) hit = true;
      resolve(ent, g.solids, null);
    }
    return hit;
  }
  function navPoint(g, from, to) {
    if (g.scene !== 'location') return to;
    const a = roomAt(LOC, from.x, from.y), b = roomAt(LOC, to.x, to.y);
    if (a === b) return to;
    let next = NEXT_ROOM[a][b];
    if (a === 'party' && b === 'disposal' && from === g.player && g.p.prep.serviceFound) next = 'service';
    const door = LOC.doors.find((d) => (d.a === a && d.b === next) || (d.b === a && d.a === next));
    const near = door.a === a ? door.pa : door.pb, far = door.a === a ? door.pb : door.pa;
    // Inside the doorway (or right at its approach point) head through; this has no back-and-forth band.
    const inDoor = Math.hypot(from.x - door.x, from.y - door.y) < 44 || Math.hypot(from.x - near.x, from.y - near.y) < 18;
    return inDoor ? far : near;
  }
  function stepToward(g, e, target, speed, dt) {
    const tp = navPoint(g, e, target);
    const d = norm(tp.x - e.x, tp.y - e.y);
    if (d.l < 2) return;
    e.face = { x: d.x, y: d.y };
    e.walk += dt * speed * 0.08;
    moveEnt(g, e, d.x * speed * dt, d.y * speed * dt);
  }

  // ---------------------------------------------------------------- enemies
  function updEnemy(g, e, dt) {
    e.flash = Math.max(0, e.flash - dt);
    if (Math.abs(e.kvx) + Math.abs(e.kvy) > 1) {
      moveEnt(g, e, e.kvx * dt, e.kvy * dt);
      e.kvx *= Math.exp(-dt * 10); e.kvy *= Math.exp(-dt * 10);
    }
    if (e.type === 'dancer') updDancer(g, e, dt);
    else if (e.type === 'bear') updBear(g, e, dt);
    else updPopper(g, e, dt);
  }

  function updDancer(g, e, dt) {
    const D = ED.dancer, p = g.p, P = g.player;
    if (e.dark) { e.state = 'dark'; return; }
    if (g.music.on) { // the learned rule: the song always disables security dancers
      if (e.state !== 'dance') { e.state = 'dance'; e.t = 0; }
      e.t += dt; return;
    }
    if (p.stage !== 'encounter') {
      e.state = 'post';
      if (dist(e, e.home) > 4) stepToward(g, e, e.home, 60, dt);
      return;
    }
    if (e.wake > 0) { e.wake -= dt; e.state = 'alert'; return; }
    if (['post', 'dance', 'alert', 'dark'].includes(e.state)) { e.state = 'chase'; e.t = 0; }
    const d = dist(e, P);
    e.t += dt;
    switch (e.state) {
      case 'chase':
        if (d < D.reach && roomAt(LOC, e.x, e.y) === roomAt(LOC, P.x, P.y)) { e.state = 'windup'; e.t = 0; emit(g, 'sfx', { name: 'tell' }); }
        else stepToward(g, e, P, e.slow ? D.slowSpeed : D.speed, dt);
        break;
      case 'windup':
        if (e.t >= (e.slow ? D.slowWindup : D.windup)) { e.state = 'spin'; e.t = 0; e.hitDone = false; emit(g, 'sfx', { name: 'spin' }); }
        break;
      case 'spin':
        if (!e.hitDone && d < D.spinR + P.r) { if (hurtPlayer(g, D.dmg, e.x, e.y)) e.hitDone = true; }
        if (e.t >= D.spinT) { e.state = 'recover'; e.t = 0; }
        break;
      case 'recover': if (e.t >= D.recover) { e.state = 'chase'; e.t = 0; } break;
      case 'stagger': if (e.t >= 0.4) { e.state = 'chase'; e.t = 0; } break;
      default: e.state = 'chase';
    }
  }

  function updBear(g, e, dt) {
    const D = ED.bear, p = g.p, P = g.player, ped = g.ped;
    const hostile = p.stage === 'encounter' && p.commit === 'preserve' && g.music.on && !e.spent;
    if (!hostile) {
      if (e.dark || e.spent) { e.state = e.spent ? 'spent' : 'dark'; return; }
      if (g.music.on && p.stage === 'explore') { // harmless during the test: they wake and turn to the recording
        e.state = 'stir';
        if (ped && dist(e, ped) > 135) stepToward(g, e, ped, 34, dt);
        else e.face = norm(ped.x - e.x, ped.y - e.y);
        return;
      }
      e.state = 'dock';
      if (dist(e, e.home) > 4) stepToward(g, e, e.home, 60, dt);
      return;
    }
    if (e.wake > 0) { e.wake -= dt; e.state = 'wake'; return; }
    const pd = dist(e, P);
    const tgt = pd < 120 || !ped || ped.hp <= 0 ? P : ped;
    e.cd = Math.max(0, e.cd - dt);
    e.t += dt;
    if (!['seek', 'aim', 'charge', 'recover', 'stagger'].includes(e.state)) { e.state = 'seek'; e.t = 0; }
    switch (e.state) {
      case 'seek': {
        const d = dist(e, tgt);
        if (d < D.range && e.cd <= 0 && roomAt(LOC, e.x, e.y) === roomAt(LOC, tgt.x, tgt.y)) {
          e.state = 'aim'; e.t = 0; const n = norm(tgt.x - e.x, tgt.y - e.y); e.dx = n.x; e.dy = n.y; e.face = n;
          emit(g, 'sfx', { name: 'tell' });
        } else stepToward(g, e, tgt, e.slow ? D.slowSpeed : D.speed, dt);
        break;
      }
      case 'aim': {
        const aimT = e.slow ? D.slowAim : D.aim;
        if (e.t < aimT * 0.45) { const n = norm(tgt.x - e.x, tgt.y - e.y); if (n.l) { e.dx = n.x; e.dy = n.y; e.face = n; } }
        if (e.t >= aimT) { e.state = 'charge'; e.t = 0; e.hitP = false; emit(g, 'sfx', { name: 'charge' }); }
        break;
      }
      case 'charge': {
        const sp = e.slow ? D.slowChargeSpeed : D.chargeSpeed;
        const hit = moveEnt(g, e, e.dx * sp * dt, e.dy * sp * dt);
        if (!e.hitP && dist(e, P) < e.r + P.r + 4 && hurtPlayer(g, D.dmg, e.x, e.y)) e.hitP = true;
        if (ped && ped.hp > 0 && dist(e, ped) < e.r + ped.r + 3) { hitPedestal(g, D.pedDmg, e); e.state = 'recover'; e.t = 0; break; }
        if (hit || e.t >= D.chargeT) { e.state = 'recover'; e.t = hit ? -0.3 : 0; }
        break;
      }
      case 'recover': if (e.t >= D.recover) { e.state = 'seek'; e.t = 0; e.cd = 0.5; } break;
      case 'stagger': if (e.t >= 0.45) { e.state = 'seek'; e.t = 0; } break;
    }
  }

  function updPopper(g, e, dt) {
    const D = ED.popper, p = g.p, P = g.player;
    if (p.stage !== 'encounter' || e.spent) { e.state = 'idle'; return; }
    if (e.wake > 0) { e.wake -= dt; e.state = 'wake'; return; }
    e.t += dt; e.cd -= dt;
    if (e.state === 'recoil') { if (e.t > 0.35) { e.state = 'move'; e.t = 0; } return; }
    e.state = 'move';
    const same = roomAt(LOC, e.x, e.y) === roomAt(LOC, P.x, P.y);
    const d = dist(e, P);
    if (same) {
      if (d < 170) { const n = norm(e.x - P.x, e.y - P.y); e.face = { x: -n.x, y: -n.y }; moveEnt(g, e, n.x * D.speed * dt, n.y * D.speed * dt); }
      else if (d > 300) stepToward(g, e, P, D.speed, dt);
      else e.face = norm(P.x - e.x, P.y - e.y);
      if (e.cd <= 0 && d < 470) {
        g.shots.push({ x0: e.x, y0: e.y - 10, tx: P.x, ty: P.y, t: 0, dur: D.flight, r: D.splash });
        e.cd = D.cd; e.state = 'recoil'; e.t = 0;
        emit(g, 'sfx', { name: 'popperFire' });
      }
    } else if (dist(e, e.home) > 6) stepToward(g, e, e.home, D.speed * 0.6, dt);
  }

  function separate(g) {
    const E = g.enemies, P = g.player;
    for (let i = 0; i < E.length; i++) {
      const a = E[i];
      for (let j = i + 1; j < E.length; j++) {
        const b = E[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), m = a.r + b.r;
        if (d < m && d > 1e-6) { const k = (m - d) / 2 / d; a.x -= dx * k; a.y -= dy * k; b.x += dx * k; b.y += dy * k; }
      }
      if (P.state !== 'dodge' && a.state !== 'charge') {
        const dx = a.x - P.x, dy = a.y - P.y, d = Math.hypot(dx, dy), m = a.r + P.r;
        if (d < m && d > 1e-6) { a.x = P.x + dx / d * m; a.y = P.y + dy / d * m; }
      }
      resolve(a, g.solids, null);
    }
  }

  function updShots(g, dt) {
    const P = g.player;
    for (const s of g.shots) {
      s.t += dt;
      if (s.t >= s.dur && !s.done) {
        s.done = true;
        burst(g, s.tx, s.ty, 14, ['#ffffff', '#ffd166', '#ff8fab'], 180, 3);
        addDecal(g, s.tx, s.ty, 14, '#fff6e0');
        emit(g, 'sfx', { name: 'splat' });
        if (Math.hypot(P.x - s.tx, P.y - s.ty) < s.r + P.r * 0.3) hurtPlayer(g, ED.popper.dmg, s.tx, s.ty);
      }
    }
    g.shots = g.shots.filter((s) => !s.done);
  }

  function updGuests(g, dt) {
    const enc = g.enc, p = g.p;
    for (const k of g.guests) {
      k.bob += dt;
      if (k.state === 'leaving') {
        const ex = LOC.guestExit, d = norm(ex.x - k.x, ex.y + 20 - k.y);
        k.x += d.x * 70 * dt; k.y += d.y * 70 * dt;
        if (d.l < 8) k.state = 'gone';
      }
    }
    if (enc && p.stage === 'encounter' && p.commit === 'preserve') {
      const n = g.guests.length, span = T.defendTime - 8;
      const due = Math.floor((enc.t - 2) / (span / n)) + 1;
      let started = g.guests.filter((k) => k.state !== 'seated').length;
      for (const k of g.guests) { if (started >= due) break; if (k.state === 'seated') { k.state = 'leaving'; started++; } }
    }
    g.guests = g.guests.filter((k) => k.state !== 'gone' || (g.enc && g.p.stage === 'encounter'));
  }

  function updEncounter(g, dt) {
    const p = g.p, E = g.enc;
    if (p.stage !== 'encounter' || !E) return;
    E.t += dt;
    if (!E.shifted && E.t >= (p.commit === 'preserve' ? T.shiftPreserve : T.shiftDestroy)) triggerShift(g);
    const once = (key, at, fn) => { if (!E.waves[key] && E.t >= at) { E.waves[key] = true; fn(); } };
    const spawn = (e) => { g.enemies.push(e); g.poofs.push({ x: e.x, y: e.y, t: 0 }); emit(g, 'sfx', { name: 'spawn' }); };
    if (p.commit === 'preserve') {
      if (p.prep.cut !== 'dock') {
        once('w1', 13, () => { spawn(mkEnemy('w1a', 'bear', 650, 505, { wake: 1.0 })); spawn(mkEnemy('w1b', 'bear', 700, 500, { wake: 1.2 })); caption(g, '', 'More cake bears push through the stage curtain from the service route.', 2.8); });
        once('w2', 26, () => { spawn(mkEnemy('w2a', 'bear', 675, 505, { wake: 1.0 })); });
      }
      once('pp', 20, () => spawn(mkEnemy('p2', 'popper', 610, 230, { wake: 1.2, cd: 0.6 })));
      if (E.t >= T.defendTime) winPreserve(g);
    } else {
      once('r1', 15, () => {
        const slow = p.prep.cut === 'dance';
        spawn(mkEnemy('r1', 'dancer', 1235, 110, { wake: 1.0, slow })); spawn(mkEnemy('r2', 'dancer', 1290, 110, { wake: 1.2, slow }));
        caption(g, '', 'Two more security dancers march in through the party exit.', 2.6);
      });
    }
  }

  // ---------------------------------------------------------------- particles & decals
  function burst(g, x, y, n, colors, speed, size, dir) {
    for (let i = 0; i < n; i++) {
      let a = rand(g) * Math.PI * 2;
      if (dir && rand(g) < 0.6) a = Math.atan2(dir.y, dir.x) + (rand(g) - 0.5) * 1.6;
      const s = speed * (0.3 + rand(g) * 0.8);
      g.particles.push({ x, y, z: 4 + rand(g) * 10, vx: Math.cos(a) * s, vy: Math.sin(a) * s, vz: 60 + rand(g) * 160,
        c: colors[(rand(g) * colors.length) | 0], s: size * (0.6 + rand(g) * 0.9), life: 0.5 + rand(g) * 0.6, t: 0, sq: rand(g) < 0.5, rot: rand(g) * 6 });
    }
    if (g.particles.length > 600) g.particles.splice(0, g.particles.length - 600);
  }
  function updParticles(g, dt) {
    for (const q of g.particles) {
      q.t += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vz -= 520 * dt; q.z = Math.max(0, q.z + q.vz * dt);
      const f = Math.exp(-dt * (q.z <= 0 ? 9 : 2)); q.vx *= f; q.vy *= f; q.rot += dt * 8;
    }
    g.particles = g.particles.filter((q) => q.t < q.life);
  }
  function addDecal(g, x, y, r, c) {
    if (g.scene !== 'location') return;
    const p = g.p;
    p.decals.push({ x: Math.round(x), y: Math.round(y), r: Math.round(r), c, s: (rand(g) * 1000) | 0 });
    if (p.decals.length > 220) p.decals.splice(0, p.decals.length - 220);
  }

  // ---------------------------------------------------------------- HUD helpers
  function goalInfo(g) {
    const p = g.p, st = p.stage, P = g.player;
    const tgt = (pt) => (pt ? navPoint(g, P, pt) : null);
    switch (st) {
      case 'intro':
        if (!p.talked.mara) return { text: 'Talk to Mara in the kitchen', sub: [], target: g.npcs[0] };
        return { text: 'Head out the front door to Jellybean Junction', sub: p.talked.tobi ? [] : ['Optional: say hi to Tobi on the sofa'], target: HOME.frontDoor };
      case 'explore': {
        if (!p.seen.party) return { text: 'Find the birthday recording', sub: ['It\'s somewhere in the party room, east of the lobby', p.talked.parent ? '' : 'Optional: talk to the parent by the coats'].filter(Boolean), target: tgt(LOC.pedestal) };
        const sub = [];
        if (p.talked.rabbit) sub.push('Rabbit: keep it playing (hold E at the sound desk)');
        if (p.talked.parent) sub.push('Dana: destroy it (hold E at the pedestal, then the crusher)');
        if (!p.talked.rabbit) sub.push('Talk to the rabbit on the stage');
        if (!p.talked.parent) sub.push('Talk to the parent in the lobby');
        if (!p.prep.tested) sub.push('Optional: tap E at the sound desk to test the song');
        if (!p.prep.serviceFound) sub.push(p.talked.kid ? 'Optional: look behind the stage curtain' : 'Optional: explore (a guest knows a secret)');
        else if (!p.prep.cut) sub.push('Optional: pull a fuse in the service route');
        return { text: 'Decide what happens to the recording', sub, target: !p.talked.rabbit ? tgt(g.npcs.find((n) => n.id === 'rabbit')) : null };
      }
      case 'encounter':
        if (p.commit === 'preserve') {
          const left = Math.max(0, Math.ceil(T.defendTime - (g.enc ? g.enc.t : 0)));
          return { text: `Defend the recording: ${left}s left`, sub: ['Until every guest is out of the party exit', 'Cake bears charge the pedestal: hit them first'], target: tgt(LOC.pedestal), timer: g.enc ? g.enc.t / T.defendTime : 0 };
        }
        return { text: 'Carry the recording to the crusher in the disposal room', sub: ['Carrying: slower, no heavy attack. Dodge still works.'], target: tgt({ x: LOC.crusher.x, y: LOC.crusher.y + 10 }) };
      case 'aftermath':
        if (p.outcome === 'preserve' && p.recording === 'pedestal') return { text: 'The song ended. Take the recording', sub: [], target: tgt(LOC.pedestal) };
        return { text: 'Go home (lobby exit, west wall)', sub: [], target: tgt(LOC.exit) };
      case 'home_after': {
        const sub = [];
        if (!p.talked.mara2) sub.push('Talk to Mara');
        if (!p.talked.tobi2) sub.push('Talk to Tobi');
        if (sub.length) return { text: 'You\'re home. See what everyone makes of it', sub, target: !p.talked.mara2 ? g.npcs[0] : g.npcs[1] };
        return { text: 'Revisit Jellybean Junction (front door)', sub: ['Something there might have changed'], target: HOME.frontDoor };
      }
      case 'revisit': {
        const looked = p.seen.revisitPed;
        return { text: looked ? 'Look around. Leave by the lobby exit when ready' : 'Look around Jellybean Junction', sub: looked ? [] : ['Check the pedestal in the party room'], target: tgt(looked ? LOC.exit : LOC.pedestal) };
      }
      case 'home_final': return { text: 'Sit down for dinner (kitchen table)', sub: [], target: HOME.table };
      default: return { text: '', sub: [], target: null };
    }
  }

  function prepInfo(g) {
    const p = g.p, out = [];
    if (p.prep.tested) out.push('Known: the song stops security dancers and wakes cake bears');
    if (p.prep.serviceFound) out.push('Found: service route, a shortcut to disposal');
    if (p.prep.cut === 'dock') out.push('Fuse: cake-bear dock off (slow bears, no reinforcements)');
    if (p.prep.cut === 'dance') out.push('Fuse: dance floor off (slow dancers, lobby guards offline)');
    return out;
  }

  const api = {
    T, ED, LOC, HOME, PROPS, SAVE_VERSION, roomAt, roomName,
    createGame, loadGame, serialize, freshPersist, update, emptyInput,
    advanceDialogue, skipDialogue, retryEncounter, resetAll, replayAssignment,
    interactables, nearestInteractable, goalInfo, prepInfo,
    // exposed for tests / debugging
    _: { commitPreserve, commitDestroy, takeHome, goHome, goLocation, winDestroy, winPreserve, hurtPlayer, hitEnemy, testSong, pullFuse, talk, triggerShift, killEnemy },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MYAH = api;
})(typeof window !== 'undefined' ? window : globalThis);
