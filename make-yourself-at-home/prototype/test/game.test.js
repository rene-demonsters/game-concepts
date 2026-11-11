// Headless tests of the prototype's core loop and branching state.
// Run: node --test test/game.test.js   (no dependencies)
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../js/game.js');

const DT = 1 / 60;
function step(g, n, inp) { for (let i = 0; i < (n || 1); i++) M.update(g, Object.assign(M.emptyInput(), inp || {}), DT); }
function secs(s) { return Math.ceil(s / DT); }
function tapE(g) { step(g, 1, { interactPressed: true, interactDown: true }); step(g, 1); }
function holdE(g, s) { step(g, 1, { interactPressed: true, interactDown: true }); step(g, secs(s) + 2, { interactDown: true }); step(g, 1); }
function finishDialogue(g) { let n = 0; while (g.dialogue && n++ < 20) M.advanceDialogue(g); }
function tp(g, x, y) { g.player.x = x; g.player.y = y; step(g, 1); }
function god(g) { g.player.hp = g.player.maxHp; g.player.inv = 0.5; }
function focusId(g) { const it = M.nearestInteractable(g); return it && it.id; }

// Walk by following the HUD goal target (exercises navigation and the arrow targets).
function walkToGoal(g, maxS, stopDist) {
  for (let i = 0; i < secs(maxS || 20); i++) {
    const t = M.goalInfo(g).target; if (!t) return false;
    const dx = t.x - g.player.x, dy = t.y - g.player.y;
    const waypoint = M.LOC.doors.some((d) => d.pa === t || d.pb === t);
    if (Math.hypot(dx, dy) < (stopDist || 30) && !waypoint) return true;
    const l = Math.hypot(dx, dy);
    step(g, 1, { mx: dx / l, my: dy / l });
    if (g.dialogue) finishDialogue(g);
  }
  return false;
}
function walkTo(g, x, y, maxS) {
  for (let i = 0; i < secs(maxS || 10); i++) {
    const dx = x - g.player.x, dy = y - g.player.y, l = Math.hypot(dx, dy);
    if (l < 8) return true;
    step(g, 1, { mx: dx / l, my: dy / l });
  }
  return false;
}

function newAtLocation() {
  const g = M.createGame(null, 42);
  M._.talk(g, 'mara'); finishDialogue(g);
  M._.goLocation(g);
  g.events.length = 0;
  return g;
}

// Defend automatically: stay full-health, kill whatever reaches the pedestal area.
function autoDefend(g, maxS) {
  for (let i = 0; i < secs(maxS); i++) {
    god(g);
    if (i % 15 === 0) for (const e of g.enemies) if (e.type !== 'dancer' && Math.hypot(e.x - g.ped.x, e.y - g.ped.y) < 260) M._.killEnemy(g, e, false);
    step(g, 1);
    if (g.p.stage !== 'encounter') return true;
  }
  return false;
}

test('home intro: talk to Mara via E, then the front door leads to the play centre', () => {
  const g = M.createGame(null, 1);
  assert.equal(g.scene, 'home'); assert.equal(g.p.stage, 'intro');
  assert.match(M.goalInfo(g).text, /Mara/);
  // door refuses before Mara has spoken
  tp(g, 900, 300); tapE(g); assert.equal(g.p.stage, 'intro');
  assert.ok(walkToGoal(g, 10, 40), 'reached Mara');
  assert.equal(focusId(g), 'mara');
  tapE(g); assert.ok(g.dialogue, 'dialogue opened'); finishDialogue(g);
  assert.equal(g.p.talked.mara, true);
  assert.ok(g.p.journal.some((j) => j.kind === 'told' && /Mara/.test(j.text)));
  assert.match(M.goalInfo(g).text, /front door/);
  assert.ok(walkToGoal(g, 10, 30), 'reached door');
  assert.equal(focusId(g), 'door');
  tapE(g);
  assert.equal(g.p.stage, 'explore'); assert.equal(g.scene, 'location');
});

