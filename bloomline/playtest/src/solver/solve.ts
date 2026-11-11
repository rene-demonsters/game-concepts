import { type Tile, DIRS, add, tileName } from '../core/coords.ts';
import { type Level, isWalkable, tileIndex } from '../core/level.ts';
import { Mood, Run } from '../core/sim.ts';

export type SolveReport = {
  solvable: boolean;
  /** Distinct paths within the Warmth budget that cheer everyone, ending on the final greeting. */
  solutions: number;
  shortest: number | null;
  /** A few shortest solutions, as tile names. */
  examples: string[][];
  /** Paths that cheer everyone but one, ending on their last greeting. The "so close" count. */
  nearSolutions: number;
  nodes: number;
  /** True if the node limit was hit; counts are then lower bounds. */
  truncated: boolean;
};

export type SolveOptions = {
  budget?: number;
  maxNodes?: number;
  maxExamples?: number;
  nearSolutions?: boolean;
};

type Search = {
  level: Level;
  budget: number;
  allowedFails: number;
  used: Uint8Array;
  path: Tile[];
  /** Walkable tiles next to each creature. */
  approaches: Tile[][];
  nodes: number;
  maxNodes: number;
  onLeaf: (run: Run, cheeredBefore: number, path: readonly Tile[]) => void;
};

function approachesFor(level: Level): Tile[][] {
  return level.creatures.map((c) => DIRS.map((d) => add(c.at, d)).filter((t) => isWalkable(level, t)));
}

function prune(s: Search, run: Run): boolean {
  const remaining = s.budget - run.beat;
  let failed = run.failedCount();
  if (failed > s.allowedFails) return true;
  for (const c of s.level.creatures) {
    if (run.moods[c.index] !== Mood.Gray) continue;
    let best = Infinity;
    for (const a of s.approaches[c.index]!) {
      const d = Math.abs(a.x - run.pos.x) + Math.abs(a.y - run.pos.y);
      if (d < best) best = d;
    }
    // A Sleepy creature is only resolved after Ochre leaves (or stops on) the tile next to it.
    const late = c.kind === 'worrier' && run.beat + best > c.countdown!;
    if (best > remaining || late) {
      failed++;
      if (failed > s.allowedFails) return true;
    }
  }
  return false;
}

function dfs(s: Search, run: Run): void {
  if (s.nodes++ >= s.maxNodes) return;
  if (run.beat >= s.budget) return;
  for (const d of DIRS) {
    const next = add(run.pos, d);
    if (!isWalkable(s.level, next)) continue;
    const i = tileIndex(s.level, next);
    if (s.used[i]) continue;
    const child = run.clone();
    const before = child.cheeredCount();
    child.step(next);
    if (child.failedCount() > s.allowedFails) continue;
    s.used[i] = 1;
    s.path.push(next);
    const leaf = child.clone();
    leaf.finish();
    s.onLeaf(leaf, before, s.path);
    if (!prune(s, child)) dfs(s, child);
    s.path.pop();
    s.used[i] = 0;
  }
}

function search(level: Level, budget: number, allowedFails: number, maxNodes: number, onLeaf: Search['onLeaf']): { nodes: number; truncated: boolean } {
  const s: Search = {
    level,
    budget,
    allowedFails,
    used: new Uint8Array(level.width * level.height),
    path: [level.start],
    approaches: approachesFor(level),
    nodes: 0,
    maxNodes,
    onLeaf,
  };
  s.used[tileIndex(level, level.start)] = 1;
  const run = new Run(level, false);
  dfs(s, run);
  return { nodes: s.nodes, truncated: s.nodes >= maxNodes };
}

export function solve(level: Level, opts: SolveOptions = {}): SolveReport {
  const budget = opts.budget ?? level.warmth;
  const maxNodes = opts.maxNodes ?? 20_000_000;
  const maxExamples = opts.maxExamples ?? 5;
  const n = level.creatures.length;

  let solutions = 0;
  let shortest: number | null = null;
  let examples: string[][] = [];

  const first = search(level, budget, 0, maxNodes, (leaf, before, path) => {
    if (leaf.cheeredCount() !== n || before === n) return;
    solutions++;
    const names = path.slice(1).map(tileName);
    if (shortest === null || leaf.beat < shortest) {
      shortest = leaf.beat;
      examples = [names];
    } else if (leaf.beat === shortest && examples.length < maxExamples) {
      examples.push(names);
    }
  });

  let nearSolutions = 0;
  let nodes = first.nodes;
  let truncated = first.truncated;
  if (opts.nearSolutions !== false && n > 1) {
    const second = search(level, budget, 1, maxNodes, (leaf, before) => {
      const cheered = leaf.cheeredCount();
      if (cheered === n - 1 && before < cheered) nearSolutions++;
    });
    nodes += second.nodes;
    truncated ||= second.truncated;
  }

  return { solvable: solutions > 0, solutions, shortest, examples, nearSolutions, nodes, truncated };
}
