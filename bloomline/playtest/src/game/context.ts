import type { Flags } from '../config/flags.ts';
import type { Session } from '../meta/session.ts';
import type { Platform } from '../platform/types.ts';
import type { Synth } from './audio/synth.ts';

export type GameContext = {
  session: Session;
  platform: Platform;
  flags: Flags;
  synth: Synth;
};

let current: GameContext | null = null;

export function setContext(c: GameContext): void {
  current = c;
}

export function ctx(): GameContext {
  if (!current) throw new Error('Game context not set');
  return current;
}
