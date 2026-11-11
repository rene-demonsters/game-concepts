import type { LevelDef } from '../core/level.ts';
import twoRabbits from './01-two-rabbits.ts';
import showOfHands from './02-show-of-hands.ts';
import eyeContact from './03-eye-contact.ts';
import straightPastTheBear from './04-straight-past-the-bear.ts';
import mildPanic from './05-mild-panic.ts';
import gooseFirst from './06-goose-first.ts';
import anyOtherBusiness from './07-any-other-business.ts';
import pointOfOrder from './08-point-of-order.ts';

export const LEVELS: readonly LevelDef[] = [
  twoRabbits,
  showOfHands,
  eyeContact,
  straightPastTheBear,
  mildPanic,
  gooseFirst,
  anyOtherBusiness,
  pointOfOrder,
];
