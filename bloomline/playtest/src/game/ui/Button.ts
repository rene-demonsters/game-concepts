import Phaser from 'phaser';
import { COLORS, FONT, hex } from '../theme.ts';

export type ButtonOptions = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  /** Device pixels per CSS pixel. */
  u: number;
  style?: 'primary' | 'normal' | 'quiet';
  fontSize?: number;
  depth?: number;
  onClick: () => void;
};

/** A rounded clay-ish button. (x, y) is the centre. */
export class Button {
  readonly zone: Phaser.GameObjects.Zone;
  private readonly bg: Phaser.GameObjects.Graphics;
  private readonly text: Phaser.GameObjects.Text;
  private readonly opts: ButtonOptions;
  private enabled = true;
  private pressed = false;

  constructor(scene: Phaser.Scene, opts: ButtonOptions) {
    this.opts = opts;
    const depth = opts.depth ?? 200;
    this.bg = scene.add.graphics().setDepth(depth).setPosition(opts.x, opts.y);
    this.text = scene.add
      .text(opts.x, opts.y, opts.label, {
        fontFamily: FONT,
        fontSize: `${Math.round(opts.fontSize ?? 17 * opts.u)}px`,
        fontStyle: 'bold',
        color: hex(opts.style === 'primary' ? 0xffffff : COLORS.text),
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(depth + 1);
    this.zone = scene.add.zone(opts.x, opts.y, opts.w, opts.h).setDepth(depth + 2).setInteractive({ useHandCursor: true });
    this.zone.on('pointerdown', () => {
      if (!this.enabled) return;
      this.pressed = true;
      this.draw();
    });
    this.zone.on('pointerout', () => {
      this.pressed = false;
      this.draw();
    });
    this.zone.on('pointerup', () => {
      if (!this.enabled || !this.pressed) return;
      this.pressed = false;
      this.draw();
      opts.onClick();
    });
    this.draw();
  }

  private draw(): void {
    const { w, h, u, style } = this.opts;
    const g = this.bg;
    g.clear();
    const r = Math.min(h / 2, 18 * u);
    const fill = style === 'primary' ? COLORS.accent : style === 'quiet' ? COLORS.panel : COLORS.button;
    const edge = style === 'primary' ? COLORS.accentDark : COLORS.buttonEdge;
    const press = this.pressed ? 3 * u : 0;
    g.fillStyle(edge, this.enabled ? 1 : 0.5);
    g.fillRoundedRect(-w / 2, -h / 2 + 4 * u, w, h - 4 * u, r);
    g.fillStyle(fill, this.enabled ? 1 : 0.5);
    g.fillRoundedRect(-w / 2, -h / 2 + press, w, h - 4 * u, r);
    this.text.setY(this.opts.y - 2 * u + press);
    this.text.setAlpha(this.enabled ? 1 : 0.45);
  }

  setEnabled(on: boolean): this {
    this.enabled = on;
    if (on) this.zone.setInteractive({ useHandCursor: true });
    else this.zone.disableInteractive();
    this.draw();
    return this;
  }

  setLabel(label: string): this {
    this.text.setText(label);
    return this;
  }

  setVisible(on: boolean): this {
    this.bg.setVisible(on);
    this.text.setVisible(on);
    if (on && this.enabled) this.zone.setInteractive({ useHandCursor: true });
    else this.zone.disableInteractive();
    return this;
  }

  destroy(): void {
    this.bg.destroy();
    this.text.destroy();
    this.zone.destroy();
  }
}