test('explore: goal arrow leads to the party room; dialogue pauses the world', () => {
  const g = newAtLocation();
  assert.match(M.goalInfo(g).text, /Find the birthday recording/);
  assert.ok(walkToGoal(g, 20, 60), 'followed arrow');
  assert.equal(g.p.seen.party, true);
  // talking pauses everything
  tp(g, 1240, 260);
  assert.equal(focusId(g), 'rabbit');
  tapE(g); assert.ok(g.dialogue);
  const before = { x: g.player.x, y: g.player.y, t: g.time };
  step(g, 120, { mx: 1, my: 0, light: true });
  assert.deepEqual({ x: g.player.x, y: g.player.y, t: g.time }, before);
  M.skipDialogue(g);
  assert.equal(g.dialogue, null); assert.equal(g.p.talked.rabbit, true);
});

test('testing the song: dancers dance, bears stir harmlessly, then everything returns', () => {
  const g = newAtLocation();
  tp(g, 1140, 470);
  assert.equal(focusId(g), 'desk');
  tapE(g);
  assert.equal(g.music.on, true); assert.equal(g.music.mode, 'test'); assert.equal(g.p.prep.tested, true);
  assert.equal(g.p.stage, 'explore', 'a tap is a test, not a commitment');
  step(g, secs(1));
  const dancers = g.enemies.filter((e) => e.type === 'dancer'), bears = g.enemies.filter((e) => e.type === 'bear');
  assert.ok(dancers.every((e) => e.state === 'dance'));
  assert.ok(bears.every((e) => e.state === 'stir'));
  const hp = g.player.hp;
  step(g, secs(5.5));
  assert.equal(g.music.on, false);
  assert.equal(g.player.hp, hp, 'testing never hurts');
  step(g, secs(1));
  assert.ok(dancers.every((e) => e.state === 'post'));
  assert.ok(g.p.journal.some((j) => /security dancers stopped/.test(j.text)));
});

test('preparation: finding the service route and pulling one fuse', () => {
  const g = newAtLocation();
  tp(g, 660, 610); step(g, 2);
  assert.equal(g.p.prep.serviceFound, true);
  tp(g, 990, 670);
  assert.equal(focusId(g), 'fuse-dock');
  tapE(g); assert.equal(g.p.prep.cut, 'dock');
  tp(g, 1070, 670); tapE(g); assert.equal(g.p.prep.cut, 'dance', 'only one fuse: pulling the other swaps it');
  tp(g, 990, 670); tapE(g); assert.equal(g.p.prep.cut, 'dock');
  assert.equal(M.prepInfo(g).length, 2);
});

