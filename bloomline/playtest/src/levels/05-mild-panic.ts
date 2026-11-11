import { defineLevel } from '../core/level.ts';

export default defineLevel({
  id: 'mild-panic',
  name: 'Mild Panic',
  intro: 'The goose counts down one step at a time. Get there before it reaches zero.',
  warmth: 12,
  par: 11,
  bloomTarget: 0.55,
  start: 'C1',
  map: [
    '. . . . .',
    '. . . . .',
    '. . R . .',
    '. . . . .',
    '. . . . .',
    '. . . . .',
  ],
  creatures: [
    { kind: 'worrier', at: 'E6', countdown: 6, species: 'goose' },
    { kind: 'gloomy', at: 'A6', species: 'rabbit' },
    { kind: 'gloomy', at: 'A3', species: 'hedgehog' },
    { kind: 'gloomy', at: 'D2', species: 'mole' },
  ],
});
