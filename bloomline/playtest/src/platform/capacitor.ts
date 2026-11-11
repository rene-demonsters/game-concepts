// The only file that imports Capacitor plugins.
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Preferences } from '@capacitor/preferences';
import { StatusBar } from '@capacitor/status-bar';
import type { Platform } from './types.ts';

export function capacitorPlatform(): Platform {
  StatusBar.hide().catch(() => {});
  const backHandlers: Array<() => boolean> = [];
  App.addListener('backButton', () => {
    for (let i = backHandlers.length - 1; i >= 0; i--) if (backHandlers[i]!()) return;
    App.minimizeApp().catch(() => {});
  });
  return {
    id: Capacitor.getPlatform() === 'ios' ? 'ios' : 'android',
    storage: {
      get: async (key) => (await Preferences.get({ key })).value,
      set: async (key, value) => Preferences.set({ key, value }),
      remove: async (key) => Preferences.remove({ key }),
    },
    haptics: {
      tick: () => void Haptics.selectionChanged().catch(() => {}),
      bump: () => void Haptics.impact({ style: ImpactStyle.Light }).catch(() => {}),
      success: () => void Haptics.notification({ type: NotificationType.Success }).catch(() => {}),
    },
    lifecycle: {
      onPause: (fn) => void App.addListener('pause', fn),
      onResume: (fn) => void App.addListener('resume', fn),
      onBack: (fn) => void backHandlers.push(fn),
    },
  };
}
