import { Capacitor } from '@capacitor/core';
import type { Platform } from './types.ts';
import { webPlatform } from './web.ts';

export async function detectPlatform(): Promise<Platform> {
  if (Capacitor.isNativePlatform()) {
    const { capacitorPlatform } = await import('./capacitor.ts');
    return capacitorPlatform();
  }
  return webPlatform();
}

export type { Platform };
