import type { SaveData } from './save.ts';

export type HeartsConfig = { max: number; regenMs: number };

export const DEFAULT_HEARTS: HeartsConfig = { max: 5, regenMs: 20 * 60 * 1000 };

/**
 * Hearts refill one at a time, based on stored timestamps, so it works across app restarts.
 * All methods take `now` explicitly: no hidden clock.
 */
export class Hearts {
  private readonly save: SaveData;
  readonly config: HeartsConfig;
  constructor(save: SaveData, config: HeartsConfig = DEFAULT_HEARTS) {
    this.save = save;
    this.config = config;
  }

  /** Applies any refills that are due. Returns true if the save changed. */
  update(now: number): boolean {
    const h = this.save.hearts;
    if (now < h.since) {
      // The clock went backwards. Don't punish or reward it, just restart the timer.
      h.since = now;
      return true;
    }
    if (h.count >= this.config.max) {
      if (h.since !== now) {
        h.since = now;
        return true;
      }
      return false;
    }
    const gained = Math.floor((now - h.since) / this.config.regenMs);
    if (gained <= 0) return false;
    h.count = Math.min(this.config.max, h.count + gained);
    h.since = h.count >= this.config.max ? now : h.since + gained * this.config.regenMs;
    return true;
  }

  count(now: number): number {
    this.update(now);
    return this.save.hearts.count;
  }

  unlimited(now: number): boolean {
    return now < this.save.hearts.unlimitedUntil;
  }

  canPlay(now: number): boolean {
    return this.unlimited(now) || this.count(now) > 0;
  }

  /** Milliseconds until the next heart, or 0 when full. */
  msToNext(now: number): number {
    this.update(now);
    const h = this.save.hearts;
    if (h.count >= this.config.max) return 0;
    return Math.max(0, h.since + this.config.regenMs - now);
  }

  lose(now: number): void {
    if (this.unlimited(now)) return;
    this.update(now);
    const h = this.save.hearts;
    if (h.count >= this.config.max) h.since = now;
    h.count = Math.max(0, h.count - 1);
  }

  refill(now: number): void {
    this.save.hearts.count = this.config.max;
    this.save.hearts.since = now;
  }

  set(count: number, now: number): void {
    this.save.hearts.count = Math.max(0, Math.min(this.config.max, count));
    this.save.hearts.since = now;
  }

  grantUnlimited(ms: number, now: number): void {
    const h = this.save.hearts;
    h.unlimitedUntil = Math.max(h.unlimitedUntil, now) + ms;
  }
}
