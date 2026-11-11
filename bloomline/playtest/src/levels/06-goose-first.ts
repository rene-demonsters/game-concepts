import { defineLevel } from '../core/level.ts';

/** The worked example from the concept. Solver-checked: exactly four 15-tile solutions. */
export default defineLevel({
  id: 'goose-first',
  name: 'Goose First',
  intro: 'The goose has been counting. Nobody asked it to.',
  warmth: 15,
  par: 15,
  bloomTarget: 0.6,
  start: 'A1',
  map: [
    '. . . . .',
    '. . R . .',
    '. . . S .',
    '. . . . .',
    '. S . . .',
    '. . . . .',
  ],
  creatures: [
    { kind: 'shy', at: 'A6', facing: 'E' },
    { kind: 'worrier', at: 'E6', countdown: 8 },
    { kind: 'sleepy', at: 'C3' },
  ],
});
