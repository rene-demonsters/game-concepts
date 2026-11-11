import { defineLevel } from '../core/level.ts';

export default defineLevel({
  id: 'eye-contact',
  name: 'Eye Contact',
  intro: 'The owl only trusts you if it sees you coming. Walk along its dotted line, toward it.',
  warmth: 10,
  par: 8,
  bloomTarget: 0.55,
  start: 'B1',
  map: [
    '. . . . .',
    '. . . . .',
    '. . R . .',
    '. . . . .',
    '. . . . .',
    '. . . . .',
  ],
  creatures: [
    { kind: 'shy', at: 'E5', facing: 'W', species: 'owl' },
    { kind: 'gloomy', at: 'A3', species: 'rabbit' },
    { kind: 'gloomy', at: 'D2', species: 'mole' },
  ],
});
