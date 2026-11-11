import { defineLevel } from '../core/level.ts';

export default defineLevel({
  id: 'show-of-hands',
  name: 'Show of Hands',
  intro: 'Warmth runs out. Every tile counts.',
  warmth: 9,
  par: 8,
  bloomTarget: 0.6,
  start: 'C1',
  map: [
    '. . . . .',
    '. . . R .',
    '. . . . .',
    '. . R . .',
    '. . . . .',
    '. . . . .',
  ],
  creatures: [
    { kind: 'gloomy', at: 'B6', species: 'rabbit' },
    { kind: 'gloomy', at: 'A4', species: 'fox' },
    { kind: 'gloomy', at: 'E4', species: 'rabbit' },
    { kind: 'gloomy', at: 'D2', species: 'mole' },
  ],
});
