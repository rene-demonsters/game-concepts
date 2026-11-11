// A deliberately naive bot used to check both branches are winnable without god mode.
'use strict';
const M = require('../js/game.js');
const DT = 1 / 60;

function threat(g) { // nearest enemy that is telegraphing an attack close to the player
  const P = g.player;
  for (const e of g.enemies) {
    const d = Math.hypot(e.x - P.x, e.y - P.y);
    if (e.type === 'dancer' && e.state === 'windup' && d < 75 && e.t > 0.3) return e;
    if (e.type === 'bear' && e.state === 'aim' && d < 220 && e.t > 0.45) {
      // in the lane?
      const px = P.x - e.x, py = P.y - e.y, along = px * e.dx + py * e.dy, across = Math.abs(px * e.dy - py * e.dx);
      if (along > 0 && across < 34) return e;
    }
  }
  for (const s of g.shots) if (Math.hypot(s.tx - P.x, s.ty - P.y) < s.r + 10 && s.t > s.dur - 0.35) return { x: s.tx, y: s.ty };
  return null;
}

function hostile(e) { return ['chase', 'windup', 'spin', 'recover', 'stagger', 'seek', 'aim', 'charge', 'move', 'recoil'].includes(e.state); }

function botInput(g, goalPoint) {
  const P = g.player, inp = M.emptyInput();
  const th = threat(g);
  if (th && P.dodgeCd <= 0) {
    let ax = P.x - th.x, ay = P.y - th.y;
    if (th.dx !== undefined) { ax = -th.dy; ay = th.dx; } // sidestep a charge
    const l = Math.hypot(ax, ay) || 1; inp.mx = ax / l; inp.my = ay / l; inp.dodge = true; return inp;
  }
  // fight the nearest hostile enemy within reach of where we want to be
  let best = null, bd = 1e9;
  for (const e of g.enemies) {
    if (!hostile(e)) continue;
    const d = Math.hypot(e.x - P.x, e.y - P.y);
    if (d < bd) { bd = d; best = e; }
  }
  const carrying = g.p.recording === 'carried';
  if (best && bd < 58 && !(carrying && best.type === 'popper')) {
    inp.aim = { x: best.x, y: best.y }; inp.light = (g.time * 60 | 0) % 6 === 0; return inp;
  }
  let target = goalPoint;
  if (!carrying && best && bd < 260) target = best;
  if (target) {
    const t = target, dx = t.x - P.x, dy = t.y - P.y, l = Math.hypot(dx, dy);
    if (l > 6) { inp.mx = dx / l; inp.my = dy / l; }
  }
  return inp;
}

function playPreserve(cut, seed) {
  const g = M.createGame(null, seed || 3);
  M._.talk(g, 'mara'); while (g.dialogue) M.advanceDialogue(g); M._.goLocation(g);
  if (cut) { g.p.prep.serviceFound = true; M._.pullFuse(g, cut); }
  g.player.x = 1140; g.player.y = 470; M._.commitPreserve(g);
  let deaths = 0;
  for (let i = 0; i < 60 * 300 && g.p.stage === 'encounter'; i++) {
    if (g.down) { deaths++; M.update(g, Object.assign(M.emptyInput(), { interactPressed: g.down.t > 0.7 }), DT); continue; }
    const ped = g.ped;
    M.update(g, botInput(g, { x: ped.x + 40, y: ped.y + 40 }), DT);
  }
  return { outcome: g.p.outcome, deaths, attempts: g.p.attempts, hp: g.player.hp, ped: g.ped.hp };
}

function playDestroy(cut, seed) {
  const g = M.createGame(null, seed || 3);
  M._.talk(g, 'mara'); while (g.dialogue) M.advanceDialogue(g); M._.goLocation(g);
  if (cut) { g.p.prep.serviceFound = true; M._.pullFuse(g, cut); }
  g.player.x = 930; g.player.y = 345; M._.commitDestroy(g);
  let deaths = 0;
  for (let i = 0; i < 60 * 300 && g.p.stage === 'encounter'; i++) {
    if (g.down) { deaths++; M.update(g, Object.assign(M.emptyInput(), { interactPressed: g.down.t > 0.7 }), DT); continue; }
    const P = g.player, it = M.nearestInteractable(g);
    if (it && it.id === 'crusher') {
      const inp = botInput(g, null);
      if (!inp.dodge) { inp.mx = 0; inp.my = 0; inp.light = false; inp.interactDown = true; inp.interactPressed = !g.hold; }
      M.update(g, inp, DT); continue;
    }
    M.update(g, botInput(g, M.goalInfo(g).target), DT);
  }
  return { outcome: g.p.outcome, deaths, attempts: g.p.attempts, hp: g.player.hp };
}

module.exports = { playPreserve, playDestroy };
if (require.main === module) {
  for (const cut of [null, 'dock', 'dance']) for (const seed of [1, 2, 3]) {
    console.log('preserve', cut, seed, JSON.stringify(playPreserve(cut, seed)));
    console.log('destroy ', cut, seed, JSON.stringify(playDestroy(cut, seed)));
  }
}
