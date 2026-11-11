import Phaser from 'phaser';
import { readFlags } from './config/flags.ts';
import { LEVELS } from './levels/index.ts';
import { OffsetClock } from './meta/clock.ts';
import { Session } from './meta/session.ts';
import { detectPlatform } from './platform/index.ts';
import { Synth } from './game/audio/synth.ts';
import { setContext } from './game/context.ts';
import { BootScene } from './game/scenes/BootScene.ts';
import { LevelScene } from './game/scenes/LevelScene.ts';
import { MenuScene } from './game/scenes/MenuScene.ts';
import { COLORS, hex } from './game/theme.ts';

async function boot(): Promise<void> {
  const flags = readFlags();
  const platform = await detectPlatform();
  const clock = new OffsetClock();
  const session = await Session.load(
    { storage: platform.storage, clock, levels: LEVELS, heartsEnabled: flags.hearts, unlockAll: flags.unlockAll },
    flags.reset,
  );
  const synth = new Synth();
  synth.setMuted(session.settings.muted);
  setContext({ session, platform, flags, synth });

  // Render at device pixel ratio so the vector stand-ins stay crisp. The canvas is sized in
  // device pixels and zoomed back down to CSS size; scenes multiply CSS sizes by `u`.
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const parent = document.getElementById('game')!;
  const size = () => ({ w: Math.max(1, parent.clientWidth), h: Math.max(1, parent.clientHeight) });
  const { w, h } = size();
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: Math.round(w * dpr),
    height: Math.round(h * dpr),
    backgroundColor: hex(COLORS.table),
    scale: { mode: Phaser.Scale.NONE, zoom: 1 / dpr },
    input: { activePointers: 2, keyboard: true },
    render: { antialias: true, roundPixels: false },
    banner: false,
    scene: [BootScene, MenuScene, LevelScene],
  });
  game.registry.set('u', dpr);

  window.addEventListener('resize', () => {
    const s = size();
    game.scale.setZoom(1 / dpr);
    game.scale.resize(Math.round(s.w * dpr), Math.round(s.h * dpr));
  });
  document.addEventListener('pointerdown', () => synth.unlock(), { passive: true });
  platform.lifecycle.onPause(() => {
    synth.suspend();
    void session.flush();
  });
  platform.lifecycle.onResume(() => synth.resume());

  // Test hook for the Playwright smoke test and for poking around in the console.
  (window as unknown as { __bloomline: unknown }).__bloomline = { session, game, levels: LEVELS, clock };
}

void boot();
