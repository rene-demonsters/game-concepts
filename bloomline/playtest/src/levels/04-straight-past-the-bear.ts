import { defineLevel } from '../core/level.ts';

export default defineLevel({
  id: 'straight-past-the-bear',
  name: 'Straight Past the Bear',
  intro: 'Turning next to a sleeper wakes it up grumpy. Walking straight past is fine.',
  warmth: 11,
  par: 9,
  bloomTarget: 0.55,
  start: 'C1',
  map: [
    '. . . . .',
    '. . . . .',
    '. . . . .',
    '. . . . .',
    '. R . R .',
    '. . . . .',
  ],
  creatures: [
    { kind: 'sleepy', at: 'C4', species: 'bear' },
    { kind: 'gloomy', at: 'A5', species: 'rabbit' },
    { kind: 'gloomy', at: 'E5', species: 'fox' },
  ],
});
