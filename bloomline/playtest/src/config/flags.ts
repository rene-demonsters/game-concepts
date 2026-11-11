/**
 * Feature flags. Override in the browser with URL params, e.g. ?commitOnRelease=1&debug=1.
 */
export type Flags = {
  /** The concept's lift-to-go. Off by default: a Go button commits (decided). */
  commitOnRelease: boolean;
  /** Lose a heart on a failed run. */
  hearts: boolean;
  /** Debug panel: unlock all, set hearts, push the clock, export analytics. */
  debug: boolean;
  /** Unlock every level. */
  unlockAll: boolean;
  /** Milliseconds per beat during a run. */
  beatMs: number;
  /** Start straight into a level by id. */
  level: string | null;
  /** Wipe the save on boot. */
  reset: boolean;
};

export const DEFAULT_FLAGS: Flags = {
  commitOnRelease: false,
  hearts: true,
  debug: import.meta.env.DEV,
  unlockAll: false,
  beatMs: 380,
  level: null,
  reset: false,
};

function bool(v: string | null, d: boolean): boolean {
  if (v === null) return d;
  return v === '' || v === '1' || v === 'true' || v === 'yes';
}

export function readFlags(search: string = typeof location === 'undefined' ? '' : location.search): Flags {
  const p = new URLSearchParams(search);
  return {
    commitOnRelease: bool(p.get('commitOnRelease'), DEFAULT_FLAGS.commitOnRelease),
    hearts: bool(p.get('hearts'), DEFAULT_FLAGS.hearts),
    debug: bool(p.get('debug'), DEFAULT_FLAGS.debug),
    unlockAll: bool(p.get('unlockAll'), DEFAULT_FLAGS.unlockAll),
    beatMs: p.has('beatMs') ? Math.max(60, Number(p.get('beatMs'))) : DEFAULT_FLAGS.beatMs,
    level: p.get('level'),
    reset: bool(p.get('reset'), DEFAULT_FLAGS.reset),
  };
}
