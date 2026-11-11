import { defineLevel } from '../core/level.ts';

export default defineLevel({
  id: 'two-rabbits',
  name: 'Two Rabbits, No Plans',
  intro: 'Drag a path from Ochre. Walk next to someone to cheer them up.',
  warmth: 7,
  par: 4,
  bloomTarget: 0.35,
  start: 'C1',
  map: [
    '. . . . .',
    '. . . . .',
    '. . . . .',
    '. . . . .',
    '. . . . .',
    '. . . . .',
  ],
  creatures: [
    { kind: 'gloomy', at: 'B4', species: 'rabbit' },
    { kind: 'gloomy', at: 'D5', species: 'rabbit' },
  ],
});
