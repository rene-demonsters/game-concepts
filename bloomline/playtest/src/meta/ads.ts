export type AdResult = { watched: boolean };

/** The seam for rewarded ads (the puppet show). Not used in the playtest. */
export interface AdService {
  available(): boolean;
  showRewarded(placement: string): Promise<AdResult>;
}

export const noAds: AdService = {
  available: () => false,
  showRewarded: async () => ({ watched: false }),
};
