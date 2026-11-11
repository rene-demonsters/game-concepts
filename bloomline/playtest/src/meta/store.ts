import type { OfferId } from './offers.ts';

export type PurchaseResult = { ok: true } | { ok: false; reason: 'cancelled' | 'unavailable' | 'error' };

/**
 * The seam for real purchases: native IAP or RevenueCat on mobile, Steam on desktop.
 * Gameplay never calls this directly; it goes through Session.redeem().
 */
export interface StoreService {
  readonly label: string;
  /** Display price, or null if the offer isn't for sale on this platform. */
  price(offer: OfferId): string | null;
  purchase(offer: OfferId): Promise<PurchaseResult>;
}

/** The playtest store: everything is free and says so. */
export class PrototypeStore implements StoreService {
  readonly label = 'prototype';
  price(): string {
    return 'Free (playtest)';
  }
  async purchase(): Promise<PurchaseResult> {
    return { ok: true };
  }
}
