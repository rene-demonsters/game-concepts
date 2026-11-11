import { describe, expect, it } from 'vitest';
import { parseTile } from '../../src/core/coords.ts';
import { type LevelDef, parseLevel } from '../../src/core/level.ts';
import { checkStep, validatePath } from '../../src/core/path.ts';
import { simulate } from '../../src/core/sim.ts';
import { solve } from '../../src/solver/solve.ts';
import { LEVELS } from '../../src/levels/index.ts';

const base: LevelDef = {
  id: 't',
  name: 't',
  warmth: 10,
  par: 10,
  bloomTarget: 0.5,
  start: 'A1',
  map: ['. . . .', '. . . .', '. . . .', '. . . .'],
  creatures: [],
};
const lvl = (over: Partial<LevelDef>) => parseLevel({ ...base, ...over });
const run = (level: ReturnType<typeof lvl>, names: string) =>
  simulate(level, [level.start, ...names.split(' ').filter(Boolean).map(parseTile)]).outcome;

describe('path rules', () => {
  const level = lvl({ map: ['. . . .', '. . . .', '. R . .', '. . . .'], creatures: [{ kind: 'gloomy', at: 'D4' }], warmth: 3 });
  const p = (names: string) => [level.start, ...names.split(' ').filter(Boolean).map(parseTile)];
  it('blocks obstacles, creatures, reuse, diagonals and over-budget steps', () => {
    expect(checkStep(level, p(''), parseTile('B1'))).toBe('ok');
    expect(checkStep(level, p('A2'), parseTile('B2'))).toBe('blocked');
    expect(checkStep(level, p('B1'), parseTile('A1'))).toBe('used');
    expect(checkStep(level, p(''), parseTile('B2'))).toBe('not-adjacent');
    expect(checkStep(level, p('B1 C1 D1'), parseTile('D2'))).toBe('no-warmth');
    expect(checkStep(level, p('A2 A3 A4'), parseTile('B4'), { extraWarmth: 1 })).toBe('ok');
    expect(checkStep(level, p('B1 C1 D1 D2'), parseTile('D3'), { extraWarmth: 9 })).toBe('ok');
    expect(validatePath(level, p('B1 C1 D1'))).toBe('ok');
  });
});

describe('greetings', () => {
  it('there is no greeting on beat 0', () => {
    const level = lvl({ creatures: [{ kind: 'gloomy', at: 'A2' }] });
    expect(run(level, '').cleared).toBe(false);
  });

  it('one tile next to two creatures greets both', () => {
    const level = lvl({ start: 'B1', creatures: [{ kind: 'gloomy', at: 'A2' }, { kind: 'gloomy', at: 'C2' }] });
    const r = simulate(level, [level.start, parseTile('B2')]);
    expect(r.outcome.cleared).toBe(true);
    expect(r.beats[1]!.filter((e) => e.type === 'greet')).toHaveLength(2);
  });

  it('shy: greeted only when walking toward it along its gaze', () => {
    const level = lvl({ creatures: [{ kind: 'shy', at: 'A4', facing: 'E' }] });
    expect(run(level, 'B1 C1 C2 C3 C4 B4').cleared).toBe(true);
    expect(run(level, 'A2 A3').causes[0]).toBe('hid');
    expect(run(level, 'B1 B2 B3 B4').causes[0]).toBe('hid');
  });

  it('sleepy: straight past cheers, turning makes it grumpy, stopping is quiet', () => {
    const level = lvl({ creatures: [{ kind: 'sleepy', at: 'B3' }] });
    expect(run(level, 'A2 A3 A4').cleared).toBe(true);
        expect(run(level, 'B1 C1 C2 C3 D3').causes[0]).toBe('grumpy');
    expect(run(level, 'B1 C1 C2 C3').cleared).toBe(true);
  });

  it('sleepy: leaving the start tile never counts', () => {
    const level = lvl({ start: 'A3', creatures: [{ kind: 'sleepy', at: 'B3' }] });
    expect(run(level, 'A4').causes[0]).toBe('not-reached');
  });

  it('worrier: greeting on the countdown beat is in time; one beat later it honks and shy creatures hide', () => {
    const level = lvl({ creatures: [{ kind: 'worrier', at: 'D1', countdown: 2 }, { kind: 'shy', at: 'A4', facing: 'S' }] });
    expect(run(level, 'B1 C1').causes[0]).toBeUndefined();
    const late = run(level, 'A2 B2 C2');
    expect(late.causes[0]).toBe('honked');
    expect(late.causes[1]).toBe('honk-hid');
  });
});

describe('bloom and stars', () => {
  it('counts the start tile, walked tiles and greeting areas, but only walkable tiles', () => {
    const level = lvl({ map: ['. . . .', '. . . .', '. . . .', 'R . . .'], start: 'B1', creatures: [{ kind: 'gloomy', at: 'D4' }] });
    // 16 tiles, minus the rock and the creature = 14 walkable.
    const r = simulate(level, [level.start]).outcome;
    expect(r.bloomPct).toBeCloseTo(1 / 14);
  });

  it('is tunable per level', () => {
    const level = lvl({ start: 'B2', bloom: { startRadius: 1 } });
    expect(simulate(level, [level.start]).outcome.bloomPct).toBeCloseTo(9 / 16);
    const off = lvl({ bloom: { startTile: false } });
    expect(simulate(off, [off.start]).outcome.bloomPct).toBe(0);
  });
});

describe('levels', () => {
  for (const def of LEVELS) {
    it(`${def.id} is solvable and its par is the shortest solution`, () => {
      const r = solve(parseLevel(def), { nearSolutions: false });
      expect(r.solvable).toBe(true);
      expect(r.shortest).toBe(def.par);
      expect(r.truncated).toBe(false);
    });
  }
});
