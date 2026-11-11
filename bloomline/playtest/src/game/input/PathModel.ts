import { type Tile, sameTile } from '../../core/coords.ts';
import type { Level } from '../../core/level.ts';
import { type RunModifiers, NO_MODIFIERS, budgetFor } from '../../core/modifiers.ts';
import { type StepCheck, checkStep, indexInPath } from '../../core/path.ts';

/** The path being drawn. path[0] is always Ochre's start tile. */
export class PathModel {
  readonly level: Level;
  mods: RunModifiers;
  tiles: Tile[];

  constructor(level: Level, initial?: readonly Tile[], mods: RunModifiers = NO_MODIFIERS) {
    this.level = level;
    this.mods = mods;
    this.tiles = [level.start];
    if (initial) for (const t of initial.slice(1)) if (this.check(t) === 'ok') this.tiles.push(t);
  }

  get head(): Tile {
    return this.tiles[this.tiles.length - 1]!;
  }

  get length(): number {
    return this.tiles.length - 1;
  }

  get budget(): number {
    return budgetFor(this.level.warmth, this.mods);
  }

  check(t: Tile): StepCheck {
    return checkStep(this.level, this.tiles, t, this.mods);
  }

  indexOf(t: Tile): number {
    return indexInPath(this.tiles, t);
  }

  isPrevious(t: Tile): boolean {
    return this.tiles.length >= 2 && sameTile(this.tiles[this.tiles.length - 2]!, t);
  }

  extend(t: Tile): StepCheck {
    const r = this.check(t);
    if (r === 'ok') this.tiles.push(t);
    return r;
  }

  pop(): boolean {
    if (this.tiles.length <= 1) return false;
    this.tiles.pop();
    return true;
  }

  truncateTo(index: number): void {
    this.tiles.length = Math.max(1, Math.min(this.tiles.length, index + 1));
  }

  clear(): void {
    this.tiles.length = 1;
  }

  snapshot(): Tile[] {
    return this.tiles.slice();
  }
}
