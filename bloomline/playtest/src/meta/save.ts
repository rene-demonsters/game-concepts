import type { FailCause } from '../core/sim.ts';

export const SAVE_VERSION = 1;

export type LevelProgress = {
  stars: number;
  bestLength: number | null;
  bestBloom: number;
  attempts: number;
  clears: number;
};

export type AnalyticsEvent = {
  at: number;
  type: 'run' | 'level-open' | 'out-of-hearts' | 'redeem' | 'solution-shown';
  level?: string;
  cleared?: boolean;
  length?: number;
  gray?: number;
  causes?: FailCause[];
  planMs?: number;
  /** The run used a path drawn by the debug Solution button. */
  solutionShown?: boolean;
  offer?: string;
};

export type SaveData = {
  version: number;
  hearts: {
    count: number;
    /** When the regen timer last ticked (ms). */
    since: number;
    /** Unlimited hearts until this time (Bottomless Mug). */
    unlimitedUntil: number;
  };
  progress: Record<string, LevelProgress>;
  inventory: { coins: number; boosters: Record<string, number> };
  /** Written when Go is pressed, cleared when the run is reported. Survives an app kill. */
  pendingRun: { level: string; at: number } | null;
  analytics: AnalyticsEvent[];
  settings: { muted: boolean; fast: boolean };
};

export function freshSave(now: number): SaveData {
  return {
    version: SAVE_VERSION,
    hearts: { count: 5, since: now, unlimitedUntil: 0 },
    progress: {},
    inventory: { coins: 0, boosters: {} },
    pendingRun: null,
    analytics: [],
    settings: { muted: false, fast: false },
  };
}

/** Upgrades older saves. Unknown or broken data starts fresh. */
export function migrate(raw: unknown, now: number): SaveData {
  if (!raw || typeof raw !== 'object') return freshSave(now);
  const data = raw as Partial<SaveData>;
  if (typeof data.version !== 'number' || data.version > SAVE_VERSION) return freshSave(now);
  // Version 1 is the first; future migrations go here, one step at a time.
  const base = freshSave(now);
  return {
    ...base,
    ...data,
    hearts: { ...base.hearts, ...data.hearts },
    inventory: { ...base.inventory, ...data.inventory },
    settings: { ...base.settings, ...data.settings },
    progress: data.progress ?? {},
    analytics: data.analytics ?? [],
    pendingRun: data.pendingRun ?? null,
    version: SAVE_VERSION,
  };
}
