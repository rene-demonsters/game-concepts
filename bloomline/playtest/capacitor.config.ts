import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Placeholder bundle id; change before publishing a store build.
  appId: 'nl.demonsters.bloomline.playtest',
  appName: 'Bloomline',
  webDir: 'dist',
  backgroundColor: '#dcd7ce',
  ios: { contentInset: 'never', scrollEnabled: false },
  android: { backgroundColor: '#dcd7ce' },
  plugins: {
    StatusBar: { overlaysWebView: true },
  },
};

export default config;
