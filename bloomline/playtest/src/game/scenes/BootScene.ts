import Phaser from 'phaser';
import { LEVELS } from '../../levels/index.ts';
import { ctx } from '../context.ts';
import { bakeTextures } from '../skin/textures.ts';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    bakeTextures(this);
    const { flags } = ctx();
    const direct = flags.level && LEVELS.find((l) => l.id === flags.level);
    if (direct) this.scene.start('level', { levelId: direct.id });
    else this.scene.start('menu');
  }
}
