// Level design helper: random layouts, scored with the solver. Prints the best candidates
// as level definitions to paste into src/levels/ and then polish by hand.
//
//   node scripts/generate.ts --w 6 --h 8 --kinds gloomy,gloomy,shy,sleepy,worrier,gloomy \
//     --obstacles 6 --spare 1 --min 16 --max 22 --maxSolutions 6 --tries 400 --seed 7
import { type Dir, DIRS, add, tileName } from '../src/core/coords.ts';
import { type CreatureDef, type CreatureKind, type LevelDef, isWalkable, parseLevel } from '../src/core/level.ts';
import { solve } from '../src/solver/solve.ts';

const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i]!.replace(/^--/, ''), process.argv[i + 1]!);
const num = (k: string, d: number) => (args.has(k) ? Number(args.get(k)) : d);

const W = num('w', 6);
const H = num('h', 8);
const kinds = (args.get('kinds') ?? 'gloomy,gloomy,shy,sleepy,worrier,gloomy').split(',') as CreatureKind[];
const obstacles = num('obstacles', 6);
const spare = num('spare', 1);
const minLen = num('min', 14);
const maxLen = num('max', 22);
const maxSolutions = num('maxSolutions', 6);
const tries = num('tries', 300);
const show = num('show', 3);
let seed = num('seed', 1);
/** Kinds whose rule must matter: relaxing them into Gloomy must allow clearly more solutions. */
const matters = (args.get('matters') ?? '').split(',').filter(Boolean) as CreatureKind[];
const fixedStart = args.get('start');

function rand(): number {
  // mulberry32
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = <T>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)]!;

type Candidate = { def: LevelDef; score: number; solutions: number; near: number; shortest: number };
const found: Candidate[] = [];

for (let n = 0; n < tries; n++) {
  const grid: string[][] = Array.from({ length: H }, () => Array.from({ length: W }, () => '.'));
  const free = () => {
    for (;;) {
      const x = Math.floor(rand() * W);
      const y = Math.floor(rand() * H);
      if (grid[H - 1 - y]![x] === '.') return { x, y };
    }
  };
  const start = fixedStart ? { x: fixedStart.charCodeAt(0) - 65, y: Number(fixedStart.slice(1)) - 1 } : { x: Math.floor(rand() * W), y: 0 };
  grid[H - 1]![start.x] = '*';
  for (let i = 0; i < obstacles; i++) {
    const t = free();
    grid[H - 1 - t.y]![t.x] = pick(['R', 'S', 'B']);
  }
  const creatures: CreatureDef[] = [];
  const taken = new Set<string>();
  for (const kind of kinds) {
    let t = free();
    while (taken.has(`${t.x},${t.y}`)) t = free();
    taken.add(`${t.x},${t.y}`);
    grid[H - 1 - t.y]![t.x] = 'c';
    const c: CreatureDef = { kind, at: tileName(t) };
    if (kind === 'shy') c.facing = pick(DIRS) as Dir;
    if (kind === 'worrier') c.countdown = 4 + Math.floor(rand() * 10);
    creatures.push(c);
  }
  const map = grid.map((row) => row.map((ch) => (ch === '*' || ch === 'c' ? '.' : ch)).join(' '));
  const base: LevelDef = { id: `gen-${n}`, name: `Generated ${n}`, warmth: maxLen, par: maxLen, bloomTarget: 0.5, start: tileName(start), map, creatures };
  let level;
  try {
    level = parseLevel(base);
  } catch {
    continue;
  }
  // Shy creatures must have a walkable tile in front of them.
  if (level.creatures.some((c) => c.kind === 'shy' && !isWalkable(level, add(c.at, c.facing!)))) continue;
  const wide = solve(level, { budget: maxLen, nearSolutions: false, maxNodes: 3_000_000, maxExamples: 1 });
  if (!wide.solvable || wide.truncated || wide.shortest! < minLen) continue;
  const warmth = wide.shortest! + spare;
  const def = { ...base, warmth, par: wide.shortest! };
  const r = solve(parseLevel(def), { maxNodes: 6_000_000, maxExamples: 1 });
  if (r.truncated || r.solutions > maxSolutions) continue;
  let relaxGain = 1;
  if (matters.length) {
    const relaxed = { ...def, creatures: def.creatures.map((c) => (matters.includes(c.kind) ? { kind: 'gloomy' as const, at: c.at } : c)) };
    const rr = solve(parseLevel(relaxed), { maxNodes: 6_000_000, maxExamples: 1, nearSolutions: false });
    relaxGain = rr.solutions / r.solutions;
    if (rr.shortest! < r.shortest!) relaxGain += 10 * (r.shortest! - rr.shortest!);
    if (relaxGain < 3) continue;
  }
  const score = r.nearSolutions / r.solutions + r.shortest! * 2 + Math.min(relaxGain, 30);
  found.push({ def, score, solutions: r.solutions, near: r.nearSolutions, shortest: r.shortest! });
}

found.sort((a, b) => b.score - a.score);
console.log(`${found.length} candidates from ${tries} tries`);
for (const c of found.slice(0, show)) {
  console.log(`\n// shortest ${c.shortest}, solutions ${c.solutions}, near ${c.near}`);
  console.log(JSON.stringify(c.def, null, 2));
}