test('preserve branch: commit at the desk, defend, pick up without switching outcome, go home, revisit', () => {
  const g = newAtLocation();
  // prep: dock fuse
  tp(g, 660, 610); tp(g, 990, 670); tapE(g);
  assert.equal(g.p.prep.cut, 'dock');
  tp(g, 1140, 470);
  holdE(g, 1.0);
  assert.equal(g.p.stage, 'encounter'); assert.equal(g.p.commit, 'preserve');
  assert.equal(g.music.on, true); assert.equal(g.music.mode, 'loop');
  const bears = g.enemies.filter((e) => e.type === 'bear');
  assert.ok(bears.length === 3 && bears.every((e) => e.slow), 'dock fuse makes bears slow');
  // nobody can hit you during the opening second
  const hp0 = g.player.hp; step(g, secs(1.0)); assert.equal(g.player.hp, hp0);
  // run to the shift: rules survive it
  for (let i = 0; i < secs(16); i++) { god(g); step(g, 1); if (g.ped.hp < 100) g.ped.hp = 100; }
  assert.equal(g.enc.shifted, true); assert.equal(g.voice, 'you'); assert.ok(g.hatch);
  assert.ok(g.enemies.filter((e) => e.type === 'dancer').every((e) => e.state === 'dance'), 'dancers still disabled by the song after the shift');
  assert.ok(g.p.journal.some((j) => /kitchen/.test(j.text)));
  assert.equal(M.T.light.range, 50); // hitboxes are constants, untouched by the shift
  assert.ok(autoDefend(g, 40), 'defence completes');
  assert.equal(g.p.stage, 'aftermath'); assert.equal(g.p.outcome, 'preserve');
  assert.ok(!g.enemies.some((e) => /^w/.test(e.id)), 'dock fuse: no reinforcement waves');
  assert.equal(g.music.on, false);
  // pick it up: must not flip outcome or restart anything
  const decalsAfter = g.p.decals.length;
  tp(g, 930, 345);
  assert.equal(focusId(g), 'pedestal');
  tapE(g);
  assert.equal(g.p.recording, 'held'); assert.equal(g.p.outcome, 'preserve'); assert.equal(g.p.commit, 'preserve');
  assert.equal(g.p.stage, 'aftermath'); assert.equal(g.enc && g.enc.mode, 'commit');
  step(g, secs(3));
  assert.equal(g.player.hp, g.player.maxHp, 'no hostile enemies after the win');
  // crusher cannot switch the outcome now
  tp(g, 121, 720); tapE(g); assert.equal(g.p.recording, 'held');
  // leave
  tp(g, 70, 340); assert.equal(focusId(g), 'exit'); tapE(g);
  assert.equal(g.p.stage, 'home_after'); assert.equal(g.scene, 'home'); assert.equal(g.p.recording, 'shelf');
  assert.equal(g.music.on, true, 'the recording plays at home');
  M._.talk(g, 'mara'); finishDialogue(g); M._.talk(g, 'tobi'); finishDialogue(g);
  assert.ok(g.p.journal.some((j) => /MY voice/.test(j.text)));
  assert.ok(g.p.journal.some((j) => /tomorrow/.test(j.text)));
  assert.match(M.goalInfo(g).text, /Revisit/);
  // revisit: damage persists, a new contradiction is there
  tp(g, 900, 300); tapE(g);
  assert.equal(g.p.stage, 'revisit'); assert.equal(g.scene, 'location');
  assert.equal(g.p.decals.length, decalsAfter, 'decals persisted');
  for (const id of Object.keys(g.p.dead)) assert.ok(!g.enemies.some((e) => e.id === id), `killed ${id} stays gone`);
  assert.equal(g.music.mode, 'faint');
  step(g, 2);
  assert.ok(g.enemies.filter((e) => e.type === 'dancer').every((e) => e.state === 'dance'), 'the faint song still disables dancers');
  tp(g, 930, 345); tapE(g); finishDialogue(g);
  assert.ok(g.p.journal.some((j) => /still playing at the empty pedestal/.test(j.text)));
  tp(g, 110, 300); assert.equal(focusId(g), 'note'); tapE(g); finishDialogue(g);
  tp(g, 70, 340); tapE(g);
  assert.equal(g.p.stage, 'home_final');
  tp(g, 280, 420); assert.equal(focusId(g), 'table'); tapE(g);
  assert.equal(g.p.stage, 'end');
});

