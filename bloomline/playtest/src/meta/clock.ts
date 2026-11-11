export interface Clock {
  now(): number;
}

export const systemClock: Clock = { now: () => Date.now() };

/** A clock the debug panel and tests can push forward. */
export class OffsetClock implements Clock {
  offset = 0;
  private readonly base: Clock;
  constructor(base: Clock = systemClock) {
    this.base = base;
  }
  now(): number {
    return this.base.now() + this.offset;
  }
}
