import Phaser from 'phaser';

/** Textures baked once at boot. Drawn large and scaled down, so they stay smooth at any size. */
export const TEX = {
  tile: 'tile',
  dot: 'dot',
  soft: 'soft',
} as const;

export function bakeTextures(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  const S = 256;
  g.clear();
  g.fillStyle(0xffffff, 1);
  g.fillRoundedRect(0, 0, S, S, 46);
  g.generateTexture(TEX.tile, S, S);

  g.clear();
  g.fillStyle(0xffffff, 1);
  g.fillCircle(64, 64, 64);
  g.generateTexture(TEX.dot, 128, 128);

  g.clear();
  for (let r = 64; r > 0; r -= 2) {
    g.fillStyle(0xffffff, 0.06);
    g.fillCircle(64, 64, r);
  }
  g.generateTexture(TEX.soft, 128, 128);
  g.destroy();
}