test('destroy branch: take it, carry it slower, crush it, shards come home, revisit shows copy 2', () => {
  const g = newAtLocation();
  tp(g, 930, 345);
  assert.equal(focusId(g), 'pedestal');
  tapE(g); assert.equal(g.p.stage, 'explore', 'a tap does not take it');
  holdE(g, 0.6);
  assert.equal(g.p.stage, 'encounter'); assert.equal(g.p.commit, 'destroy'); assert.equal(g.p.recording, 'carried');
  assert.equal(g.music.on, false);
  // carrying is slower
  god(g); tp(g, 930, 380);
  const x0 = g.player.x; step(g, 30, { mx: -1 }); const carriedDist = x0 - g.player.x;
  assert.ok(carriedDist > 50 && carriedDist < 80, `carry speed ${carriedDist}`);
  // heavy is refused while carrying
  step(g, 1, { heavy: true }); assert.notEqual(g.player.kind === 'heavy' && g.player.state === 'attack', true);
  // dancers become hostile after their wake-up tell
  step(g, secs(1));
  assert.ok(g.enemies.some((e) => e.type === 'dancer' && ['chase', 'windup', 'spin', 'recover'].includes(e.state)));
  assert.ok(g.enemies.filter((e) => e.type === 'bear').every((e) => e.state === 'dock'), 'no song: bears stay docked');
  for (let i = 0; i < secs(8); i++) { god(g); step(g, 1); }
  assert.equal(g.enc.shifted, true);
  // walk to the crusher by following the goal arrow (god mode), then hold E with enemies around
  for (let i = 0; i < secs(30) && Math.hypot(g.player.x - 121, g.player.y - 748) > 50; i++) {
    god(g);
    const t = M.goalInfo(g).target, dx = t.x - g.player.x, dy = t.y - g.player.y, l = Math.hypot(dx, dy) || 1;
    step(g, 1, { mx: dx / l, my: dy / l });
  }
  assert.equal(focusId(g), 'crusher');
  step(g, 1, { interactPressed: true, interactDown: true });
  for (let i = 0; i < secs(1); i++) { god(g); step(g, 1, { interactDown: true }); }
  assert.equal(g.p.stage, 'aftermath'); assert.equal(g.p.outcome, 'destroy'); assert.equal(g.p.recording, 'shards');
  assert.ok(g.enemies.every((e) => e.type !== 'popper'));
  tp(g, 70, 340); tapE(g);
  assert.equal(g.p.stage, 'home_after'); assert.equal(g.p.recording, 'shards');
  M._.talk(g, 'mara'); finishDialogue(g);
  assert.ok(g.p.journal.some((j) => /already smashed/.test(j.text)));
  const decals = g.p.decals.length;
  M._.goLocation(g);
  assert.equal(g.p.stage, 'revisit'); assert.equal(g.p.decals.length, decals);
  assert.ok(g.npcs.some((n) => n.id === 'parent')); assert.ok(!g.npcs.some((n) => n.id === 'rabbit'));
  tp(g, 930, 345); tapE(g); finishDialogue(g);
  assert.ok(g.p.journal.some((j) => /COPY 2 OF 2/.test(j.text)));
});

test('death retries the encounter with commitment and preparation preserved', () => {
  const g = newAtLocation();
  tp(g, 660, 610); tp(g, 1070, 670); tapE(g); // dance fuse
  tp(g, 930, 345); holdE(g, 0.6);
  assert.equal(g.p.commit, 'destroy');
  const snapDecals = g.p.decals.length;
  assert.ok(g.enemies.filter((e) => e.id === 'd4' || e.id === 'd5').every((e) => e.dark), 'dance fuse: lobby guards offline');
  // wreck a balloon and a cake, then die
  step(g, secs(9));
  M._.killEnemy(g, g.enemies.find((e) => e.type === 'dancer'), false);
  for (let i = 0; i < 20 && !g.down; i++) { g.player.inv = 0; g.player.iframe = 0; M._.hurtPlayer(g, 20, g.player.x + 10, g.player.y); }
  assert.ok(g.down);
  step(g, secs(0.3), { interactPressed: true }); assert.ok(g.down, 'retry needs a beat so a mashed key does not skip it');
  step(g, secs(0.5)); step(g, 1, { interactPressed: true, interactDown: true });
  assert.equal(g.down, null);
  assert.equal(g.p.stage, 'encounter'); assert.equal(g.p.commit, 'destroy'); assert.equal(g.p.recording, 'carried');
  assert.equal(g.p.prep.cut, 'dance'); assert.equal(g.p.prep.serviceFound, true);
  assert.equal(g.p.attempts, 1); assert.equal(g.player.hp, g.player.maxHp);
  assert.equal(g.p.decals.length, snapDecals, 'retry restores the pre-fight damage');
  assert.equal(Object.keys(g.p.dead).length, 0, 'enemies killed in the failed attempt come back');
  assert.equal(g.enc.shifted, false); assert.equal(g.enc.t, 0);
});

