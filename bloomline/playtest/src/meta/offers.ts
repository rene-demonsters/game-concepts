/**
 * What can be offered, and what each offer grants. Data only: prices and real purchases
 * live in a StoreService. The playtest's store grants these for free.
 */
export type Grant =
  | { type: 'hearts-refill' }
  | { type: 'unlimited-hearts'; ms: number }
  | { type: 'coins'; amount: number }
  | { type: 'booster'; id: BoosterId; amount: number }
  | { type: 'continue'; extraWarmth: number };

export type BoosterId = 'second-draft' | 'dress-rehearsal' | 'spoiler' | 'extra-warmth' | 'sturdy-boots';

export type OfferId = 'hearts.refill' | 'mug.1h' | 'continue.3tiles';

export type Offer = { id: OfferId; title: string; blurb: string; grants: Grant[] };

export const OFFERS: Readonly<Record<OfferId, Offer>> = {
  'hearts.refill': {
    id: 'hearts.refill',
    title: 'Refill hearts',
    blurb: 'All five, right now.',
    grants: [{ type: 'hearts-refill' }],
  },
  'mug.1h': {
    id: 'mug.1h',
    title: 'Bottomless Mug',
    blurb: 'Unlimited hearts for an hour.',
    grants: [{ type: 'unlimited-hearts', ms: 60 * 60 * 1000 }],
  },
  'continue.3tiles': {
    id: 'continue.3tiles',
    title: 'Catch your breath',
    blurb: 'Keep your path and get 3 extra tiles.',
    grants: [{ type: 'continue', extraWarmth: 3 }],
  },
};
