import { describe, expect, it } from 'vitest';
import { parseTile } from '../../src/core/coords.ts';
import { parseLevel } from '../../src/core/level.ts';
import { simulate } from '../../src/core/sim.ts';
import { solve } from '../../src/solver/solve.ts';
import gooseFirst from '../../src/levels/06-goose-first.ts';

const level = parseLevel(gooseFirst);
const path = (names: string) => [level.start, ...names.split(' ').map(parseTile)];

describe('Goose First (the concept worked example)', () => {
  it('has exactly the four 15-tile solutions the concept describes, and nothing shorter', () => {
    const report = solve(level, { maxExamples: 10, budget: 20, nearSolutions: false });
    expect(report.shortest).toBe(15);
    const at15 = solve(level, { maxExamples: 10, nearSolutions: false });
    expect(at15.solutions).toBe(4);
    expect(at15.examples.map((e) => e.join(' ')).sort()).toEqual(
      [
        'B1 C1 D1 D2 E2 E3 E4 E5 D5 D6 C6 B6 B5 B4 B3',
        'B1 C1 D1 D2 E2 E3 E4 E5 D5 D6 C6 B6 B5 B4 C4',
        'B1 C1 D1 E1 E2 E3 E4 E5 D5 D6 C6 B6 B5 B4 B3',
        'B1 C1 D1 E1 E2 E3 E4 E5 D5 D6 C6 B6 B5 B4 C4',
      ].sort(),
    );
  });

  it('clears with the intended route and earns stars', () => {
    const { outcome } = simulate(level, path('B1 C1 D1 E1 E2 E3 E4 E5 D5 D6 C6 B6 B5 B4 B3'));
    expect(outcome.cleared).toBe(true);
    expect(outcome.length).toBe(15);
    expect(outcome.stars).toBeGreaterThanOrEqual(2);
  });

  it('the owl hides when approached from below', () => {
    const { outcome } = simulate(level, path('A2 A3 A4 A5'));
    expect(outcome.causes[0]).toBe('hid');
  });

  it('the goose honks if it is not greeted by beat 8', () => {
    const { outcome } = simulate(level, path('B1 C1 D1 E1 E2 E3 D3 D2'));
    expect(outcome.causes[1]).toBe('honked');
    expect(outcome.causes[0]).toBe('honk-hid');
  });

  it('turning next to the bear makes it grumpy', () => {
    const { outcome } = simulate(level, path('B1 C1 C2 D2'));
    expect(outcome.causes[2]).toBe('grumpy');
  });
});
