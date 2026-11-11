import { test } from "node:test";
import assert from "node:assert/strict";
import { createTown, createState, stepDay, simulate, ghostRuns, metrics, DAYS, REACH_PER_DAY } from "./sim.js";

const town = createTown(11);
const mix = (S, d) => (d < DAYS - 1 ? [{ type: "thread", neigh: d % 3 }, { type: "article", neigh: d % 3 }] : []);

test("same seed and same actions give a byte-identical result", () => {
  const a = simulate(town, 5, mix).S;
  const b = simulate(town, 5, mix).S;
  assert.deepEqual(Array.from(a.o), Array.from(b.o));
  assert.deepEqual(Array.from(a.will), Array.from(b.will));
});

test("a bot-free run does not depend on how it was requested", () => {
  const a = simulate(town, 9, null).m;
  const b = simulate(town, 9, () => []).m;
  assert.deepEqual(a, b);
});

test("opinions stay in [-1, 1] and willingness in [0, 1]", () => {
  const S = simulate(town, 3, mix).S;
  for (const o of S.o) assert.ok(o >= -1 && o <= 1);
  for (const w of S.will) assert.ok(w >= 0 && w <= 1);
});

test("with no bots the perceived-vs-actual gap is small on average", () => {
  const gaps = Array.from({ length: 60 }, (_, k) => simulate(town, k + 1, null).m.gap);
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  assert.ok(Math.abs(mean) < 0.12, `baseline gap ${mean}`);
});

test("bots move the result in the player's direction on average (paired seeds)", () => {
  let sum = 0;
  const n = 60;
  for (let k = 1; k <= n; k++) sum += simulate(town, k, mix).m.voteYes - simulate(town, k, null).m.voteYes;
  const mean = sum / n;
  assert.ok(mean > 0.02 && mean < 0.2, `mean effect ${mean}`);
});

test("actions that cost more than the day's reach are dropped", () => {
  const S = createState(town, 1);
  const ev = stepDay(S, [{ type: "article", neigh: 0 }, { type: "article", neigh: 1 }]);
  assert.equal(ev.actions.length, 1, `only 1 of 2 articles fits in ${REACH_PER_DAY} reach`);
});

test("bots raise heat and heat decays", () => {
  const S = createState(town, 1);
  stepDay(S, [{ type: "thread", neigh: 0 }]);
  const after = S.heat.phrasing;
  assert.ok(after > 0);
  stepDay(S, []);
  assert.ok(S.heat.phrasing < after);
});

test("ghost runs return one result per run, each a valid share", () => {
  const runs = ghostRuns(town, 25);
  assert.equal(runs.length, 25);
  for (const r of runs) assert.ok(r > 0 && r < 1);
});
