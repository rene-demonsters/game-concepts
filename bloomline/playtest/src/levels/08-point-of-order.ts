import { defineLevel } from '../core/level.ts';

/** Started from a generated layout (scripts/generate.ts), then checked with the solver. */
export default defineLevel({
  id: 'point-of-order',
  name: 'Point of Order',
  intro: 'Not one tile to spare.',
  warmth: 24,
  par: 24,
  bloomTarget: 0.55,
  start: 'G1',
  map: [
    '. . . . . . B',
    'B S . . . . .',
    '. . . . . . .',
    '. . . . . . .',
    '. . S . . . .',
    '. . . . R . .',
    '. . . . . . .',
    'S . . S . . .',
    '. . . . B R .',
  ],
  creatures: [
    { kind: 'sleepy', at: 'B7', species: 'bear' },
    { kind: 'worrier', at: 'C7', countdown: 9, species: 'goose' },
    { kind: 'shy', at: 'A6', facing: 'S', species: 'owl' },
    { kind: 'sleepy', at: 'E5', species: 'bear' },
    { kind: 'gloomy', at: 'C4', species: 'rabbit' },
    { kind: 'gloomy', at: 'F4', species: 'fox' },
    { kind: 'gloomy', at: 'F3', species: 'hedgehog' },
    { kind: 'shy', at: 'A1', facing: 'E', species: 'owl' },
  ],
});
