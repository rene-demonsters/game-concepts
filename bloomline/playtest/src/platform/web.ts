import type { Platform } from './types.ts';

export function webPlatform(): Platform {
  const vibrate = (ms: number) => {
    // Only some Android browsers support this. Firefox and Safari expose `vibrate` but throw
    // when it's called, so haptics must never be able to break the game.
    try {
      if (typeof navigator.vibrate === 'function') navigator.vibrate(ms);
    } catch {
      /* no haptics here */
    }
  };
  return {
    id: 'web',
    storage: {
      get: async (k) => localStorage.getItem(k),
      set: async (k, v) => localStorage.setItem(k, v),
      remove: async (k) => localStorage.removeItem(k),
    },
    haptics: {
      tick: () => vibrate(4),
      bump: () => vibrate(12),
      success: () => vibrate(20),
    },
    lifecycle: {
      onPause: (fn) => document.addEventListener('visibilitychange', () => document.hidden && fn()),
      onResume: (fn) => document.addEventListener('visibilitychange', () => !document.hidden && fn()),
      onBack: () => {},
    },
  };
}
