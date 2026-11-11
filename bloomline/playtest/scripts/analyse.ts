// node scripts/analyse.ts <level-id>: does each special creature's rule change the answer?
// Relaxes one creature at a time into a plain Gloomy and compares the solver results.
import { type LevelDef, parseLevel } from '../src/core/level.ts';
import { solve } from '../src/solver/solve.ts';
import { LEVELS } from '../src/levels/index.ts';

const id = process.argv[2];
const budget = process.argv[3] ? Number(process.argv[3]) : undefined;
for (const def of LEVELS.filter((l) => !id || l.id === id)) {
  const base = solve(parseLevel(def), { nearSolutions: false, maxExamples: 3, budget });
  console.log(`\n${def.id}: shortest ${base.shortest}, solutions ${base.solutions}`);
  for (const e of base.examples) console.log('   ', e.join(' '));
  def.creatures.forEach((c, i) => {
    if (c.kind === 'gloomy') return;
    const relaxed: LevelDef = { ...def, creatures: def.creatures.map((d, j) => (j === i ? { kind: 'gloomy', at: d.at } : d)) };
    const r = solve(parseLevel(relaxed), { nearSolutions: false, maxExamples: 1, budget });
    console.log(`  without the ${c.kind} rule at ${c.at}: shortest ${r.shortest}, solutions ${r.solutions}   e.g. ${r.examples[0]?.join(' ')}`);
  });
}
