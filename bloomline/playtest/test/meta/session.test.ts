import { describe, expect, it } from 'vitest';
import type { Outcome } from '../../src/core/sim.ts';
import { OffsetClock } from '../../src/meta/clock.ts';
import { Session } from '../../src/meta/session.ts';
import { LEVELS } from '../../src/levels/index.ts';
import type { KeyValueStorage } from '../../src/platform/types.ts';

function memoryStorage(): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    get: async (k) => data.get(k) ?? null,
    set: async (k, v) => void data.set(k, v),
    remove: async (k) => void data.delete(k),
  };
}

const fail: Outcome = { cleared: false, gray: [0], causes: { 0: 'not-reached' }, length: 3, bloomPct: 0.2, stars: 0, nearMiss: true };
const win: Outcome = { cleared: true, gray: [], causes: {}, length: 4, bloomPct: 0.5, stars: 3, nearMiss: false };
const fixed = { now: () => 1_000_000 };

describe('Session', () => {
  it('loses a heart only on a failed run, and refills over time', async () => {
    const clock = new OffsetClock(fixed);
    const s = await Session.load({ storage: memoryStorage(), clock, levels: LEVELS });
    expect(s.heartCount()).toBe(5);
    await s.beginRun('two-rabbits');
    s.reportRun('two-rabbits', win, 1000);
    expect(s.heartCount()).toBe(5);
    await s.beginRun('two-rabbits');
    expect(s.reportRun('two-rabbits', fail, 1000).heartLost).toBe(true);
    expect(s.heartCount()).toBe(4);
    clock.offset += 20 * 60 * 1000;
    expect(s.heartCount()).toBe(5);
  });

  it('blocks Go at zero hearts, but a refill offer fixes it', async () => {
    const s = await Session.load({ storage: memoryStorage(), clock: new OffsetClock(fixed), levels: LEVELS });
    s.debugSetHearts(0);
    expect(s.canStartRun()).toBe(false);
    expect(await s.beginRun('two-rabbits')).toBe(false);
    await s.redeem('hearts.refill');
    expect(s.heartCount()).toBe(5);
  });

  it('counts a run interrupted by closing the app as a failed run', async () => {
    const storage = memoryStorage();
    const clock = new OffsetClock(fixed);
    const s = await Session.load({ storage, clock, levels: LEVELS });
    await s.beginRun('two-rabbits');
    // app killed here: no reportRun
    const again = await Session.load({ storage, clock, levels: LEVELS });
    expect(again.heartCount()).toBe(4);
    expect(again.recoveredPendingRun).toBe('two-rabbits');
    expect(again.progressFor('two-rabbits').attempts).toBe(1);
  });

  it('unlocks the next level after a clear', async () => {
    const s = await Session.load({ storage: memoryStorage(), clock: new OffsetClock(fixed), levels: LEVELS });
    expect(s.isUnlocked(LEVELS[1]!.id)).toBe(false);
    s.reportRun(LEVELS[0]!.id, win, 0);
    expect(s.isUnlocked(LEVELS[1]!.id)).toBe(true);
  });

  it('survives a clock going backwards', async () => {
    const clock = new OffsetClock(fixed);
    const s = await Session.load({ storage: memoryStorage(), clock, levels: LEVELS });
    s.debugSetHearts(2);
    clock.offset -= 60 * 60 * 1000;
    expect(s.heartCount()).toBe(2);
  });
});
