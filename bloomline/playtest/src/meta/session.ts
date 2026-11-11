import type { LevelDef } from '../core/level.ts';
import type { Outcome } from '../core/sim.ts';
import type { KeyValueStorage } from '../platform/types.ts';
import { type AdService, noAds } from './ads.ts';
import type { Clock } from './clock.ts';
import { DEFAULT_HEARTS, type HeartsConfig, Hearts } from './hearts.ts';
import { OFFERS, type Offer, type OfferId } from './offers.ts';
import { type AnalyticsEvent, type LevelProgress, type SaveData, freshSave, migrate } from './save.ts';
import { PrototypeStore, type StoreService } from './store.ts';

const SAVE_KEY = 'bloomline.playtest.save';
const MAX_ANALYTICS = 3000;

export type SessionOptions = {
  storage: KeyValueStorage;
  clock: Clock;
  levels: readonly LevelDef[];
  heartsEnabled?: boolean;
  unlockAll?: boolean;
  store?: StoreService;
  ads?: AdService;
  hearts?: HeartsConfig;
};

export type RunReport = {
  heartLost: boolean;
  newBestStars: boolean;
  firstClear: boolean;
};

/**
 * The only object the game layer talks to for anything outside a single run:
 * hearts, progress, offers, analytics. A real store slots in behind redeem() later.
 */
export class Session {
  readonly levels: readonly LevelDef[];
  readonly store: StoreService;
  readonly ads: AdService;
  heartsEnabled: boolean;
  unlockAll: boolean;
  private data: SaveData;
  private readonly storage: KeyValueStorage;
  private readonly clock: Clock;
  private hearts: Hearts;
  private readonly heartsConfig: HeartsConfig;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<() => void>();
  /** Set when the previous session ended mid-run; the UI can mention it once. */
  recoveredPendingRun: string | null = null;

  private constructor(opts: SessionOptions, data: SaveData) {
    this.levels = opts.levels;
    this.storage = opts.storage;
    this.clock = opts.clock;
    this.store = opts.store ?? new PrototypeStore();
    this.ads = opts.ads ?? noAds;
    this.heartsEnabled = opts.heartsEnabled ?? true;
    this.unlockAll = opts.unlockAll ?? false;
    this.heartsConfig = opts.hearts ?? DEFAULT_HEARTS;
    this.data = data;
    this.hearts = new Hearts(this.data, this.heartsConfig);
  }

  static async load(opts: SessionOptions, reset = false): Promise<Session> {
    const now = opts.clock.now();
    let data: SaveData;
    if (reset) {
      data = freshSave(now);
    } else {
      let raw: unknown = null;
      try {
        const text = await opts.storage.get(SAVE_KEY);
        raw = text ? JSON.parse(text) : null;
      } catch {
        raw = null;
      }
      data = migrate(raw, now);
    }
    const session = new Session(opts, data);
    if (data.pendingRun) {
      // The app was closed during a run. That counts as a failed run.
      session.recoveredPendingRun = data.pendingRun.level;
      if (session.heartsEnabled) session.hearts.lose(now);
      session.bumpAttempt(data.pendingRun.level);
      data.pendingRun = null;
    }
    session.hearts.update(now);
    await session.flush();
    return session;
  }

  get now(): number {
    return this.clock.now();
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private changed(): void {
    for (const fn of this.listeners) fn();
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => void this.flush(), 150);
  }

  async flush(): Promise<void> {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = null;
    await this.storage.set(SAVE_KEY, JSON.stringify(this.data));
  }

  // ---- hearts ----

  heartCount(): number {
    return this.hearts.count(this.now);
  }

  heartsMax(): number {
    return this.heartsConfig.max;
  }

  msToNextHeart(): number {
    return this.hearts.msToNext(this.now);
  }

  unlimitedHearts(): boolean {
    return !this.heartsEnabled || this.hearts.unlimited(this.now);
  }

  canStartRun(): boolean {
    return !this.heartsEnabled || this.hearts.canPlay(this.now);
  }

  // ---- runs ----

  /** Press Go. The marker is saved right away, so killing the app mid-run still costs a heart. */
  async beginRun(levelId: string): Promise<boolean> {
    if (!this.canStartRun()) {
      this.track({ type: 'out-of-hearts', level: levelId });
      return false;
    }
    this.data.pendingRun = { level: levelId, at: this.now };
    await this.flush();
    return true;
  }

