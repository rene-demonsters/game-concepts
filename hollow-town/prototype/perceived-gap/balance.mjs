// Headless balance sweep: how big is the bot effect, how noisy is the town?
import { createTown, simulate, ghostRuns, DAYS } from "./sim.js";

const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))); };
const pct = (x) => (100 * x).toFixed(1).padStart(5) + "%";

const policies = {
  "none (ghost)": null,
  "threads only": (S, d) => (d < DAYS - 1 ? [{ type: "thread", neigh: d % 3 }, { type: "thread", neigh: (d + 1) % 3 }] : []),
  "articles only": (S, d) => (d < DAYS - 1 ? [{ type: "article", neigh: d % 3 }] : []),
  "mix, thread+article": (S, d) => (d < DAYS - 1 ? [{ type: "thread", neigh: d % 3 }, { type: "article", neigh: d % 3 }] : []),
  "mix, spread wide": (S, d) => (d < DAYS - 1 ? [{ type: "thread", neigh: d % 3 }, { type: "thread", neigh: (d + 1) % 3 }] : []),
  "spam one neighborhood": (S, d) => (d < DAYS - 1 ? [{ type: "thread", neigh: 0 }, { type: "thread", neigh: 0 }] : []),
};

const seeds = Number(process.argv[2] ?? 200);
for (const townSeed of [7, 11, 23]) {
  const town = createTown(townSeed);
  const base = ghostRuns(town, seeds);
  console.log(`\ntown ${townSeed}: bot-free YES ${pct(mean(base))} sd ${pct(sd(base))}  P(pass)=${pct(base.filter((x) => x > 0.5).length / base.length)}`);
  for (const [name, plan] of Object.entries(policies)) {
    if (!plan) continue;
    const effects = [], gaps = [], sil = [], trust = [];
    for (let k = 1; k <= seeds; k++) {
      const a = simulate(town, k, plan).m;
      const b = simulate(town, k, null).m;
      effects.push(a.voteYes - b.voteYes);
      gaps.push(a.gap);
      sil.push(a.silent - b.silent);
      trust.push(a.trust);
    }
    console.log(`  ${name.padEnd(24)} effect ${pct(mean(effects))} (sd ${pct(sd(effects))})  gap ${pct(mean(gaps))}  extra silent ${mean(sil).toFixed(1)}  trust ${mean(trust).toFixed(2)}`);
  }
}
