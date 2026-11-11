/**
 * Things that change a run without changing the level. Empty in the playtest.
 * Boosters and the near-miss continue plug in here later (Extra Warmth = extraWarmth: 3).
 */
export type RunModifiers = {
  extraWarmth?: number;
};

export const NO_MODIFIERS: RunModifiers = Object.freeze({});

export function budgetFor(warmth: number, mods: RunModifiers): number {
  return warmth + (mods.extraWarmth ?? 0);
}