  reportRun(levelId: string, outcome: Outcome, planMs: number, solutionShown = false): RunReport {
    const now = this.now;
    this.data.pendingRun = null;
    const p = this.bumpAttempt(levelId);
    let heartLost = false;
    let newBestStars = false;
    let firstClear = false;
    if (outcome.cleared) {
      firstClear = p.clears === 0;
      p.clears++;
      if (outcome.stars > p.stars) {
        newBestStars = true;
        p.stars = outcome.stars;
      }
      p.bestLength = p.bestLength === null ? outcome.length : Math.min(p.bestLength, outcome.length);
      p.bestBloom = Math.max(p.bestBloom, outcome.bloomPct);
    } else if (this.heartsEnabled && !this.hearts.unlimited(now)) {
      this.hearts.lose(now);
      heartLost = true;
    }
    this.track({
      type: 'run',
      level: levelId,
      cleared: outcome.cleared,
      length: outcome.length,
      gray: outcome.gray.length,
      causes: Object.values(outcome.causes),
      planMs: Math.round(planMs),
      ...(solutionShown ? { solutionShown } : {}),
    });
    this.changed();
    return { heartLost, newBestStars, firstClear };
  }

  private bumpAttempt(levelId: string): LevelProgress {
    const p = this.progressFor(levelId);
    p.attempts++;
    this.data.progress[levelId] = p;
    return p;
  }

  // ---- progress ----

  progressFor(levelId: string): LevelProgress {
    return this.data.progress[levelId] ?? { stars: 0, bestLength: null, bestBloom: 0, attempts: 0, clears: 0 };
  }

  isUnlocked(levelId: string): boolean {
    if (this.unlockAll) return true;
    const i = this.levels.findIndex((l) => l.id === levelId);
    if (i <= 0) return i === 0;
    return this.progressFor(this.levels[i - 1]!.id).clears > 0;
  }

  nextLevel(levelId: string): LevelDef | null {
    const i = this.levels.findIndex((l) => l.id === levelId);
    return this.levels[i + 1] ?? null;
  }

  totalStars(): number {
    return this.levels.reduce((n, l) => n + this.progressFor(l.id).stars, 0);
  }

  // ---- offers ----

  offer(id: OfferId): Offer & { price: string | null } {
    return { ...OFFERS[id], price: this.store.price(id) };
  }

  async redeem(id: OfferId): Promise<boolean> {
    const result = await this.store.purchase(id);
    if (!result.ok) return false;
    const now = this.now;
    for (const g of OFFERS[id].grants) {
      switch (g.type) {
        case 'hearts-refill':
          this.hearts.refill(now);
          break;
        case 'unlimited-hearts':
          this.hearts.grantUnlimited(g.ms, now);
          break;
        case 'coins':
          this.data.inventory.coins += g.amount;
          break;
        case 'booster':
          this.data.inventory.boosters[g.id] = (this.data.inventory.boosters[g.id] ?? 0) + g.amount;
          break;
        case 'continue':
          break; // applied by the level as a RunModifier
      }
    }
    this.track({ type: 'redeem', offer: id });
    this.changed();
    return true;
  }

  // ---- settings ----

  get settings(): SaveData['settings'] {
    return this.data.settings;
  }

  setSetting<K extends keyof SaveData['settings']>(key: K, value: SaveData['settings'][K]): void {
    this.data.settings[key] = value;
    this.changed();
  }

  // ---- analytics ----

  track(e: Omit<AnalyticsEvent, 'at'>): void {
    this.data.analytics.push({ at: this.now, ...e });
    if (this.data.analytics.length > MAX_ANALYTICS) this.data.analytics.splice(0, this.data.analytics.length - MAX_ANALYTICS);
    this.changed();
  }

  exportAnalytics(): string {
    const perLevel = this.levels.map((l) => {
      const runs = this.data.analytics.filter((e) => e.type === 'run' && e.level === l.id && !e.solutionShown);
      const firstClear = runs.findIndex((r) => r.cleared);
      return {
        level: l.id,
        attempts: runs.length,
        attemptsToFirstClear: firstClear === -1 ? null : firstClear + 1,
        failCauses: runs.flatMap((r) => (r.cleared ? [] : (r.causes ?? []))).reduce<Record<string, number>>((acc, c) => {
          acc[c] = (acc[c] ?? 0) + 1;
          return acc;
        }, {}),
        progress: this.progressFor(l.id),
      };
    });
    return JSON.stringify({ exportedAt: new Date(this.now).toISOString(), perLevel, events: this.data.analytics }, null, 2);
  }

  // ---- debug ----

  debugSetHearts(n: number): void {
    this.hearts.set(n, this.now);
    this.changed();
  }

  debugUnlockAll(on: boolean): void {
    this.unlockAll = on;
    this.changed();
  }

  async debugReset(): Promise<void> {
    this.data = freshSave(this.now);
    this.hearts = new Hearts(this.data, this.heartsConfig);
    this.changed();
    await this.flush();
  }
}
