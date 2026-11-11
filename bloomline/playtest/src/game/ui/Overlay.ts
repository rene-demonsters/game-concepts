import Phaser from 'phaser';
import { COLORS, FONT, hex } from '../theme.ts';
import { Button, type ButtonOptions } from './Button.ts';

/** A dimmed screen with a panel. Blocks input to everything underneath. */
export class Overlay {
  private readonly objects: Phaser.GameObjects.GameObject[] = [];
  private readonly buttons: Button[] = [];
  readonly scene: Phaser.Scene;
  readonly panel: { x: number; y: number; w: number; h: number };
  readonly u: number;

  constructor(scene: Phaser.Scene, w: number, h: number, u: number, dim = 0.35) {
    this.scene = scene;
    this.u = u;
    const W = scene.scale.width;
    const H = scene.scale.height;
    const shade = scene.add.rectangle(0, 0, W, H, 0x3b3631, dim).setOrigin(0).setDepth(500).setInteractive();
    this.objects.push(shade);
    const pw = Math.min(w, W - 24 * u);
    const ph = Math.min(h, H - 24 * u);
    this.panel = { x: (W - pw) / 2, y: (H - ph) / 2, w: pw, h: ph };
    const g = scene.add.graphics().setDepth(501);
    g.fillStyle(COLORS.panelEdge, 1);
    g.fillRoundedRect(this.panel.x, this.panel.y + 5 * u, pw, ph, 24 * u);
    g.fillStyle(COLORS.panel, 1);
    g.fillRoundedRect(this.panel.x, this.panel.y, pw, ph, 24 * u);
    this.objects.push(g);
    g.setScale(0.96);
    g.setAlpha(0);
    scene.tweens.add({ targets: g, alpha: 1, scale: 1, duration: 160, ease: 'Back.out' });
  }

  text(x: number, y: number, s: string, size: number, opts: { colour?: number; bold?: boolean; wrap?: number; origin?: number } = {}): Phaser.GameObjects.Text {
    const t = this.scene.add
      .text(x, y, s, {
        fontFamily: FONT,
        fontSize: `${Math.round(size * this.u)}px`,
        fontStyle: opts.bold ? 'bold' : 'normal',
        color: hex(opts.colour ?? COLORS.text),
        align: 'center',
        wordWrap: opts.wrap ? { width: opts.wrap, useAdvancedWrap: true } : undefined,
      })
      .setOrigin(opts.origin ?? 0.5, 0)
      .setDepth(502);
    this.objects.push(t);
    return t;
  }

  button(o: Omit<ButtonOptions, 'u' | 'depth'>): Button {
    const b = new Button(this.scene, { ...o, u: this.u, depth: 503 });
    this.buttons.push(b);
    return b;
  }

  add<T extends Phaser.GameObjects.GameObject>(o: T): T {
    this.objects.push(o);
    return o;
  }

  destroy(): void {
    for (const o of this.objects) o.destroy();
    for (const b of this.buttons) b.destroy();
  }
}