test('a smashed pedestal is a retry too, and the song comes back on', () => {
  const g = newAtLocation();
  tp(g, 1140, 470); holdE(g, 1.0);
  g.ped.hp = 5; // already battered; one real bear charge finishes it
  const b = g.enemies.find((e) => e.type === 'bear');
  b.wake = 0; b.state = 'charge'; b.t = 0; b.x = g.ped.x - 60; b.y = g.ped.y; b.dx = 1; b.dy = 0;
  g.player.x = 1300; g.player.y = 480;
  step(g, 20);
  assert.ok(g.down); assert.equal(g.down.reason, 'pedestal'); assert.equal(g.music.on, false);
  M.retryEncounter(g);
  assert.equal(g.ped.hp, 100); assert.equal(g.music.on, true); assert.equal(g.p.commit, 'preserve');
});

test('save/load mid-encounter resumes the same fight; replay and reset clear storage state', () => {
  const g = newAtLocation();
  tp(g, 930, 345); holdE(g, 0.6);
  step(g, secs(3));
  const json = M.serialize(g);
  const h = M.loadGame(json, 7);
  assert.equal(h.p.stage, 'encounter'); assert.equal(h.p.commit, 'destroy'); assert.equal(h.p.recording, 'carried');
  assert.ok(h.enemies.length >= 5); assert.equal(h.enc.t, 0);
  assert.equal(M.loadGame('{"v":999}'), null); assert.equal(M.loadGame('garbage'), null);
  M.replayAssignment(h);
  assert.equal(h.p.stage, 'explore'); assert.equal(h.p.commit, null); assert.equal(h.p.outcome, null);
  assert.equal(h.p.decals.length, 0); assert.equal(h.p.prep.cut, null);
  M.resetAll(h);
  assert.equal(h.p.stage, 'intro'); assert.equal(h.p.journal.length, 0); assert.equal(h.scene, 'home');
});

test('combat: light combo damages, dodge i-frames avoid hits, dancer tell precedes damage', () => {
  const g = newAtLocation();
  tp(g, 930, 345); holdE(g, 0.6);
  // isolate one dancer
  const d = g.enemies.find((e) => e.id === 'd2');
  g.enemies = [d]; d.wake = 0; d.state = 'chase';
  g.player.x = 1000; g.player.y = 300; d.x = 1040; d.y = 300; g.player.face = { x: 1, y: 0 };
  const hp0 = d.hp;
  step(g, 1, { light: true }); step(g, 8);
  assert.ok(d.hp < hp0, 'light attack hit');
  // i-frames
  g.player.state = 'free'; g.player.dodgeCd = 0; step(g, 1, { dodge: true });
  assert.ok(g.player.iframe > 0);
  assert.equal(M._.hurtPlayer(g, 10, g.player.x + 5, g.player.y), false, 'dodge i-frames block damage');
  // tell before damage
  const h = newAtLocation(); tp(h, 930, 345); holdE(h, 0.6);
  const e = h.enemies.find((q) => q.id === 'd2'); h.enemies = [e]; e.wake = 0; e.state = 'chase';
  h.player.x = 1000; h.player.y = 300; e.x = 1100; e.y = 300; e.hp = 1e9;
  let windup = 0, hurtAt = -1;
  for (let i = 0; i < secs(4); i++) { step(h, 1); if (e.state === 'windup') windup += DT; if (h.player.hp < h.player.maxHp) { hurtAt = i; break; } }
  assert.ok(hurtAt > 0, 'eventually hits a player who stands still');
  assert.ok(windup >= 0.5, `visible windup before damage (${windup.toFixed(2)}s)`);
});

test('both branches are winnable by a naive bot without god mode, with and without preparation', () => {
  const bot = require('./bot.js');
  for (const cut of [null, 'dock', 'dance']) {
    assert.equal(bot.playPreserve(cut, 1).outcome, 'preserve', `preserve with cut=${cut}`);
    assert.equal(bot.playDestroy(cut, 1).outcome, 'destroy', `destroy with cut=${cut}`);
  }
});
