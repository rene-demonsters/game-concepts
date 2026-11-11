/** Everything that differs between web, Android/iOS (Capacitor) and later Electron/Steam. */
export interface KeyValueStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface Haptics {
  tick(): void;
  bump(): void;
  success(): void;
}

export interface Lifecycle {
  onPause(fn: () => void): void;
  onResume(fn: () => void): void;
  /** Android back button. Return true if handled. */
  onBack(fn: () => boolean): void;
}

export interface Platform {
  id: 'web' | 'android' | 'ios' | 'electron';
  storage: KeyValueStorage;
  haptics: Haptics;
  lifecycle: Lifecycle;
}
