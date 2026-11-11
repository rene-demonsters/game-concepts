// pnpm solve [level-id]: solver report for every level (or one).
import { parseLevel } from '../src/core/level.ts';
import { solve } from '../src/solver/solve.ts';
import { LEVELS } from '../src/levels/index.ts';

const only = process.argv[2];
let problems = 0;
for (const def of LEVELS) {
  if (only && def.id !== only) continue;
  const level = parseLevel(def);
  const t0 = performance.now();
  const r = solve(level, { maxExamples: 3 });
  const ms = Math.round(performance.now() - t0);
  const spare = r.shortest === null ? '-' : String(level.warmth - r.shortest);
  const flags: string[] = [];
  if (!r.solvable) flags.push('UNSOLVABLE');
  if (r.shortest !== null && r.shortest !== level.par) flags.push(`PAR SHOULD BE ${r.shortest}`);
  if (r.truncated) flags.push('TRUNCATED');
  problems += flags.length;
  console.log(
    `${def.id.padEnd(24)} ${level.width}×${level.height}  creatures ${String(level.creatures.length).padStart(2)}  warmth ${String(level.warmth).padStart(2)}  ` +
      `shortest ${String(r.shortest ?? '-').padStart(2)}  spare ${spare}  solutions ${String(r.solutions).padStart(5)}  near ${String(r.nearSolutions).padStart(6)}  ${ms}ms ${flags.join(' ')}`,
  );
  if (only) for (const e of r.examples) console.log('   ', e.join(' '));
}
if (problems) process.exitCode = 1;
