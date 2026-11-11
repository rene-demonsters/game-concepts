import type Phaser from 'phaser';
import type { Session } from '../../meta/session.ts';
import { COLORS, FONT, hex } from '../theme.ts';

export function formatMs(ms: number): string {
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Five hearts and a refill timer, right-aligned at (right, y). */
export class HeartsBadge {
  private readonly hearts: Phaser.GameObjects.Text[] = [];
  private readonly timer: Phaser.GameObjects.Text;
  private readonly session: Session;
  private readonly scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, session: Session, right: number, y: number, u: number) {
    this.scene = scene;
    this.session = session;
    const size = Math.round(20 * u);
    for (let i = 0; i < session.heartsMax(); i++) {
      const x = right - (session.heartsMax() - 1 - i) * size * 1.05;
      this.hearts.push(scene.add.text(x, y - 6 * u, '♥', { fontFamily: FONT, fontSize: `${size}px`, color: hex(COLORS.heart) }).setOrigin(1, 0.5).setDepth(210));
    }
    this.timer = scene.add
      .text(right, y + 13 * u, '', { fontFamily: FONT, fontSize: `${Math.round(11 * u)}px`, color: hex(COLORS.textSoft) })
      .setOrigin(1, 0.5)
      .setDepth(210);
    this.refresh();
    scene.time.addEvent({ delay: 500, loop: true, callback: () => this.refresh() });
  }

  refresh(): void {
    const s = this.session;
    const unlimited = s.unlimitedHearts();
    const n = s.heartCount();
    this.hearts.forEach((h, i) => h.setColor(hex(unlimited || i < n ? COLORS.heart : COLORS.heartEmpty)));
    if (!s.heartsEnabled) this.timer.setText('hearts off');
    else if (unlimited) this.timer.setText('unlimited');
    else if (n < s.heartsMax()) this.timer.setText(`+1 in ${formatMs(s.msToNextHeart())}`);
    else this.timer.setText('full');
  }

  /** The heart that was just lost cracks and drops. */
  loseOne(): void {
    const n = this.session.heartCount();
    const h = this.hearts[n];
    if (!h) return;
    const y = h.y;
    h.setColor(hex(COLORS.heart));
    this.scene.tweens.add({
      targets: h,
      y: y + 14,
      angle: 25,
      alpha: 0.3,
      duration: 450,
      ease: 'Quad.in',
      onComplete: () => {
        h.setPosition(h.x, y).setAngle(0).setAlpha(1);
        this.refresh();
      },
    });
  }
}
