import { defineLevel } from '../core/level.ts';

/** Started from a generated layout (scripts/generate.ts), then checked with the solver. */
export default defineLevel({
  id: 'any-other-business',
  name: 'Any Other Business',
  intro: 'Everything you know, all at once. Take your time planning.',
  warmth: 20,
  par: 18,
  bloomTarget: 0.6,
  start: 'E1',
  map: [
    '. . . . . .',
    'R S . . . .',
    '. . . . . .',
    '. B . . . .',
    'R . . . . .',
    '. . . . . .',
    '. R . . . .',
    '. S . . . .',
  ],
  creatures: [
    { kind: 'sleepy', at: 'D7', species: 'bear' },
    { kind: 'worrier', at: 'E7', countdown: 9, species: 'goose' },
    { kind: 'gloomy', at: 'C5', species: 'rabbit' },
    { kind: 'gloomy', at: 'E4', species: 'fox' },
    { kind: 'shy', at: 'E3', facing: 'S', species: 'owl' },
    { kind: 'gloomy', at: 'F3', species: 'hedgehog' },
  ],
});
