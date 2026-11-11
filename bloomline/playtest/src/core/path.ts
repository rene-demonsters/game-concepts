import { type Tile, isAdjacent } from './coords.ts';
import { type Level, inBounds, isWalkable } from './level.ts';
import { type RunModifiers, NO_MODIFIERS, budgetFor } from './modifiers.ts';

export type StepCheck = 'ok' | 'out-of-bounds' | 'not-adjacent' | 'blocked' | 'used' | 'no-warmth';

/**
 * Draw-time validation. Only static rules: nothing here depends on timing or greeting order,
 * so drawing never gives away how the run will go.
 * A path always starts with Ochre's start tile; its length in tiles is path.length - 1.
 */
export function checkStep(level: Level, path: readonly Tile[], next: Tile, mods: RunModifiers = NO_MODIFIERS): StepCheck {
  const head = path[path.length - 1]!;
  if (!inBounds(level, next)) return 'out-of-bounds';
  if (!isAdjacent(head, next)) return 'not-adjacent';
  if (!isWalkable(level, next)) return 'blocked';
  if (path.some((t) => t.x === next.x && t.y === next.y)) return 'used';
  if (path.length - 1 >= budgetFor(level.warmth, mods)) return 'no-warmth';
  return 'ok';
}

export function pathLength(path: readonly Tile[]): number {
  return Math.max(0, path.length - 1);
}

export function indexInPath(path: readonly Tile[], t: Tile): number {
  return path.findIndex((p) => p.x === t.x && p.y === t.y);
}

/** Full validation of a finished path, used by tests and the solver's sanity checks. */
export function validatePath(level: Level, path: readonly Tile[], mods: RunModifiers = NO_MODIFIERS): StepCheck {
  if (path.length === 0 || path[0]!.x !== level.start.x || path[0]!.y !== level.start.y) return 'blocked';
  for (let i = 1; i < path.length; i++) {
    const r = checkStep(level, path.slice(0, i), path[i]!, mods);
    if (r !== 'ok') return r;
  }
  return 'ok';
}
