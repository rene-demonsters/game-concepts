import { type Dir, type Tile, OPPOSITE, add, dirBetween, isAdjacent, sameTile } from './coords.ts';
import { type Creature, type Level, walkableCount } from './level.ts';
import { type RunModifiers, NO_MODIFIERS } from './modifiers.ts';

export const Mood = {
  Gray: 0,
  Cheered: 1,
  Hidden: 2,
  Grumpy: 3,
  Honked: 4,
} as const;
export type Mood = (typeof Mood)[keyof typeof Mood];

export type FailCause = 'hid' | 'honk-hid' | 'grumpy' | 'honked' | 'not-reached';

export type SimEvent =
  | { type: 'start'; beat: 0 }
  | { type: 'step'; beat: number; from: Tile; to: Tile; dir: Dir; turned: boolean }
  | { type: 'greet'; beat: number; creature: number; paradeIndex: number }
  | { type: 'hide'; beat: number; creature: number; cause: 'approach' | 'honk' }
  | { type: 'grumpy'; beat: number; creature: number }
  | { type: 'tick'; beat: number; creature: number; remaining: number }
  | { type: 'honk'; beat: number; creature: number }
  | { type: 'bloom'; beat: number; origin: Tile; tiles: number[]; source: 'start' | 'path' | 'greet' }
  | { type: 'end'; beat: number };

export type Outcome = {
  cleared: boolean;
  /** Creature indices that aren't cheered at the end. */
  gray: number[];
  /** Why each gray creature stayed gray, by creature index. */
  causes: Record<number, FailCause>;
  length: number;
  bloomPct: number;
  stars: 0 | 1 | 2 | 3;
  nearMiss: boolean;
};

export type RunTimeline = {
  /** events grouped by beat: beats[0] is the setup, beats[n] is step n. */
  beats: SimEvent[][];
  outcome: Outcome;
};

/**
 * One run, advanced one step at a time. The solver clones it at every branch;
 * simulate() drives it over a whole path. Deterministic: no randomness, no clock.
 *
 * Order within a beat (see docs/prototype-plan.md, "Rule timing"):
 *  1. Ochre leaves the previous tile: a gray Sleepy creature next to it is cheered if Ochre goes
 *     straight on, and turns grumpy if Ochre turns. Leaving the start tile never counts.
 *  2. Ochre arrives: every gray creature next to the new tile reacts at once.
 *  3. Countdowns tick: a Worrier still gray at the end of beat N honks; gray Shy creatures hide.
 *  End of path: a gray Sleepy creature next to the last tile is cheered (stopping is quiet).
 */
export class Run {
  readonly level: Level;
  pos: Tile;
  beat = 0;
  lastDir: Dir | null = null;
  moods: Uint8Array;
  causes: Record<number, FailCause> = {};
  bloomed: Uint8Array;
  paradeSize = 0;
  finished = false;
  /** Events of the current beat; null disables event recording (the solver runs faster). */
  private events: SimEvent[][] | null;

  constructor(level: Level, recordEvents = true) {
    this.level = level;
    this.pos = level.start;
    this.moods = new Uint8Array(level.creatures.length);
    this.bloomed = new Uint8Array(level.width * level.height);
    this.events = recordEvents ? [[{ type: 'start', beat: 0 }]] : null;
    if (level.bloom.startTile) this.bloomAround(level.start, level.bloom.startRadius, 'start');
  }

  clone(): Run {
    const r = Object.create(Run.prototype) as Run;
    Object.assign(r, this);
    r.moods = this.moods.slice();
    r.bloomed = this.bloomed.slice();
    r.causes = { ...this.causes };
    r.events = null;
    return r;
  }

  get timeline(): SimEvent[][] {
    return this.events ?? [];
  }

  private emit(e: SimEvent): void {
    this.events?.[this.beat]?.push(e);
  }

  private cheer(c: Creature): void {
    this.moods[c.index] = Mood.Cheered;
    delete this.causes[c.index];
    this.emit({ type: 'greet', beat: this.beat, creature: c.index, paradeIndex: this.paradeSize });
    this.paradeSize++;
    this.bloomAround(c.at, this.level.bloom.greetRadius, 'greet');
  }

  private fail(c: Creature, mood: Mood, cause: FailCause): void {
    this.moods[c.index] = mood;
    this.causes[c.index] = cause;
  }

  private bloomAround(origin: Tile, radius: number, source: 'start' | 'path' | 'greet'): void {
    if (radius < 0) return;
    const { width, height } = this.level;
    const tiles: number[] = [];
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (this.level.bloom.shape === 'diamond' && Math.abs(dx) + Math.abs(dy) > radius) continue;
        const x = origin.x + dx;
        const y = origin.y + dy;
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        const i = y * width + x;
        if (!this.bloomed[i]) {
          this.bloomed[i] = 1;
          tiles.push(i);
        }
      }
    }
    if (this.events && tiles.length) this.emit({ type: 'bloom', beat: this.beat, origin, tiles, source });
  }

  /** Advance one tile. The caller is responsible for the path being valid (see checkStep). */
  step(to: Tile): void {
    const from = this.pos;
    const dir = dirBetween(from, to);
    if (!dir) throw new Error('Run.step: tiles are not adjacent');
    this.beat++;
    this.events?.push([]);
    const turned = this.lastDir !== null && this.lastDir !== dir;
    const { creatures } = this.level;

    // 1. Leaving the previous tile (never the start tile).
    if (this.lastDir !== null) {
      for (const c of creatures) {
        if (c.kind === 'sleepy' && this.moods[c.index] === Mood.Gray && isAdjacent(from, c.at)) {
          if (turned) {
            this.fail(c, Mood.Grumpy, 'grumpy');
            this.emit({ type: 'grumpy', beat: this.beat, creature: c.index });
          } else {
            this.cheer(c);
          }
        }
      }
    }

    this.pos = to;
    this.lastDir = dir;
    this.emit({ type: 'step', beat: this.beat, from, to, dir, turned });
    this.bloomAround(to, this.level.bloom.pathRadius, 'path');

    // 2. Arriving.
    for (const c of creatures) {
      if (this.moods[c.index] !== Mood.Gray || !isAdjacent(to, c.at)) continue;
      switch (c.kind) {
        case 'gloomy':
        case 'worrier':
          this.cheer(c);
          break;
        case 'shy': {
          const front = add(c.at, c.facing!);
          if (sameTile(front, to) && dir === OPPOSITE[c.facing!]) {
            this.cheer(c);
          } else {
            this.fail(c, Mood.Hidden, 'hid');
            this.emit({ type: 'hide', beat: this.beat, creature: c.index, cause: 'approach' });
          }
          break;
        }
        case 'sleepy':
          break; // resolved when Ochre leaves, or at the path end
      }
    }

    // 3. Countdowns.
    for (const c of creatures) {
      if (c.kind !== 'worrier' || this.moods[c.index] !== Mood.Gray) continue;
      const remaining = c.countdown! - this.beat;
      if (remaining > 0) {
        this.emit({ type: 'tick', beat: this.beat, creature: c.index, remaining });
        continue;
      }
      this.fail(c, Mood.Honked, 'honked');
      this.emit({ type: 'honk', beat: this.beat, creature: c.index });
      for (const s of creatures) {
        if (s.kind === 'shy' && this.moods[s.index] === Mood.Gray) {
          this.fail(s, Mood.Hidden, 'honk-hid');
          this.emit({ type: 'hide', beat: this.beat, creature: s.index, cause: 'honk' });
        }
      }
    }
  }

  /** The path ends here. Idempotent. */
  finish(): void {
    if (this.finished) return;
    this.finished = true;
    if (this.beat > 0) {
      for (const c of this.level.creatures) {
        if (c.kind === 'sleepy' && this.moods[c.index] === Mood.Gray && isAdjacent(this.pos, c.at)) this.cheer(c);
      }
    }
    this.emit({ type: 'end', beat: this.beat });
  }

  /** True when some creature can no longer be cheered in this run. */
  get doomed(): boolean {
    for (let i = 0; i < this.moods.length; i++) {
      if (this.moods[i] !== Mood.Gray && this.moods[i] !== Mood.Cheered) return true;
    }
    return false;
  }

  failedCount(): number {
    let n = 0;
    for (let i = 0; i < this.moods.length; i++) {
      if (this.moods[i] !== Mood.Gray && this.moods[i] !== Mood.Cheered) n++;
    }
    return n;
  }

  cheeredCount(): number {
    let n = 0;
    for (let i = 0; i < this.moods.length; i++) if (this.moods[i] === Mood.Cheered) n++;
    return n;
  }

  outcome(): Outcome {
    const level = this.level;
    const gray: number[] = [];
    const causes: Record<number, FailCause> = {};
    for (const c of level.creatures) {
      if (this.moods[c.index] !== Mood.Cheered) {
        gray.push(c.index);
        causes[c.index] = this.causes[c.index] ?? 'not-reached';
      }
    }
    const bloomPct = bloomPercentage(level, this.bloomed);
    const cleared = gray.length === 0;
    const length = this.beat;
    const stars = (cleared ? 1 + (length <= level.par ? 1 : 0) + (bloomPct >= level.bloomTarget ? 1 : 0) : 0) as Outcome['stars'];
    return { cleared, gray, causes, length, bloomPct, stars, nearMiss: gray.length === 1 };
  }
}

/** Share of walkable tiles in colour. Obstacles can bloom too, but never count. */
export function bloomPercentage(level: Level, bloomed: Uint8Array): number {
  const total = walkableCount(level);
  let n = 0;
  for (let i = 0; i < bloomed.length; i++) {
    if (bloomed[i] && level.terrain[i] === 'floor' && level.creatureAt[i] === -1) n++;
  }
  return total === 0 ? 1 : n / total;
}

/** Simulate a whole path (path[0] is the start tile). */
export function simulate(level: Level, path: readonly Tile[], _mods: RunModifiers = NO_MODIFIERS): RunTimeline {
  const run = new Run(level);
  for (let i = 1; i < path.length; i++) run.step(path[i]!);
  run.finish();
  return { beats: run.timeline, outcome: run.outcome() };
}
